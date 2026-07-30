"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import cart from "@/assets/cart.svg";
import CartModal from "./CartModal";
import { useAppSelector } from "@/lib/hooks";
import Menu from "@/assets/Menu.png";
import Close from "@/assets/Close_round.png";
import { MenuIcon, UserRound, X } from "lucide-react";
import { useGetProfile, useGetTenantInfo } from "@/api/queries/auth";
import { useGetProducts } from "@/api/queries/products";

export default function PageNavBar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { data: tenantInfo } = useGetTenantInfo();
  const { data: profile } = useGetProfile();
  const userProfile = profile?.data;
  const isUserLoggedIn = !!userProfile;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);

  const cartItems = useAppSelector((state) => state.cart.items);
  const { data } = useGetProducts({});
  const availableItems = data?.data.results || [];

  return (
    <>
      <nav
        className="w-full bg-white text-black px-4 py-8 md:px-10 h-14.75 flex items-center justify-between
         sticky top-0 left-0 z-50 shadow-md"
      >
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-black text-3xl"
            aria-label="Open menu"
          >
            {isMenuOpen ? <X /> : <MenuIcon />}
          </button>
        </div>

        <div className="hidden md:flex gap-6 text-sm font-light relative left-10">
          <div className="relative group">
            <button className="hover:underline font-semibold text-[13px] leading-8.75 tracking-[0%]">
              SHOP
            </button>

            <div className="fixed left-0 right-2 max-h-100 top-14.75 mx-5 bg-[#F1F1F1] shadow-lg border-t border-gray-200 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all delay-100 overflow-x-hidden">
              <div className="px-4 py-3 space-y-3">
                <span className="block text-[18px] font-semibold tracking-tight text-black antialiased font-syne">
                  Available Items
                </span>
                <div className="flex flex-col gap-1">
                  {availableItems.map((item) => (
                    <Link
                      href={`/shop/${item.id}`}
                      className="font-syne block w-max text-base font-normal uppercase tracking-normal transition-all duration-200 cursor-pointer hover:font-black hover:scale-x-100 hover:tracking-widest origin-left"
                      key={item.id}
                    >
                      {item.product_name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Link
            href="/about"
            className="hover:underline font-semibold text-[13px] leading-8.75 tracking-[0%] uppercase"
          >
            ABOUT {tenantInfo?.data.business_name}
          </Link>
        </div>

        <div className="">
          <Link
            href="/"
            className="text-lg font-semibold sm:text-[20px] text-[13px] leading-8.75 tracking-[0.4em]"
          >
            {tenantInfo?.data.business_name}
          </Link>
        </div>

        <div className="flex gap-5 items-center">
          <input
            placeholder="SEARCH"
            className="hidden md:block w-full text-sm bg-black/10 rounded-full py-2 px-4 font-medium"
          />
          {isUserLoggedIn ? (
            <div className="relative group hover:bg-gray-100 p-2 rounded-full cursor-pointer">
              <UserRound size={20} color="#1936FF" />

              <div className="fixed right-0 w-96 top-12.25 mx-5 bg-white rounded-xs shadow-lg border-t border-gray-200 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all delay-100 overflow-x-hidden">
                <div className="p-6 space-y-3">
                  <Link href={"/profile"}>
                    <button className="bg-black text-white w-full py-4 font-azeret font-medium cursor-pointer">
                      My Account
                    </button>
                  </Link>
                  <button className=" text-[#DE1717] font-azeret font-medium cursor-pointer">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              className="hidden md:block font-semibold text-sm"
              href={"/auth/login"}
            >
              LOGIN
            </Link>
          )}
          <div className="flex items-center">
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center"
            >
              <Image src={cart} alt="cart" className="h-5 mr-1" />
              <p className="text-sm">{cartItems.length}</p>
            </button>
          </div>
        </div>
      </nav>
      <div className="border-b-2 border-black relative bottom-3"></div>
      {isMenuOpen && (
        <div className="md:hidden absolute top-15.75 left-0 right-0 z-40 bg-white shadow-md border-t border-gray-200">
          <div className="flex items-start px-6 py-4 space-x-8 ">
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
              ABOUT {tenantInfo?.data.business_name}
            </Link>
          </div>
          {isShopMenuOpen && (
            <div className="px-6 py-4">
              <span className="text-xs text-gray-500 font-semibold mb-2 block">
                AVAILABLE ITEMS
              </span>
              {availableItems.map(({ id, product_name }) => (
                <Link
                  href={`/shop/${id}`}
                  className="block py-1 text-black hover:underline"
                  key={id}
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsShopMenuOpen(false);
                  }}
                >
                  {product_name}
                </Link>
              ))}
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
