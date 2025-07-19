import Image from 'next/image';
import { useRef, useEffect } from 'react';
import { ProgramItem, CalendarViewProps } from '@/types/program';
import { useLanguage } from '@/context/LanguageContext';

const calendarColors = [
  '#000000', // 0 - fallback (black)
  '#7A2B2B', // 1 - January (muted red)
  '#7A4F2B', // 2 - February (warm brown)
  '#7A7A2B', // 3 - March (olive)
  '#4F7A2B', // 4 - April (green)
  '#2B7A2B', // 5 - May (forest green)
  '#2B7A7A', // 6 - June (teal)
  '#2B4F7A', // 7 - July (muted blue)
  '#4F2B7A', // 8 - August (purple)
  '#7A2B7A', // 9 - September (magenta)
  '#7A2B4F', // 10 - October (muted rose)
  '#4F4F4F', // 11 - November (dark gray)
  '#7A7A7A'  // 12 - December (light gray)
];

// Convert hex color to rgba with opacity
function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// Translate day name to localized label
function getDayLabel(dayName: string, t: any): string {
  const fallback = dayName.slice(0, 3).toUpperCase();
  switch (dayName) {
    case 'monday': return t.days.monday.abbr || fallback;
    case 'tuesday': return t.days.tuesday.abbr || fallback;
    case 'wednesday': return t.days.wednesday.abbr || fallback;
    case 'thursday': return t.days.thursday.abbr || fallback;
    case 'friday': return t.days.friday.abbr || fallback;
    case 'saturday': return t.days.saturday.abbr || fallback;
    case 'sunday': return t.days.sunday.abbr || fallback;
    default: return fallback;
  }
}

export default function CalendarView({ items, cellOpacity = 0.4 }: CalendarViewProps) {
  const today = new Date().toISOString().split('T')[0];
  const todayRef = useRef<HTMLDivElement | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (todayRef.current) {
      todayRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  // Calendar range: May 1st - October 1st, 2025
  const startDate = new Date('2025-07-01T00:00:00Z');
  const endDate = new Date('2025-08-01T23:59:59Z');

  const days: {
    date: string;
    month: string;
    monthIndex: number;
    events: ProgramItem[];
    dayName: string;
  }[] = [];

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const monthIndex = d.getMonth() + 1; // May = 5
    const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    days.push({
      date: formatDate(d),
      month: d.toLocaleString('default', { month: 'long' }).toUpperCase(),
      monthIndex,
      events: [],
      dayName: dayOfWeek
    });
  }

  // Group events by each day between startDate and endDate
  // Group events by each day between startDate and endDate
  items.forEach((item) => {
    const start = new Date(item.startDate);
    const end = new Date(item.endDate);

    // Normalize start and end to midnight UTC
    start.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(0, 0, 0, 0);

    days.forEach((day) => {
      const current = new Date(day.date);
      current.setUTCHours(0, 0, 0, 0);

      if (current >= start && current <= end) {
        day.events.push(item);
      }
    });
  });


  console.log(days);


  return (
    <div className="p-4">
      <div className="grid [grid-template-columns:repeat(auto-fill,minmax(120px,1fr))]">
        {days.map((day, index) => {
          const isToday = day.date === today;
          const dayNumber = new Date(day.date).getDate();
          const dayLabel = getDayLabel(day.dayName, t);
          const cellColor = calendarColors[day.monthIndex] || calendarColors[0];
  
          return (
            <div
              key={index}
              ref={isToday ? todayRef : null}
              className="relative aspect-[4/3] border border-[#8B0000] overflow-hidden"
              style={{ backgroundColor: hexToRgba(cellColor, cellOpacity) }}
            >
              {/* Top-left: Day abbreviation */}
              <div className="absolute top-0 left-0 z-10 bg-[#8B0000] text-white text-xs px-1 border border-[#8B0000]">
                {dayLabel}
              </div>
  
              {/* Top-right: Day number */}
              <div className="absolute top-0 right-0 z-10 bg-[#8B0000] text-white text-xs px-1 border border-[#8B0000]">
                {dayNumber}
              </div>
  
              {/* Events */}
              {day.events.length > 0 ? (
                <div
                  className="h-full w-full grid relative z-0"
                  style={{ gridTemplateRows: `repeat(${day.events.length}, 1fr)` }}
                >
                  {day.events.map((event) => (
                    <a
                      key={event.id}
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative w-full h-full"
                    >
                      {/* Event image */}
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover z-0"
                      />
                      {/* Event title */}
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <span className="text-black font-bold text-center text-xs">
                          {event.title}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                // Month label when no events
                <div className="h-full w-full flex items-center justify-center text-[#8B0000] font-bold text-lg z-10">
                  {day.month}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );  
}
