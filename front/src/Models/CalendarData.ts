import { MouseEventHandler } from "react";
import { EventModel } from "./EventModel";

export class CalendarData {
  day;
  year;
  month;
  events;
  onClick: MouseEventHandler<HTMLDivElement> | undefined;
  onEventClick: MouseEventHandler<HTMLDivElement> | undefined;
  constructor(
    day?: number,
    year?: number,
    month?: number,
    onClick?: MouseEventHandler<HTMLDivElement> | undefined,
    onEventClick?: MouseEventHandler<HTMLDivElement> | undefined,
    events?: Array<EventModel>
  ) {
    this.day = day;
    this.year = year;
    this.month = month;
    this.onClick = onClick;
    this.onEventClick = onEventClick;
    this.events = events;
  }
}
