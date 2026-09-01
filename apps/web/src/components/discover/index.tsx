import AppLayout from "@/src/layouts/app-layout";
import DiscoverHeader from "./header";

export default function Page() {
  return (
    <AppLayout>
      <div className="h-full w-full overflow-y-auto">
        <DiscoverHeader />
      </div>
    </AppLayout>
  );
}
