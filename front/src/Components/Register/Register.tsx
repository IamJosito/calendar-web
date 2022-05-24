import "./Register.scss";
import { FaUserAlt } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { t } from "i18next";
import translations from "../../Enums/translations";
import { User } from "../../Models/User";
import { SocketContext } from "../../Services/socket";
import { useNavigate } from "react-router-dom";
import ErrorMsg from "../ErrorMsg/ErrorMsg";

export default function Register() {
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState(
    translations.REGISTER_ERROR_MSG_FIELDS
  );

  const [user, setUser] = useState<User>({
    name: "",
    surname: "",
    mail: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    socket.on("register-error", () => {
      setErrorMsg(translations.REGISTER_ERROR_MSG_REPEATED_USER);
      setShowErrorMsg(true);
      const inputs = document.querySelectorAll("input");
      inputs[2].classList.add("input-error");
      inputs[3].classList.add("input-error");
    });

    socket.on("register-user", () => {
      navigate("/login");
    });

    return () => {
      socket.off("register-user");
      socket.off("register-error");
    };
  }, [user.password]);

  return (
    <div className="main">
      <div className="main--header">
        <FaUserAlt />
        <span>{t(translations.REGISTER_TITLE)}</span>
      </div>
      <div className="main--body">
        <div className="user-name-data">
          <input
            type="text"
            name=""
            className="user-data user-name"
            placeholder={t(translations.REGISTER_NAME_PLACEHOLDER)}
            onChange={(e) => setUser({ ...user, name: e.target.value.trim() })}
          />
          <input
            type="text"
            name=""
            className="user-data user-surname"
            placeholder={t(translations.REGISTER_SURNAME_PLACEHOLDER)}
            onChange={(e) =>
              setUser({ ...user, surname: e.target.value.trim() })
            }
          />
        </div>
        <input
          type="text"
          name=""
          className="user-data"
          placeholder={t(translations.REGISTER_USERNAME_PLACEHOLDER)}
          onChange={(e) =>
            setUser({ ...user, username: e.target.value.toLowerCase().trim() })
          }
        />
        <input
          type="text"
          name=""
          className="user-data"
          placeholder={t(translations.REGISTER_MAIL_PLACEHOLDER)}
          onChange={(e) => setUser({ ...user, mail: e.target.value.trim() })}
        />
        <input
          type="password"
          name=""
          className="user-data"
          placeholder={t(translations.REGISTER_PASSWORD_PLACEHOLDER)}
          onChange={(e) =>
            setUser({ ...user, password: e.target.value.trim() })
          }
        />
        <input
          type="password"
          name=""
          className="user-data"
          placeholder={t(translations.REGISTER_REPEAT_PASSWORD_PLACEHOLDER)}
          onChange={(e) => setRepeatedPassword(e.target.value.trim())}
        />
        <button onClick={registerUser}>
          {t(translations.REGISTER_BUTTON)}
        </button>

        {showErrorMsg && <ErrorMsg msg={errorMsg} />}
        <a href="/">{t(translations.REGISTER_LINK)}</a>
      </div>
    </div>
  );

  function registerUser() {
    if (!fillFields()) {
      if (checkPassword()) {
        socket.emit("register-user", user);
      }
    }
  }

  function fillFields(): Boolean {
    let fillFields = false;
    const inputs = document.querySelectorAll("input");
    for (let index = 0; index < inputs.length; index++) {
      const input = inputs[index];
      input.classList.remove("input-error");
      setShowErrorMsg(false);
      if (input.value.trim() === "") {
        setShowErrorMsg(true);
        setErrorMsg(translations.REGISTER_ERROR_MSG_FIELDS);
        input.classList.add("input-error");
        fillFields = true;
      }
    }
    return fillFields;
  }

  function checkPassword(): Boolean {
    if (user.password === repeatedPassword) return true;

    const passwordInputs = document.querySelectorAll('input[type="password"]');
    for (let index = 0; index < passwordInputs.length; index++) {
      const passwordInput = passwordInputs[index];
      passwordInput.classList.add("input-error");
    }
    setShowErrorMsg(true);
    setErrorMsg(translations.REGISTER_ERROR_MSG_PASSWORDS);
    return false;
  }
}
