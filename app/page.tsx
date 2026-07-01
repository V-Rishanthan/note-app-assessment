"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Home, Package, StickyNote } from "lucide-react";
import LoginDialog from "@/components/auth/LoginDialog";
import FloatingAddButton from "@/components/common/FloatingAddButton";
import NotesList from "@/components/NotesList";

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Notes", path: "/", icon: Home },
    { name: "Dashboard", path: "/dashboard", icon: Package },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-indigo-500 flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 py-4 md:py-6 z-50">
        {/* Logo with Note icon */}
        <Link href="/" className="flex items-center gap-2">
          <StickyNote className="text-white" size={28} />
          <span className="text-2xl font-bold tracking-tight text-white">
            NoteMe
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4 lg:gap-8">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              href={link.path}
              className="group flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
            >
              <link.icon size={18} />
              {link.name}
              <div className="bg-white h-0.5 w-0 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        {/* Desktop Right - Login Dialog */}
        <div className="hidden md:flex items-center gap-4">
          <LoginDialog />
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-6 w-6 cursor-pointer text-white" />
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            className="absolute top-4 right-4"
            onClick={() => setIsMenuOpen(false)}
          >
            <X className="h-8 w-8" />
          </button>

          {navLinks.map((link, index) => (
            <Link
              key={index}
              href={link.path}
              onClick={() => setIsMenuOpen(false)}
              className="text-xl hover:text-indigo-500 transition-colors flex items-center gap-3"
            >
              <link.icon size={24} />
              {link.name}
            </Link>
          ))}

          <div onClick={() => setIsMenuOpen(false)}>
            <LoginDialog />
          </div>
        </div>
      </nav>

      <main className="pt-28">
        <NotesList />
      </main>

      <FloatingAddButton />
    </>
  );
}
