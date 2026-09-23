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
    const count = 50;

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
        this.alpha = Math.random() * 0.4 + 0.15;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.twinkleSpeed = Math.random() * 0.015 + 0.005;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha += this.twinkleSpeed;
        if (this.alpha > 0.6 || this.alpha < 0.15) {
          this.twinkleSpeed = -this.twinkleSpeed;
        }
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(184, 74, 28, ${Math.max(0.1, this.alpha * 0.7)})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = "rgba(184, 74, 28, 0.4)";
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
    idea: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

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
      const subject = `[${formData.service}] Inquiry from ${formData.name}`;

      const messageContent = `Client Email: ${formData.email}\nService Requested: ${formData.service}\n\nProject Idea / Inquiry:\n${formData.idea}`;

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
      className="relative w-full min-h-screen bg-[#FAF7F2] text-[#1C1917] py-24 px-4 sm:px-6 lg:px-12 flex items-center justify-center overflow-hidden"
    >
      {/* ================= PARTICLES BACKGROUND ================= */}
      <CosmicParticles />

      {/* ================= BACKGROUND GLOWS ================= */}
      <div className="pointer-events-none absolute left-[-150px] top-[20%] h-[500px] w-[500px] rounded-full bg-[#EFE7D8]/70 blur-[150px]" />
      <div className="pointer-events-none absolute right-[-150px] bottom-[20%] h-[500px] w-[500px] rounded-full bg-[#E8DFC8]/60 blur-[150px]" />
      <div className="pointer-events-none absolute left-[35%] top-[40%] h-[350px] w-[350px] rounded-full bg-[#EFE7D8]/50 blur-[130px]" />

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
            {/* Ambient Warm Glow behind Astronaut */}
            <div className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-[#E8DFC8]/60 via-[#F5EFEB]/30 to-transparent blur-3xl pointer-events-none" />

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
              className="relative z-10 w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[380px] drop-shadow-[0_12px_30px_rgba(28,25,23,0.12)]"
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
            className="lg:col-span-7 w-full max-w-[500px] mx-auto lg:ml-auto"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div
              className="rounded-3xl p-5 sm:p-7 relative overflow-hidden bg-white/95 border border-[#E8E1D5] shadow-[0_20px_45px_-10px_rgba(28,25,23,0.08)]"
            >
              {/* Form Header */}
              <div className="mb-4">
                <h2 className="font-serif font-bold text-[24px] sm:text-[28px] lg:text-[32px] leading-[1.1] text-[#1C1917] tracking-tight">
                  Let's Work <span className="text-[#B84A1C] italic font-serif">Together</span>
                </h2>
                <p className="mt-1.5 font-sans font-normal text-xs sm:text-[13.5px] leading-[1.5] text-[#57534E]">
                  Have a project in mind or want to collaborate? Fill out the form below and I'll get back to you promptly.
                </p>
              </div>

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* 1. Your Name */}
                <div>
                  <label className="block font-sans font-semibold text-[11.5px] text-[#1C1917] mb-1">
                    Your Name <span className="text-[#B84A1C] text-[11px] ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="w-full h-[40px] px-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E1D5] text-[#1C1917] placeholder:text-[#A8A29E] font-sans text-xs sm:text-[13px] hover:border-[#D8C7B0] focus:outline-none focus:border-[#B84A1C] focus:ring-1 focus:ring-[#B84A1C]/20 transition-all duration-150 ease-out"
                  />
                </div>

                {/* 2. Your Email */}
                <div>
                  <label className="block font-sans font-semibold text-[11.5px] text-[#1C1917] mb-1">
                    Your Email <span className="text-[#B84A1C] text-[11px] ml-0.5">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    className="w-full h-[40px] px-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E1D5] text-[#1C1917] placeholder:text-[#A8A29E] font-sans text-xs sm:text-[13px] hover:border-[#D8C7B0] focus:outline-none focus:border-[#B84A1C] focus:ring-1 focus:ring-[#B84A1C]/20 transition-all duration-150 ease-out"
                  />
                </div>

                {/* 3. Service Needed */}
                <div>
                  <label className="block font-sans font-semibold text-[11.5px] text-[#1C1917] mb-1">
                    Service Needed <span className="text-[#B84A1C] text-[11px] ml-0.5">*</span>
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full h-[40px] px-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E1D5] text-[#1C1917] font-sans text-xs sm:text-[13px] hover:border-[#D8C7B0] focus:outline-none focus:border-[#B84A1C] focus:ring-1 focus:ring-[#B84A1C]/20 transition-all duration-150 ease-out cursor-pointer"
                  >
                    <option value="Web Development" className="bg-[#FAF7F2] text-[#1C1917]">
                      Web Development
                    </option>
                    <option value="Full Stack Application" className="bg-[#FAF7F2] text-[#1C1917]">
                      Full Stack Application
                    </option>
                    <option value="Frontend & UI/UX Design" className="bg-[#FAF7F2] text-[#1C1917]">
                      Frontend & UI/UX Design
                    </option>
                    <option value="AI & API Integration" className="bg-[#FAF7F2] text-[#1C1917]">
                      AI & API Integration
                    </option>
                    <option value="Others" className="bg-[#FAF7F2] text-[#1C1917]">
                      Others
                    </option>
                    <option value="Something in mind?" className="bg-[#FAF7F2] text-[#1C1917]">
                      Something in mind?
                    </option>
                  </select>
                </div>

                {/* 4. Explain Your Idea */}
                <div>
                  <label className="block font-sans font-semibold text-[11.5px] text-[#1C1917] mb-1">
                    Explain Your Idea <span className="text-[#B84A1C] text-[11px] ml-0.5">*</span>
                  </label>
                  <textarea
                    name="idea"
                    required
                    value={formData.idea}
                    onChange={handleChange}
                    placeholder="Explain your idea or inquiry..."
                    className="w-full h-[90px] px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8E1D5] text-[#1C1917] placeholder:text-[#A8A29E] font-sans text-xs sm:text-[13px] leading-relaxed hover:border-[#D8C7B0] focus:outline-none focus:border-[#B84A1C] focus:ring-1 focus:ring-[#B84A1C]/20 transition-all duration-150 ease-out resize-none"
                  />
                </div>

                {/* Status Message */}
                {status && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-xs sm:text-[13px] font-sans font-medium flex items-center gap-2 py-2 px-3 rounded-xl ${
                      submitted
                        ? "text-emerald-800 bg-emerald-50 border border-emerald-200"
                        : "text-rose-800 bg-rose-50 border border-rose-200"
                    }`}
                  >
                    {submitted ? (
                      <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" />
                    ) : (
                      <span className="text-rose-600 text-sm flex-shrink-0">⚠️</span>
                    )}
                    <span>{status}</span>
                  </motion.div>
                )}

                {/* 5. Submit Button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-[42px] rounded-full font-medium text-xs sm:text-[13.5px] text-white bg-[#B84A1C] hover:bg-[#A03D14] shadow-md hover:shadow-[0_8px_20px_rgba(184,74,28,0.25)] transition-all duration-150 ease-out hover:-translate-y-[1px] active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {loading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send size={14} />
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
