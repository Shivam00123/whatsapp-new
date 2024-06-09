import React, { useEffect, useRef } from "react";

interface ComponentVisibleHook {
  ref: React.RefObject<any>;
  isComponentVisible: boolean;
  setIsComponentVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const useComponentVisible = (
  initialVisibility: boolean
): ComponentVisibleHook => {
  const [isComponentVisible, setIsComponentVisible] =
    React.useState<boolean>(initialVisibility);
  const ref = useRef<any>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return {
    ref,
    isComponentVisible,
    setIsComponentVisible,
  };
};

export default useComponentVisible;
