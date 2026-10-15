export type NavigationItem = {
  label: string;
  href: string;
  description?: string;
};

export const navigationData: NavigationItem[] = [
  {
    label: "Projects",
    href: "/projects",
    description: "Our work and initiatives",
  },
  {
    label: "Services",
    href: "/services",
    description: "What we offer",
  },
  {
    label: "Journal",
    href: "/journal",
    description: "Latest updates and insights",
  },
  {
    label: "Contact",
    href: "/contacts",
    description: "",
  },
];

export const isActivePath = (currentPath: string, href: string): boolean => {
  if (href === "/") {
    return currentPath === "/";
  }
  return currentPath === href || currentPath.startsWith(`${href}/`);
};
