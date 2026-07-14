export type NavigationItem = {
  label: string;
  href: string;
  description?: string;
};

export type NavigationGroup = {
  title: string;
  items: NavigationItem[];
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
  /*   {
    label: "About",
    href: "/about",
    description: "Learn about our mission",
  }, */
];

export const navigationGroups: NavigationGroup[] = [
  {
    title: "Main",
    items: [
      {
        label: "Home",
        href: "/",
        description: "Back to home",
      },
      {
        label: "About",
        href: "/about",
        description: "Learn about our mission",
      },
    ],
  },
  {
    title: "Work",
    items: [
      {
        label: "Services",
        href: "/services",
        description: "What we offer",
      },
      {
        label: "Projects",
        href: "/projects",
        description: "Our work and initiatives",
      },
    ],
  },
  {
    title: "Resources",
    items: [
      {
        label: "Journal",
        href: "/journal",
        description: "Latest updates and insights",
      },
    ],
  },
];

// Helper functions
export const getNavigationItem = (href: string): NavigationItem | undefined =>
  navigationData.find((item) => item.href === href);

export const isActivePath = (currentPath: string, href: string): boolean => {
  if (href === "/") {
    return currentPath === "/";
  }
  return currentPath.startsWith(href);
};

// Default export
export default navigationData;
