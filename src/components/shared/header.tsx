"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logotype from "@/components/brand/logotype";
import { Button } from "@/components/ui/button";
import NavigationDesktop from "./navigation/navigation-desktop";
import NavigationMobile from "./navigation/navigation-mobile";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHalfScrolled, setIsHalfScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);

      if (isHomePage) {
        setIsHalfScrolled(window.scrollY > window.innerHeight * 0.5);
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  // Block scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const buttonVariant = isHomePage && !isHalfScrolled ? "default" : "brand";

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
        <NavigationDesktop />
        <div className="flex items-center md:hidden gap-4">
          {/* <Button asChild size={"sm"} variant={buttonVariant}>
            <Link href="/contacts">Contact Us</Link>
          </Button> */}
          <Button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            size="icon"
            variant="ghost"
          >
            {isMobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-10 bg-stone-950 md:hidden">
          <div className="p-5 pt-24">
            <NavigationMobile onLinkClick={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
