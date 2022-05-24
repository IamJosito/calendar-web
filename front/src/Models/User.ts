export class User {
  name;
  surname;
  username;
  mail;
  password;
  constructor(
    name?: string ,
    surname?: string ,
    username?: string ,
    mail?: string ,
    password?: string 
  ) {
    this.name = name;
    this.surname = surname;
    this.username = username;
    this.mail = mail;
    this.password = password;
  }
}
