import { RiDeleteBin6Line } from "react-icons/ri";
import { FriendDataModel } from "../../Models/FriendDataModel";
import "./FriendData.scss";
export default function FriendData(props: FriendDataModel) {

  return (
    <div className={props.isYou ? "friend-data your-data" : "friend-data"} onClick={props.onClick}>
      <span>{props.name}</span> <RiDeleteBin6Line className="delete" />
    </div>
  );
}
