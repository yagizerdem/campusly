import { cn } from "@lib/utils";
import { Toaster } from "@components/ui/toast";
import { useSelector } from "react-redux";
import type { RootState } from "@store/root-reducer";
import { AppLoader } from "@components/shared/AppLoader";

interface DefaultLayoutProps {
  children: React.ReactNode;
  props?: any;
}

export default function DefaultLayout({ children, props }: DefaultLayoutProps) {
  const isLoading = useSelector((state: RootState) => state.loader.isLoading);

  return (
    <div className={cn("w-screen h-screen", props?.className)}>
      {children}
      <Toaster />
      <AppLoader visible={isLoading} />
    </div>
  );
}
