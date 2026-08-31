import { selectFullName } from "@/src/store/slice/auth-slice";
import { useSelector } from "react-redux";
import Feed from "./feed";
import AppLayout from "@/src/layouts/app-layout";

export default function Page() {
  const fullName = useSelector(selectFullName);

  return (
    <AppLayout>
      <Feed />
    </AppLayout>
  );
}
