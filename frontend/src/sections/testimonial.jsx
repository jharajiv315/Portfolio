import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Quote, Star } from "lucide-react";

export default function Testimonials({ testimonials = [] }) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section
      id="testimonials"
      className="relative w-full bg-black text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background Glows */}
      <div className="pointer-events-none absolute left-[-150px] top-[20%] h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute right-[-150px] bottom-[20%] h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[140px]" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 section-pill mb-3">
            <Sparkles size={13} />
            Endorsements
          </div>
          <h2 className="section-heading">
            What People <span className="text-cyan-400">Say</span>
          </h2>
          <p className="mt-3 section-subtext max-w-xl mx-auto">
            Feedback and recommendations from mentors, teammates, and tech communities.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t._id || t.id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="bg-zinc-950/80 border border-zinc-800/80 p-6 rounded-2xl backdrop-blur-xl shadow-xl hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Quote size={28} className="text-cyan-400/60" />
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-300 font-body text-sm leading-relaxed mb-6 italic">
                  "{t.content || t.description || t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-900 flex items-center gap-3">
                {t.avatar?.url ? (
                  <img
                    src={t.avatar.url}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-cyan-500/40"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-heading font-semibold text-sm">
                    {t.name ? t.name.charAt(0) : "U"}
                  </div>
                )}
                <div>
                  <h4 className="text-sm sm:text-base font-heading font-semibold text-white">{t.name}</h4>
                  <p className="text-xs font-body text-cyan-400/80">
                    {t.role || t.designation || "Colleague"}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
