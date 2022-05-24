import { decryptData } from "./crypt";

export const isLogged = () => {
  try {
    const u = localStorage.getItem("u");
    const p = localStorage.getItem("p");
    if (u && p) {
      const user = decryptData(u, process.env.REACT_APP_SECRET!);

      const pass = decryptData(p, process.env.REACT_APP_SECRET!);

      if (user.length > 0 && pass.length > 0) {
        return true;
      }
    }
    return false;
  } catch (err) {
    console.log(err);
  }
};
