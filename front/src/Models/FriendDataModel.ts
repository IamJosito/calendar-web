import { MouseEventHandler } from "react";

export class FriendDataModel {
  isYou?: boolean;
  name?: string;
  onClick?: MouseEventHandler<HTMLDivElement> | undefined;
  constructor(
    name?: string,
    isYou?: boolean,
    onClick?: MouseEventHandler<HTMLDivElement> | undefined
  ) {
    this.name = name;
    this.isYou = isYou;
    this.onClick = onClick;
  }
}
