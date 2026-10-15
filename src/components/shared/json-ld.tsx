import { stegaClean } from "next-sanity";

type JsonLdProps = {
  data: Record<string, unknown>;
  id?: string;
};

export function JsonLd({ data, id }: JsonLdProps) {
  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Escaping every < prevents CMS content from closing the JSON-LD script.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(stegaClean(data)).replace(/</g, "\\u003c"),
      }}
      id={id}
      type="application/ld+json"
    />
  );
}
