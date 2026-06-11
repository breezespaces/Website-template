"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import bag from '@/assets/Bag White.png'
import CartModal from './CartModal';
import { useAppSelector } from "@/lib/hooks";
import whiteMenu from "@/assets/Menu Icon White.png"
import closeWhite from "@/assets/Close button white.png"

export default function HomeNavBar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false); // Add this line
  const cartItems = useAppSelector((state) => state.cart.items);
  

  return (
    <>
      <nav className="w-full text-black px-4 md:px-10 h-[45px] flex items-center 
      justify-between sticky top-0 left-0 z-50 shadow-md font-syne bg-gradient-to-b from-[rgba(217,217,217,0.5)] to-black">
        
        {/* Left Links - Hidden on mobile, visible on desktop */}
        <div className="hidden md:flex gap-6 text-sm font-light text-white relative left-10">
          <div className="relative group">
            <button className="hover:underline font-semibold text-[13px] leading-[35px] tracking-[0%]">SHOP</button>
            {/* Dropdown on hover */}
            <div className="fixed left-0 top-[45px] w-full bg-white shadow-lg border-t border-gray-200 z-50 hidden group-hover:block overflow-x-hidden">
              <div className="px-4 py-3">
                <span className="text-xs text-gray-500 font-semibold mb-2 block">AVAILABLE ITEMS</span>
                <Link href="/shop/lfw-custom-rich-suits" className="block py-1 text-black hover:underline">LFW Custom Rich Suits</Link>
                <Link href="/shop/lfw-crop-top-and-plain-pants" className="block py-1 text-black hover:underline">LFW Crop Top And Plain Pants</Link>
                <Link href="/shop/lfw-custom-two-piece-set" className="block py-1 text-black hover:underline">
                LFW Custom Two Piece Set</Link>
                <Link href="/shop/lfw-plain-short-and-sleeveless-set" className="block py-1 text-black hover:underline">
                LFW Plain Short And Sleeveless Set</Link>
                <Link href="/shop/lfw-three-piece-set" className="block py-1 text-black hover:underline">
                LFW Three Piece Set</Link>
                {/* <Link href="/shop/all-items" className="block py-1 text-black hover:underline">All Items </Link> */}
              </div>
            </div>
          </div>
          <Link href="/about" className="hover:underline font-semibold text-[13px] leading-[35px] tracking-[0%]">ABOUT LFW</Link>
        </div>

        {/* Mobile Menu Button - Visible only on mobile */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsNavOpen(!isNavOpen)} 
            className="text-white text-xl font-bold"
          >
            {isNavOpen ? (
              <span className="inline-flex items-center justify-center rounded-full shadow-lg p-2">
                <Image src={closeWhite} alt="close" />
              </span>
            ) : (
              <span className="inline-flex items-center justify-center rounded-full shadow-lg p-2">
                <Image src={whiteMenu} alt="Menu" />
              </span>
            )}
          </button>
        </div>

        {/* Center Logo */}
        <div className="hidden md:block text-lg font-semibold tracking-widest md:mr-20">
          <Link href="/" className="text-lg text-white font-semibold sm:text-[15px] text-[13px] leading-[35px] tracking-[0.4em]" >
            {/* <Image src={logo} alt="logo" className="sm:w-[100px] w-[90px] md:w-[133px] relative sm:right-6 sm:left-0 left-3 " /> */}
            LHEESFASHIONWORLD
          </Link>
        </div>
        <div className="block md:hidden text-lg font-semibold tracking-widest md:mr-20">
          <Link href="/" className="text-lg text-white font-semibold sm:text-[13px] text-[13px] leading-[35px] tracking-[0.4em]" >
            {/* <Image src={logo} alt="logo" className="sm:w-[100px] w-[90px] md:w-[133px] relative sm:right-6 sm:left-0 left-3 " /> */}
            LFW
          </Link>
        </div>

        {/* Right Icon */}
        <div>
          <button onClick={() => setIsCartOpen(true)} className="flex">
            <Image src={bag} alt="cart bag" className="h-4 md:h-5 mr-1" />
            <p className="text-white text-sm md:text-base">{cartItems.length}</p>
          </button>
        </div>
      </nav>

{/* Mobile Navigation Links - Toggleable */}
{isNavOpen && (
  <div className="md:hidden absolute top-[50px] left-0 right-0 z-40 bg-white shadow-md border-t border-gray-200">
    <div className="flex  items-start px-6 py-4 ">
      <button
        className="text-black font-semibold text-base uppercase tracking-wide"
        style={{ background: "none", border: "none", padding: 0, margin: 0 }}
        onClick={() => setIsShopMenuOpen(!isShopMenuOpen)}
      >
        SHOP
      </button>
      <Link
        href="/about"
        className="text-black font-semibold text-base uppercase tracking-wide ml-5"
        onClick={() => setIsNavOpen(false)}
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
          onClick={() => { setIsNavOpen(false); setIsShopMenuOpen(false); }}
        >
          LFW Custom Rich Suits
        </Link>
        <Link
          href="/shop/lfw-crop-top-and-plain-pants"
          className="block py-1 text-black hover:underline"
          onClick={() => { setIsNavOpen(false); setIsShopMenuOpen(false); }}
        >
          LFW Crop Top And Plain Pants
        </Link>
        <Link
          href="/shop/lfw-custom-two-piece-set"
          className="block py-1 text-black hover:underline"
          onClick={() => { setIsNavOpen(false); setIsShopMenuOpen(false); }}
        >
          LFW Custom Two Piece Set
        </Link>
        <Link
          href="/shop/lfw-plain-short-and-sleeveless-set"
          className="block py-1 text-black hover:underline"
          onClick={() => { setIsNavOpen(false); setIsShopMenuOpen(false); }}
        >
          LFW Plain Short And Sleeveless Set
        </Link>
        <Link
          href="/shop/lfw-three-piece-set"
          className="block py-1 text-black hover:underline"
          onClick={() => { setIsNavOpen(false); setIsShopMenuOpen(false); }}
        >
          LFW Three Piece Set
        </Link>
        {/* <Link
          href="/shop/all-items"
          className="block py-1 text-black hover:underline"
          onClick={() => { setIsNavOpen(false); setIsShopMenuOpen(false); }}
        >
          All Items
        </Link> */}
      </div>
    )}
  </div>
)}

      
      
      <CartModal 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
      />
    </>
  );
}
