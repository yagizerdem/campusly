import { cn } from "@lib/utils";
import { Toaster } from "@components/ui/toast";
import { useSelector } from "react-redux";
import type { RootState } from "@store/root-reducer";
import AppLoaderPanel from "@/src/components/shared/app/app-loader";

interface DefaultLayoutProps {
  children: React.ReactNode;
  props?: any;
}

export default function DefaultLayout({ children, props }: DefaultLayoutProps) {
  const isLoading = useSelector((state: RootState) => state.loader.isLoading);

  return (
    <div className={cn("h-screen w-full", props?.className)}>
      {children}
      <Toaster />
      <AppLoaderPanel visible={isLoading} />
    </div>
  );
}
