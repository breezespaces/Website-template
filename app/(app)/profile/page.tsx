"use client";

import HomeNavBar from "@/components/NavBar";
import Orders from "@/components/orders";
import ProfileSettings from "@/components/profile-settings";
import Reviews from "@/components/reviews";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function Profile() {
  const tabs = [
    { label: "settings", title: "Profile Settings" },
    { label: "orders", title: "My Orders" },
    { label: "reviews", title: "Reviews" },
  ];
  type Tabs = "settings" | "orders" | "reviews";
  const [activeTab, setActiveTab] = useState<Tabs>("settings");
  return (
    <div className="bg-white ">
      <HomeNavBar />
      <div className="m-10 font-syne space-y-20">
        <h1 className="font-semibold text-3xl">My Account</h1>

        <div className="flex gap-5 items-start mr-20">
          <div className="border divide-y flex-1 border-black/60 divide-black/30">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label as Tabs)}
                className={cn(
                  "block w-full text-left p-5 text-xl font-semibold hover:bg-[#F1F1F1] cursor-pointer",
                  {
                    "bg-[#F1F1F1]": tab.label === activeTab,
                  },
                )}
              >
                {tab.title}
              </button>
            ))}
            <div className="p-5 text-xl font-semibold">
              <button className="text-[#DE1717] cursor-pointer border py-1 px-5 border-black">
                Logout
              </button>
            </div>
          </div>

          {activeTab === "settings" && <ProfileSettings />}
          {activeTab === "orders" && <Orders />}
          {activeTab === "reviews" && <Reviews />}
        </div>
      </div>
    </div>
  );
}
