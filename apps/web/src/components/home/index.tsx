import DefaultLayout from "@/src/layouts/default-layout";
import { selectFullName } from "@/src/store/slice/auth-slice";
import { useSelector } from "react-redux";
import AppTopBar from "../shared/app/app-top-bar";

export default function Page() {
  const fullName = useSelector(selectFullName);

  return (
    <DefaultLayout>
      <div className="flex flex-col min-h-screen w-full h-full">
        <AppTopBar />
      </div>
    </DefaultLayout>
  );
}
