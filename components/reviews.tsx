import React from "react";

const Reviews = () => {
  return (
    <div className="border flex-3 flex flex-col divide-y border-black/60 divide-black/30">
      <div className="p-5 bg-[#F1F1F1]">
        <h1 className="text-xl font-semibold">Reviews</h1>
        <p className="text-sm">Share your thoughts on items you’ve bought.</p>
      </div>
      <div className="flex items-center justify-center flex-col h-full space-y-7 my-24">
        <div className="flex items-center justify-center flex-col">
          <p className="text-xl font-semibold">No pending reviews yet.</p>
          <p>Keep exploring store</p>
        </div>

        <button className="bg-black text-white px-12 py-4 font-azeret font-medium cursor-pointer">
          Start Shopping
        </button>
      </div>
    </div>
  );
};

export default Reviews;
