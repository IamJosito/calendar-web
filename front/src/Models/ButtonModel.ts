import { MouseEventHandler } from "react";

export class ButtonModel {
  text: string | undefined;
  className: string | undefined;
  onClick: MouseEventHandler<HTMLDivElement> | undefined;
  disabled? : Boolean;
  constructor(
    text: string,
    className: string,
    onClick: MouseEventHandler<HTMLDivElement>,
    disabled?:boolean
  ) {
    this.text = text;
    this.className = className;
    this.onClick = onClick;
    this.disabled = disabled
  }
}
