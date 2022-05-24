import "./Main.scss";
import MainCalendarCard from "../MainCalendarCard/MainCalendarCard";
import { SocketContext } from "../../Services/socket";
import { decryptData } from "../../Services/crypt";
import { useContext, useEffect, useState } from "react";

export default function Main() {
  const socket = useContext(SocketContext);
  const [calendars, setCalendars] = useState([]);

  useEffect(() => {
    getCalendars();
    return () => {
      socket.off("get-calendars");
    };
  }, []);

  useEffect(() => {
    socket.on("get-calendars", (payload: any) => {
      setCalendars(payload);
    });

    return () => {
      socket.off("get-calendars");
    };
  }, [calendars]);

  function getCalendars() {
    socket.emit(
      "get-calendars",
      decryptData(localStorage.getItem("u")!, process.env.REACT_APP_SECRET!)
    );
  }

  const [modalIsOpen, setIsOpen] = useState(false);

  async function openModal() {
    await setIsOpen(true);
  }

  async function closeModal() {
    await setIsOpen(false);
  }

  return (
    <div className="main-home">
      {calendars.map((calendar: any, index) => (
        <MainCalendarCard
          title={calendar.title}
          hash={calendar.hash}
          key={index}
        ></MainCalendarCard>
      ))}
      <MainCalendarCard title={undefined} hash={undefined}></MainCalendarCard>
    </div>
  );
}
