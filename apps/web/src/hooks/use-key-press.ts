import { useEffect } from "react";

const useKeyPress = (keys: string[], callback: (key: string) => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const pressedKey = event.key.toLowerCase();

      const normalizedKeys = keys.map((key) =>
        key
          .toLowerCase()
          .split(" + ")
          .map((k) => k.trim()),
      );

      const modifiers = {
        control: event.ctrlKey,
        shift: event.shiftKey,
        alt: event.altKey,
        meta: event.metaKey,
        "⌘": event.ctrlKey,
        ctrl: event.ctrlKey,
      };

      const modifierKeys = [
        "control",
        "shift",
        "alt",
        "meta",
        "⌘",
        "ctrl",
      ] as const;

      for (const combination of normalizedKeys) {
        const requiredModifiers = combination.filter((key) =>
          modifierKeys.includes(key as (typeof modifierKeys)[number]),
        );
        const requiredKeys = combination.filter(
          (key) => !modifierKeys.includes(key as (typeof modifierKeys)[number]),
        );

        const allModifiersMatch = requiredModifiers.every(
          (mod) => modifiers[mod as keyof typeof modifiers],
        );

        const keyMatch = requiredKeys.includes(pressedKey);

        if (keyMatch && allModifiersMatch) {
          event.preventDefault();
          callback(event.key);
          return;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown, { capture: true });

    return () => {
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, [keys, callback]);
};

export default useKeyPress;
