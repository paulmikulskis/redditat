import { useEffect, useState } from "react";

export function useComponentDidMount() {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return [mounted];
}
