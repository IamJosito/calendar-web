import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import Header from "./Components/Header/Header";
import "./App.scss";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { SocketContext, socket } from "./Services/socket";
import Main from "./Components/Main/Main";
import { isLogged } from "./Services/auth";
import { useEffect, useState } from "react";
import Invite from "./Components/Invite/Invite";
import Calendar from "./Components/Calendar/Calendar";

function App() {
  const [login, setLogin] = useState(isLogged());
  useEffect(() => {
    setLogin(isLogged());
  }, [login]);
  return (
    <div className="App">
      <SocketContext.Provider value={socket}>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route
              path="/"
              element={
                login ? <Navigate to="/home" /> : <Navigate to="/login" />
              }
            />
            {/* Home */}

            <Route
              path="/home"
              element={login ? <Main /> : <Navigate to="/login" />}
            />

            {/* Calendars */}
            <Route path="/calendar/:hash" element={login ? <Calendar/> : <Navigate to="login" />}/>

            {/* Login */}

            <Route path="/login" element={<Login />} />

            {/* Register */}
            <Route path="/register" element={<Register />} />

            {/* Magic Route */}
            <Route path="/:id" element={<Invite />} />
          </Routes>
        </BrowserRouter>
      </SocketContext.Provider>
    </div>
  );
}

export default withTranslation()(App);
