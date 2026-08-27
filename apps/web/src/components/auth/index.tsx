import DefaultLayout from "@/src/layouts/default-layout";

import { useState, useReducer } from "react";
import LoginPanel from "./login-panel";
import RegisterPanel from "./register-panel";

interface PanelState {
  loginEmail: string;
  loginPassword: string;
  registerEmail: string;
  registerPassword: string;
  registerPasswordRepeat: string;
}

type ReducerAction = object & { type: string; payload?: any };

function reducer(state: PanelState, action: ReducerAction) {
  switch (action.type) {
    case "set/login-email":
      return { ...state, loginEmail: action.payload };
    case "set/login-password":
      return { ...state, loginPassword: action.payload };
    case "set/register-email":
      return { ...state, registerEmail: action.payload };
    case "set/register-password":
      return { ...state, registerPassword: action.payload };
    case "set/register-password-repeat":
      return { ...state, registerPasswordRepeat: action.payload };
    default:
      return state;
  }
}

export default function Page() {
  const [showRegisterPanel, setShowRegisterPanel] = useState(true);
  const [panelState, dispatch] = useReducer(reducer, {
    loginEmail: "",
    loginPassword: "",
    registerEmail: "",
    registerPassword: "",
    registerPasswordRepeat: "",
  });

  return (
    <DefaultLayout
      props={{
        className: "flex items-center justify-center",
      }}
    >
      {showRegisterPanel ? (
        <RegisterPanel
          onSwitchLogin={() => setShowRegisterPanel(false)}
          registerEmail={panelState.registerEmail}
          registerPassword={panelState.registerPassword}
          registerPasswordRepeat={panelState.registerPasswordRepeat}
          setRegisterEmail={(email) =>
            dispatch({ type: "set/register-email", payload: email })
          }
          setRegisterPassword={(password) =>
            dispatch({ type: "set/register-password", payload: password })
          }
          setRegisterPasswordRepeat={(password) =>
            dispatch({
              type: "set/register-password-repeat",
              payload: password,
            })
          }
        />
      ) : (
        <LoginPanel
          onSwitchRegister={() => setShowRegisterPanel(true)}
          loginEmail={panelState.loginEmail}
          loginPassword={panelState.loginPassword}
          setLoginEmail={(email) =>
            dispatch({ type: "set/login-email", payload: email })
          }
          setLoginPassword={(password) =>
            dispatch({ type: "set/login-password", payload: password })
          }
        />
      )}
    </DefaultLayout>
  );
}
