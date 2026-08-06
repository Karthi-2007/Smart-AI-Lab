import { Star } from "lucide-react";
import SectionTitle from "../ui/SectionTitle";
import GlassCard from "../ui/GlassCard";

const testimonials = [
  {
    name: "Arun Kumar",
    role: "Final Year CSE Student",
    review:
      "SmartLab AI made booking laboratory equipment incredibly easy. The QR-based access and booking reminders saved a lot of time.",
  },
  {
    name: "Dr. Priya",
    role: "Faculty Coordinator",
    review:
      "The dashboard provides complete visibility into equipment usage and student bookings. Managing laboratory resources has become much easier.",
  },
  {
    name: "Lab Assistant",
    role: "Mechanical Laboratory",
    review:
      "The AI maintenance prediction helped us identify equipment requiring service before unexpected failures occurred.",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 sm:py-24 px-6" style={{ background: '#ffffff' }}>
      <div className="max-w-7xl mx-auto">

        <SectionTitle
          title="What Our Users Say"
          subtitle="SmartLab AI improves laboratory management for students, faculty, and administrators."
        />

        <div className="grid lg:grid-cols-3 gap-8">

          {testimonials.map((user, index) => (
             <GlassCard
               key={index}
               className="hover:border-orange-500 hover:-translate-y-2 transition-all duration-500"
             >
               {/* Avatar */}

               <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-2xl font-bold text-white shadow-md">
                 {user.name.charAt(0)}
               </div>

               {/* Stars */}

               <div className="flex gap-1 mt-6">
                 {[1, 2, 3, 4, 5].map((star) => (
                   <Star
                     key={star}
                     size={18}
                     fill="#cc6926"
                     color="#cc6926"
                   />
                 ))}
               </div>

               {/* Review */}

               <p className="mt-6 text-slate-600 text-sm leading-relaxed italic">
                 "{user.review}"
               </p>

               {/* User */}

               <div className="mt-8 pt-4 border-t border-slate-100">

                 <h3 className="font-bold text-lg" style={{ color: '#0b2545' }}>
                   {user.name}
                 </h3>

                 <p className="text-[#cc6926] text-xs font-bold uppercase tracking-wider mt-0.5">
                   {user.role}
                 </p>

               </div>

             </GlassCard>
          ))}

        </div>

      </div>
    </section>
  );
};

export default Testimonials;