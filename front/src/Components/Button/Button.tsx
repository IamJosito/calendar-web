import { ButtonModel } from "../../Models/ButtonModel";
import "./Button.scss";
export default function Button(props: ButtonModel) {
  return (
    <div
      className={
        !props.disabled
          ? `button ${props.className}`
          : `button ${props.className} disabled`
      }
      onClick={!props.disabled ? props.onClick : undefined}
    >
      {props.text}
    </div>
  );
}
