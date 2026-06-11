// components/TermsOfUse.tsx
import PageNavBar from "@/components/PageNavBar";
import React from "react";

const TermsOfUse: React.FC = () => {
  return (
    <>
      <PageNavBar />
      {/* The main container is modified to have a smaller horizontal padding on mobile.
        The max-w-4xl and mx-auto ensure it stays centered on desktop.
      */}
      <div className="max-w-4xl mx-auto px-12 sm:px-6 py-12 text-black font-syne mb-20">
        {/*
          The heading has a smaller top margin on mobile,
          and the mb-24 is kept for desktop screens.
        */}
        <h1 className="text-lg font-bold mb-12 sm:mb-24 tracking-wide uppercase">
          TERMS OF USE
        </h1>

        {/* The body text font size is adjusted for mobile, making it easier to read.
          The space-y-6 is a good choice for consistent spacing.
        */}
        <div className="space-y-6 text-xs sm:text-sm leading-relaxed">
          <p>Lheesfashionworld.com</p>

          <p className="leading-4">
            By accessing or using Lheesfashionworld.com (the “Site”), you agree to the following Terms and Conditions.
            These govern your use of the Site and any services, content, or products offered through it.
            Please read carefully.
          </p>

          {/* 1. Personal Data & Privacy Policy */}
          <div>
            <p className="font-semibold">
              If it's custom, it takes from 1 week to be ready
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsOfUse;