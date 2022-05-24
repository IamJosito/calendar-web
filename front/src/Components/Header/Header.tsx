import i18n from "../../i18n";
import "./Header.scss";
import { isLogged } from "../../Services/auth";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function Header() {
  const getLanguage = localStorage.getItem("lang") || "en";

  const navigate = useNavigate();
  function logout() {
    localStorage.removeItem("u");
    localStorage.removeItem("p");
    navigate("/login");
  }
  return (
    <div className="header">
      <ul>
        <li
          onClick={() => setActive(0)}
          className={getLanguage === "en" ? "active language" : "language"}
          id="english-language"
        >
          EN
        </li>
        <li>|</li>
        <li
          onClick={() => setActive(2)}
          className={getLanguage === "es" ? "active language" : "language"}
          id="spanish-language"
        >
          ES
        </li>
      </ul>
      <div className="logo">
        <img src={logo} alt="" onClick={() => navigate("/")} />
      </div>
      <div
        className="logout"
        style={
          isLogged() ? { visibility: "visible" } : { visibility: "hidden" }
        }
        onClick={() => logout()}
      >
        Log out
      </div>
    </div>
  );

  function setLanguage(lang: string) {
    localStorage.setItem("lang", lang);
    i18n.changeLanguage(lang);
  }

  function setActive(liIndex: number) {
    const ul: HTMLUListElement = document.querySelector("ul")!!;
    for (let index = 0; index < ul.children.length; index++) {
      ul.children[index].classList.remove("active");
    }
    const li = ul.children[liIndex];
    li.classList.add("active");
    setLanguage(li.innerHTML.toLowerCase());
  }
}
