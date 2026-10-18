"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import emailjs from "@emailjs/browser";
import Link from "next/link";
import { useGetCheckoutCallback } from "@/api/queries/cart";
import { Spinner } from "@/components/ui/spinner";

const emailJsPublicKey = process.env.NEXT_PUBLIC_EMAIL_JS_PUBLIC_KEY;
const serviceId = process.env.NEXT_PUBLIC_SERVICE_ID;
const adminTemplateId = process.env.NEXT_PUBLIC_ADMIN_TEMPLATE_ID;
const clientTemplateId = process.env.NEXT_PUBLIC_CLIENT_TEMPLATE_ID;

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") || "";

  const { data: verifiedOrder, isLoading: isVerifying } =
    useGetCheckoutCallback(reference);

  useEffect(() => {
    if (!emailJsPublicKey || !serviceId || !adminTemplateId || !clientTemplateId) {
      return;
    }

    try {
      emailjs.init(emailJsPublicKey);
    } catch {
      // Ignore init errors
    }

    const storedOrderRaw = localStorage.getItem("lfw_order");
    if (!storedOrderRaw) return;

    let order: any;
    try {
      order = JSON.parse(storedOrderRaw);
    } catch {
      return;
    }

    const orderId = verifiedOrder?.order_id || order.order_id || `ORD-${Date.now()}`;
    const itemsList =
      verifiedOrder?.line_items
        ?.map((i) => `${i.product_name} x${i.quantity}`)
        .join(", ") ||
      order.items
        ?.map(
          (item: any) =>
            `${item.name || "Unknown"} (${item.color || "N/A"} / ${item.size || "N/A"}) x${item.quantity || 1}`,
        )
        .join(", ") ||
      "No items found";

    const fullAddress =
      [
        order.deliveryDetails?.houseNumber,
        order.deliveryDetails?.street,
        order.deliveryDetails?.city,
        order.deliveryDetails?.state,
        order.deliveryDetails?.postcode,
        order.deliveryDetails?.country,
      ]
        .filter(Boolean)
        .join(", ") || "No address";

    emailjs
      .send(
        serviceId,
        adminTemplateId,
        {
          order_id: orderId,
          reference: reference || "N/A",
          customer_name:
            verifiedOrder?.customer_name ||
            `${order.deliveryDetails?.firstName || ""} ${order.deliveryDetails?.lastName || ""}`.trim() ||
            "Customer",
          email: order.deliveryDetails?.email || "no-email@provided.com",
          phone: order.deliveryDetails?.phone || "N/A",
          address: fullAddress,
          items: itemsList,
          total: `₦${verifiedOrder?.amount_paid || order.total || "0"}`,
        },
        emailJsPublicKey,
      )
      .then(() => {
        try {
          emailjs.send(
            serviceId,
            clientTemplateId,
            {
              order_id: orderId,
              customer_name:
                verifiedOrder?.customer_name ||
                order.deliveryDetails?.firstName ||
                "Customer",
              email: order.deliveryDetails?.email,
              items: itemsList,
              total: `₦${verifiedOrder?.amount_paid || order.total}`,
              address: fullAddress,
            },
            emailJsPublicKey,
          );
        } catch {
          // Ignore secondary email error
        }
        localStorage.removeItem("lfw_order");
      })
      .catch(() => {
        // Ignore email sending failure
      });
  }, [searchParams, verifiedOrder, reference]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6 py-12">
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-lg w-full text-center font-syne">
        <div className="flex justify-center mb-4">
          <svg
            className="w-16 h-16 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2l4-4m6 2a9 9 0 1 1-18 0a9 9 0 0 1 18 0z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Payment Successful 🎉
        </h1>
        <p className="text-gray-600 mb-6 text-sm">
          Thank you for your purchase. Your order has been placed and verified.
        </p>

        {isVerifying ? (
          <div className="flex items-center justify-center gap-2 py-4 text-sm text-gray-500">
            <Spinner /> Verifying order status with server...
          </div>
        ) : verifiedOrder ? (
          <div className="bg-[#F8F8FA] border border-gray-200 p-4 rounded-lg text-left text-xs mb-6 space-y-2">
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-gray-500">Order ID:</span>
              <span className="font-mono font-bold text-gray-900">
                {verifiedOrder.order_id}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-gray-500">Customer:</span>
              <span className="text-gray-900">{verifiedOrder.customer_name}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-gray-500">Amount Paid:</span>
              <span className="font-bold text-gray-900">
                ₦{Number(verifiedOrder.amount_paid).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-gray-500">Payment Status:</span>
              <span className="uppercase font-semibold text-green-600">
                {verifiedOrder.payment_status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-500">Order Status:</span>
              <span className="uppercase font-semibold text-blue-600">
                {verifiedOrder.order_status}
              </span>
            </div>
          </div>
        ) : null}

        <Link
          href="/"
          className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition font-medium text-sm"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}