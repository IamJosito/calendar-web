import "./Login.scss";
import { FaUserAlt } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { t } from "i18next";
import translations from "../../Enums/translations";
import { SocketContext } from "../../Services/socket";
import { User } from "../../Models/User";
import ErrorMsg from "../ErrorMsg/ErrorMsg";
import { useNavigate } from "react-router-dom";
import { encryptData } from "../../Services/crypt";

function Login() {
  const socket = useContext(SocketContext);
  const navigate = useNavigate();

  const [user, setUser] = useState<User>({
    name: "",
    surname: "",
    mail: "",
    username: "",
    password: "",
  });
  useEffect(() => {
    socket.on("login", async (login: Boolean) => {
      const inputs = document.querySelectorAll("input");
      inputs.forEach((input) => {
        input.classList.remove("input-error");
      });
      setShowErrorMsg(false);
      if (!login) {
        inputs.forEach((input) => {
          input.classList.add("input-error");
          setShowErrorMsg(true);
        });
      } else {
        const usernameEnc = encryptData(
          user.username!,
          process.env.REACT_APP_SECRET!
        ).toString();

        const passEnc = encryptData(
          user.password!,
          process.env.REACT_APP_SECRET!
        ).toString();

        localStorage.setItem("u", usernameEnc);
        localStorage.setItem("p", passEnc);
        navigate("/home");
        navigate(0);
      }
    });
    return () => {
      socket.off("login");
    };
  }, [user.username, user.password, navigate]);

  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState(translations.LOGIN_ERROR_MSG);

  return (
    <div className="main">
      <div className="main--header">
        <FaUserAlt />
        <span>{t(translations.LOGIN_TITLE)}</span>
      </div>
      <div className="main--body">
        <input
          type="text"
          name=""
          className="user-data"
          placeholder={t(translations.LOGIN_USERNAME_PLACEHOLDER)}
          onChange={(e) =>
            setUser({ ...user, username: e.target.value.trim().toLowerCase() })
          }
        />
        <input
          type="password"
          name=""
          className="user-data"
          placeholder={t(translations.LOGIN_PASSWORD_PLACEHOLDER)}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />

        <button onClick={login}>{t(translations.LOGIN_BUTTON)}</button>
        {showErrorMsg && <ErrorMsg msg={errorMsg} />}
        <a href="/register">{t(translations.LOGIN_LINK)}</a>
      </div>
    </div>
  );
  async function login() {
    setUser(user);
    socket.emit("login", user);
  }
}

export default Login;
