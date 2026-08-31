import { createContext, useContext } from "react";
import { ThemeProvider } from "./theme-provider";
import { Provider } from "react-redux";
import { store } from "@store/app-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@components/ui/tooltip";

const queryClient = new QueryClient();

type BaseProviderProps = {
  children: React.ReactNode;
};

const initialState: unknown = {};

const BaseProviderContext = createContext<unknown>(initialState);

export function BaseProvider({ children }: BaseProviderProps) {
  return (
    <BaseProviderContext.Provider value={initialState}>
      <ThemeProvider>
        <TooltipProvider>
          <QueryClientProvider client={queryClient}>
            <Provider store={store}>{children}</Provider>
          </QueryClientProvider>
        </TooltipProvider>
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
