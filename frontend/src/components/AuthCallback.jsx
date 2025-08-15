// App.tsx or a small component mounted at root
import { useEffect } from "react";


function TokenHandler() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      // clean up the URL
      window.history.replaceState({}, document.title, "/dashboard");
    }
  }, []);

  return null;
}


export default TokenHandler;