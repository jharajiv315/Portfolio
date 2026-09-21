import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import astraImg from "../assets/Astra.png";
import { API_URL } from "../config";

// =====================================================
// COSMIC PARTICLES BACKGROUND CANVAS
// =====================================================

function CosmicParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrameId;
    let particles = [];
    const count = 75;

    const resize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
      }
    };

    resize();
    window.addEventListener("resize", resize);

    class Star {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.alpha = Math.random() * 0.8 + 0.2;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha += this.twinkleSpeed;
        if (this.alpha > 1 || this.alpha < 0.2) {
          this.twinkleSpeed = -this.twinkleSpeed;
        }
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, this.alpha)})`;
        ctx.shadowBlur = this.size > 1.5 ? 8 : 0;
        ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
        ctx.fill();
      }
    }

    for (let i = 0; i < count; i++) {
      particles.push(new Star());
    }

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}

// =====================================================
// MAIN CONTACT SECTION
// =====================================================

export default function Contact({ user }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "Web Development",
    budget: "",
    idea: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const isOthers = formData.service === "Others" || formData.service === "Something in mind?";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const subject = `[${formData.service}]${
        formData.budget ? ` (Budget: ${formData.budget})` : ""
      } Inquiry from ${formData.name}`;

      const messageContent = `Client Email: ${formData.email}\nService Requested: ${formData.service}\n${
        formData.budget ? `Budget: ${formData.budget}\n` : ""
      }\nProject Idea / Inquiry:\n${formData.idea}`;

      const res = await axios.post(
        `${API_URL}/api/v1/message/send`,
        {
          senderName: formData.name,
          subject,
          message: messageContent,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      setSubmitted(true);
      setStatus("Message sent successfully! I'll get back to you promptly. ✅");
      toast.success(res.data?.message || "Message sent successfully!");
      setFormData({
        name: "",
        email: "",
        service: "Web Development",
        budget: "",
        idea: "",
      });
    } catch (err) {
      console.error("Failed to send message:", err);
      const errorMsg =
        err.response?.data?.message || "Something went wrong. Please try again.";
      setSubmitted(false);
      setStatus(`Error: ${errorMsg} ❌`);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setStatus("");
      }, 7000);
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full min-h-screen bg-black text-white py-20 px-4 sm:px-6 lg:px-12 flex items-center justify-center overflow-hidden"
    >
      {/* ================= COSMIC PARTICLES BACKGROUND ================= */}
      <CosmicParticles />

      {/* ================= BACKGROUND GLOWS ================= */}
      <div className="pointer-events-none absolute left-[-150px] top-[20%] h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[150px]" />
      <div className="pointer-events-none absolute right-[-150px] bottom-[20%] h-[500px] w-[500px] rounded-full bg-purple-600/15 blur-[150px]" />
      <div className="pointer-events-none absolute left-[35%] top-[40%] h-[350px] w-[350px] rounded-full bg-cyan-500/10 blur-[130px]" />

      {/* ================= MAIN CONTAINER ================= */}
      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* ================= LEFT COLUMN: ASTRONAUT ARTWORK ================= */}
          <motion.div
            className="lg:col-span-5 flex flex-col items-center justify-center text-center relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Ambient Moon Glow behind Astronaut */}
            <div className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-purple-600/15 via-cyan-500/10 to-transparent blur-3xl pointer-events-none" />

            {/* Floating Animated Astronaut Artwork */}
            <motion.div
              animate={{
                y: [-10, 10, -10],
                rotate: [-1.2, 1.2, -1.2],
              }}
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-10 w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[380px] drop-shadow-[0_8px_30px_rgba(59,130,246,0.2)]"
            >
              <img
                src={astraImg}
                alt="Astronaut floating in cosmic space"
                className="w-full h-auto object-contain select-none pointer-events-none"
              />
            </motion.div>
          </motion.div>

          {/* ================= RIGHT COLUMN: LET'S WORK TOGETHER FORM ================= */}
          <motion.div
            className="lg:col-span-7 w-full max-w-[560px] mx-auto lg:ml-auto"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div
              className="rounded-[16px] p-6 sm:p-8 backdrop-blur-md relative overflow-hidden"
              style={{
                backgroundColor: "rgba(8, 10, 14, 0.78)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow:
                  "0 20px 50px -10px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255, 255, 255, 0.04)",
              }}
            >
              {/* Form Header */}
              <div className="mb-6">
                <h2 className="font-heading font-semibold sm:font-bold text-[26px] sm:text-[32px] lg:text-[36px] leading-[1.1] text-white tracking-[-0.015em]">
                  Let's Work <span className="text-[#20E6E9]">Together</span>
                </h2>
                <p className="mt-2 font-body font-normal text-[13px] sm:text-[14px] leading-[1.6] text-gray-400 max-w-[480px]">
                  Have a project in mind or want to collaborate? Fill out the form below and I'll get back to you promptly.
                </p>
              </div>

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* 1. Your Name */}
                <div>
                  <label className="block font-body font-medium text-[12px] text-white/70 mb-2">
                    Your Name <span className="text-red-400/80 text-[11px] ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="w-full h-[46px] px-3.5 rounded-[8px] bg-white/[0.035] border border-white/[0.08] text-white/90 placeholder:text-white/35 font-body text-[13px] sm:text-[13.5px] hover:border-white/[0.14] focus:outline-none focus:border-[#20E6E9]/55 focus:ring-1 focus:ring-[#20E6E9]/[0.06] transition-all duration-150 ease-out"
                  />
                </div>

                {/* 2. Your Email */}
                <div>
                  <label className="block font-body font-medium text-[12px] text-white/70 mb-2">
                    Your Email <span className="text-red-400/80 text-[11px] ml-0.5">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    className="w-full h-[46px] px-3.5 rounded-[8px] bg-white/[0.035] border border-white/[0.08] text-white/90 placeholder:text-white/35 font-body text-[13px] sm:text-[13.5px] hover:border-white/[0.14] focus:outline-none focus:border-[#20E6E9]/55 focus:ring-1 focus:ring-[#20E6E9]/[0.06] transition-all duration-150 ease-out"
                  />
                </div>

                {/* 3. Service Needed */}
                <div>
                  <label className="block font-body font-medium text-[12px] text-white/70 mb-2">
                    Service Needed <span className="text-red-400/80 text-[11px] ml-0.5">*</span>
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full h-[46px] px-3.5 rounded-[8px] bg-white/[0.035] border border-white/[0.08] text-white/90 font-body text-[13px] sm:text-[13.5px] hover:border-white/[0.14] focus:outline-none focus:border-[#20E6E9]/55 focus:ring-1 focus:ring-[#20E6E9]/[0.06] transition-all duration-150 ease-out cursor-pointer"
                  >
                    <option value="Web Development" className="bg-[#080a0e] text-white">
                      Web Development
                    </option>
                    <option value="Full Stack Application" className="bg-[#080a0e] text-white">
                      Full Stack Application
                    </option>
                    <option value="Frontend & UI/UX Design" className="bg-[#080a0e] text-white">
                      Frontend & UI/UX Design
                    </option>
                    <option value="AI & API Integration" className="bg-[#080a0e] text-white">
                      AI & API Integration
                    </option>
                    <option value="Others" className="bg-[#080a0e] text-white">
                      Others
                    </option>
                    <option value="Something in mind?" className="bg-[#080a0e] text-white">
                      Something in mind?
                    </option>
                  </select>
                </div>

                {/* 4. Your Budget */}
                {!isOthers && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -4 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -4 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <label className="block font-body font-medium text-[12px] text-white/70 mb-2">
                      Your Budget <span className="text-red-400/80 text-[11px] ml-0.5">*</span>
                    </label>
                    <input
                      type="text"
                      name="budget"
                      required={!isOthers}
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="Your Budget (e.g. ₹10,000 / $200+)"
                      className="w-full h-[46px] px-3.5 rounded-[8px] bg-white/[0.035] border border-white/[0.08] text-white/90 placeholder:text-white/35 font-body text-[13px] sm:text-[13.5px] hover:border-white/[0.14] focus:outline-none focus:border-[#20E6E9]/55 focus:ring-1 focus:ring-[#20E6E9]/[0.06] transition-all duration-150 ease-out"
                    />
                  </motion.div>
                )}

                {/* 5. Explain Your Idea */}
                <div>
                  <label className="block font-body font-medium text-[12px] text-white/70 mb-2">
                    Explain Your Idea <span className="text-red-400/80 text-[11px] ml-0.5">*</span>
                  </label>
                  <textarea
                    name="idea"
                    required
                    value={formData.idea}
                    onChange={handleChange}
                    placeholder="Explain your idea..."
                    className="w-full h-[112px] px-3.5 py-2.5 rounded-[8px] bg-white/[0.035] border border-white/[0.08] text-white/90 placeholder:text-white/35 font-body text-[13px] sm:text-[13.5px] leading-relaxed hover:border-white/[0.14] focus:outline-none focus:border-[#20E6E9]/55 focus:ring-1 focus:ring-[#20E6E9]/[0.06] transition-all duration-150 ease-out resize-none"
                  />
                </div>

                {/* Status Message */}
                {status && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-xs sm:text-[13px] font-body font-normal flex items-center gap-2 py-2 px-3 rounded-[6px] ${
                      submitted
                        ? "text-emerald-300 bg-emerald-950/30 border border-emerald-500/25"
                        : "text-rose-300 bg-rose-950/30 border border-rose-500/25"
                    }`}
                  >
                    {submitted ? (
                      <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                    ) : (
                      <span className="text-rose-400 text-sm flex-shrink-0">⚠️</span>
                    )}
                    <span>{status}</span>
                  </motion.div>
                )}

                {/* 6. Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-[46px] rounded-[8px] font-body font-medium text-[13.5px] sm:text-[14px] text-white bg-gradient-to-r from-[#2563EB] to-[#20E6E9] hover:from-[#1D4ED8] hover:to-[#12D4D7] shadow-[0_2px_8px_rgba(37,99,235,0.18)] hover:shadow-[0_4px_12px_rgba(32,230,233,0.22)] transition-all duration-150 ease-out hover:-translate-y-[1px] active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {loading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send size={15} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
