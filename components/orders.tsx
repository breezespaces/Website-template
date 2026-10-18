"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useGetCustomerOrder } from "@/api/queries/orders";
import { Spinner } from "./ui/spinner";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

const Orders = () => {
  const [searchOrderId, setSearchOrderId] = useState("");
  const [activeOrderId, setActiveOrderId] = useState("");
  const [recentOrderIds, setRecentOrderIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("customer_orders");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecentOrderIds(parsed);
          setActiveOrderId(parsed[0]);
        }
      } catch {
        // Ignore parse error
      }
    }
  }, []);

  const {
    data: orderData,
    isLoading: isOrderLoading,
    isError: isOrderError,
    error: orderError,
  } = useGetCustomerOrder(activeOrderId);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchOrderId.trim()) {
      setActiveOrderId(searchOrderId.trim());
    }
  };

  return (
    <div className="border flex-3 flex flex-col divide-y border-black/60 divide-black/30 font-syne bg-white">
      <div className="p-5 bg-[#F1F1F1]">
        <h1 className="text-xl font-semibold">My Orders</h1>
        <p className="text-sm text-black/70">
          View your recent purchases and check order status.
        </p>
      </div>

      <div className="p-5 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search by Order ID (e.g., ORD-12345)..."
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
              className="pr-10 border-black/30 rounded-none focus:border-black text-sm"
            />
            <Search
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 text-sm font-semibold hover:bg-gray-800 transition cursor-pointer"
          >
            Track Order
          </button>
        </form>

        {recentOrderIds.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pt-2">
            <span className="text-xs font-semibold text-gray-500 shrink-0">
              Recent Orders:
            </span>
            {recentOrderIds.map((id) => (
              <button
                key={id}
                onClick={() => {
                  setActiveOrderId(id);
                  setSearchOrderId(id);
                }}
                className={`text-xs px-3 py-1 border transition cursor-pointer ${
                  activeOrderId === id
                    ? "border-black bg-black text-white"
                    : "border-gray-300 text-gray-700 hover:border-black"
                }`}
              >
                {id}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-6">
        {isOrderLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-500">
            <Spinner />
            <p className="text-sm font-medium">Fetching order details...</p>
          </div>
        ) : isOrderError ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3 text-center">
            <p className="text-red-500 font-semibold">
              {(orderError as any)?.response?.data?.message ||
                "Order not found"}
            </p>
            <p className="text-xs text-gray-500">
              Please double-check your Order ID and try again.
            </p>
          </div>
        ) : orderData ? (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-start gap-4 border-b border-gray-200 pb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Order #{orderData.order_id}
                </h2>
                <p className="text-xs text-gray-500">
                  Placed on {new Date(orderData.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold uppercase rounded-full">
                  {orderData.payment_status || "Paid"}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold uppercase rounded-full">
                  {orderData.order_status || "Processing"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="border border-gray-200 p-4 space-y-1">
                <span className="font-semibold text-gray-500 block mb-1">
                  Customer Details
                </span>
                <p className="font-medium text-gray-900">
                  {orderData.customer_name}
                </p>
                {orderData.sale_source && (
                  <p className="text-gray-500">Source: {orderData.sale_source}</p>
                )}
              </div>
              <div className="border border-gray-200 p-4 space-y-1">
                <span className="font-semibold text-gray-500 block mb-1">
                  Payment Summary
                </span>
                <div className="flex justify-between">
                  <span>Amount Due:</span>
                  <span className="font-bold">
                    ₦{Number(orderData.amount_due).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Amount Paid:</span>
                  <span className="font-bold text-green-700">
                    ₦{Number(orderData.amount_paid).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Order Items</h3>
              <div className="border border-gray-200 divide-y divide-gray-200">
                {orderData.line_items?.map((item) => (
                  <div
                    key={item.id || item.variant_sku}
                    className="p-4 flex justify-between items-center text-sm"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.product_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        SKU: {item.variant_sku} | Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ₦{Number(item.subtotal).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">
                        ₦{Number(item.unit_price).toLocaleString()} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center flex-col space-y-7 my-16">
            <div className="flex items-center justify-center flex-col text-center space-y-2">
              <p className="text-xl font-semibold">Your order history is empty</p>
              <p className="text-sm text-gray-500">
                You haven’t placed any orders yet. Start shopping to place your
                first order or use the search bar above to look up an order.
              </p>
            </div>

            <Link
              href="/"
              className="bg-black text-white px-12 py-4 font-medium cursor-pointer text-sm hover:bg-gray-800 transition"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
