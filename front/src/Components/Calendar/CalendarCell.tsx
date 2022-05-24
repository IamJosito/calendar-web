import moment from "moment";
import { MouseEventHandler, useState } from "react";
import { CalendarData } from "../../Models/CalendarData";
import { EventModel } from "../../Models/EventModel";
import { decryptData } from "../../Services/crypt";
import "./CalendarCell.scss";
import Events from "./Events";

export default function CalendarCell(props: CalendarData) {
  function setActiveDay(e: any) {
    document.querySelector(".calendar-cell.active")?.classList.remove("active");
    e.target.classList.add("active");
    const openModal: MouseEventHandler<HTMLDivElement> | any = props.onClick;
    openModal(date);
  }
  const date = moment().date(props.day!).month(props.month!).year(props.year!);
  return (
    <div
      className={
        props.day === moment().date() ? "calendar-cell active" : "calendar-cell"
      }
      onClick={setActiveDay}
    >
      <div className="date-number">{props.day}</div>
      <div className="calendar-events">
        {props.events?.length!! > 0 ? (
          props.events?.map((event: EventModel, index) => {
            return (
              index < 2 &&
              (event.user ===
              decryptData(
                localStorage.getItem("u")!,
                process.env.REACT_APP_SECRET!
              ) ? (
                <Events
                  className="self"
                  eventTitle={event.title}
                  key={index}
                  onClick={props.onEventClick}
                  currentDate={date}
                />
              ) : (
                <Events
                  className="other"
                  eventTitle={event.title}
                  key={index}
                  onClick={props.onEventClick}
                  currentDate={date}
                />
              ))
            );
          })
        ) : (
          <Events className="invisible" />
        )}
        {props.events?.length!! > 2 || (window.innerWidth <= 768  && props.events?.length!! >= 1) ? (
            <Events
              className="more"
              eventTitle="..."
              onClick={props.onEventClick}
              currentDate={date}
            />
          ) : null}
      </div>
    </div>
  );
}
