import Image, { type StaticImageData } from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import TagTitle from "@/components/ui/tag-title";

// Center-crop the landscape source to the card's 4:5 frame before resizing.
const designCover =
  "https://cdn.sanity.io/images/wj2okvbq/production/c3e88b5e56a22300b4add544c008ffb4e89674eb-1200x857.webp?rect=258,1,684,855";

const analyzeCover =
  "https://cdn.sanity.io/images/wj2okvbq/production/5dd442374b3c7dc8c8a8e2b2f4cd60da8627d824-1200x1798.webp";

const engageCover =
  "https://cdn.sanity.io/images/wj2okvbq/production/fa9d22362317a91c3a70093473611429702c875a-2000x3000.webp";

interface SoilCardProps {
  title: string;
  image: StaticImageData | string;
  description: string;
}

function SoilCard({ title, image, description }: SoilCardProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <AspectRatio className="relative h-full w-full rounded" ratio={4 / 5}>
        <Image
          alt={title}
          className="h-full w-full rounded-md object-cover"
          fill
          quality={75}
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          src={image}
        />
      </AspectRatio>
      <div className="space-y-1">
        <h3 className="text-balance font-light text-xl">{title}</h3>
        <p className="text-lg text-stone-400">{description}</p>
      </div>
    </div>
  );
}

export default function SoilRevolution() {
  return (
    <div className="container-site flex flex-col items-start gap-10">
      <hgroup className="flex h-full flex-col justify-between gap-1.5">
        <TagTitle tag="How" title="Leading the Soil revolution" />
        <p className="text-pretty text-stone-400 text-xl md:w-2/3">
          We are architects and innovators, working with a wide team of
          scientists to address the complexity of nature interactions for
          leading the Soil Revolution.
        </p>
      </hgroup>
      <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <SoilCard
          description="Scientific research and field studies allow us to collect data for evidence-based design and planning."
          image={analyzeCover}
          title="Analyze"
        />
        <SoilCard
          description="Through our landscape design process, we develop solutions for restoring degraded land."
          image={designCover}
          title="Design"
        />
        <SoilCard
          description="To create real change, we engage stakeholders throughout the process and promote soil knowledge through educational activities."
          image={engageCover}
          title="Engage"
        />
      </div>
    </div>
  );
}
