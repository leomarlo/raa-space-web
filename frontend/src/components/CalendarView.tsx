import Image from 'next/image';
import {ProgramItem, CalendarViewProps} from '@/types/program';
import { useLanguage } from '@/context/LanguageContext';


const eventColors = [
  '#000000', '#8B0000', '#A52A2A', '#B22222', '#DC143C',
  '#800000', '#00008B', '#0000CD', '#4169E1', '#1E90FF', '#4682B4'
];

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
// Helper function to convert hex to rgba with opacity
function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export default function CalendarView({ items, cellOpacity = 0.4 }: CalendarViewProps) {
  const { t } = useLanguage();

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  // Calendar range: July 1st - August 31st, 2025
  const startDate = new Date('2025-07-01T00:00:00Z');
  const endDate = new Date('2025-08-31T23:59:59Z');

  const days: { date: string; month: string; monthIndex: number; events: ProgramItem[]; dayName: string }[] = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const monthIndex = d.getMonth() + 1; // July = 7, August = 8
    const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    days.push({
      date: formatDate(d),
      month: d.toLocaleString('default', { month: 'long' }).toUpperCase(),
      monthIndex,
      events: [],
      dayName: dayOfWeek
    });
  }

  // Group events by day
  items.forEach((item) => {
    const dayKey = formatDate(new Date(item.startDate));
    const day = days.find((d) => d.date === dayKey);
    if (day) day.events.push(item);
  });

  return (
    <div className="p-4">
      <div className="grid [grid-template-columns:repeat(auto-fill,minmax(120px,1fr))]">
        {days.map((day, index) => {
          const dayNumber = new Date(day.date).getDate();

          // Case-by-case day label
          let dayLabel = day.dayName.slice(0, 3).toUpperCase();
          if (day.dayName === 'monday') {
            dayLabel = t.days.monday.abbr || dayLabel;
          } else if (day.dayName === 'tuesday') {
            dayLabel = t.days.tuesday.abbr || dayLabel;
          } else if (day.dayName === 'wednesday') {
            dayLabel = t.days.wednesday.abbr || dayLabel;
          } else if (day.dayName === 'thursday') {
            dayLabel = t.days.thursday.abbr || dayLabel;
          } else if (day.dayName === 'friday') {
            dayLabel = t.days.friday.abbr || dayLabel;
          } else if (day.dayName === 'saturday') {
            dayLabel = t.days.saturday.abbr || dayLabel;
          } else if (day.dayName === 'sunday') {
            dayLabel = t.days.sunday.abbr || dayLabel;
          }

          const cellColor = calendarColors[day.monthIndex] || calendarColors[0];

          return (
            <div
              key={index}
              className="relative aspect-[4/3] border border-[#8B0000] overflow-hidden"
              style={{ backgroundColor: hexToRgba(cellColor, cellOpacity) }}
            >
              {/* Day abbreviation (top-left) */}
              <div className="absolute top-0 left-0 z-10 bg-[#8B0000] text-white text-xs px-1 border border-[#8B0000]">
                {dayLabel}
              </div>

              {/* Day number (top-right) */}
              <div className="absolute top-0 right-0 z-10 bg-[#8B0000] text-white text-xs px-1 border border-[#8B0000]">
                {dayNumber}
              </div>

              {/* Events */}
              {day.events.length > 0 ? (
                <div className="h-full w-full flex flex-col relative z-0">
                  {day.events.map((event) => (
                    <a
                      key={event.id}
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative flex-1"
                    >
                      {/* Color strip */}
                      <div
                        className="absolute left-0 top-0 h-full w-3 z-10"
                        style={{
                          backgroundColor: eventColors[Number(event.color) || 0]
                        }}
                      />
                      {/* Event image */}
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover z-0"
                      />
                      {/* Event title (transparent background) */}
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <span className="text-black font-bold text-center text-xs">
                          {event.title}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
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