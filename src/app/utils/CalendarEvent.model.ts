export interface Repeat{
  repeatType: string;
  repeatEvery: number;
}


export interface CalendarEvent {
    title: string;
    startDate: Date;
    endDate: Date;
    allDay: boolean;
    repeat: Repeat
  }