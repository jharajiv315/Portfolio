import { useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  Mail,
  Loader2,
} from "lucide-react";
import axios from "axios";
import { API_URL } from "../config";
export default function Contact({ user }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    service: "Web Development",
    idea: "",
  });
  const [loading, setLoading] = useState(false),
    [sent, setSent] = useState(false),
    [error, setError] = useState("");
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim() || !form.idea.trim()) {
      setError("Please complete your name, email, and message.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/api/v1/message/send`,
        {
          senderName: form.name.trim(),
          email: form.email.trim(),
          subject: `[${form.service}] Inquiry from ${form.name.trim()}`,
          message: `Client Email: ${form.email.trim()}\nService Requested: ${form.service}\n\nProject Idea / Inquiry:\n${form.idea.trim()}`,
        },
        { withCredentials: true, timeout: 45000 },
      );
      setSent(true);
      setForm({ name: "", email: "", service: "Web Development", idea: "" });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Your message couldn’t be sent. Please try again or email me directly.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <section id="contact" className="studio-section contact-section">
      <div className="studio-container contact-layout">
        <div>
          <p className="studio-eyebrow">05 / Start a conversation</p>
          <h2>
            Have something
            <br />
            <em>in mind?</em>
          </h2>
          <p className="contact-intro">
            A project idea, a collaboration, or a conversation about building
            better software—I’d like to hear it.
          </p>
          {user?.email && (
            <a href={`mailto:${user.email}`} className="contact-email">
              <Mail size={18} />
              {user.email}
              <ArrowUpRight size={17} />
            </a>
          )}
          <p className="contact-note">
            Your message goes directly to my dashboard.
          </p>
        </div>
        <div className="contact-panel">
          {sent ? (
            <div className="contact-success" role="status">
              <CheckCircle2 size={36} />
              <h3>Message received.</h3>
              <p>
                Thanks for reaching out. I’ll reply using the email you
                provided.
              </p>
              <button
                type="button"
                className="studio-button studio-button-outline"
                onClick={() => setSent(false)}
              >
                Send another message <ArrowRight size={17} />
              </button>
            </div>
          ) : (
            <form onSubmit={submit} aria-label="Contact Rajiv">
              <div className="contact-field-row">
                <div>
                  <label htmlFor="contact-name">Your name</label>
                  <input
                    id="contact-name"
                    name="name"
                    autoComplete="name"
                    value={form.name}
                    onChange={change}
                    required
                    maxLength={100}
                    placeholder="How should I address you?"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email">Email address</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={change}
                    required
                    maxLength={254}
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <label htmlFor="contact-service">What can I help with?</label>
              <select
                id="contact-service"
                name="service"
                value={form.service}
                onChange={change}
              >
                <option>Web Development</option>
                <option>Full Stack Application</option>
                <option>Frontend & UI/UX Design</option>
                <option>AI & API Integration</option>
                <option>Collaboration</option>
                <option>Others</option>
              </select>
              <label htmlFor="contact-idea">Your message</label>
              <textarea
                id="contact-idea"
                name="idea"
                rows={5}
                required
                maxLength={5000}
                value={form.idea}
                onChange={change}
                placeholder="Tell me a little about your idea…"
                aria-describedby={error ? "contact-error" : undefined}
              />
              {error && (
                <p id="contact-error" className="contact-error" role="alert">
                  {error}
                </p>
              )}
              <div className="contact-submit">
                <span>No mailing lists. Just a conversation.</span>
                <button
                  type="submit"
                  className="studio-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send message <ArrowUpRight size={17} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
