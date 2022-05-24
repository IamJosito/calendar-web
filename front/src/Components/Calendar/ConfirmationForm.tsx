import { t } from "i18next";
import { useState } from "react";
import translations from "../../Enums/translations";
import { socket } from "../../Services/socket";
import Button from "../Button/Button";
import "./ConfirmationForm.scss";

export default function ConfirmationForm(props: any) {
  const deleteWord = t(translations.CONFIRM_DELETE).toString();
  const [word, setWord] = useState("");

  function checkWord() {
    if (word === deleteWord) {
      props.deleteCalendar();
    }
  }

  return (
    <div className="confirm-form">
      <div className="phrase">
        <span>{t(translations.CONFIRM_TEXT_1)}</span>
        <span className="delete-word">{deleteWord}</span>
        <span>{t(translations.CONFIRM_TEXT_2)}</span>
      </div>
      <input type="text" onChange={(e) => setWord(e.target.value.trim())} />
      <Button
        className="cancel"
        onClick={checkWord}
        text={t(translations.BUTTON_DELETE_CALENDAR)}
      />
    </div>
  );
}
