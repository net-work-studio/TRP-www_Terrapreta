import Link from "next/link";
import { navigationData } from "@/lib/navigation";

interface NavigationMobileProps {
  onLinkClick?: () => void;
}

export default function NavigationMobile({
  onLinkClick,
}: NavigationMobileProps) {
  return (
    <nav className="flex flex-col space-y-4 md:hidden">
      {navigationData.map((item) => (
        <Link
          className="py-2 font-light text-2xl text-foreground transition-colors hover:text-primary"
          href={item.href}
          key={item.href}
          onClick={onLinkClick}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
