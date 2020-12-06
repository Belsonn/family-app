export interface Repeat{
  repeatType: String;
  repeatEvery
}


export interface CalendarEvent {
    _id: String,
    name: String;
    startDate: Date;
    endDate: Date;
    allDay: Boolean;
    repeat: Repeat
    color: String;
  }

  export interface EventsResponse {
    status: String,
    results: Number,
    data: {
      events: [CalendarEvent]
    }
  }