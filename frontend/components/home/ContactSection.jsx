import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Loader2,
  Globe,
  Award,
  CheckCircle2
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
      // Direct POST to public contact messages API (bypasses auth headers)
      await axios.post('/api/business/contact-messages', {
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim() || "General Inquiry",
        message: message.trim(),
        category: "General Inquiry",
        status: "UNREAD"
      });

      toast.success("Thank you! Your message has been sent to SmartLab AI support.");
      
      // Reset form
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
    <section id="contact" className="py-24 relative overflow-hidden bg-slate-950">
      {/* Background Orbs */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionTitle
          subtitle="GET IN TOUCH"
          title="We're Here to Help"
          description="Have questions about SmartLab AI infrastructure, equipment reservation, or research access at Karpagam College of Engineering?"
          dark={true}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-12">
          {/* Official College Contact Information Column */}
          <div className="lg:col-span-5 space-y-6">
            <GlassCard className="p-8 space-y-7">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <span className="w-2 h-6 bg-orange-500 rounded-full"></span>
                  College Campus & Details
                </h3>
                <span className="px-2.5 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/30 rounded-xl text-[10px] font-bold uppercase tracking-wider">
                  TNEA CODE: 2710
                </span>
              </div>

              <div className="space-y-6 text-sm">
                {/* College Address */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-orange-400 shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Karpagam College of Engineering</h4>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                      Myleripalayam Road, Othakkalmandapam Post,<br />
                      Coimbatore - 641 032, Tamil Nadu, India.
                    </p>
                    <span className="text-[10px] text-slate-500 font-semibold mt-1 block">
                      (NAAC 'A+' Grade Autonomous Institution | NBA Accredited)
                    </span>
                  </div>
                </div>

                {/* Email Addresses */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-orange-400 shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Official Email Addresses</h4>
                    <div className="flex flex-col gap-0.5 mt-1 text-xs">
                      <a href="mailto:smartlab.college.auth@gmail.com" className="text-orange-400 hover:underline font-mono">
                        smartlab.college.auth@gmail.com
                      </a>
                      <a href="mailto:info@kce.ac.in" className="text-slate-300 hover:underline font-mono text-[11px]">
                        info@kce.ac.in (General Info)
                      </a>
                    </div>
                  </div>
                </div>

                {/* Phone Numbers */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-orange-400 shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Helpline & Support</h4>
                    <p className="text-slate-300 font-mono text-xs mt-1">
                      +91 - 422 2619005 / +91 93605 36215
                    </p>
                  </div>
                </div>

                {/* Website Link */}
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-orange-400 shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Official Website</h4>
                    <a
                      href="https://kce.ac.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-400 hover:underline text-xs font-semibold"
                    >
                      https://kce.ac.in/
                    </a>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-center gap-4 pt-3 border-t border-slate-800">
                  <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-orange-400 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Laboratory Hours</h4>
                    <p className="text-slate-400 text-xs mt-0.5">Mon - Sat: 08:30 AM - 06:00 PM</p>
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
                  <h3 className="text-2xl font-bold text-white">Send Us a Message</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Fill out the form below to submit an inquiry directly to the SmartLab AI Admin portal.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Student / Visitor Name"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl px-4 py-3.5 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500 transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. visitor@example.com"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl px-4 py-3.5 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Equipment Access Inquiry"
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl px-4 py-3.5 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500 transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">Your Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your detailed message or inquiry here..."
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl px-4 py-3.5 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500 transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-4 bg-orange-500 hover:bg-orange-600 active:scale-98 text-white font-bold text-xs rounded-2xl transition shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
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