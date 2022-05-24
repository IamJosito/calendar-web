import { t } from "i18next";
import "./ErrorMsg.scss";

export default function ErrorMsg(props:any) {
  return (
    <span className="error-msg">{t(props.msg)}</span>
  );
}
