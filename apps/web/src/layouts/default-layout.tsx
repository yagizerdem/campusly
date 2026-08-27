import { cn } from "@lib/utils";
import { Toaster } from "@components/ui/toast";

interface DefaultLayoutProps {
  children: React.ReactNode;
  props?: any;
}

export default function DefaultLayout({ children, props }: DefaultLayoutProps) {
  return (
    <div className={cn("w-screen h-screen", props?.className)}>
      {children}
      <Toaster />
    </div>
  );
}
