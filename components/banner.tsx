"use client";

import { useGetTenantInfo } from "@/api/queries/auth";
import Image from "next/image";
import React from "react";

const Banner = () => {
  const { data: tenantInfo } = useGetTenantInfo();
  return (
    <div className="relative w-[calc(100%-24px)] mx-auto h-[450px] sm:h-[500px] overflow-hidden rounded-xl my-3">
      {tenantInfo?.data?.banner ? (
        <Image
          src="/assets/images/banner.png"
          fill
          loading="eager"
          className="object-cover"
          alt="banner-image"
        />
      ) : (
        <div className="flex bg-gray-100 shadow h-full items-center justify-center">
          <p className="font-syne text-6xl font-semibold">
            {tenantInfo?.data.business_name}
          </p>
        </div>
      )}
    </div>
  );
};

export default Banner;
