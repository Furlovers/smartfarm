import React from "react";
import NavLandingDesktop from "./NavLandingDesktop";
import NavLandingMobile from "./NavLandingMobile";

export default function NavLanding() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <NavLandingMobile />
          <NavLandingDesktop />
        </div>
      </div>
    </nav>
  );
}