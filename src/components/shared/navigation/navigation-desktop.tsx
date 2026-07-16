import Link from "next/link";
import { navigationData } from "@/lib/navigation";

export default function NavigationDesktop() {
  return (
    <nav className="hidden items-center space-x-6 md:flex">
      {navigationData.map((item) => (
        <Link
          className="font-medium text-foreground text-base transition-colors hover:text-primary"
          href={item.href}
          key={item.href}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
