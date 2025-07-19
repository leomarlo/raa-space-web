// types/program.ts
interface ProgramItem {
  id: string;
  image: string;
  title: string;
  url: string;
  startDate: string;
  endDate: string;
  color: string;
  location: string;
  shortDescription: string;
  when: string;
  instaLink: string;
  fbLink: string;
  registrationLink: string;
  price: string;
  description: string;
  showTextOverThumbnail: number;
}

interface ProgramListViewProps {
  items: ProgramItem[];
}

interface CalendarViewProps {
  items: ProgramItem[];
  startDate: Date | string;
  endDate: Date | string;
  cellOpacity?: number;
}


type Translations = {
  days: {
    monday: { abbr: string };
    tuesday: { abbr: string };
    wednesday: { abbr: string };
    thursday: { abbr: string };
    friday: { abbr: string };
    saturday: { abbr: string };
    sunday: { abbr: string };
  };
  months: {
    january: { name: string };
    february: { name: string };
    march: { name: string };
    april: { name: string };
    may: { name: string };
    june: { name: string };
    july: { name: string };
    august: { name: string };
    september: { name: string };
    october: { name: string };
    november: { name: string };
    december: { name: string };
  };
};
// export ProgramItem and CalendarViewProps
export type { ProgramItem, CalendarViewProps, ProgramListViewProps, Translations };