import { AsteriskIcon } from "@sanity/icons/Asterisk";
import { EarthGlobeIcon } from "@sanity/icons/EarthGlobe";
import { SearchIcon } from "@sanity/icons/Search";

export const groups = [
  {
    name: "meta",
    title: "Meta",
    icon: EarthGlobeIcon,
  },
  {
    name: "content",
    title: "Content",
    default: true,
    icon: AsteriskIcon,
  },
  {
    name: "seo",
    title: "SEO",
    icon: SearchIcon,
  },
];
