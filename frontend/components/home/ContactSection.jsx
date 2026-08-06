import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Loader2,
  CheckCircle2
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

import SectionTitle from "../ui/SectionTitle";
import GlassCard from "../ui/GlassCard";

const ContactSection = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }

    setSending(true);
    try {
      const contactPayload = {
        id: `contact-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim() || "General Inquiry",
        message: message.trim(),
        createdAt: new Date().toISOString()
      };

      // 1. Store in localStorage for contact records history
      try {
        const stored = localStorage.getItem("smartlab_contact_messages");
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(contactPayload);
        localStorage.setItem("smartlab_contact_messages", JSON.stringify(list));
      } catch (err) {
        console.warn("Could not save to localStorage", err);
      }

      // 2. Dispatch system notification to Admin backend
      await api.post("/api/business/notifications", {
        title: `Contact Us: ${contactPayload.subject}`,
        message: `From ${contactPayload.name} (${contactPayload.email}): ${contactPayload.message}`,
        type: "CONTACT"
      }).catch(() => {});

      toast.success("Thank you! Your message has been stored & sent to SmartLab support.");
      
      // Reset form
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="bg-slate-900 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionTitle
          title="Contact Us"
          subtitle="Need assistance? Reach out to the SmartLab AI support team at Karpagam College of Engineering."
        />

        <div className="grid lg:grid-cols-2 gap-10">
          {/* LEFT: Contact Information Cards */}
          <div className="space-y-6">
            <GlassCard>
              <div className="flex gap-5 items-start">
                <div className="bg-orange-500 p-4 rounded-xl text-white shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-white">Address</h3>
                  <p className="text-slate-400 mt-2 text-sm leading-relaxed">
                    Karpagam College of Engineering,
                    Othakkalmandapam,
                    Coimbatore,
                    Tamil Nadu - 641032
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="flex gap-5 items-center">
                <div className="bg-orange-500 p-4 rounded-xl text-white shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Phone</h3>
                  <p className="text-slate-400 text-sm mt-1">+91 422 2619005</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="flex gap-5 items-center">
                <div className="bg-orange-500 p-4 rounded-xl text-white shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Email</h3>
                  <p className="text-slate-400 text-sm mt-1">smartlab@kce.ac.in</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="flex gap-5 items-center">
                <div className="bg-orange-500 p-4 rounded-xl text-white shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Working Hours</h3>
                  <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                    Monday - Saturday
                    <br />
                    9:00 AM - 5:00 PM
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* RIGHT: Interactive Contact Form */}
          <GlassCard>
            <h2 className="text-3xl font-bold mb-8 text-white">Send a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 outline-none focus:border-orange-500 transition text-sm"
              />

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 outline-none focus:border-orange-500 transition text-sm"
              />

              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject (Optional)"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 outline-none focus:border-orange-500 transition text-sm"
              />

              <textarea
                rows={6}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your Message"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 outline-none focus:border-orange-500 transition text-sm resize-none"
              />

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-base disabled:opacity-60"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;