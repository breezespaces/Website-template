"use client";

import React, { useState } from "react";
import Image from "next/image";
import PageNavBar from "./PageNavBar";
import { useAppDispatch } from "@/lib/hooks";
import { addToCart } from "@/store/cartSlice";
import { toast } from "sonner";
import { Star, ChevronDown, ChevronUp, Plus, Minus, X } from "lucide-react";

import { useGetProduct } from "@/api/queries/products";
import { useParams } from "next/navigation";
import { Button } from "./ui/button";

const Product = () => {
  const { id } = useParams();
  const { data } = useGetProduct(id as string);
  const product = data?.data;
  const dispatch = useAppDispatch();

  const [activeIndex, setActiveIndex] = useState(0);
  const [fade, setFade] = useState(false);

  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const [expandedSection, setExpandedSection] = useState<
    "desc" | "delivery" | "reviews" | null
  >("desc");

  const [errors, setErrors] = useState({ color: false, size: false });

  const handleThumbnailClick = (index: number) => {
    if (index === activeIndex) return;
    setFade(true);
    setTimeout(() => {
      setActiveIndex(index);
      setFade(false);
    }, 200);
  };

  const handleQuantityChange = (type: "inc" | "dec") => {
    if (type === "inc") {
      setQuantity((prev) => Math.min(prev + 1, 3));
    } else {
      setQuantity((prev) => Math.max(prev - 1, 1));
    }
  };

  const handleAddToBag = () => {
    const hasColorError = !color;
    const hasSizeError = !size;

    setErrors({ color: hasColorError, size: hasSizeError });

    if (hasColorError || hasSizeError) {
      toast.error("Please select color and size");
      return;
    }

    dispatch(
      addToCart({
        name: product?.product_name || "",
        price: 0,
        imageUrl: product?.product_images[activeIndex].image as string,
        quantity: quantity,
        color: color,
        size: size,
      }),
    );
    toast.success("Added to bag successfully!");
  };

  const toggleSection = (section: "desc" | "delivery" | "reviews") => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans pb-16">
      <PageNavBar />

      <main className="max-w-7xl mx-auto px-4 md:px-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            <div className="flex flex-row md:flex-col gap-3 justify-center md:justify-start w-full md:w-20 shrink-0">
              {product?.product_images.map((product, idx) => (
                <button
                  key={idx}
                  onClick={() => handleThumbnailClick(idx)}
                  className={`relative w-20 h-20 md:w-20 md:h-24 bg-[#F8F8F8] border rounded-lg overflow-hidden flex items-center justify-center p-2 transition-all hover:border-black/50 ${
                    activeIndex === idx
                      ? "border-black shadow-sm"
                      : "border-neutral-200"
                  }`}
                >
                  <Image
                    src={product.image}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-contain p-1"
                  />
                </button>
              ))}
            </div>

            <div className="grow bg-[#F8F8F8] aspect-square rounded-2xl relative flex items-center justify-center p-6 border border-neutral-100 overflow-hidden">
              <div
                className={`relative w-full h-full transition-opacity duration-200 ${
                  fade ? "opacity-0" : "opacity-100"
                }`}
              >
                <Image
                  src={product?.product_images[activeIndex].image as string}
                  alt={product?.product_name || ""}
                  fill
                  className="object-contain p-4"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight font-syne mb-2">
                {product?.product_name}
              </h1>
              <p className="text-2xl font-semibold text-black">
                {product?.variants?.[0]?.product_price
                  ? `₦${Number(product.variants[0].product_price).toLocaleString()}`
                  : "N/A"}
              </p>
            </div>

            <div className="flex flex-col gap-1.5 border-t border-neutral-100 pt-4">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Select Color:
              </span>
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="text-amber-500 fill-none stroke-[1.5]"
                    />
                  ))}
                </div>
                <span className="text-xs text-neutral-400 font-medium">
                  (No ratings yet)
                </span>
              </div>
              <p className="text-xs text-stone-500/80 mt-1">
                Please select color and size
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {product?.variants?.map((variant, idx) => (
                <div key={variant.sku || idx} className="flex flex-col gap-2">
                  <label className="text-sm font-semibold font-syne tracking-wider">
                    Select Color:
                  </label>
                  <div className="relative">
                    <select
                      value={color}
                      onChange={(e) => {
                        setColor(e.target.value);
                        if (e.target.value)
                          setErrors((prev) => ({ ...prev, color: false }));
                      }}
                      className={`w-full bg-[#F1F1F1] border rounded-md py-3.5 px-4 text-sm font-medium appearance-none outline-none transition-colors cursor-pointer pr-10 ${
                        errors.color
                          ? "border-red-500 bg-red-50/10 focus:border-red-500"
                          : "border-neutral-200 focus:border-black"
                      }`}
                    >
                      <option value="" disabled>
                        Please select color
                      </option>
                      {variant.option_values?.map((opt) => (
                        <option key={opt.name} value={opt.name}>
                          {opt.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
                    />
                  </div>
                </div>
              ))}

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold font-syne tracking-wider">
                  Select preferred size:
                </label>
                <div className="relative">
                  <select
                    value={size}
                    onChange={(e) => {
                      setSize(e.target.value);
                      if (e.target.value)
                        setErrors((prev) => ({ ...prev, size: false }));
                    }}
                    className={`w-full bg-[#F1F1F1] border rounded-md py-3.5 px-4 text-sm font-medium appearance-none outline-none transition-colors cursor-pointer pr-10 ${
                      errors.size
                        ? "border-red-500 bg-red-50/10 focus:border-red-500"
                        : "border-neutral-200 focus:border-black"
                    }`}
                  >
                    <option value="" disabled>
                      Size
                    </option>
                    <option value="37">37</option>
                    <option value="38">38</option>
                    <option value="39">39</option>
                    <option value="40">40</option>
                    <option value="41">41</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
                  />
                </div>
              </div>

              <div>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-sm font-semibold font-syne text-black hover:underline inline-flex items-center gap-1 cursor-pointer transition-all"
                >
                  Size guide &gt;
                </button>
              </div>

              <div className="flex items-center gap-4 py-2">
                <span className="text-sm font-semibold text-neutral-600">
                  Quantity
                </span>
                <div className="flex items-center">
                  <button
                    disabled={quantity <= 1}
                    onClick={() => handleQuantityChange("dec")}
                    className="w-9 h-9 flex items-center justify-center bg-[#4E4E4E] text-white hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition rounded-l-md active:scale-95 cursor-pointer"
                  >
                    <Minus size={14} />
                  </button>
                  <div className="w-14 h-9 flex items-center justify-center border-y border-neutral-300 font-semibold text-sm bg-white">
                    {quantity}
                  </div>
                  <button
                    disabled={quantity >= 3}
                    onClick={() => handleQuantityChange("inc")}
                    className="w-9 h-9 flex items-center justify-center bg-[#4E4E4E] text-white hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition rounded-r-md active:scale-95 cursor-pointer"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToBag}
                className="w-full bg-[#7E7E7E] hover:bg-neutral-800 active:scale-[0.99] transition-all text-white font-semibold py-4 px-6 text-sm tracking-widest uppercase rounded-sm mt-4 shadow-sm cursor-pointer"
              >
                ADD TO BAG
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 max-w-4xl">
          <div className="border border-neutral-200 font-syne overflow-hidden flex flex-col gap-0 divide-y divide-neutral-200">
            <div>
              <button
                onClick={() => toggleSection("desc")}
                className="w-full flex justify-between items-center py-6 px-20 bg-white hover:bg-neutral-50 transition-colors font-bold text-sm tracking-wide text-left"
              >
                <span>Product Description</span>
                {expandedSection === "desc" ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>

              <div
                className={`transition-all duration-300 overflow-hidden ${
                  expandedSection === "desc" ? "max-h-125" : "max-h-0"
                }`}
              >
                <div className="bg-[#F1F1F1] py-6 px-20 border-t border-neutral-200 text-sm text-neutral-800 space-y-4 font-sans leading-relaxed">
                  {product?.product_description}
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={() => toggleSection("delivery")}
                className="w-full flex justify-between items-center py-6 px-20 bg-white hover:bg-neutral-50 transition-colors font-bold text-sm tracking-wide text-left"
              >
                <span>Delivery and Return</span>
                {expandedSection === "delivery" ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>

              <div
                className={`transition-all duration-300 overflow-hidden ${
                  expandedSection === "delivery" ? "max-h-[500px]" : "max-h-0"
                }`}
              >
                <div className="bg-[#F1F1F1] py-6 px-20 border-t border-neutral-200 text-sm text-neutral-800 space-y-3 font-sans leading-relaxed">
                  <p>
                    We offer standard shipping to all states in Nigeria and
                    select international destinations.
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>Lagos Delivery:</strong> 1-2 business days.
                    </li>
                    <li>
                      <strong>Other States:</strong> 3-5 business days.
                    </li>
                    <li>
                      <strong>International Shipping:</strong> 7-14 business
                      days via DHL.
                    </li>
                  </ul>
                  <p>
                    Returns are accepted within 7 days of receipt for items in
                    their original, unworn condition with tags still attached.
                    Contact our support line to request a return.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={() => toggleSection("reviews")}
                className="w-full flex justify-between items-center py-6 px-20 bg-white hover:bg-neutral-50 transition-colors font-bold text-sm tracking-wide text-left"
              >
                <span>Reviews</span>
                {expandedSection === "reviews" ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>

              <div
                className={`transition-all duration-300 overflow-hidden ${
                  expandedSection === "reviews" ? "max-h-125" : "max-h-0"
                }`}
              >
                <div className="bg-[#F1F1F1] py-6 px-20 border-t border-neutral-200 text-sm text-neutral-800 font-sans leading-relaxed space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className="text-amber-500 fill-none stroke-[1.5]"
                        />
                      ))}
                    </div>
                    <span>No reviews yet</span>
                  </div>
                  <p>
                    Help other shoppers out! Be the first to to review this
                    product
                  </p>
                  <Button className="px-10 py-6 bg-transparent rounded-none text-black border border-black hover:text-white hover:bg-black cursor-pointer">
                    Write a review
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowSizeGuide(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
          />
          <div className="relative bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-neutral-100 z-10">
            <div className="flex justify-between items-center p-5 border-b border-neutral-150">
              <h3 className="text-lg font-bold font-syne text-black">
                Shoe Size Guide
              </h3>
              <button
                onClick={() => setShowSizeGuide(false)}
                className="text-neutral-400 hover:text-black transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-neutral-700">
                  <thead className="text-xs uppercase bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200">
                    <tr>
                      <th className="px-4 py-3">EU Size</th>
                      <th className="px-4 py-3">US Size (Women)</th>
                      <th className="px-4 py-3">UK Size</th>
                      <th className="px-4 py-3">Foot Length (cm)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    <tr>
                      <td className="px-4 py-3 font-semibold text-black">37</td>
                      <td className="px-4 py-3">6.5</td>
                      <td className="px-4 py-3">4</td>
                      <td className="px-4 py-3">23.5</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-black">38</td>
                      <td className="px-4 py-3">7.5</td>
                      <td className="px-4 py-3">5</td>
                      <td className="px-4 py-3">24.0</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-black">39</td>
                      <td className="px-4 py-3">8.5</td>
                      <td className="px-4 py-3">6</td>
                      <td className="px-4 py-3">24.5</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-black">40</td>
                      <td className="px-4 py-3">9.5</td>
                      <td className="px-4 py-3">7</td>
                      <td className="px-4 py-3">25.0</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold text-black">41</td>
                      <td className="px-4 py-3">10.5</td>
                      <td className="px-4 py-3">8</td>
                      <td className="px-4 py-3">25.5</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-neutral-400 mt-4 text-center">
                *Measurements are approximate. If you fall between sizes, we
                recommend ordering the larger size.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
