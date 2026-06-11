"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppSelector } from "@/lib/hooks";
import { useDispatch } from "react-redux";
import CartModal from './CartModal';

interface Props {
  show: boolean;
  onClose: () => void;
}

export default function AddToBagAlert({ show, onClose }: Props) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartItems = useAppSelector((state) => state.cart.items);
  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(onClose, 10000);
    return () => clearTimeout(timer);
  }, [show, onClose]);


  return (
    <>
      <div
        className={`
          fixed left-0 right-0 top-[40px] z-50
          transition-all duration-300 ease-out px-6 font-syne
          ${show
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-full opacity-0 pointer-events-none"}
        `}
      >
        <div className="bg-gray-100 border-b border-gray-200 shadow-sm">
          <div className="hidden max-w-7xl mx-auto px-6 py-4 md:flex items-center justify-end gap-12">
            <p className="mr-[100px] text-xl font-medium text-gray-800">
              ✔ ADDED TO BAG 
            </p>

            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-black hover:bg-gray-800 text-white px-4 py-4 w-70 font-bold 
              hover:cursor-pointer transition-transform active:scale-95"
            >
              CHECKOUT
            </button>
          </div>
          
          {/* mobile responsiveness  */}

          <div className="md:hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-medium text-gray-800">
                  ✔ ADDED TO BAG 
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setIsCartOpen(true)}
              className="mt-3 bg-black hover:bg-gray-800 text-white px-4 py-4 w-full font-bold 
              hover:cursor-pointer transition-transform active:scale-95"
            >
              CHECKOUT
            </button>
          </div>
        </div>
        
      </div>
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
      />
    </>
    
  );
}
