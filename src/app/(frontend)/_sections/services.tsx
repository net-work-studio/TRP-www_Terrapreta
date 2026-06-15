import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { draftMode } from "next/headers";
import { Suspense } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TagTitle from "@/components/ui/tag-title";
import { urlFor } from "@/sanity/lib/image";
import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
} from "@/sanity/lib/live";
import { SERVICES_QUERY } from "@/sanity/lib/queries";
import type { SERVICES_QUERY_RESULT } from "@/sanity/types";

interface ServiceCardProps {
  name: string;
  mainImage: {
    image: {
      asset: {
        url: string;
      };
    };
  };
  shortDescription: string;
  slug: string;
}

function ServiceCard({
  name,
  mainImage,
  shortDescription,
  slug,
}: ServiceCardProps) {
  return (
    <div className="relative flex aspect-3/2 w-full grid-cols-3 items-end gap-5 rounded bg-gray-600 p-7.5">
      <div className="absolute inset-0 z-1 h-full w-full bg-stone-950/20" />
      <Image
        alt={name}
        blurDataURL={urlFor(mainImage.image)
          .width(24)
          .height(24)
          .quality(5)
          .auto("format")
          .url()}
        className="z-0 h-full w-full rounded object-cover object-center"
        fill
        placeholder="blur"
        quality={75}
        src={urlFor(mainImage.image).quality(75).auto("format").url()}
      />

      <div className="z-10 flex items-baseline gap-5">
        <Dialog>
          <DialogTrigger asChild className="w-full">
            <div className="flex h-fit w-full justify-between gap-5 md:items-center">
              <h3 className="text-lg">{name}</h3>
              <Button size="icon" variant="outline">
                <Plus />
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent className="container-article p-0!">
            <div className="space-y-1.5">
              <DialogHeader>
                <div className="space-y-10">
                  <AspectRatio ratio={3 / 2}>
                    <div className="absolute right-0 bottom-0 left-0 z-1 h-[45%] w-full bg-linear-to-t from-stone-950 to-transparent" />
                    <Image
                      alt={name}
                      blurDataURL={urlFor(mainImage.image)
                        .width(24)
                        .height(24)
                        .quality(5)
                        .auto("format")
                        .url()}
                      className="h-full w-full rounded object-cover object-center"
                      fill
                      placeholder="blur"
                      quality={75}
                      src={urlFor(mainImage.image)
                        .quality(75)
                        .auto("format")
                        .url()}
                    />
                  </AspectRatio>
                  <DialogTitle className="px-5 text-left font-normal text-2xl text-stone-50 md:px-10 md:text-3xl">
                    {name}
                  </DialogTitle>
                </div>
              </DialogHeader>
              <div className="px-5 text-stone-400 text-xl md:px-10">
                {shortDescription}
              </div>
            </div>

            <div className="p-5 pb-10 md:p-10">
              <Button>
                <Link href={`/services/${slug}`}>Discover more</Link>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function ServicesContent({
  services,
}: {
  services: SERVICES_QUERY_RESULT | null;
}) {
  return (
    <div className="container-site flex flex-col items-start justify-center gap-10">
      <hgroup className="flex w-full flex-col gap-1.5">
        <TagTitle tag="Services" title="Soil-based Solutions" />
        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-3">
          <p className="col-span-2 text-balance text-stone-400 text-xl">
            We pioneer ecological restoration providing full-service design and
            consultancy, helping public and private clients realize complex,
            innovative projects. Our research-driven approach allows us to
            deliver transformative solutions at any scale.
          </p>
          <Button
            asChild
            className="w-fit md:justify-self-end"
            variant="default"
          >
            <Link href="/discovery-call">Book a Discovery Call</Link>
          </Button>
        </div>
      </hgroup>

      <div className="grid w-full gap-5 md:grid-cols-2">
        {services
          ?.filter(
            (
              service
            ): service is SERVICES_QUERY_RESULT[number] & {
              name: string;
              slug: { current: string };
              mainImage: { image: { asset: { url: string } } };
            } =>
              Boolean(
                service.name &&
                  service.slug?.current &&
                  service.mainImage?.image?.asset?.url
              )
          )
          .map((service) => (
            <ServiceCard
              key={service.name}
              mainImage={service.mainImage}
              name={service.name}
              shortDescription={service.shortDescription || ""}
              slug={service.slug.current}
            />
          ))}
      </div>
    </div>
  );
}

async function CachedServices({ perspective, stega }: DynamicFetchOptions) {
  "use cache";

  const { data: services } = await sanityFetch({
    query: SERVICES_QUERY,
    perspective,
    stega,
  });

  return <ServicesContent services={services} />;
}

async function DynamicServices() {
  const { perspective, stega } = await getDynamicFetchOptions();
  return <CachedServices perspective={perspective} stega={stega} />;
}

export default async function Services() {
  const { isEnabled: isDraftMode } = await draftMode();

  if (isDraftMode) {
    return (
      <Suspense fallback={<ServicesContent services={null} />}>
        <DynamicServices />
      </Suspense>
    );
  }

  return <CachedServices perspective="published" stega={false} />;
}
