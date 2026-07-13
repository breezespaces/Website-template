"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import emailjs from "@emailjs/browser";
import Link from "next/link";

const emailJsPublicKey = process.env.NEXT_PUBLIC_EMAIL_JS_PUBLIC_KEY;
const serviceId = process.env.NEXT_PUBLIC_SERVICE_ID;
const adminTemplateId = process.env.NEXT_PUBLIC_ADMIN_TEMPLATE_ID;
const clientTemplateId = process.env.NEXT_PUBLIC_CLIENT_TEMPLATE_ID;

export default function PaymentSuccess() {
  const searchParams = useSearchParams();

  const generateOrderId = () => {
    const random = Math.floor(10000 + Math.random() * 90000);
    return `LFW-${random}`;
  };

  useEffect(() => {
    if (!emailJsPublicKey || !serviceId || !adminTemplateId || !clientTemplateId) {
      return;
    }
  
    try {
      emailjs.init(emailJsPublicKey);
    } catch {
    }

    const reference = searchParams.get("reference");

    const storedOrderRaw = localStorage.getItem("lfw_order");

    if (!storedOrderRaw) {
      return;
    }

    let order;
    try {
      order = JSON.parse(storedOrderRaw);
    } catch {
      return;
    }

    const orderId = generateOrderId();

    const itemsList = order.items?.map?.((item: any) =>
      `${item.name || 'Unknown'} (${item.color || 'N/A'} / ${item.size || 'N/A'}) x${item.quantity || 1}`
    ).join(", ") || "No items found";

    const fullAddress = [
      order.deliveryDetails?.houseNumber,
      order.deliveryDetails?.street,
      order.deliveryDetails?.city,
      order.deliveryDetails?.state,
      order.deliveryDetails?.postcode,
      order.deliveryDetails?.country,
    ].filter(Boolean).join(", ") || "No address";

    emailjs
      .send(
        serviceId,
        adminTemplateId,
        {
          order_id: orderId,
          reference: reference || "N/A",
          customer_name: `${order.deliveryDetails?.firstName || ''} ${order.deliveryDetails?.lastName || ''}`.trim() || "Customer",
          email: order.deliveryDetails?.email || "no-email@provided.com",
          phone: order.deliveryDetails?.phone || "N/A",
          address: fullAddress,
          items: itemsList,
          total: `₦${order.total || '0'}`,
        },
        emailJsPublicKey
      )
      .then((response) => {
        try {
          emailjs.send(
            serviceId,
            clientTemplateId,
            {
              order_id: orderId,
              customer_name: `${order.deliveryDetails?.firstName}`,
              email: order.deliveryDetails?.email,
              items: itemsList,
              total: `₦${order.total}`,
              address: fullAddress,
            },
            emailJsPublicKey
          );
        } catch (err) {
        }
        localStorage.removeItem("lfw_order");
      })
      .catch(() => {
      });
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-md w-full text-center">
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
          Success 🎉
        </h1>
        <p className="text-gray-600 mb-6">
          Your order has been received. <br /> Confirmation email is on the way!
        </p>
        <Link
          href="/"
          className="inline-block bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}