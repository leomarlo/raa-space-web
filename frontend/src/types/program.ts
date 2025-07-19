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
}

type CalendarViewProps = {
  items: ProgramItem[];
  cellOpacity?: number;
};

// export ProgramItem and CalendarViewProps
export type { ProgramItem, CalendarViewProps };