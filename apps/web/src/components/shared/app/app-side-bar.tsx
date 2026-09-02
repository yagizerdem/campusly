import { cn } from "@/src/lib/utils";
import CampuslyLogo from "@assets/campusly-logo2.png";
import { Button } from "@components/ui/button";
import {
  CalendarIcon,
  CompassIcon,
  HomeIcon,
  UserIcon,
  BellIcon,
  BookmarkIcon,
  UsersIcon,
} from "lucide-react";
import { useNavigate } from "react-router";

const SIDE_BAR_NAVIGATION_ITEMS = [
  { label: "home", icon: <HomeIcon />, path: "/home" },
  { label: "discover", icon: <CompassIcon />, path: "/discover" },
  { label: "club", icon: <UsersIcon />, path: "/club" },
  { label: "events", icon: <CalendarIcon />, path: "/events" },
  { label: "notifications", icon: <BellIcon />, path: "/notifications" },
  { label: "saved", icon: <BookmarkIcon />, path: "/saved" },
  { label: "profile", icon: <UserIcon />, path: "/profile" },
];

interface AppSideBarProps {
  className?: string;
  props?: any;
}

export default function AppSideBar({ className, props }: AppSideBarProps) {
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        "h-full w-64 shrink-0 bg-stitch-surface-container-low border-r-stitch-surface-container-high border-r-3",
        className,
      )}
    >
      <div className="flex flex-row h-16 ">
        <span className="block h-full flex items-center justify-center w-16 pb-5 font-bold text-xl ">
          <img
            src={CampuslyLogo}
            alt="Campusly Logo"
            className="w-12 h-12 rounded-md select-none"
          />
        </span>
        <div className="flex flex-col">
          <span className="text-lg font-semibold">Campusly</span>
          <span className="text-sm font-normal text-gray-500">
            Your Campus Companion
          </span>
        </div>
      </div>
      <div className="flex flex-col">
        {SIDE_BAR_NAVIGATION_ITEMS.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className="justify-start cursor-pointer py-5"
            onMouseUp={() => navigate(item.path)}
          >
            <div className="flex flex-row">
              <span className="mr-2">{item.icon}</span>
              <span className="capitalize">{item.label}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
