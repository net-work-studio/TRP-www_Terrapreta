import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import TagTitle from "@/components/ui/tag-title";

interface NumberCardProps {
  title: string;
  description: string;
  image: string;
}

function NumberCard({ title, description, image }: NumberCardProps) {
  return (
    <div className="flex flex-col justify-start rounded-lg border border-stone-700">
      <div className="relative">
        <div className="absolute right-0 bottom-0 left-0 z-1 h-[35%] w-full bg-linear-to-t from-stone-800 to-transparent" />
        <AspectRatio className="relative w-full rounded" ratio={5 / 4}>
          <Image
            alt="Why? Our Soil needs help."
            className="h-full w-full rounded object-cover object-center"
            fill
            quality={75}
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            src={image}
          />
        </AspectRatio>
      </div>
      <hgroup className="space-y-2.5 bg-linear-to-b from-stone-800 to-transparent px-5 pt-5 pb-6">
        <h3 className="text-4xl">{title}</h3>
        <p className="text-balance text-stone-300 text-xl">{description}</p>
      </hgroup>
    </div>
  );
}
export default function Numbers() {
  return (
    <div className="container-site flex flex-col items-start gap-10">
      <hgroup className="flex h-full flex-col justify-between gap-1.5">
        <TagTitle tag="Why" title="Soil needs our help" />
        <p className="text-pretty text-stone-400 text-xl md:w-2/3">
          The conditions of soil in the European Union (and worldwide) are
          worrying, causing problems for the environment and human health.
        </p>
      </hgroup>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <NumberCard
          description="Of estimated contaminated sites to be recovered, only in the EU."
          image="https://cdn.sanity.io/images/wj2okvbq/production/05956bbe8b5b11c2c1fec5a7cd315971cfcc509b-1500x1125.webp"
          title="3 million"
        />
        <NumberCard
          description="Percentage of degraded soils in the EU."
          image="https://cdn.sanity.io/images/wj2okvbq/production/73f468c87925b92b5c0140bdab8125267f4b6bb2-1500x1186.webp"
          title="Over 60%"
        />
        <NumberCard
          description="The loss of ecosystem benefits cause by soil degradation."
          image="https://cdn.sanity.io/images/wj2okvbq/production/90180c6a849b692f747bac16dd81abffbda0c52a-2000x1500.webp"
          title="€50 bn/year"
        />
      </div>
    </div>
  );
}
