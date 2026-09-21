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
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* ================= LEFT COLUMN: ASTRONAUT ARTWORK ================= */}
          <motion.div
            className="lg:col-span-5 flex flex-col items-center justify-center text-center relative"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Ambient Moon Glow behind Astronaut */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-purple-600/30 via-cyan-500/20 to-transparent blur-3xl pointer-events-none" />

            {/* Floating Animated Astronaut Artwork */}
            <motion.div
              animate={{
                y: [-12, 12, -12],
                rotate: [-1.5, 1.5, -1.5],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-10 w-full max-w-[340px] sm:max-w-[420px] lg:max-w-full drop-shadow-[0_0_35px_rgba(59,130,246,0.35)]"
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
            className="lg:col-span-7"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-zinc-950/85 border border-zinc-800/80 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl relative overflow-hidden">
              {/* Form Header */}
              <div className="mb-8">
                <h2 className="section-heading">
                  Let's Work <span className="text-cyan-400">Together</span>
                </h2>
                <p className="mt-2 section-subtext">
                  Have a project in mind or want to collaborate? Fill out the form below and I'll get back to you promptly.
                </p>
              </div>

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* 1. Your Name */}
                <div>
                  <label className="block text-xs sm:text-sm font-body font-medium text-gray-300 mb-2">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white placeholder-gray-500 font-body text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                </div>

                {/* 2. Your Email */}
                <div>
                  <label className="block text-xs sm:text-sm font-body font-medium text-gray-300 mb-2">
                    Your Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white placeholder-gray-500 font-body text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                </div>

                {/* 3. Service Needed */}
                <div>
                  <label className="block text-xs sm:text-sm font-body font-medium text-gray-300 mb-2">
                    Service Needed <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white font-body text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all cursor-pointer"
                  >
                    <option value="Web Development" className="bg-zinc-900 text-white">
                      Web Development
                    </option>
                    <option value="Full Stack Application" className="bg-zinc-900 text-white">
                      Full Stack Application
                    </option>
                    <option value="Frontend & UI/UX Design" className="bg-zinc-900 text-white">
                      Frontend & UI/UX Design
                    </option>
                    <option value="AI & API Integration" className="bg-zinc-900 text-white">
                      AI & API Integration
                    </option>
                    <option value="Others" className="bg-zinc-900 text-white">
                      Others
                    </option>
                    <option value="Something in mind?" className="bg-zinc-900 text-white">
                      Something in mind?
                    </option>
                  </select>
                </div>

                {/* 4. Your Budget */}
                {!isOthers && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="block text-xs sm:text-sm font-body font-medium text-gray-300 mb-2">
                      Your Budget <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="budget"
                      required={!isOthers}
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="Your Budget (e.g. ₹10,000 / $200+)"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white placeholder-gray-500 font-body text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                    />
                  </motion.div>
                )}

                {/* 5. Explain Your Idea */}
                <div>
                  <label className="block text-xs sm:text-sm font-body font-medium text-gray-300 mb-2">
                    Explain Your Idea <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="idea"
                    required
                    rows={4}
                    value={formData.idea}
                    onChange={handleChange}
                    placeholder="Explain your idea..."
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-white placeholder-gray-500 font-body text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all resize-none"
                  />
                </div>

                {/* Status Message */}
                {status && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-sm font-body font-medium flex items-center gap-1.5 p-3 rounded-xl ${
                      submitted
                        ? "text-emerald-400 bg-emerald-950/40 border border-emerald-800/60"
                        : "text-red-400 bg-red-950/40 border border-red-800/60"
                    }`}
                  >
                    {submitted ? <CheckCircle2 size={18} /> : <span>⚠️</span>}
                    {status}
                  </motion.div>
                )}

                {/* 6. Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl font-body font-medium text-sm sm:text-base text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 transition-all shadow-[0_0_25px_rgba(59,130,246,0.35)] hover:shadow-[0_0_35px_rgba(34,211,238,0.5)] hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={18} />
                        Send Message
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
