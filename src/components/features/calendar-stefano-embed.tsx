"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export default function CalendarStefanoEmbed() {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: "30min" });
      cal("ui", {
        theme: "dark",
        cssVarsPerTheme: {
          dark: { "cal-brand": "#FD5F0C" },
          light: { "cal-brand": "#FD5F0C" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <Cal
      calLink="stefanozoli/30min"
      config={{ layout: "month_view", theme: "dark" }}
      namespace="30min"
      style={{ width: "100%", height: "100%", overflow: "hidden" }}
    />
  );
}
