"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import cart from "@/assets/cart.svg";
import CartModal from "./CartModal";
import { useAppSelector } from "@/lib/hooks";
import { Menu, User2, UserRound, X } from "lucide-react";
import { useGetProfile, useGetTenantInfo } from "@/api/queries/auth";
import { useGetProducts } from "@/api/queries/products";

export default function HomeNavBar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
  const cartItems = useAppSelector((state) => state.cart.items);
  const { data } = useGetProducts({});
  const availableItems = data?.data.results || [];
  const { data: profile } = useGetProfile();
  const userProfile = profile?.data;
  const isUserLoggedIn = !!userProfile;
  const { data: tenantInfo } = useGetTenantInfo();

  return (
    <>
      <nav
        className="w-full text-black px-6 py-8 md:px-10 h-11.25 flex items-center 
        justify-between sticky top-0 left-0 z-50 shadow-md  bg-white border-b border-gray-100 font-inter"
      >
        <div className="md:hidden">
          <button
            onClick={() => setIsNavOpen(!isNavOpen)}
            className="text-whit text-xl font-bold"
          >
            {isNavOpen ? <X /> : <Menu />}
          </button>
        </div>

        <div className="text-lg font-semibold">
          <Link
            href="/"
            className="text-lg font-bold sm:text-[15px] text-[13px] uppercase"
          >
            {tenantInfo?.data.business_name}
          </Link>
        </div>

        <div className="hidden md:flex gap-6 text-sm font-light relative">
          <Link
            href="/"
            className="hover:underline font-semibold text-[13px] leading-8.75 tracking-[0%]"
          >
            HOME
          </Link>
          <div className="relative group overflow-hidden">
            <button className="hover:underline font-semibold text-[13px] leading-8.75 tracking-[0%]">
              SHOP
            </button>
            <div className="fixed left-0 right-2 max-h-100 top-16.5 mx-5 bg-[#F1F1F1] shadow-lg border-t border-gray-200 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all delay-100 overflow-x-hidden">
              <div className="px-4 py-3 space-y-3">
                <span className="block text-[18px] font-semibold tracking-tight text-black antialiased font-syne">
                  Available Items
                </span>
                <div className="flex flex-col gap-1">
                  {availableItems.map(({ id, product_name }) => (
                    <Link
                      href={`/shop/${id}`}
                      className="font-syne block w-max text-base font-normal uppercase tracking-normal transition-all duration-200 cursor-pointer hover:font-black hover:scale-x-100 hover:tracking-widest origin-left"
                      key={id}
                    >
                      {product_name}
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

        <div className="flex items-center justify-between gap-5">
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

          <div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex cursor-pointer"
            >
              <Image src={cart} alt="cart" className="h-4 md:h-5 mr-1" />
              <p className="text-sm md:text-base font-semibold">
                {cartItems.length}
              </p>
            </button>
          </div>
        </div>
      </nav>

      {isNavOpen && (
        <div className="md:hidden absolute top-12.5 left-0 right-0 z-40 bg-white shadow-md border-t border-gray-200">
          <div className="flex  items-start px-6 py-4 font-syne">
            <button
              className="text-black font-semibold text-base uppercase tracking-wide"
              style={{
                background: "none",
                border: "none",
                padding: 0,
                margin: 0,
              }}
              onClick={() => setIsShopMenuOpen(!isShopMenuOpen)}
            >
              SHOP
            </button>
            <Link
              href="/about"
              className="text-black font-semibold text-base uppercase ml-5"
              onClick={() => setIsNavOpen(false)}
            >
              ABOUT {tenantInfo?.data.business_name}
            </Link>
          </div>
          {isShopMenuOpen && (
            <div className="px-6 pb-4">
              <span className="text-xs text-gray-500 font-semibold mb-2 block">
                AVAILABLE ITEMS
              </span>
              <div className="flex flex-col gap-1">
                {availableItems.map(({ id, product_name }) => (
                  <Link
                    href={`/shop/${id}`}
                    className="font-syne block w-max text-base font-normal uppercase tracking-normal transition-all duration-200 cursor-pointer hover:font-black hover:scale-x-100 hover:tracking-widest origin-left"
                    key={id}
                  >
                    {product_name}
                  </Link>
                ))}
              </div>
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
