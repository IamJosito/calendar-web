require("dotenv").config();
const server = require("http").createServer();

const mysql = require("mysql2/promise");
const { decryptData, encryptData } = require("./services/crypto");

const { HOST, USER, PASSWORD, DATABASE } = process.env;

let con;
mysql
  .createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
  })
  .then((connection) => (con = connection));

const port = 8080;
const options = {
  cors: true,
  origins: ["http://localhost:3000"],
};
const io = require("socket.io")(server, options);
server.listen(port);

const namespaces = [];

io.on("connection", (socket) => {
  socket.on("register-user", (user) => {
    const sql = `INSERT INTO users VALUES ('${user.name}','${user.surname}','${
      user.username
    }','${user.mail}','${encryptData(user.password, process.env.SECRET)}')`;
    if (executeQuery(sql)) {
      socket.emit("register-user", "");
    } else {
      socket.emit("register-error", "");
    }
  });

  socket.on("login", async (loggedUser) => {
    let login = false;
    const sql = "SELECT password FROM users";
    const [rows, fields] = await con.execute(sql);
    rows.forEach((row) => {
      if (decryptData(row.password, process.env.SECRET) === loggedUser.password)
        login = true;
    });
    socket.emit("login", login);
  });

  socket.on("register-calendar", async (payload) => {
    const sql = `INSERT INTO calendars(name, user, hash) VALUES('${payload.calendarName}', '${payload.username}', '${payload.calendarHash}')`;
    if (executeQuery(sql)) {
      socket.emit("register-calendar", "");
    } else {
      socket.emit("register-calendar-error", "");
    }
    namespaces.push(io.of(`/${payload.calendarHash}`));
  });

  socket.on("register-calendar-invite", async (payload) => {
    const sql = `INSERT INTO calendars(name, user, hash) VALUES('${payload.calendarName}', '${payload.username}', '${payload.calendarHash}')`;
    if (executeQuery(sql)) {
      socket.emit("register-calendar", "");
    } else {
      socket.emit("register-calendar-error", "");
    }
  });

  socket.on("get-calendars", async (username) => {
    const sql = `SELECT name as title, hash FROM calendars WHERE user='${username}';`;
    const [rows, fields] = await con.execute(sql);
    socket.emit("get-calendars", rows);
  });

  socket.on("get-calendar-hash", async (hash) => {
    const sql = `SELECT name, user FROM calendars WHERE hash='${hash}';`;
    const [rows, fields] = await con.execute(sql);
    socket.emit("get-calendar", rows);
  });

  socket.on("get-users-in-the-calendar", async (hash) => {
    const sql = `SELECT user FROM calendars WHERE hash='${hash}';`;
    const [rows, fields] = await con.execute(sql);
    emitToAll(hash, rows, "get-users-in-the-calendar");
  });

  socket.on("delete-user-from-calendar", async (payload) => {
    const sql = `DELETE FROM calendars WHERE user='${payload.friendName}' AND hash='${payload.hash}';`;
    const [rows, fields] = await con.execute(sql);
    emitToAll(payload.hash, payload.friendName, "delete-user-from-calendar");
  });

  socket.on("send-event", async (payload) => {
    const event = payload.event;
    const hash = payload.hash;
    const calendar = await getCalendarByHash(hash);
    const sql = `INSERT INTO events(title, description, date, calendar, user) VALUES('${event.title}','${event.description}','${event.date}',${calendar.id}, '${event.user}');`;
    const [rows, fields] = await con.execute(sql);
  });

  socket.on("get-events-in-the-calendar", async (hash) => {
    const calendar = await getCalendarByHash(hash);
    const sql = `SELECT * FROM events WHERE calendar = ${calendar.id}`;
    const [rows, fields] = await con.execute(sql);
    emitToAll(hash, rows, "get-events-in-the-calendar");
  });

  socket.on("edit-event", async (payload) => {
    const sql = `UPDATE events SET title='${payload.event.title}', description='${payload.event.description}' WHERE id=${payload.event.id}`;
    const [rows, fields] = await con.execute(sql);
    emitToAll(payload.hash, rows, "edited-event");
  });

  socket.on("delete-events-from-user-in-calendar", async (payload) => {
    const calendar = await getCalendarByHash(payload.hash);
    const sql = `DELETE FROM events WHERE user='${payload.friendName}' AND calendar=${calendar.id}`;
    const [rows, fields] = await con.execute(sql);
    emitToAll(payload.hash, rows, "deleted-events-from-user-in-calendar");
  });

  socket.on("delete-event", async (payload) => {
    const sql = `DELETE FROM events WHERE id=${payload.eventToEdit.id}`;
    const [rows, fields] = await con.execute(sql);
    emitToAll(payload.hash, rows, "delete-event");
  });

  socket.on("delete-calendar", async (hash) => {
    const calendar = await getCalendarByHash(hash);
    let sql = `DELETE FROM events WHERE calendar=${calendar.id}`;
    let [rows, fields] = await con.execute(sql);
    sql = `DELETE FROM calendars WHERE hash='${hash}'`;
    [rows, fields] = await con.execute(sql);
    emitToAll(hash, rows, "delete-calendar");
  });

  function emitToAll(hash, rows, eventName) {
    // Create new room
    socket.join(hash);

    // Emit to the local client the data
    socket.emit(eventName, rows);

    // Emit to all the users in the room this data
    socket.to(hash).emit(eventName, rows);
  }
});

async function getCalendarByHash(hash) {
  const sql = `SELECT id FROM calendars WHERE hash = '${hash}'`;
  const [rows, fields] = await con.execute(sql);
  return rows[0];
}

async function executeQuery(sql) {
  try {
    const [rows, fields] = await con.execute(sql);
    return true;
  } catch (err) {
    return false;
  }
}
