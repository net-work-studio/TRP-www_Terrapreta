import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import TagTitle from "@/components/ui/tag-title";

export default function Context() {
  return (
    <section className="container-site flex flex-col items-start gap-10 rounded bg-stone-200 py-5 text-stone-950">
      <hgroup className="flex h-full w-full flex-col justify-between gap-1.5">
        <TagTitle
          tag="Context"
          theme="light"
          title="Our Mission in Europe's Soil Health Revolution"
        />
        <p className="w-2/3 text-balance text-stone-700 text-xl">
          Europe is taking unprecedented action to reverse soil degradation and
          contamination, guided by the EU Soil Strategy for 2030 and
          groundbreaking laws like the Soil Monitoring Law. These initiatives
          target clean, healthy soils across the continent, requiring
          restoration and innovative approaches to achieve a toxic-free
          environment by 2050.
        </p>
      </hgroup>
      <div className="grid h-fit w-full grid-cols-4 gap-5">
        <AspectRatio className="relative h-auto w-full rounded" ratio={4 / 5}>
          <Image
            alt="Context"
            className="rounded object-cover"
            fill
            quality={75}
            sizes="25vw"
            src="https://cdn.sanity.io/images/wj2okvbq/production/bf5359dbaaabe2a723a66fd982db42a7196a52af-2400x1600.webp"
          />
        </AspectRatio>
        <AspectRatio className="relative h-auto w-full rounded" ratio={4 / 5}>
          <Image
            alt="Context"
            className="rounded object-cover"
            fill
            quality={75}
            sizes="25vw"
            src="https://cdn.sanity.io/images/wj2okvbq/production/bf5359dbaaabe2a723a66fd982db42a7196a52af-2400x1600.webp"
          />
        </AspectRatio>
        <AspectRatio className="relative h-auto w-full rounded" ratio={4 / 5}>
          <Image
            alt="Context"
            className="rounded object-cover"
            fill
            quality={75}
            sizes="25vw"
            src="https://cdn.sanity.io/images/wj2okvbq/production/bf5359dbaaabe2a723a66fd982db42a7196a52af-2400x1600.webp"
          />
        </AspectRatio>
        <AspectRatio className="relative h-auto w-full rounded" ratio={4 / 5}>
          <Image
            alt="Context"
            className="rounded object-cover"
            fill
            quality={75}
            sizes="25vw"
            src="https://cdn.sanity.io/images/wj2okvbq/production/bf5359dbaaabe2a723a66fd982db42a7196a52af-2400x1600.webp"
          />
        </AspectRatio>
      </div>
    </section>
  );
}
