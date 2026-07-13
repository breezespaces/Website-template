"use client";

import { FaInstagram, FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Link from "next/link";
import { useGetTenantInfo } from "@/api/queries/auth";

export default function Footer() {
  const { data: tenantInfo } = useGetTenantInfo();
  return (
    <footer className="bg-[#2E2E2E] text-white md:py-16 md:px-8">
      <div className="md:hidden">
          <div className="mb-10 flex flex-col gap-10 py-12 px-6">
          <div className="space-y-[3px] font-azeret">
            <h3 className="text-lg font-medium">CUSTOMER CARE</h3>
            <p className="text-sm">
              {tenantInfo?.data?.business_email || "N/A"}
            </p>
            <p className="text-sm">
              {tenantInfo?.data?.business_phone_number || "N/A"}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className=" font-medium text-xl font-azeret">Follow Us</h3>
            <div className="flex gap-4 justify-start">
              <Link
                href={tenantInfo?.data?.instagram_handle || "#"}
                target="_blank"
              >
                <FaInstagram className="text-xl" />
              </Link>
              <Link
                href={tenantInfo?.data?.tiktok_handle || "#"}
                target="_blank"
              >
                <FaTiktok className="text-xl" />
              </Link>
              <Link href={tenantInfo?.data?.x_handle || "#"} target="_blank">
                <FaXTwitter className="text-xl" />
              </Link>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center border border-white rounded-md">
          <p className="p-5">
            Powered by{" "}
            <span className="text-xl hover:underline">
              <Link
                href="https://www.breezespaces.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Breezespaces
              </Link>
            </span>{" "}
          </p>
        </div>
      </div>

      <div className="hidden md:block">
        <div className="flex justify-between items-center px-20">
          <div className="mb-10 flex flex-col gap-10">
            <div className="space-y-[3px] font-azeret">
              <h3 className="text-lg font-medium">CONTACT US</h3>
              <p className="text-sm">
                {tenantInfo?.data?.business_email || "N/A"}
              </p>
              <p className="text-sm">
                {tenantInfo?.data?.business_phone_number || "N/A"}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className=" font-medium text-xl font-azeret">Follow Us</h3>
              <div className="flex gap-4 justify-start">
                <Link
                  href={tenantInfo?.data?.instagram_handle || "#"}
                  target="_blank"
                >
                  <FaInstagram className="text-xl" />
                </Link>
                <Link
                  href={tenantInfo?.data?.tiktok_handle || "#"}
                  target="_blank"
                >
                  <FaTiktok className="text-xl" />
                </Link>
                <Link href={tenantInfo?.data?.x_handle || "#"}>
                  <FaXTwitter className="text-xl" />
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text- font-medium">
              RECEIVE DISCOUNT AND NEWSLETTER{" "}
            </h3>
            <input
              placeholder="ENTER YOUR PHONE NUMBER OR EMAIL"
              className="w-full bg-[#424242] rounded-md px-4 py-2 text-sm"
            />
            <button className="bg-white text-black py-2 px-6 rounded-md text-sm cursor-pointer">
              Subscribe
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <p className="bg-[#423d32] p-5 rounded-xl w-max">
            Powered by{" "}
            <span className="text-xl hover:underline">
              <Link
                href="https://www.breezespaces.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Breezespaces
              </Link>
            </span>{" "}
          </p>
        </div>
      </div>
    </footer>
  );
}
