import { useEffect, useState } from "react";
import { getOrigin } from "../lib/html-util";

export function useCustomHeaderUser() {
  const [email, setEmail] = useState<string | null>(null);

  const origin = getOrigin();

  const checkHeadersUrl = `${origin}/api/headers`;
  useEffect(() => {
    fetch(checkHeadersUrl)
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (json.hasHeaders) {
          setEmail(json.email);
        }
      });
  }, []);

  return [email];
}
