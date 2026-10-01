import { test, describe } from "node:test";
import assert from "node:assert/strict";
import crypto from "crypto";
import jwt from "jsonwebtoken";

describe("Backend Critical Engineering Tests", () => {
  describe("Password Reset Token Cryptography", () => {
    test("Generates reproducible SHA-256 hash for raw reset token", () => {
      const rawToken = "d3b07384d113edec49eaa6238ad5ff00";
      const hashed = crypto.createHash("sha256").update(rawToken).digest("hex");

      assert.equal(typeof hashed, "string");
      assert.equal(hashed.length, 64);

      // Verify idempotent hashing
      const hashedAgain = crypto.createHash("sha256").update(rawToken).digest("hex");
      assert.equal(hashed, hashedAgain);
    });

    test("Rejects mismatched reset tokens", () => {
      const tokenA = "token_alpha_123456";
      const tokenB = "token_bravo_123456";
      const hashA = crypto.createHash("sha256").update(tokenA).digest("hex");
      const hashB = crypto.createHash("sha256").update(tokenB).digest("hex");

      assert.notEqual(hashA, hashB);
    });
  });

  describe("JWT Token Security", () => {
    const testSecret = "test_jwt_secret_key_production_grade_32_bytes";

    test("Signs and verifies valid JWT payload", () => {
      const payload = { id: 1, role: "admin" };
      const token = jwt.sign(payload, testSecret, { expiresIn: "1h" });

      const decoded = jwt.verify(token, testSecret);
      assert.equal(decoded.id, 1);
      assert.equal(decoded.role, "admin");
    });

    test("Rejects tampered JWT token", () => {
      const token = jwt.sign({ id: 1 }, testSecret, { expiresIn: "1h" });
      const tampered = token.slice(0, -5) + "abcde";

      assert.throws(() => {
        jwt.verify(tampered, testSecret);
      }, /invalid signature|jwt malformed/i);
    });

    test("Rejects expired JWT token", async () => {
      const expiredToken = jwt.sign({ id: 1 }, testSecret, { expiresIn: "1ms" });
      await new Promise((resolve) => setTimeout(resolve, 10));

      assert.throws(() => {
        jwt.verify(expiredToken, testSecret);
      }, /jwt expired/i);
    });
  });

  describe("Message Validation Semantics", () => {
    test("Validates minimum required lengths for contact inquiry", () => {
      const validateInput = (senderName, subject, message) => {
        if (!senderName || !subject || !message) {
          return { valid: false, error: "Please fill all the fields" };
        }
        if (senderName.trim().length < 3) {
          return { valid: false, error: "Name should be at least 3 characters" };
        }
        if (subject.trim().length < 3) {
          return { valid: false, error: "Subject should be at least 3 characters" };
        }
        if (message.trim().length < 5) {
          return { valid: false, error: "Message should be at least 5 characters" };
        }
        return { valid: true };
      };

      assert.equal(validateInput("", "Help", "Valid message text").valid, false);
      assert.equal(validateInput("Jo", "Help", "Valid message text").valid, false);
      assert.equal(validateInput("John", "Hi", "Valid message text").valid, false);
      assert.equal(validateInput("John", "Help", "123").valid, false);
      assert.equal(validateInput("John Doe", "Project Inquiry", "Hello, I would like to collaborate.").valid, true);
    });
  });

  describe("Rate Limiter Logic & Throttling", () => {
    test("Enforces request threshold and calculates Retry-After header", () => {
      const requests = new Map();
      const windowMs = 60 * 1000;
      const max = 3;

      const rateLimitCheck = (ip) => {
        const now = Date.now();
        const record = requests.get(ip);

        if (!record || now - record.startTime > windowMs) {
          requests.set(ip, { startTime: now, count: 1 });
          return { allowed: true };
        }

        if (record.count >= max) {
          const retryAfter = Math.ceil((record.startTime + windowMs - now) / 1000);
          return { allowed: false, retryAfter };
        }

        record.count += 1;
        return { allowed: true };
      };

      const testIp = "192.168.1.100";
      assert.equal(rateLimitCheck(testIp).allowed, true); // req 1
      assert.equal(rateLimitCheck(testIp).allowed, true); // req 2
      assert.equal(rateLimitCheck(testIp).allowed, true); // req 3

      const throttled = rateLimitCheck(testIp); // req 4 -> throttled
      assert.equal(throttled.allowed, false);
      assert.ok(throttled.retryAfter > 0);
    });
  });

  describe("CORS Origin Whitelist Evaluation", () => {
    test("Rejects arbitrary third-party vercel subdomains", () => {
      const allowedOrigins = [
        "https://portfolio-beta-ochre-90.vercel.app",
        "https://portfolio-dashboard-seven-delta.vercel.app",
      ];

      const isAllowed = (origin) => {
        if (!origin) return true;
        return allowedOrigins.includes(origin);
      };

      assert.equal(isAllowed("https://portfolio-beta-ochre-90.vercel.app"), true);
      assert.equal(isAllowed("https://portfolio-dashboard-seven-delta.vercel.app"), true);
      assert.equal(isAllowed("https://attacker.vercel.app"), false);
      assert.equal(isAllowed("https://evil-phishing.vercel.app"), false);
      assert.equal(isAllowed("https://attacker-portfolio-beta-ochre-90.vercel.app"), false);
    });
  });

  describe("Contact Form & Direct Reply Email Architecture", () => {
    const extractEmail = (email, messageText) => {
      if (email && typeof email === "string" && email.includes("@")) {
        return email.trim();
      }
      if (!messageText) return "";
      const clientMatch = messageText.match(/Client Email:\s*([^\s\n\r]+)/i);
      if (clientMatch && clientMatch[1]?.includes("@")) {
        return clientMatch[1].trim();
      }
      const generalMatch = messageText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
      if (generalMatch && generalMatch[0]) {
        return generalMatch[0].trim();
      }
      return "";
    };

    test("Extracts explicit email address when provided", () => {
      const email = "client@example.com";
      const message = "Hello, I want to build an AI project.";
      assert.equal(extractEmail(email, message), "client@example.com");
    });

    test("Extracts email embedded in formatted contact message string", () => {
      const message = "Client Email: founder@techstartup.io\nService Requested: Web Development\n\nProject Idea:\nNeed a modern portal";
      assert.equal(extractEmail(null, message), "founder@techstartup.io");
    });

    test("Extracts arbitrary email found in plain text message", () => {
      const message = "Reach me at contact.partner@domain.org for collaboration.";
      assert.equal(extractEmail("", message), "contact.partner@domain.org");
    });

    test("Validates reply payload structure before email dispatch", () => {
      const validateReply = (replyMessage, recipientEmail) => {
        if (!replyMessage || replyMessage.trim().length < 2) {
          return { valid: false, error: "Please enter your reply message content." };
        }
        if (!recipientEmail || !recipientEmail.includes("@")) {
          return { valid: false, error: "Cannot send email: invalid sender email address." };
        }
        return { valid: true };
      };

      assert.equal(validateReply("", "test@example.com").valid, false);
      assert.equal(validateReply("Thank you for reaching out!", "").valid, false);
      assert.equal(validateReply("Thank you for reaching out!", "test@example.com").valid, true);
    });
  });
});
