"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import HomeNavBar from "@/components/NavBar";

import Link from "next/link";
import { useGetProducts } from "@/api/queries/products";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetTenantInfo } from "@/api/queries/auth";
import Banner from "@/components/banner";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useRouter();
  const { data: tenantInfo } = useGetTenantInfo();

  const { data, isLoading } = useGetProducts({
    offset: (currentPage - 1) * 10,
    limit: 10,
  });

  const products = data?.data?.results || [];
  const count = data?.data?.count || 1;
  const totalPages = Math.ceil(count / 10);

  return (
    <div className="min-h-screen bg-white">
      <HomeNavBar />

      <Banner />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <h3 className="mb-2 text-[18px] font-medium">Available Items</h3>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="space-y-3">
                <Skeleton className="w-full h-96" />
                <Skeleton className="w-[80%] h-5" />
                <Skeleton className="w-[50%] h-5" />
              </div>
            ))}
          </div>
        ) : products?.length === 0 ? (
          <div className="flex items-center justify-center flex-col h-full space-y-7 my-24">
            <div className="flex items-center justify-center flex-col text-center">
              <p className="text-xl font-semibold">
                There are no available items
              </p>
              <p>
                This store hasn’t uploaded any collections yet. Check back soon
                or explore other features.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.id}`}
                className="flex justify-center flex-col w-fit"
              >
                <div className="cursor-pointer mb-2">
                  <Image
                    src={product.first_image}
                    alt={product.product_name}
                    width={200}
                    height={200}
                    className="w-full aspect-3/4 object-cover rounded-lg"
                  />

                  <h3 className="hidden md:block mt-2 text-[13px] font-medium">
                    {product.product_name}
                  </h3>
                  <h3 className="block md:hidden mt-2 text-[13px] font-medium truncate w-40">
                    {product.product_name}
                  </h3>
                  <p className="text-[13px] font-medium text-gray-500">
                    ₦{product.lowest_price}
                  </p>
                </div>
                <button
                  onClick={() => navigate.push(`/shop/${product.id}`)}
                  className={`py-2.5 text-[10px] tracking-widest border 
                  transition-all border-black hover:bg-black hover:text-white hover:cursor-pointer rounded-sm`}
                >
                  VIEW ITEM
                </button>
              </Link>
            ))}
          </div>
        )}

        <div className="flex justify-center my-20 gap-3">
          <button
            className="cursor-pointer"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          >
            Previous
          </button>
          <div className="bg-[#d4d4d4] p-2 rounded-md flex items-center gap-3">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 font-medium rounded-md cursor-pointer ${
                  currentPage === index + 1
                    ? "bg-black text-white"
                    : "bg-[#EBEBEB] text-black"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <button
            className="cursor-pointer"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
