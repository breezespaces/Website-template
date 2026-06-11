"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import HomeNavBar from "@/components/NavBar";
import desktopHero from "@/assets/DesktopHomeScreen1.png";
import arrowImage from "@/assets/Arrow1.png";


import item1 from "@/assets/CustomRichSuits/LFW_custom_rich_suits.jpeg";
import item2 from "@/assets/LFW Suit 2/LFW_custom_two_piece_set.jpeg";
import item3 from "@/assets/ThreePieceSet/LFW_three_piece_set.jpeg";
import item4 from "@/assets/PlainPants/LFW_crop_top_and_plain_pants.jpeg";
import item5 from "@/assets/PlainShortsSleevelessSet/LFW_plain_short_and_sleeveless_set.jpeg";
import item6 from "@/assets/unlabelled/unlabelled-1.jpg";
import item7 from "@/assets/unlabelled/unlabelled-02.jpg";
import item8 from "@/assets/unlabelled/unlabelled-3.jpeg";
import item9 from "@/assets/unlabelled/unlabelled-4.jpeg";
import item10 from "@/assets/unlabelled/unlabelled-5.jpeg";
import item11 from "@/assets/unlabelled/unlabelled-6.jpeg";
import item12 from "@/assets/unlabelled/unlabelled-07.jpg";
import item13 from "@/assets/unlabelled/unlabelled-8.jpeg";
import item14 from "@/assets/unlabelled/unlabelled-9.jpeg";
import item15 from "@/assets/unlabelled/unlabelled-10.jpeg";
import item16 from "@/assets/unlabelled/unlabelled-11.jpeg";
import item17 from "@/assets/unlabelled/unlabelled-12.jpeg";
import item18 from "@/assets/unlabelled/unlabelled-13.jpeg";
import item19 from "@/assets/unlabelled/unlabelled-14.jpeg";
import item20 from "@/assets/unlabelled/unlabelled-15.jpeg";
import item21 from "@/assets/unlabelled/unlabelled-16.jpeg";
import item22 from "@/assets/unlabelled/unlabelled-17.jpeg";
import item23 from "@/assets/unlabelled/unlabelled-18.jpeg";
import item24 from "@/assets/unlabelled/unlabelled.jpeg";

import Link from "next/link";

const products = [
  { id: 1, name: "LFW Custom Rich Suits", slug: "lfw-custom-rich-suits", price: "150,00", image: item1 },
  { id: 2, name: "LFW Custom Two Piece Set", slug: "lfw-custom-two-piece-set", price: "70,000", image: item2 },
  { id: 3, name: "LFW Three Piece Set", slug: "lfw-three-piece-set", price: "70,000", image: item3 },
  { id: 4, name: "LFW Crop Top and Plain Pants", slug: "lfw-crop-top-and-plain-pants", price: "50,000", image: item4 },
  { id: 5, name: "LFW Plain Short and Sleeveless Set", slug: "lfw-plain-short-and-sleeveless-set", price: "50,000", image: item5 },
  // { id: 6, name: "Product 6", slug: "product-6", price: "40000", image: item6 },
  // { id: 7, name: "Product 7", slug: "product-7", price: "40000", image: item7 },
  // { id: 8, name: "Product 8", slug: "product-8", price: "40000", image: item8 },
  // { id: 9, name: "Product 9", slug: "product-9", price: "40000", image: item9 },
  // { id: 10, name: "Product 10", slug: "product-10", price: "40000", image: item10 },
  // { id: 11, name: "Product 11", slug: "product-11", price: "40000", image: item11 },
  // { id: 12, name: "Product 12", slug: "product-12", price: "40000", image: item12 },
  // { id: 13, name: "Product 13", slug: "product-13", price: "40000", image: item13 },
  // { id: 14, name: "Product 14", slug: "product-14", price: "40000", image: item14 },
  // { id: 15, name: "Product 15", slug: "product-15", price: "40000", image: item15 },
  // { id: 16, name: "Product 16", slug: "product-16", price: "40000", image: item16 },
  // { id: 17, name: "Product 17", slug: "product-17", price: "40000", image: item17 },
  // { id: 18, name: "Product 18", slug: "product-18", price: "40000", image: item18 },
  // { id: 19, name: "Product 19", slug: "product-19", price: "40000", image: item19 },
  // { id: 20, name: "Product 20", slug: "product-20", price: "40000", image: item20 },
  // { id: 21, name: "Product 21", slug: "product-21", price: "40000", image: item21 },
  // { id: 22, name: "Product 22", slug: "product-22", price: "40000", image: item22 },
  // { id: 23, name: "Product 23", slug: "product-23", price: "40000", image: item23 },
  // { id: 24, name: "Product 24", slug: "product-24", price: "40000", image: item24 },
];

