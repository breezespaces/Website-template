'use client';

import React from 'react';
import Image from 'next/image';
import PageNavBar from '@/components/PageNavBar';
import { useRouter } from 'next/navigation';

import SuitPic from "../../../assets/Product page pics/FirstPic.jpg"
import plainPant from "../../../assets/PlainPants/plainPants.jpg"
import LFWsuit from "../../../assets/LFW Suit 2/LFWSuit.jpg"

export default function AllItemsPage() {
  const router = useRouter();

  const products = [
    {
      id: 1,
      name: 'LFW SUIT',
      price: '₦45,000',
      image: SuitPic,
      path: '/shop/lfw-suit1',
      primary: true,
    },
    {
      id: 2,
      name: 'PLAIN PANTS AND CROP TOP',
      price: '₦35,000',
      image: plainPant,
      path: '/shop/plain-pants',
    },
    {
      id: 3,
      name: 'LFW SUIT 2',
      price: '₦15,000',
      image: LFWsuit,
      path: '/shop/lfw-suit2',
    },
  ];

  return (
    <>
      <PageNavBar />

      <section className="font-syne px-4 pt-16 pb-32">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-lg font-semibold mb-1">
            Items Available
          </h1>
          <p className="text-xs text-gray-500 max-w-xs mx-auto">
            All personal essentials for many possibilities and effortless style.
          </p>
        </div>

        {/* Products Grid */}
        <div className="
          md:max-w-1/3 mx-auto
          grid grid-cols-2 md:grid-cols-3
          gap-0.5
            justify-items-center
            
        ">
          {products.map((product) => (
            <div key={product.id} className="flex justify-center flex-col w-fit">
              {/* Image */}
              <div className="
                  
                bg-gray-100 
                flex items-center justify-center 
                mb-3
              ">
                <Image
                  src={product.image}
                  alt={product.name}
                  
                  className="object-contain w-full h-52"
                />
              </div>

              {/* Name */}
              <h3 className="text-[10px] tracking-wide mb-1">
                {product.name}
              </h3>

              {/* Price */}
              <p className="text-[10px] text-gray-500 mb-3">
                {product.price}
              </p>

              {/* Button */}
              <button
                onClick={() => router.push(product.path)}
                className={`py-1.5 text-[10px] tracking-widest border transition-all border-black hover:bg-black hover:text-white hover:cursor-pointer`}
              >
                VIEW ITEM
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
