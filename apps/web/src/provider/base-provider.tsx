import { createContext, useContext } from "react";
import { ThemeProvider } from "./theme-provider";
import { Provider } from "react-redux";
import { store } from "@store/app-store";

type BaseProviderProps = {
  children: React.ReactNode;
};

const initialState: unknown = {};

const BaseProviderContext = createContext<unknown>(initialState);

export function BaseProvider({ children }: BaseProviderProps) {
  return (
    <BaseProviderContext.Provider value={initialState}>
      <ThemeProvider>
        <Provider store={store}>{children}</Provider>
      </ThemeProvider>
    </BaseProviderContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useBaseProvider = () => {
  const context = useContext(BaseProviderContext);

  if (context === undefined)
    throw new Error("useBaseProvider must be used within a BaseProvider");

  return context;
};
