"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Image from "next/image";
import Pic1 from "../../../assets/unlabelled/unlabelled-3.jpeg";
import Pic2 from "../../../assets/Product page pics/SecondPic.jpg";
import Pic3 from "../../../assets/Product page pics/LastPic.jpg";

import LeftArrow from "../../../assets/Backward-mobile.png";
import RightArrow from "../../../assets/Forward-Mobile.png";
import PageNavBar from "@/components/PageNavBar";
import { addToCart, CartItem } from "@/store/cartSlice";
import { useAppDispatch } from "@/lib/hooks";

type Section = {
  title: string;
  content: React.ReactNode;
};

const ProductPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0); // ✅ fixed: number
  const dispatch = useAppDispatch();

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    details: false,
    shipping: false,
  });

  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  const images = [Pic1, Pic2, Pic3];

  const sections: Record<string, Section> = {
    details: {
      title: "Details",
      content: (
        <>
          <p className="text-sm mb-2">Item No.LS-001LFW</p>
          <ul className="list-disc pl-4 text-sm space-y-1">
            <li>Best selling LFW suit</li>
            <li>Cotton lining</li>
            <li>Made in Nigeria</li>
          </ul>
          <p className="text-sm mt-2">Dimensions (WHD): 10" x 8" x 3"</p>
        </>
      ),
    },
    shipping: {
      title: "Shipping and Return policy",
      content: (
        <>
          <p className="text-sm mb-2">Worldwide shipping. 3–5 days.</p>
          <p className="text-sm">
            Products purchased can only be returned if it doesn't fit or damage when delivered.
          </p>
        </>
      ),
    },
  };

  const toggleSection = (section: string) => {
    setOpenSections((prev) => {
      const isCurrentlyOpen = prev[section];
      return {
        details: false,
        shipping: false,
        [section]: !isCurrentlyOpen,
      };
    });
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const colorOptions = [
    { name: "Black", value: "black", bg: "bg-black", border: "border-black" },
    { name: "White", value: "white", bg: "bg-[#f5f5f5]", border: "border-gray-400" },
    { name: "Red", value: "red", bg: "bg-[#ff0000]", border: "border-gray-400" },
    { name: "Blue", value: "blue", bg: "bg-[#0000ff]", border: "border-gray-400" },
    { name: "Green", value: "green", bg: "bg-[#008000]", border: "border-gray-400" },
    { name: "Creme", value: "creme", bg: "bg-[#fffdd0]", border: "border-gray-400" },
    { name: "Maroon", value: "maroon", bg: "bg-[#800000]", border: "border-gray-400" },
    { name: "Pink", value: "pink", bg: "bg-[#ffc0cb]", border: "border-gray-400" },
  ];

  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");

  const sizeOptions = ["S", "M", "L", "XL"];

  const bagItem: CartItem = {
    name: "Product 8",
    price: 50000,
    imageUrl: Pic1.src,
    quantity: 1,
    color: selectedColor,
    size: selectedSize, 
  };

  return (
    <>
      <PageNavBar />
      <div className="flex flex-col min-h-screen pb-10 bg-white font-syne">
        <main className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-8 py-6 max-w-7xl mx-auto w-full">
          {/* Image Section */}
          <div className="flex">
            {isMobile ? (
              <Swiper
                modules={[Navigation]}
                spaceBetween={10}
                slidesPerView={1}
                pagination={{ clickable: true }}
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }}
                onBeforeInit={(swiper) => {
                  if (
                    swiper.params.navigation &&
                    typeof swiper.params.navigation !== "boolean"
                  ) {
                    swiper.params.navigation.prevEl = prevRef.current;
                    swiper.params.navigation.nextEl = nextRef.current;
                  }
                }}
                className="w-full relative"
              >
                {images.map((img, idx) => (
                  <SwiperSlide
                    key={idx}
                    className="h-[400px] flex items-center justify-center"
                  >
                    <Image
                      src={img}
                      alt={`Tatam Sandal slide ${idx + 1}`}
                      className="w-full object-contain"
                    />
                  </SwiperSlide>
                ))}

                {/* <button
                  ref={prevRef}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10"
                >
                  <Image src={LeftArrow} alt="Previous" width={30} height={30} />
                </button>
                <button
                  ref={nextRef}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10"
                >
                  <Image src={RightArrow} alt="Next" width={30} height={30} />
                </button> */}
              </Swiper>
            ) : (
              <>
                {/* <div className="flex flex-col mr-4 space-y-3 w-20">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`border cursor-pointer ${
                        selectedImageIndex === idx
                          ? "border-black"
                          : "border-gray-200"
                      }`}
                      onClick={() => setSelectedImageIndex(idx)}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  ))}
                </div> */}
                <div className="flex-grow">
                  <Image
                    src={images[selectedImageIndex]}
                    alt={`Tatam Sandal ${selectedImageIndex + 1}`}
                    className="w-full h-auto object-contain"
                  />
                </div>
              </>
            )}
          </div>

          {/* Product Info Section */}
          <div className="flex flex-col text-black">
            <h1 className="text-2xl font-bold mb-2">
              Product 8
            </h1>
            <h1 className="text-xl font-bold mb-2 mt-[-9px]">
              ₦50,000
            </h1>
            <p className="text-sm mb-6">
              LFW SUITS — leather, chain, and quiet audacity.
            </p>

            {/* Color Selection */}
            <div className="mb-4">
              <span className="font-semibold text-sm">
                Color:{" "}
                {selectedColor
                  ? colorOptions.find((c) => c.value === selectedColor)?.name
                  : "Select Color"}
              </span>
              <div className="flex gap-3 mt-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    className={`w-6 h-6 rounded-full border-2 ${color.border} ${color.bg} 
                      ${selectedColor === color.value ? "ring-2 ring-black" : ""}`}
                    aria-label={color.name}
                    onClick={() => setSelectedColor(color.value)}
                    type="button"
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <span className="font-semibold text-sm">Select preferred size</span>
              <div className="flex gap-2 mt-2">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    className={`border border-gray-400 px-4 py-1 text-sm font-medium hover:bg-gray-100
                      ${selectedSize === size ? "bg-black text-white border-black" : ""}`}
                    onClick={() => setSelectedSize(size)}
                    type="button"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {(!selectedColor || !selectedSize) && (
              <p className="text-xs text-gray-500 mb-2">
                Please select color and size
              </p>
            )}

            <button
              className={`w-full mb-[88px] h-10 font-bold transition-transform
                ${
                  selectedColor && selectedSize
                    ? "bg-black hover:bg-gray-800 text-white hover:cursor-pointer active:scale-95"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              disabled={!selectedColor || !selectedSize}
              onClick={() => dispatch(addToCart(bagItem))}
            >
              ADD TO BAG
            </button>

            {/* Accordion Sections */}
            {Object.keys(sections).map((key) => (
              <div key={key} className="border border-gray-200 py-4">
                <div
                  className="flex justify-between items-center cursor-pointer p-3"
                  onClick={() => toggleSection(key)}
                >
                  <h3 className="font-bold">{sections[key].title}</h3>
                  <button
                    className="rounded-full p-1"
                    aria-label={`Toggle ${sections[key].title}`}
                  >
                    {openSections[key] ? (
                      <FaChevronUp className="h-4 w-4" />
                    ) : (
                      <FaChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {openSections[key] && (
                  <div className="pt-2 bg-[#F8F8FA] p-3">
                    {sections[key].content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default ProductPage;
