export interface Repeat{
  repeatType: String;
  repeatEvery
}


export interface CalendarEvent {
    title: String;
    startDate: Date;
    endDate: Date;
    allDay: Boolean;
    repeat: Repeat
    color: String;
  }