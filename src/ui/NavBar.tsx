"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // interface IsActiveFn {
  //   (pathname: string): boolean;
  // }

  // const isActive: IsActiveFn = (pathname) =>
  //   (router as { pathname?: string }).pathname === pathname;
  return (
    <nav className="w-full px-4 fixed top-4 z-50 ">
      <div className="w-full bg-[#E0FFE0] flex items-center justify-between text-lg px-5 rounded-md shadow-md">
        <Link href="/" className="text-xl font-bold">
          <img
            loading="lazy"
            className="h-20 w-20"
            src="/paw-reach-logo.png"
            alt="paw-reach-logo"
          />
        </Link>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              ></path>
            </svg>
          </button>
        </div>
        <button
          onClick={() => router.push("/ngo-search")}
          className="hidden md:block bg-[#00796B] text-white px-4 py-2 rounded-lg hover:bg-[#009688] text-lg font-semibold cursor-pointer"
        >
          Find Nearby NGOs
        </button>
      </div>
    </nav>
  );
};


export default Navbar;