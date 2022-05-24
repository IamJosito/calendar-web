export default function Events(props: any) {
  function foo(e: any) {
    e.stopPropagation();
    props.onClick(props.currentDate);
  }
  return (
    <div className={`calendar-event ${props.className}`} onClick={foo}>
      {props.eventTitle || ""}
    </div>
  );
}
