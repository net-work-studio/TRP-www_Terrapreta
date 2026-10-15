import SanityImage from "@/components/ui/sanity-image";
import type { SERVICE_QUERY_RESULT } from "@/sanity/types";

type ServiceClient = NonNullable<
  NonNullable<SERVICE_QUERY_RESULT>["clients"]
>[number];

type ClientWithLogo = ServiceClient & {
  name: string;
  logoDark: NonNullable<ServiceClient["logoDark"]>;
};

function hasLogo(client: ServiceClient): client is ClientWithLogo {
  return Boolean(client.name && client.logoDark?.asset?._id);
}

export function ServiceClients({
  clients,
}: {
  clients: ServiceClient[] | null | undefined;
}) {
  const clientsWithLogo = clients?.filter(hasLogo) ?? [];

  if (clientsWithLogo.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-start justify-center gap-2.5">
      <h2 className="text-2xl">Our clients</h2>
      <div className="flex flex-row flex-wrap items-center justify-start gap-5">
        {clientsWithLogo.map((client) => (
          <div key={client._id}>
            <SanityImage
              alt={client.name}
              height={100}
              quality={75}
              source={client.logoDark}
              width={100}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
