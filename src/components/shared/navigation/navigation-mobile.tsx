import Link from "next/link";
import { isActivePath, navigationData } from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface NavigationMobileProps {
  onLinkClick?: () => void;
  pathname: string;
}

export default function NavigationMobile({
  onLinkClick,
  pathname,
}: NavigationMobileProps) {
  return (
    <nav aria-label="Primary" className="flex flex-col space-y-4 md:hidden">
      {navigationData.map((item) => {
        const isActive = isActivePath(pathname, item.href);

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "py-2 font-light text-2xl text-foreground transition-colors hover:text-orange-500",
              isActive && "text-orange-500 underline underline-offset-4"
            )}
            href={item.href}
            key={item.href}
            onClick={onLinkClick}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
