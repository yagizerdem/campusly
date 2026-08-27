import { cn } from "@lib/utils";

interface DefaultLayoutProps {
  children: React.ReactNode;
  props?: any;
}

export default function DefaultLayout({ children, props }: DefaultLayoutProps) {
  return (
    <div className={cn("w-screen h-screen", props?.className)}>{children}</div>
  );
}
