import moment, { Moment } from "moment";
import { useEffect, useState } from "react";
import "./Calendar.scss";
import { useLocation, useNavigate } from "react-router-dom";
import CalendarCell from "./CalendarCell";
import { GrClose, GrLinkNext, GrLinkPrevious } from "react-icons/gr";
import { t } from "i18next";
import translations from "../../Enums/translations";
import { FaUserFriends } from "react-icons/fa";
import FriendData from "./FriendData";
import { socket } from "../../Services/socket";
import { decryptData } from "../../Services/crypt";
import Modal from "react-modal";
import Button from "../Button/Button";
import toast, { Toaster } from "react-hot-toast";
import { EventModel } from "../../Models/EventModel";
import { AiOutlineArrowLeft } from "react-icons/ai";
import ConfirmationForm from "./ConfirmationForm";

export default function Calendar() {
  const location: any = useLocation();
  const hash = location.state.calendarHash;
  const months = [
    translations.JANUARY,
    translations.FEBRUARY,
    translations.MARCH,
    translations.APRIL,
    translations.MAY,
    translations.JUNE,
    translations.JULY,
    translations.AUGUST,
    translations.SEPTEMBER,
    translations.OCTOBER,
    translations.NOVEMBER,
    translations.DECEMBER,
  ];
  const [actualDate, setActualDate] = useState(moment());
  const [friends, setFriends] = useState([]);
  const [events, setEvents] = useState(Array<EventModel>());
  const [disabledEditEvents, setDisabledEditEvents] = useState(false);

  const [modalIsOpen, setIsOpen] = useState(false);
  const [deleteUserModal, setDeleteUserModal] = useState(false);
  const [dayModalIsOpened, setDayModal] = useState(false);
  const [eventModalIsOpened, setEventModal] = useState(false);
  const [editEventModal, setEditEventModal] = useState(false);
  const [inviteModalIsOpen, setInviteModal] = useState(false);
  const [deleteCalendarModalIsOpen, setDeleteCalendarModal] = useState(false);
  const [deleteCalendarIsOpen, setDeleteCalendarIsOpen] = useState(false);

  const [friendName, setFriendName] = useState("");
  const [date, setDate] = useState(moment());
  const [event, setEvent] = useState(
    new EventModel(
      "",
      "",
      decryptData(localStorage.getItem("u")!!, process.env.REACT_APP_SECRET!!),
      date.format("DD-MM-YYYY").toString()
    )
  );
  const [eventToEdit, setEventToEdit] = useState(
    new EventModel(
      "",
      "",
      decryptData(localStorage.getItem("u")!!, process.env.REACT_APP_SECRET!!),
      date.format("DD-MM-YYYY").toString(),
      0
    )
  );

  const [calendarCellsArray, setCalendarCells] = useState(new Array<any>());
  const navigate = useNavigate();

  const toastCopyLink = () =>
    toast(t(translations.TOAST_COPY_TO_CLIPBOARD), {
      duration: 1000,
      style: {
        background: "#0db53f",
        color: "#fff",
      },
    });

  async function openModal(friendName: string) {
    await setFriendName(friendName);
    await setIsOpen(true);
  }

  async function closeModal() {
    await setIsOpen(false);
  }

  async function openDeleteUserModal() {
    await setDeleteUserModal(true);
  }

  async function closeDeleteUserModal() {
    await setDeleteUserModal(false);
    navigate("/home");
  }

  async function openDayModal(date: any) {
    setDate(date);
    setEvent({ ...event, date: date.format("DD-MM-YYYY").toString() });
    await setDayModal(true);
  }

  async function closeDayModal() {
    await setDayModal(false);
  }

  async function openEventModal(date: any) {
    await setDate(date);
    await setEventModal(true);
  }

  async function closeEventModal() {
    await setEventModal(false);
  }

  async function openEditEventModal(event: EventModel) {
    await setEventToEdit(event);
    await setEventModal(false);
    await setEditEventModal(true);
  }
  async function closeEditEventModal() {
    await setEditEventModal(false);
    await openEventModal(date);
  }

  async function openInviteModal() {
    await setInviteModal(true);
  }
  async function closeInviteModal() {
    await setInviteModal(false);
  }

  async function openDeleteCalendarModal() {
    await setDeleteCalendarModal(true);
  }
  async function closeDeleteCalendarModal() {
    await setDeleteCalendarModal(false);
  }

  async function openDeleteCalendar(){
    setDeleteCalendarIsOpen(true);
  }
  async function closeDeleteCalendar(){
    setDeleteCalendarIsOpen(false);
    navigate("/home");
  }

  async function sendEventToEdit() {
    await socket.emit("edit-event", {
      event: eventToEdit,
      hash,
    });
    await socket.emit("get-events-in-the-calendar", hash);
    await closeEditEventModal();
  }

  async function deleteEvent() {
    await socket.emit("delete-event", { hash, eventToEdit });
    await socket.emit("get-events-in-the-calendar", hash);
  }

  async function deleteCalendar(){
    await socket.emit("delete-calendar", hash);
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

  useEffect(() => {
    socket.emit("get-users-in-the-calendar", hash);
    return () => {
      socket.off("get-users-in-the-calendar");
    };
  }, [hash]);
  useEffect(() => {
    socket.emit("get-events-in-the-calendar", hash);
    return () => {
      socket.off("get-events-in-the-calendar");
    };
  }, [hash]);

  useEffect(() => {
    socket.on("get-users-in-the-calendar", (users) => {
      let myUserIndex = 0;
      users.forEach((user: any, index: number) => {
        if (
          decryptData(
            localStorage.getItem("u")!,
            process.env.REACT_APP_SECRET!
          ) === user.user
        ) {
          myUserIndex = index;
        }
      });
      const finalUsers = users;
      const myUser = finalUsers[myUserIndex];
      const otherUser = finalUsers[0];
      finalUsers[0] = myUser;
      finalUsers[myUserIndex] = otherUser;
      setFriends(finalUsers);
    });
    return () => {
      socket.off("get-users-in-the-calendar");
    };
  }, [friends]);

  useEffect(() => {
    socket.on("get-events-in-the-calendar", async (eventsInTheCalendar) => {
      await setEvents(eventsInTheCalendar);
    });
    return () => {
      socket.off("get-events-in-the-calendar");
    };
  }, [events]);

  useEffect(() => {
    generateCalendar(actualDate);
  }, [actualDate, events]);

  function generateCalendar(_date: Moment) {
    const calendarCells: Array<any> = [];
    if (_date.startOf("month").day() !== 1) {
      if (_date.startOf("month").day() === 0) {
        for (let index = 0; index < 6; index++) {
          calendarCells.push(<div key={"empty-" + index}></div>);
        }
      } else {
        for (let index = 0; index < _date.startOf("month").day() - 1; index++) {
          calendarCells.push(<div key={"empty-" + index}></div>);
        }
      }
    }

    for (let index = 0; index < _date.daysInMonth(); index++) {
      const potentialDate = moment(actualDate)
        .date(index + 1)
        .format("DD-MM-YYYY")
        .toString();

      calendarCells.push(
        <CalendarCell
          day={index + 1}
          month={_date.month()}
          year={_date.year()}
          key={index}
          onClick={openDayModal}
          onEventClick={openEventModal}
          events={events.filter(
            (event: EventModel) => event.date === potentialDate
          )}
        />
      );
    }
    setCalendarCells(calendarCells);
  }

  const toastError = () =>
    toast(
      t(translations.TOAST_DELETED_FRIEND, {
        friend: friendName,
      }),
      {
        duration: 1500,
        style: {
          background: "#0db53f",
          color: "#fff",
        },
      }
    );

  function deleteUserFromCalendar() {
    socket.emit("delete-events-from-user-in-calendar", { hash, friendName });
    socket.emit("delete-user-from-calendar", {
      friendName,
      hash,
    });
    socket.emit("get-users-in-the-calendar", hash);
    socket.emit("get-events-in-the-calendar", hash);
    closeModal();
    toastError();
  }

  useEffect(() => {
    socket.on("delete-user-from-calendar", (data) => {
      if (
        decryptData(
          localStorage.getItem("u")!,
          process.env.REACT_APP_SECRET!
        ) === data
      ) {
        openDeleteUserModal();
      }
    });
    return () => {
      socket.off("delete-user-from-calendar");
    };
  }, []);

  useEffect(() => {
    socket.on("delete-calendar", () => {
      openDeleteCalendar();
    });
    return () => {
      socket.off("delete-user-from-calendar");
    };
  }, []);

  async function sendEvent() {
    const calendarTitle = document.querySelector("#calendar-title");
    const calendarDescription = document.querySelector("#calendar-description");
    calendarTitle?.classList.remove("invalid");
    calendarDescription?.classList.remove("invalid");
    if (event.description?.length === 0 || event.title?.length === 0) {
      calendarTitle?.classList.add("invalid");
      calendarDescription?.classList.add("invalid");
    } else {
      await socket.emit("send-event", { event, hash });
      await socket.emit("get-events-in-the-calendar", hash);
      closeDayModal();
    }
  }

  return (
    <div className="calendar">
      <div className="calendar-friends">
        <div className="calendar-friends-title">
          <FaUserFriends />
          <span>{t(translations.FRIENDS_TITLE)}</span>
        </div>

        {friends.map((friend: any, index) => (
          <FriendData
            name={friend.user}
            isYou={index === 0}
            key={index}
            onClick={() => (index !== 0 ? openModal(friend.user) : undefined)}
          />
        ))}

        <div className="btn-group">
          <Button
            className="accept"
            text={t(translations.BUTTON_INVITE)}
            onClick={openInviteModal}
          />
          <Button
            className="cancel"
            text={t(translations.BUTTON_DELETE_CALENDAR)}
            onClick={openDeleteCalendarModal}
          />
        </div>
      </div>

      <div className="calendar-data">
        <div className="calendar-month-name">
          <GrLinkPrevious
            className="arrow"
            onClick={() =>
              setActualDate(moment(actualDate).subtract(1, "month"))
            }
          />
          <span>
            {t(months[actualDate.month()])} - {actualDate.year()}
          </span>
          <GrLinkNext
            className="arrow"
            onClick={() => setActualDate(moment(actualDate).add(1, "month"))}
          />
        </div>
        <div className="calendar-day-name">
          <div>{t(translations.MONDAY)}</div>
          <div>{t(translations.TUESDAY)}</div>
          <div>{t(translations.THURSDAY)}</div>
          <div>{t(translations.WEDNESDAY)}</div>
          <div>{t(translations.FRIDAY)}</div>
          <div>{t(translations.SATURDAY)}</div>
          <div>{t(translations.SUNDAY)}</div>
        </div>

        <div className="calendar-days">{calendarCellsArray}</div>
      </div>
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
        <div className="modal-calendar-body">
          <div>
            {t(translations.DELETE_FRIEND_TEXT, {
              friend: friendName,
            })}
          </div>
          <div className="btn-group">
            <Button
              text={t(translations.BUTTON_YES)}
              className="cancel"
              onClick={deleteUserFromCalendar}
            />
            <Button
              text={t(translations.BUTTON_NO)}
              className="accept"
              onClick={closeModal}
            />
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={deleteUserModal}
        onRequestClose={closeDeleteUserModal}
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
        <span onClick={closeDeleteUserModal} className="close-modal-button">
          <GrClose />
        </span>
        <div>{t(translations.MODAL_DELETE_FRIEND_TEXT)}</div>
        <Button
          text={t(translations.BUTTON_EXIT)}
          className="cancel"
          onClick={closeDeleteUserModal}
        />
      </Modal>
      <Modal
        isOpen={dayModalIsOpened}
        onRequestClose={closeDayModal}
        shouldCloseOnOverlayClick={true}
        portalClassName="modal-day"
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
        <span onClick={closeDayModal} className="close-modal-button">
          <GrClose />
        </span>
        <div className="calendar-form">
          <h1>
            {t(translations.MODAL_CALENDAR_TITLE, {
              date: date.format("DD-MM-YYYY").toString(),
            })}
          </h1>
          <label htmlFor="calendar-title">
            {t(translations.MODAL_CALENDAR_EVENT_TITLE)}
          </label>
          <input
            type="text"
            id="calendar-title"
            onChange={(e) =>
              setEvent({ ...event, title: e.target.value.trim() })
            }
          />
          <label htmlFor="calendar-description">
            {t(translations.MODAL_CALENDAR_EVENT_DESCRIPTION)}
          </label>
          <textarea
            name=""
            id="calendar-description"
            onChange={(e) =>
              setEvent({ ...event, description: e.target.value.trim() })
            }
          ></textarea>
          <div className="btn-group">
            <Button
              text={t(translations.BUTTONS_SAVE)}
              className="accept"
              onClick={sendEvent}
            />
            <Button
              text={t(translations.BUTTONS_CANCEL)}
              className="cancel"
              onClick={closeDayModal}
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={eventModalIsOpened}
        onRequestClose={closeEventModal}
        shouldCloseOnOverlayClick={true}
        portalClassName="modal-events"
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
        <span onClick={closeEventModal} className="close-modal-button">
          <GrClose />
        </span>
        <div className="event-content">
          {events
            .filter(
              (events) => events.date === date.format("DD-MM-YYYY").toString()
            )
            .map((event, index) => (
              <div
                key={index}
                className="event"
                onClick={
                  event.user ===
                  decryptData(
                    localStorage.getItem("u")!,
                    process.env.REACT_APP_SECRET!
                  )
                    ? () => {
                        openEditEventModal(event);
                        setDisabledEditEvents(false);
                      }
                    : () => {
                        openEditEventModal(event);
                        setDisabledEditEvents(true);
                      }
                }
              >
                <div className="event-title">{event.title}</div>
                <div className="event-user">{event.user}</div>
              </div>
            ))}
        </div>
      </Modal>

      <Modal
        isOpen={editEventModal}
        onRequestClose={closeEditEventModal}
        shouldCloseOnOverlayClick={true}
        portalClassName="modal-day"
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
        <span onClick={closeEditEventModal} className="go-back-modal-button">
          <AiOutlineArrowLeft />
        </span>
        <div className="calendar-form">
          <label htmlFor="calendar-title">
            {t(translations.MODAL_CALENDAR_EVENT_TITLE)}
          </label>
          <input
            type="text"
            id="calendar-title"
            defaultValue={eventToEdit.title}
            onChange={(e) =>
              setEventToEdit({ ...eventToEdit, title: e.target.value.trim() })
            }
            disabled={disabledEditEvents}
          />
          <label htmlFor="calendar-description">
            {t(translations.MODAL_CALENDAR_EVENT_DESCRIPTION)}
          </label>
          <textarea
            name=""
            id="calendar-description"
            defaultValue={eventToEdit.description}
            onChange={(e) =>
              setEventToEdit({
                ...eventToEdit,
                description: e.target.value.trim(),
              })
            }
            disabled={disabledEditEvents}
          ></textarea>
          <div className="btn-group">
            <Button
              text={t(translations.BUTTONS_UPDATE)}
              className="accept"
              onClick={sendEventToEdit}
              disabled={disabledEditEvents}
            />
            <Button
              text={t(translations.BUTTON_DELETE)}
              className="cancel"
              onClick={async () => {
                await deleteEvent();
                await setEditEventModal(false);
              }}
              disabled={disabledEditEvents}
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={inviteModalIsOpen}
        onRequestClose={closeInviteModal}
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
        <span onClick={closeInviteModal} className="close-modal-button">
          <GrClose />
        </span>
        <div className="modal-body invite-body">
          <div className="invite-link-title">
            {t(translations.MODAL_INVITATION_LINK)}
          </div>
          <div className="invite-link">
            <input
              type="text"
              className="new-calendar-input"
              value={window.location.host + "/" + hash}
              readOnly
            />
            <button onClick={copyToClipboard}>
              {t(translations.MODAL_COPY_LINK)}
            </button>
          </div>
          <Button
            text={t(translations.BUTTON_EXIT)}
            className="cancel"
            onClick={closeInviteModal}
          />
        </div>
      </Modal>

      <Modal
        isOpen={deleteCalendarModalIsOpen}
        onRequestClose={closeDeleteCalendarModal}
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
        <span onClick={closeDeleteCalendarModal} className="close-modal-button">
          <GrClose />
        </span>
        <div className="modal-body invite-body">
          <ConfirmationForm deleteCalendar={deleteCalendar}/>
        </div>
      </Modal>
      <Modal
        isOpen={deleteCalendarIsOpen}
        onRequestClose={closeDeleteCalendar}
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
        <span onClick={closeDeleteCalendar} className="close-modal-button">
          <GrClose />
        </span>
        <div>{t(translations.MODAL_DELETE_FRIEND_TEXT)}</div>
        <Button
          text={t(translations.BUTTON_EXIT)}
          className="cancel"
          onClick={closeDeleteCalendar}
        />
      </Modal>
      <Toaster />
    </div>
  );
}