const ITEMS_PER_PAGE = 12;

export default function Home() {
  const navigate = useRouter();

  // Rotating slides
  const slides = [
    {
      title: "NEW LOOK",
      desc: "Elevate your style with conscious design and intentional detail",
      link: "/shop/lfw-custom-rich-suits",
      linkName: "LFW CUSTOM RICH SUITS"
    },
    {
      title: "CHIC STYLE",
      desc: "Stride elegantly and in style for any occasion",
      link: "/shop/lfw-crop-top-and-plain-pants",
      linkName: "LFW CROP TOP AND PLAIN PANTS"
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);

  const [current, setCurrent] = useState(0);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <HomeNavBar />

      {/* Hero Section */}
      <section className="relative">
        <div className="relative">
          <Image
            src={desktopHero}
            alt="Hero Image"
            className="sm:w-full sm:block hidden sm:h-full h-[20vh] md:h-[70vh]"
            priority
          />

          <Image
            src={desktopHero}
            alt="Hero Image"
            className="sm:w-full sm:h-full h-[50vh] md:h-[135vh] sm:hidden block"
            priority
            width={1920}
            height={1080}
          />

          {/* ROTATING TEXT SECTION */}
          <div
            className="
              fade-rotate
              absolute 
              left-5 
              top-[38%]
              sm:left-[20%] 
              sm:top-[55%]
              w-[260px]
              text-white
            "
          >
            <h2 className="font-syne text-lg mb-1 tracking-tight">
              {slides[current].title}
            </h2>

            <p className="font-syne text-xs mb-4 sm:w-44 w-32 leading-tight">
              {slides[current].desc}
            </p>

            <div className="flex items-center gap-2 font-syne font-medium text-sm mt-2">
              <Link href={slides[current].link}>{slides[current].linkName}</Link>
              <Image src={arrowImage} alt="Arrow" className="w-[3rem] sm:w-[10rem]" />
            </div>
          </div>
        </div>
      </section>

      {/* Product Display Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h3 className="mb-2 text-[18px] font-medium">Available Items</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginatedProducts.map((product) => (
            <Link key={product.id} href={`/shop/${product.slug}`} className="flex justify-center flex-col w-fit">
              <div className="cursor-pointer mb-2">
                <Image
                  src={product.image}
                  alt={product.name}         
                  className="w-full aspect-[3/4] object-cover"
                />

                <h3 className="hidden md:block mt-2 text-[13px] font-medium">{product.name}</h3>
                <h3 className="block md:hidden mt-2 text-[13px] font-medium truncate w-40">{product.name}</h3>
                <p className="text-[13px] font-medium text-gray-500">₦{product.price}</p>

              </div>
              <button onClick={() => navigate.push(product.slug)} className={`py-1.5 text-[10px] tracking-widest border 
              transition-all border-black hover:bg-black hover:text-white hover:cursor-pointer`}>VIEW ITEM</button>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-12 gap-3">
          <button className="cursor-pointer" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>
            Previous
          </button>
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 border ${
                currentPage === index + 1
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button className="cursor-pointer" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}>
            Next
          </button>
        </div>
      </div>

      {/* Mobile grid */}
      
    </div>
  );
}
