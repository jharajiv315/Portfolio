import { useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  Mail,
  Loader2,
} from "lucide-react";
import axios from "axios";
import { API_URL } from "../config";
export default function Contact({ user, copy = {}, preview = false }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    service: "Web Development",
    idea: "",
  });
  const [loading, setLoading] = useState(false),
    [sent, setSent] = useState(false),
    [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const pending = useRef(false);
  const formRef = useRef(null);
  const receipt = useRef('');
  const validate = values => ({
    ...(values.name.trim().length < 3 ? {name: 'Enter at least 3 characters for your name.'} : {}),
    ...(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()) ? {email: 'Enter a valid email address so I can reply.'} : {}),
    ...(values.idea.trim().length < 5 ? {idea: 'Tell me a little more (at least 5 characters).'} : {}),
  });
  const change = (e) => {
    const next = {...form, [e.target.name]:e.target.value}; setForm(next);
    if (fieldErrors[e.target.name]) setFieldErrors(validate(next));
    setError('');
  };
  const submit = async (e) => {
    e.preventDefault();
    if (pending.current) return;
    if (preview) {
      setError("Contact submission is disabled in preview.");
      return;
    }
    setError("");
    const invalid = validate(form); setFieldErrors(invalid);
    if (Object.keys(invalid).length) {
      formRef.current?.elements.namedItem(Object.keys(invalid)[0])?.focus(); return;
    }
    pending.current = true;
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
      receipt.current = form.email.trim();
      setSent(true);
      setForm({ name: "", email: "", service: "Web Development", idea: "" });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Your message couldn’t be sent. Please try again or email me directly.",
      );
    } finally {
      pending.current = false;
      setLoading(false);
    }
  };
  return (
    <section id="contact" className="studio-section contact-section">
      <div className="studio-container contact-layout">
        <div>
          <p className="studio-eyebrow">05 / Start a conversation</p>
          <h2>
            {copy.contactTitle}
            <br />
            <em>{copy.contactAccent}</em>
          </h2>
          <p className="contact-intro">{copy.contactIntro}</p>
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
                Your inquiry is saved in my dashboard. I’ll reply to {receipt.current}.
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
            <form ref={formRef} onSubmit={submit} noValidate aria-label="Contact Rajiv" aria-busy={loading}>
              <fieldset disabled={loading || preview} className="min-w-0">
              <legend className="sr-only">Send a portfolio inquiry</legend>
              <div className="contact-field-row">
                <div>
                  <label htmlFor="contact-name">Your name</label>
                  <input
                    id="contact-name"
                    name="name"
                    autoComplete="name"
                    value={form.name}
                    onChange={change}
                    aria-invalid={Boolean(fieldErrors.name)}
                    aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
                    required
                    maxLength={100}
                    placeholder="How should I address you?"
                  />
                  {fieldErrors.name && <p id="contact-name-error" className="contact-error" role="alert">{fieldErrors.name}</p>}
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
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined}
                    required
                    maxLength={254}
                    placeholder="you@example.com"
                  />
                  {fieldErrors.email && <p id="contact-email-error" className="contact-error" role="alert">{fieldErrors.email}</p>}
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
                aria-invalid={Boolean(fieldErrors.idea)}
                aria-describedby="contact-message-help contact-idea-error"
              />
              <p id="contact-message-help" className="contact-field-help">{form.idea.length}/5000 characters · Please don’t include passwords or sensitive details.</p>
              {fieldErrors.idea && <p id="contact-idea-error" className="contact-error" role="alert">{fieldErrors.idea}</p>}
              {preview && <p className="contact-field-help">Submissions are disabled in draft preview.</p>}
              {error && (
                <p id="contact-error" className="contact-error" role="alert">
                  {error}
                </p>
              )}
              <div className="contact-submit">
                <span role="status">{loading ? "Saving your inquiry… Please keep this page open." : "No mailing lists. Just a conversation."}</span>
                <button
                  type="submit"
                  className="studio-button"
                  disabled={loading || preview}
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
              </fieldset>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
