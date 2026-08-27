import { cn } from "@lib/utils";
import { tsParticles } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { useEffect } from "react";

interface ParticleLayoutProps {
  children: React.ReactNode;
  props?: object & {
    className?: string;
    contentPanelClassName?: string;
  };
}

const options = {
  background: {
    color: {
      value: "#0b1120",
    },
  },
  particles: {
    move: {
      enable: true,
      speed: 1.1,
    },
    number: {
      value: 42,
    },
    opacity: {
      value: {
        min: 0.35,
        max: 0.85,
      },
    },
    paint: {
      fill: {
        color: {
          value: ["#60a5fa", "#34d399", "#f59e0b", "#f472b6"],
        },
        enable: true,
      },
      stroke: {
        color: {
          value: "#ffffff",
        },
        width: 0,
      },
    },
    shape: {
      type: "square",
      close: true,
      options: {
        square: {
          close: true,
        },
      },
    },
    size: {
      value: {
        min: 4,
        max: 10,
      },
    },
  },
};

export default function ParticleLayout({
  children,
  props,
}: ParticleLayoutProps) {
  useEffect(() => {
    (async () => {
      // 1. Register all slim bundle features on the engine
      await loadSlim(tsParticles);

      // 2. Create the animation
      await tsParticles.load({
        id: "tsparticles", // HTML container ID
        options: options,
      });
    })();
  }, []);
  return (
    <div className={cn("w-full h-full relative", props?.className)}>
      <div
        id="tsparticles"
        className="w-full h-full absolute top-0 left-0 z-1"
      ></div>
      <div
        className={cn(
          "w-full h-full top-0 left-0 inset-0 z-100 absolute",
          props?.contentPanelClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
