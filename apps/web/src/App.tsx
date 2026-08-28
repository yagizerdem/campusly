import { RouterProvider } from "react-router/dom";
import router from "./router";
import { getAuth } from "firebase/auth";
import { useEffect } from "react";
import { useRef } from "react";
import { firebaseApp } from "./lib/firebase-app";
import { useDispatch } from "react-redux";
import {
  setEmail,
  setIsLoggedIn,
  setUserUid,
} from "@/src/store/slice/auth-slice";

function App() {
  const oneTimeGuard = useRef<boolean>(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (oneTimeGuard.current) {
      const auth = getAuth(firebaseApp);
      auth.onAuthStateChanged((user) => {
        if (user) {
          // log-in
          console.log(user);
          dispatch(setUserUid(user.uid));
          dispatch(setEmail(user.email));
          dispatch(setIsLoggedIn(true));
        } else {
          // log-out
          dispatch(setUserUid(null));
          dispatch(setEmail(null));
          dispatch(setIsLoggedIn(false));
        }
      });
    }

    oneTimeGuard.current = false;
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
