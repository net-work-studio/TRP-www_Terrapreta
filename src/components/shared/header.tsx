"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logotype from "@/components/brand/logotype";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NavigationDesktop from "./navigation/navigation-desktop";
import NavigationMobile from "./navigation/navigation-mobile";

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const desktopBreakpoint = window.matchMedia("(min-width: 768px)");
    const closeMenuOnDesktop = () => {
      if (desktopBreakpoint.matches) {
        setIsMobileMenuOpen(false);
      }
    };

    closeMenuOnDesktop();
    desktopBreakpoint.addEventListener("change", closeMenuOnDesktop);

    return () => {
      desktopBreakpoint.removeEventListener("change", closeMenuOnDesktop);
    };
  }, []);

  return (
    <div
      className={`fixed top-0 right-0 left-0 z-50 flex items-center justify-center py-4 transition-all duration-100 ${
        isScrolled
          ? "border-stone-800 border-b bg-stone-950"
          : "bg-stone-950/40"
      }`}
    >
      <header className="container-site z-20 flex w-full items-center justify-between">
        <Link className="h-7 w-fit pt-1" href="/">
          <Logotype />
        </Link>
        <NavigationDesktop pathname={pathname} />
        <div className="flex items-center gap-4 md:hidden">
          <Dialog onOpenChange={setIsMobileMenuOpen} open={isMobileMenuOpen}>
            <DialogTrigger
              aria-label="Open mobile menu"
              className={buttonVariants({ size: "icon", variant: "ghost" })}
            >
              <Menu aria-hidden="true" className="h-4 w-4" />
            </DialogTrigger>
            <DialogContent
              className="inset-0 h-dvh max-w-none translate-x-0 translate-y-0 rounded-none border-0 bg-stone-950 p-5 pt-24 shadow-none transition-opacity data-ending-style:scale-100 data-starting-style:scale-100 sm:max-w-none md:hidden"
              overlayClassName="md:hidden"
              showCloseButton={false}
            >
              <DialogTitle className="sr-only">Mobile menu</DialogTitle>
              <div className="container-site absolute inset-x-0 top-4 flex items-center justify-between">
                <Link
                  className="h-7 w-fit pt-1"
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Logotype />
                </Link>
                <DialogClose
                  className={buttonVariants({ size: "icon", variant: "ghost" })}
                >
                  <X aria-hidden="true" className="h-4 w-4" />
                  <span className="sr-only">Close mobile menu</span>
                </DialogClose>
              </div>
              <NavigationMobile
                onLinkClick={() => setIsMobileMenuOpen(false)}
                pathname={pathname}
              />
            </DialogContent>
          </Dialog>
        </div>
      </header>
    </div>
  );
}
