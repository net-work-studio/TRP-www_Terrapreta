import { AspectRatio } from "@/components/ui/aspect-ratio";
import TagTitle from "@/components/ui/tag-title";
import SanityImage from "@/components/ui/sanity-image";
import {
  getSanityRequestState,
  PUBLISHED_SANITY_FETCH_OPTIONS,
  renderSanityCacheBoundary,
  type SanityFetchOptions,
  sanityFetch,
} from "@/sanity/lib/live";
import { CUSTOMERS_QUERY } from "@/sanity/lib/queries";
import type { CUSTOMERS_QUERY_RESULT, SanityImageHotspot } from "@/sanity/types";

function getObjectPosition(hotspot?: SanityImageHotspot | null): string {
  if (!hotspot) {
    return "center";
  }
  const x = (hotspot.x ?? 0.5) * 100;
  const y = (hotspot.y ?? 0.5) * 100;
  return `${x}% ${y}%`;
}

function CustomersContent({
  customers,
}: {
  customers: CUSTOMERS_QUERY_RESULT | null;
}) {
  const validCustomers =
    customers?.filter(
      (
        customer: CUSTOMERS_QUERY_RESULT[number]
      ): customer is CUSTOMERS_QUERY_RESULT[number] & {
        mainImage: NonNullable<CUSTOMERS_QUERY_RESULT[number]["mainImage"]>;
        name: string;
      } =>
        customer.mainImage !== null &&
        customer.mainImage.asset !== null &&
        customer.name !== null
    ) ?? [];

  return (
    <div
      className="container-site flex flex-col items-start gap-10"
      id="soil-revolution"
    >
      <hgroup className="flex h-full flex-col justify-between gap-2">
        <TagTitle
          tag="Customers"
          title="Helping our customers to make the difference"
        />
      </hgroup>
      <div className="md grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {validCustomers.map(
          (
            customer: CUSTOMERS_QUERY_RESULT[number] & {
              mainImage: NonNullable<
                CUSTOMERS_QUERY_RESULT[number]["mainImage"]
              >;
              name: string;
            }
          ) => (
            <div className="flex flex-col gap-2.5" key={customer._id}>
              <AspectRatio className="relative rounded" ratio={5 / 4}>
                <SanityImage
                  alt={customer.name}
                  className="rounded object-cover"
                  fill
                  quality={75}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                  source={customer.mainImage}
                  style={{
                    objectPosition: getObjectPosition(customer.mainImage.hotspot),
                  }}
                />
              </AspectRatio>
              <div className="space-y-1">
                <h3 className="text-2xl">{customer.name}</h3>
                {customer.shortDescription && (
                  <p className="text-lg text-stone-400">
                    {customer.shortDescription}
                  </p>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

async function CachedCustomers({ perspective, stega }: SanityFetchOptions) {
  "use cache";

  const { data: customers } = await sanityFetch({
    query: CUSTOMERS_QUERY,
    perspective,
    stega,
  });

  return <CustomersContent customers={customers} />;
}

async function DynamicCustomers() {
  const { fetchOptions } = await getSanityRequestState();
  return <CachedCustomers {...fetchOptions} />;
}

export default async function Customers() {
  return renderSanityCacheBoundary({
    draft: <DynamicCustomers />,
    fallback: <CustomersContent customers={null} />,
    published: <CachedCustomers {...PUBLISHED_SANITY_FETCH_OPTIONS} />,
  });
}
