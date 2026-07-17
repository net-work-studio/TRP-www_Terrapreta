import Image from "next/image";
import Link from "next/link";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { buttonVariants } from "@/components/ui/button";
import TagTitle from "@/components/ui/tag-title";
import { urlFor } from "@/sanity/lib/image";

const pilotProjectImage =
  "https://cdn.sanity.io/images/wj2okvbq/production/bf5359dbaaabe2a723a66fd982db42a7196a52af-2400x1600.webp";

export default function PilotProject() {
  return (
    <div className="container-site flex h-full flex-col items-start justify-center gap-5 md:flex-row">
      <div className="relative h-full w-full rounded md:w-1/2">
        <AspectRatio ratio={5 / 4}>
          <Image
            alt="Pilot Project Image"
            blurDataURL={urlFor(pilotProjectImage)
              .width(24)
              .height(24)
              .quality(5)
              .auto("format")
              .url()}
            className="h-full w-full rounded object-cover object-center"
            fill
            placeholder="blur"
            quality={75}
            src={urlFor(pilotProjectImage).quality(75).auto("format").url()}
          />
        </AspectRatio>
      </div>

      <div className="h-full w-full space-y-8 md:w-1/2">
        <div className="space-y-1.5">
          <TagTitle tag="Our Pilot Project" title="Osservatorio La Goccia" />
          <p className="text-balance text-lg text-stone-400">
            Osservatorio La Goccia is an open-air laboratory that aims to
            validate innovative bioremediation solutions to regenerate the soils
            of the former Gasworks of Bovisa, protecting biodiversity and
            enhancing the ecosystem benefits provided by the spontaneous forest
            that has grown there over several decades of abandonment.
          </p>
        </div>
        <Link
          className={buttonVariants()}
          href="https://osservatorio-goccia.org/"
          target="_blank"
        >
          Explore the Pilot Project
        </Link>
      </div>
    </div>
  );
}
