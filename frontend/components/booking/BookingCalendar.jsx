import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const BookingCalendar = ({ selectedDate, onSelectDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    const formatted = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(
      day
    ).padStart(2, '0')}`;
    if (onSelectDate) onSelectDate(formatted);
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">{monthName}</h3>
        </div>
        <div className="flex space-x-1">
          <button onClick={prevMonth} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={nextMonth} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-slate-400 font-medium mb-2">
        <span>Su</span>
        <span>Mo</span>
        <span>Tu</span>
        <span>We</span>
        <span>Th</span>
        <span>Fr</span>
        <span>Sa</span>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const formatted = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(
            2,
            '0'
          )}-${String(day).padStart(2, '0')}`;
          const isSelected = selectedDate === formatted;

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              className={`h-8 w-8 rounded-lg flex items-center justify-center transition ${
                isSelected
                  ? 'bg-cyan-500 text-black font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BookingCalendar;
