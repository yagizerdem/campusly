import { selectFullName } from "@/src/store/slice/auth-slice";
import { useSelector } from "react-redux";
import Feed from "./feed";
import AppLayout from "@/src/layouts/app-layout";

export default function Page() {
  const fullName = useSelector(selectFullName);

  return (
    <AppLayout>
      <div className="flex flex-row  w-full h-full ">
        <div className="w-full h-full  flex flex-row">
          <div className="w-full h-full  flex-col">
            <div>header</div>
            <Feed />
          </div>
          <div className="w-96 h-full">afaf</div>
        </div>
      </div>
    </AppLayout>
  );
}
