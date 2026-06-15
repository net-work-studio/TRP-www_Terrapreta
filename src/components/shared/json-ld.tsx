import Script from "next/script";
import { stegaClean } from "next-sanity";

type JsonLdProps = {
  data: Record<string, unknown>;
  id?: string;
};

export function JsonLd({ data, id = "json-ld" }: JsonLdProps) {
  return (
    <Script id={id} type="application/ld+json">
      {JSON.stringify(stegaClean(data))}
    </Script>
  );
}
