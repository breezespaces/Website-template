"use client";

import { useGetTenantInfo } from "@/api/queries/auth";
import React from "react";

const AboutPage = () => {
  const { data: tenantInfo } = useGetTenantInfo();
  return (
    <div className="m-10 font-syne space-y-20">
      <div className="space-y-10 ">
        <h1 className="font-semibold text-5xl">About</h1>
        <p className="font-medium text-xl max-w-[30%]">
          {tenantInfo?.data?.about || "N/A"}
        </p>
      </div>

      <div className="space-y-7">
        <h2 className="font-medium text-xl max-w-[30%]">
          For inquiries, assistance or to request catalogue, reach out - we’re
          here for you
        </h2>
        <div className="flex gap-10">
          <div className="space-y-2">
            <h3 className="font-semibold text-xl">CUSTOMER SERVICE</h3>
            <p className="text-xl">
              {tenantInfo?.data?.business_phone_number || "N/A"}
            </p>
            <p className="text-xl font-syne">
              {tenantInfo?.data?.business_email || "N/A"}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-xl">OPENING & CLOSING HOURS</h3>
            <p className="text-xl">Monday to Friday: 9am - 5pm (GMT +1)</p>
            <p className="text-xl font-syne">Saturday: 10am - 6pm (GMT +1)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
