import Link from "next/link";
import { isActivePath, navigationData } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export default function NavigationDesktop({ pathname }: { pathname: string }) {
  return (
    <nav aria-label="Primary" className="hidden items-center space-x-6 md:flex">
      {navigationData.map((item) => {
        const isActive = isActivePath(pathname, item.href);

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "font-light text-foreground text-sm transition-colors hover:text-orange-500",
              isActive && "text-orange-500 underline underline-offset-8"
            )}
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
