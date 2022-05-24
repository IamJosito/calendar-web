import "./Invite.scss";
import { SocketContext } from "../../Services/socket";
import { useContext, useEffect, useState } from "react";
import Modal from "react-modal";
import { decryptData } from "../../Services/crypt";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import translations from "../../Enums/translations";

export default function Invite() {
  const socket = useContext(SocketContext);
  const [calendar, setCalendar] = useState({
    user: "",
    calendar: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    getCalendar();
    return () => {
      socket.off("get-calendar-hash");
    };
  }, []);

  useEffect(() => {
    socket.on("get-calendar", (payload: any) => {
      if (payload.length > 0) {
        setCalendar({
          calendar: payload[0].name,
          user: payload[0].user,
        });
      }
    });
    return () => {
      socket.off("get-calendar");
    };
  }, [calendar]);

  function getCalendar() {
    socket.emit("get-calendar-hash", window.location.pathname.replace("/", ""));
  }

  function joinToTheCalendar(){
    socket.emit("register-calendar-invite", {
      calendarName: calendar.calendar,
      username: decryptData(localStorage.getItem("u")!, process.env.REACT_APP_SECRET!),
      calendarHash: window.location.pathname.replace("/","")
    })
    navigate("/home");
  }

  return (
    <div>
      <Modal
        isOpen={true}
        shouldCloseOnOverlayClick={true}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,.6)",
          },
          content: {
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            height: "40%",
            margin: "auto",
            maxWidth: "500px",
            borderRadius: "10px",
            alignItems: "center",
            justifyContent: "center",
            maxHeight: "50%"
          },
        }}
      >
        <div className="invitation-text">
          {calendar.user && calendar.calendar ? (
            <div className="invitation-container">
              <span className="invitation-text-highlight">{calendar.user}</span>{" "}
              {t(translations.INVITE_TEXT)}{" "}
              <span className="invitation-text-highlight">
                {calendar.calendar}
              </span>
              <button onClick={joinToTheCalendar}>Unirse</button>
            </div>
          ) : (
            t(translations.INVITE_ERROR)
          )}
        </div>
      </Modal>
    </div>
  );
}
