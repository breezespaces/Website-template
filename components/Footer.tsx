"use client"

import Image from "next/image";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import patOhnerLogo from '@/assets/Logo refined.png'
import Link from "next/link";
import axios from "axios";
import { useState } from "react";

export default function Footer() {
  return (
    <footer className="bg-[#000000] text-white py-12 sm:py-16 px-6 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Add this section above the Top Section */}
        <div className="mb-10 flex flex-col sm:flex-row sm:justify-start sm:items-center md:absolute">
          {/* CONNECT */}
            <div className="space-y-[-3px]">
              <h3 className="font-syne font-semibold text-sm">CONTACT US</h3>
              <p className="font-syne text-sm">
                Abelfeliciaogechi@gmail.com
              </p>
              <p className="font-syne text-sm">
                +234 7087547858
              </p>
            </div>
        </div>

        {/* Top Section */}
        <div className="flex flex-col sm:flex-row sm:justify-evenly sm:gap-[470px] items-start mb-12 sm:mb-20 gap-10">
          <div className="hidden sm:block"></div>
          <div className="space-y-8">
            {/* FOLLOW US */}
            <div className="space-y-2">
              <h3 className="font-syne font-semibold text-sm">FOLLOW US</h3>
              <div className="flex gap-4 justify-start">
                <Link
                  href="https://www.instagram.com/lheesfashionworld?igsh=bDZoeDhkYnVzMjV5/"
                  target="_blank"
                >
                  <FaInstagram className="text-xl" />
                </Link>
                <Link href="https://www.tiktok.com/@lheesfashionworld?_r=1&_t=ZS-94glsgtJ7Hs" target="_blank">
                  <FaTiktok className="text-xl" />
                </Link>
                <Link href="https://x.com/leesfashion_?s=21" target="_blank">
                  <FaXTwitter className="text-xl" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-center  items-center text-xs sm:text-sm gap-x-10">
          <p className="font-syne text-center sm:text-left">
             Powered by {" "} <span className="text-xl hover:bg-sky-500"><Link href="https://www.breezespaces.com/" target="_blank" rel="noopener noreferrer">
             Breezespaces</Link></span> ©2026. - All Rights Reserved.
          </p>
          <Link href="/terms" className="font-syne">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
