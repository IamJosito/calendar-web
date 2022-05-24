import "./MainCalendarCard.scss";
import { IoAddCircle } from "react-icons/io5";
import { CalendarEvents } from "../../Models/CalendarEvents";
import Modal from "react-modal";
import { useState } from "react";
import { GrClose } from "react-icons/gr";
import toast, { Toaster } from "react-hot-toast";
import { t } from "i18next";
import translations from "../../Enums/translations";
import { socket } from "../../Services/socket";
import { decryptData } from "../../Services/crypt";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

export default function MainCalendarCard(props: CalendarEvents) {
  const toastError = () =>
    toast(t(translations.REGISTER_ERROR_MSG_FIELDS), {
      duration: 1000,
      style: {
        background: "#ff00b3",
        color: "#fff",
      },
    });
  const toastCopyLink = () =>
    toast(t(translations.TOAST_COPY_TO_CLIPBOARD), {
      duration: 1000,
      style: {
        background: "#0db53f",
        color: "#fff",
      },
    });

  const [modalIsOpen, setIsOpen] = useState(false);
  const [calendarName, setCalendarName] = useState("");
  const [link, setLink] = useState("");
  const navigate = useNavigate();

  async function openModal() {
    const input: HTMLInputElement = document.querySelector(
      ".new-calendar-input"
    )!;
    await setIsOpen(true);
  }

  async function closeModal() {
    await setCalendarName("");
    await setLink("");
    await setIsOpen(false);
  }

  function openCalendar() {
    navigate(`/calendar/${props.hash}`, {
      state: {
        calendarHash: props.hash,
      },
    });
  }

  return (
    <div
      className="calendar-card"
      onClick={!props.title ? openModal : openCalendar}
    >
      {!props.title ? (
        <div className="add-new-calendar">
          <IoAddCircle className="add-icon" />
          {t(translations.NEW_CALENDAR)}
        </div>
      ) : (
        <div>{props.title}</div>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        shouldCloseOnOverlayClick={true}
        portalClassName="modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,.6)",
          },
          content: {
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            height: "fit-content",
            margin: "auto",
            maxWidth: "500px",
            borderRadius: "10px",
            maxHeight: "50%",
          },
        }}
      >
        <span onClick={closeModal} className="close-modal-button">
          <GrClose />
        </span>
        <div className="modal-body">
          <input
            type="text"
            className="new-calendar-input"
            placeholder={t(translations.MODAL_INPUT_NEW_CALENDAR)}
            onChange={(e) => fillCalendarName(e)}
          />
          <div className="invite-link-title">
            {t(translations.MODAL_INVITATION_LINK)}
          </div>
          <div className="invite-link">
            <input
              type="text"
              className="new-calendar-input"
              value={link}
              readOnly
            />
            <button onClick={copyToClipboard}>
              {t(translations.MODAL_COPY_LINK)}
            </button>
          </div>
          <button className="save-button" onClick={addNewCalendar}>
            {t(translations.BUTTONS_SAVE)}
          </button>
        </div>
      </Modal>
      <Toaster />
    </div>
  );

  function fillCalendarName(e: React.ChangeEvent<HTMLInputElement>) {
    setCalendarName(e.target.value);
    const link =
      e.target.value.length > 0
        ? window.location.host + "/" + Math.random().toString(12).slice(2)
        : "";
    setLink(link);
  }

  function copyToClipboard() {
    var content: any = document.querySelector(
      ".invite-link>.new-calendar-input"
    )!;

    console.log(content);

    navigator.clipboard
      .writeText(content.value)
      .then(() => {
        toastCopyLink();
      })
      .catch((err) => {
        console.log("Something went wrong", err);
      });
  }

  function addNewCalendar() {
    const input = document.querySelector(".new-calendar-input");
    input?.classList.remove("input-error");
    if (!calendarName) {
      toastError();
      input?.classList.add("input-error");
    } else {
      socket.emit("register-calendar", {
        calendarName,
        username: decryptData(
          localStorage.getItem("u")!,
          process.env.REACT_APP_SECRET!
        ),
        calendarHash: link.split("/")[1],
      });
      closeModal();
      socket.emit(
        "get-calendars",
        decryptData(localStorage.getItem("u")!, process.env.REACT_APP_SECRET!)
      );
    }
  }
}
