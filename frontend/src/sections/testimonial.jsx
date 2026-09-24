import React from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

export default function Testimonials({ testimonials = [] }) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section
      id="testimonials"
      className="relative w-full bg-[#FAF7F2] text-[#1C1917] py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background Glows */}
      <div className="pointer-events-none absolute left-[-150px] top-[20%] h-[400px] w-[400px] rounded-full bg-[#EFE7D8]/70 blur-[140px]" />
      <div className="pointer-events-none absolute right-[-150px] bottom-[20%] h-[400px] w-[400px] rounded-full bg-[#E8DFC8]/60 blur-[140px]" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-[#1C1917] tracking-tight">
            What People <span className="text-[#B84A1C] italic font-serif">Say</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#57534E] max-w-xl mx-auto leading-relaxed">
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
              className="bg-white/95 border border-[#E8E1D5] p-6 sm:p-7 rounded-2xl shadow-xs hover:border-[#B84A1C]/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Quote size={28} className="text-[#B84A1C]/60" />
                  <div className="flex items-center gap-1 text-[#D97706]">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                </div>
                <p className="text-[#57534E] font-sans text-sm leading-relaxed mb-6 italic">
                  "{t.content || t.description || t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#E8E1D5] flex items-center gap-3">
                {t.avatar?.url ? (
                  <img
                    src={t.avatar.url}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#E8E1D5]"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#E8E1D5] flex items-center justify-center text-[#B84A1C] font-serif font-bold text-sm">
                    {t.name ? t.name.charAt(0) : "U"}
                  </div>
                )}
                <div>
                  <h4 className="text-sm sm:text-base font-serif font-bold text-[#1C1917]">{t.name}</h4>
                  <p className="text-xs font-sans text-[#B84A1C] font-medium">
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
