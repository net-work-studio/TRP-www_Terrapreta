import { cleanOptionalString } from "@/lib/sanity-stega";

const JOURNAL_DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
  year: "numeric",
});

export function cleanPublishingDate(value: string | null | undefined) {
  const publishingDate = cleanOptionalString(value);

  if (!publishingDate || Number.isNaN(new Date(publishingDate).getTime())) {
    return null;
  }

  return publishingDate;
}

export function formatPublishingDate(value: string | null | undefined) {
  const publishingDate = cleanPublishingDate(value);

  return publishingDate
    ? JOURNAL_DATE_FORMATTER.format(new Date(publishingDate))
    : null;
}
