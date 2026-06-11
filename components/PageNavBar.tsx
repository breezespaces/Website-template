"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import bag from '@/assets/Bag Black.png';
import CartModal from './CartModal';
import { useAppSelector } from "@/lib/hooks";
import Menu from '@/assets/Menu.png'
import Close from '@/assets/Close_round.png'

export default function PageNavBar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false); // Add this line

  const cartItems = useAppSelector((state) => state.cart.items);

  return (
    <>
      <nav
        className="w-full bg-white text-black px-4 md:px-10 h-[59px] flex items-center justify-between 
        font-syne sticky top-0 left-0 z-50 shadow-md"
        style={{ marginTop: "-10px", marginBottom: "20px" }}
      >
        {/* Left: Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-black text-3xl"
            aria-label="Open menu"
          >
            {!isMenuOpen ? <Image src={Menu} alt="Menu" /> : <Image src={Close} alt="close"/>}
          </button>
        </div>

        {/* Left Links (desktop only) */}
        <div className="hidden md:flex gap-6 text-sm font-light relative left-10">
          <div className="relative group">
            <button
              className="hover:underline font-semibold text-[13px] leading-[35px] tracking-[0%]"
            >
              SHOP
            </button>
            {/* Dropdown on hover */}
            <div className="fixed left-0 top-[35px] w-full bg-white shadow-lg border-t border-gray-200 z-50 hidden group-hover:block overflow-x-hidden">
              <div className="px-4 py-3 ">
                <span className="text-xs text-gray-500 font-semibold mb-2 block">AVAILABLE ITEMS</span>
                <Link href="/shop/lfw-custom-rich-suits" className="block py-1 text-black hover:underline">LFW Custom Rich Suits</Link>
                <Link href="/shop/lfw-crop-top-and-plain-pants" className="block py-1 text-black hover:underline">LFW Crop Top And Plain Pants</Link>
                <Link href="/shop/lfw-custom-two-piece-set" className="block py-1 text-black hover:underline">
                LFW Custom Two Piece Set</Link>
                <Link href="/shop/lfw-plain-short-and-sleeveless-set" className="block py-1 text-black hover:underline">
                LFW Plain Short And Sleeveless Set</Link>
                <Link href="/shop/lfw-three-piece-set" className="block py-1 text-black hover:underline">
                LFW Three Piece Set</Link>
                {/* <Link href="/shop/all-items" className="block py-1 text-black hover:underline">All Items</Link> */}
              </div>
            </div>
          </div>
          <Link
            href="/about"
            className="hover:underline font-semibold text-[13px] leading-[35px] tracking-[0%]"
          >
            ABOUT LFW
          </Link>
        </div>

        {/* Center Logo */}
        <div className="">
          <Link href="/" className="text-lg font-semibold sm:text-[20px] text-[13px] leading-[35px] tracking-[0.4em]">
            {/* <Image
              src={logo}
              alt="logo"
              className="sm:w-[100px] w-[90px] md:w-[133px] h-auto relative right-6 sm:left-0 left-1"
              priority
            /> */}
            LHEESFASHIONWORLD
          </Link>
        </div>

        {/* Right: Cart */}
        <div className="flex items-center">
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center"
          >
            <Image src={bag} alt="cart bag" className="h-5 mr-1" />
            <p className="text-sm">{cartItems.length}</p>
          </button>
        </div>
      </nav>

      <div className="border-b-2 border-black relative bottom-3"></div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-[40px] left-0 right-0 z-40 bg-white shadow-md border-t border-gray-200">
          <div className="flex items-start px-6 py-4 space-x-8 font-syne">
            <button
              className="text-base font-semibold uppercase tracking-wide bg-transparent border-none p-0 m-0"
              onClick={() => setIsShopMenuOpen(!isShopMenuOpen)}
            >
              SHOP
            </button>
            <Link
              href="/about"
              className="text-base font-semibold uppercase tracking-wide ml-5"
              onClick={() => setIsMenuOpen(false)}
            >
              ABOUT LHEESFASHIONWORLD
            </Link>
          </div>
          {isShopMenuOpen && (
            <div className="px-6 py-4">
              <span className="text-xs text-gray-500 font-semibold mb-2 block">AVAILABLE ITEMS</span>
              <Link
                href="/shop/lfw-custom-rich-suits"
                className="block py-1 text-black hover:underline"
                onClick={() => { setIsMenuOpen(false); setIsShopMenuOpen(false); }}
              >
                LFW Custom Rich Suits
              </Link>
              <Link
                href="/shop/lfw-crop-top-and-plain-pants"
                className="block py-1 text-black hover:underline"
                onClick={() => { setIsMenuOpen(false); setIsShopMenuOpen(false); }}
              >
                LFW Crop Top And Plain Pants
              </Link>
              <Link
                href="/shop/lfw-custom-two-piece-set"
                className="block py-1 text-black hover:underline"
                onClick={() => { setIsMenuOpen(false); setIsShopMenuOpen(false); }}
              >
                LFW Custom Two Piece Set
              </Link>
              <Link
                href="/shop/lfw-plain-short-and-sleeveless-set"
                className="block py-1 text-black hover:underline"
                onClick={() => { setIsMenuOpen(false); setIsShopMenuOpen(false); }}
              >
                LFW Plain Short And Sleeveless Set
              </Link>
              <Link
                href="/shop/lfw-three-piece-set"
                className="block py-1 text-black hover:underline"
                onClick={() => { setIsMenuOpen(false); setIsShopMenuOpen(false); }}
              >
                LFW Three Piece Set
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Cart Modal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
      />
    </>
  );
}