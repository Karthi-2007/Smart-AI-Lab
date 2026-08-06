import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Loader2,
  Globe,
  Award
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

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
      await axios.post('/api/business/contact-messages', {
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim() || "General Inquiry",
        message: message.trim(),
        category: "General Inquiry",
        status: "UNREAD"
      });

      toast.success("Thank you! Your message has been sent to SmartLab AI support.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("Contact submit error:", error);
      toast.error("Failed to send message. Please check backend connection.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-24 px-6 relative overflow-hidden" style={{ background: '#f5f7fa' }}>
      {/* Subtle brand color glow */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#0b2545]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionTitle
          subtitle="GET IN TOUCH"
          title="We're Here to Help"
          description="Have questions about SmartLab AI infrastructure, equipment reservation, or research access at Karpagam College of Engineering?"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-12">
          {/* Official College Contact Information Column */}
          <div className="lg:col-span-5 space-y-6">
            <GlassCard className="p-8 space-y-7">
              <div className="flex items-center justify-between border-b pb-4 border-slate-100">
                <h3 className="text-xl font-bold flex items-center gap-3" style={{ color: '#0b2545' }}>
                  <span className="w-2.5 h-6 rounded-full" style={{ background: '#cc6926' }}></span>
                  Campus Details
                </h3>
                <span className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                  TNEA CODE: 2710
                </span>
              </div>

              <div className="space-y-6 text-sm">
                {/* College Address */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl shrink-0 mt-0.5 text-white" style={{ background: '#cc6926' }}>
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm" style={{ color: '#0b2545' }}>Karpagam College of Engineering</h4>
                    <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                      Myleripalayam Road, Othakkalmandapam Post,<br />
                      Coimbatore - 641 032, Tamil Nadu, India.
                    </p>
                    <span className="text-[10px] text-slate-500 font-bold mt-1 block">
                      (NAAC 'A+' Grade Autonomous Institution | NBA Accredited)
                    </span>
                  </div>
                </div>

                {/* Email Addresses */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl shrink-0 mt-0.5 text-white" style={{ background: '#cc6926' }}>
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm" style={{ color: '#0b2545' }}>Official Email</h4>
                    <div className="flex flex-col gap-0.5 mt-1 text-xs font-semibold">
                      <a href="mailto:smartlab.college.auth@gmail.com" className="hover:underline" style={{ color: '#cc6926' }}>
                        smartlab.college.auth@gmail.com
                      </a>
                      <a href="mailto:info@kce.ac.in" className="text-slate-500 hover:underline text-[11px]">
                        info@kce.ac.in (General Info)
                      </a>
                    </div>
                  </div>
                </div>

                {/* Phone Numbers */}
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl shrink-0 mt-0.5 text-white" style={{ background: '#cc6926' }}>
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm" style={{ color: '#0b2545' }}>Helpline & Support</h4>
                    <p className="text-slate-600 font-bold text-xs mt-1">
                      +91 - 422 2619005 &nbsp;|&nbsp; +91 93605 36215
                    </p>
                  </div>
                </div>

                {/* Website Link */}
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl shrink-0 text-white" style={{ background: '#cc6926' }}>
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm" style={{ color: '#0b2545' }}>Official Website</h4>
                    <a
                      href="https://kce.ac.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline text-xs font-bold"
                      style={{ color: '#cc6926' }}
                    >
                      https://kce.ac.in/
                    </a>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                  <div className="p-3 rounded-2xl shrink-0 text-white" style={{ background: '#cc6926' }}>
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm" style={{ color: '#0b2545' }}>Laboratory Hours</h4>
                    <p className="text-slate-500 text-xs mt-0.5">Mon - Sat: 08:30 AM - 06:00 PM</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Contact Message Form Column */}
          <div className="lg:col-span-7">
            <GlassCard className="p-8 sm:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-2xl font-black" style={{ color: '#0b2545' }}>Send Us a Message</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Fill out the form below to submit an inquiry directly to the SmartLab AI Admin portal.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-extrabold uppercase tracking-wider block mb-2" style={{ color: '#0b2545' }}>Your Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Student / Visitor Name"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-orange-500 focus:bg-white transition-all shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold uppercase tracking-wider block mb-2" style={{ color: '#0b2545' }}>Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. visitor@example.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-orange-500 focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-extrabold uppercase tracking-wider block mb-2" style={{ color: '#0b2545' }}>Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Equipment Access Inquiry"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-orange-500 focus:bg-white transition-all shadow-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold uppercase tracking-wider block mb-2" style={{ color: '#0b2545' }}>Your Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your detailed message or inquiry here..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-orange-500 focus:bg-white transition-all shadow-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-4 text-white font-bold text-xs rounded-xl transition shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ background: '#cc6926' }}
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Transmitting Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message to Admin</span>
                    </>
                  )}
                </button>
              </form>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;