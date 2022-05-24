export class EventModel {
  title: string | undefined;
  description: string | undefined;
  user: string | undefined;
  date: string | undefined;
  id: number | undefined;
  constructor(
    title?: string,
    description?: string,
    user?: string,
    date?: string,
    id?: number
  ) {
    this.title = title;
    this.description = description;
    this.user = user;
    this.date = date;
    this.id = id;
  }
}
