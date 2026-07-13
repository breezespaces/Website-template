"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import bagIcon from "@/assets/Empty bag.png";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { addToCart, clearCart, removeFromCart } from "@/store/cartSlice";
import { CartItem } from "@/store/cartSlice";
import paystackLogo from "@/assets/Paystack-CeruleanBlue-StackBlue-HL 2.png";
import { usePaystackApi } from "@/hooks/usePayment";
import { useRouter } from "next/navigation";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
}

const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
}) => {
  // const { makePayment, loading, error } = usePaystackApi();
  const makePayment = (args: any) => {};
  const [loading, error] = [true, null];
  const dispatch = useAppDispatch();
  const router = useRouter();
  const firstItem = useAppSelector((state) => state?.cart?.items?.[0]);
  const color = firstItem?.color || "";

  const [isCheckout, setIsCheckout] = useState(false);
  const [isDeliveryForm, setIsDeliveryForm] = useState(false);
  const [isPaymentForm, setIsPaymentForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "paystack" | null
  >(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [deliveryForm, setDeliveryForm] = useState({
    email: "",
    country: "",
    firstName: "",
    lastName: "",
    houseNumber: "",
    street: "",
    city: "",
    state: "",
    postcode: "",
    phone: "",
    selectedColor: color || "",
    place: "",
  });

  const SHIPPING = 5000;
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const requiredFields = [
      "email",
      "country",
      "firstName",
      "lastName",
      "houseNumber",
      "street",
      "city",
      "state",
      "phone",
    ] as const;

    requiredFields.forEach((field) => {
      if (!deliveryForm[field]?.trim()) {
        errors[field] =
          `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    if (deliveryForm.email && !/^\S+@\S+\.\S+$/.test(deliveryForm.email)) {
      errors.email = "Please enter a valid email address";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    router.prefetch("/payment-success");
    if (color) {
      setDeliveryForm((prevForm) => ({
        ...prevForm,
        selectedColor: color,
      }));
    }

    const saved = localStorage.getItem("deliveryDetails");
    if (saved) {
      setDeliveryForm(JSON.parse(saved));
    }
  }, [color, router]);

  if (!isOpen) return null;

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleCheckout = () => {
    setIsCheckout(true);
  };

  const handleBackToCart = () => {
    setIsCheckout(false);
    setIsDeliveryForm(false);
  };

  const handleContinueAsGuest = () => {
    setIsDeliveryForm(true);
  };

  const handleBackToCheckout = () => {
    setIsDeliveryForm(false);
  };

  const handleClose = () => {
    setIsCheckout(false);
    setIsDeliveryForm(false);
    setIsPaymentForm(false);
    onClose();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const updatedForm = {
      ...deliveryForm,
      [name]: value,
    };
    setDeliveryForm(updatedForm);
    localStorage.setItem("deliveryDetails", JSON.stringify(updatedForm));
  };

  const handleContinue = () => {
    if (validateForm()) {
      setIsPaymentForm(true);
    }
  };

  const generateWhatsAppMessage = () => {
    const itemsList = cartItems
      .map(
        (item) =>
          `${item.name} x${item.quantity} – ₦${(item.price * item.quantity).toLocaleString()}`,
      )
      .join("\n");

    const message = `Hi LFW,\nI want to place an order:\nItems:\n${itemsList}\nSubtotal – ₦${total.toLocaleString()}`;
    return encodeURIComponent(message);
  };

  const handleCheckoutViaChat = () => {
    const whatsappNumber = "2347087547858";
    const message = generateWhatsAppMessage();
    const url = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.location.href = url;
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="flex-1 bg-black/30"
        onClick={handleClose}
        aria-label="Close modal"
      />
      <div className="relative w-full max-w-sm h-full bg-white shadow-xl flex flex-col">
        <div className="px-6">
          {" "}
          {!isCheckout ? (
            <div className="flex justify-end items-center mt-14 mb-5">
              <h2 className="text-2xl font-bold text-center flex-1 relative top-5 ml-5">
                In your bag
              </h2>
              <button
                onClick={handleClose}
                className="text-black text-xs font-medium relative bottom-12"
              >
                Close
              </button>
            </div>
          ) : !isDeliveryForm ? (
            <div className="flex justify-between items-center mt-14 mb-5">
              <h2 className="text-xl font-bold text-center flex-1">
                CHECK OUT YOUR ORDER
              </h2>
            </div>
          ) : null}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {!isCheckout ? (
            cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Image
                  src={bagIcon}
                  alt="Empty bag"
                  width={60}
                  height={60}
                  className="mb-4 opacity-50"
                  priority
                />
                <p>Your bag is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.name}
                    className="border border-black p-4 relative bg-[#F8F8FA]"
                  >
                    <button
                      className="absolute top-2 right-2 text-black text-lg leading-none hover:bg-gray-100 w-6 h-6 flex items-center justify-center"
                      onClick={() => dispatch(removeFromCart(item))}
                    >
                      ×
                    </button>

                    <div className="text-center mb-4 flex flex-col m-auto w-fit">
                      <h3 className="font-medium text-sm mb-1">{item.name}</h3>
                      <p className="text-sm font-medium self-start">
                        ₦{item.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-end gap-3">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="object-contain"
                      />
                      <div className="flex items-center gap-2 text-xs bg-white px-3 py-1">
                        <span className="mr-1">Qty</span>
                        <button
                          className="px-1"
                          onClick={() => dispatch(removeFromCart(item))}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          disabled={item.quantity >= 3}
                          className="px-1"
                          onClick={() => dispatch(addToCart(item))}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : !isDeliveryForm ? (
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <h3 className="text-[1rem] font-medium mb-3">Order Summary</h3>
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.name} className="flex justify-between">
                      <span className="text-[1rem]">
                        {item.name} (x{item.quantity})
                      </span>
                      <span>
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 flex justify-between font-semibold border-gray-200">
                    <span className="text-[1rem]">Subtotal</span>
                    <span>₦{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : !isPaymentForm ? (
            <form
              ref={formRef}
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                if (isDeliveryForm) handleContinue();
              }}
            >
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={handleBackToCheckout}
                  className="text-sm text-black hover:text-gray-600"
                >
                  ← Back
                </button>
                <h2 className="text-lg font-semibold text-center flex-1">
                  Delivery
                </h2>
              </div>

              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold uppercase">
                  COMPLETE YOUR INFO
                </h1>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg mb-1">Contact</h3>
                  <span className="text-sm text-black">Required *</span>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  className={`w-full px-4 py-2 border ${formErrors.email ? "border-red-500" : "border-gray-300"} text-sm focus:outline-none focus:border-black`}
                  value={deliveryForm.email}
                  onChange={handleInputChange}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div>
                <h3 className="font-bold text-lg mb-2">Delivery</h3>
                <div className="space-y-4">
                  <div className="relative">
                    <select
                      id="country"
                      name="country"
                      className={`w-full p-4 border ${formErrors.country ? "border-red-500" : "border-gray-300"} text-sm appearance-none bg-white focus:outline-none focus:border-black`}
                      value={deliveryForm.country}
                      onChange={handleInputChange}
                    >
                      <option value="">Country/Region*</option>
                      <option value="nigeria">Nigeria</option>
                      <option value="united-states">United States</option>
                      <option value="united-kingdom">United Kingdom</option>
                      <option value="canada">Canada</option>
                    </select>
                    <div className="absolute right-4 top-4 pointer-events-none">
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                        <path
                          d="M1 1L6 6L11 1"
                          stroke="black"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    {formErrors.country && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.country}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="First Name*"
                        className={`px-4 py-2 border ${formErrors.firstName ? "border-red-500" : "border-gray-300"} text-sm focus:outline-none focus:border-black w-full`}
                        value={deliveryForm.firstName}
                        onChange={handleInputChange}
                      />
                      {formErrors.firstName && (
                        <p className="text-red-500 text-xs mt-1">
                          First name required
                        </p>
                      )}
                    </div>

                    <div className="flex-1">
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Last Name*"
                        className={`px-4 py-2 border ${formErrors.lastName ? "border-red-500" : "border-gray-300"} text-sm focus:outline-none focus:border-black w-full`}
                        value={deliveryForm.lastName}
                        onChange={handleInputChange}
                      />
                      {formErrors.lastName && (
                        <p className="text-red-500 text-xs mt-1">
                          Last name is required
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="relative">
                    <select
                      id="place"
                      name="place"
                      className="w-full py-2 px-4 border border-gray-300 text-sm appearance-none bg-white focus:outline-none focus:border-black"
                      value={deliveryForm.place}
                      onChange={handleInputChange}
                    >
                      <option value="">Address Type</option>
                      <option value="home">Home</option>
                      <option value="work">Work</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input
                        id="houseNumber"
                        name="houseNumber"
                        type="text"
                        placeholder="House Number*"
                        className={`px-4 py-2 border ${formErrors.houseNumber ? "border-red-500" : "border-gray-300"} text-sm focus:outline-none focus:border-black w-full`}
                        value={deliveryForm.houseNumber}
                        onChange={handleInputChange}
                      />
                      {formErrors.houseNumber && (
                        <p className="text-red-500 text-xs mt-1">
                          House number is required
                        </p>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        id="street"
                        name="street"
                        type="text"
                        placeholder="Street/apartment*"
                        className={`px-4 py-2 border ${formErrors.street ? "border-red-500" : "border-gray-300"} text-sm focus:outline-none focus:border-black w-full`}
                        value={deliveryForm.street}
                        onChange={handleInputChange}
                      />
                      {formErrors.street && (
                        <p className="text-red-500 text-xs mt-1">
                          Street is required
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input
                        id="city"
                        name="city"
                        type="text"
                        placeholder="City*"
                        className={`w-full px-4 py-2 border ${formErrors.city ? "border-red-500" : "border-gray-300"} text-sm focus:outline-none focus:border-black`}
                        value={deliveryForm.city}
                        onChange={handleInputChange}
                      />
                      {formErrors.city && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.city}
                        </p>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="w-full relative">
                        {deliveryForm.country === "nigeria" ? (
                          <select
                            className={`w-full px-4 py-2 border ${formErrors.state ? "border-red-500" : "border-gray-300"} text-sm appearance-none bg-white focus:outline-none focus:border-black`}
                            id="state"
                            name="state"
                            value={deliveryForm.state}
                            onChange={handleInputChange}
                          >
                            <option value="">State*</option>
                            <option value="lagos">Lagos</option>
                            <option value="fct">FCT</option>
                            <option value="niger">Niger</option>
                            <option value="oyo">Oyo</option>
                          </select>
                        ) : (
                          <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 text-sm bg-gray-100 focus:outline-none focus:border-black"
                            value={deliveryForm.state}
                            name="state"
                            onChange={handleInputChange}
                            placeholder="State/Province*"
                          />
                        )}
                      </div>
                      {formErrors.state && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.state}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-24">
                      <input
                        type="text"
                        placeholder="+234"
                        value={deliveryForm.country === "nigeria" ? "+234" : ""}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 text-sm text-center bg-gray-50 focus:outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Phone Number*"
                        className={`w-full px-4 py-2 border ${formErrors.phone ? "border-red-500" : "border-gray-300"} text-sm focus:outline-none focus:border-black`}
                        value={deliveryForm.phone}
                        onChange={handleInputChange}
                      />
                      {formErrors.phone && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-2 font-bold hover:bg-gray-800 transition-colors text-sm tracking-wide mt-6"
              >
                CONTINUE
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <h1 className="text-2xl font-bold uppercase mb-8 text-center">
                COMPLETE YOUR INFO
              </h1>
              <div className="w-full max-w-md mb-6">
                <h2 className="font-bold text-xl mb-3">Summary</h2>
                <div className="border border-black p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Subtotal</span>
                    <span className="font-bold text-sm">
                      ₦{total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Shipping</span>
                    <span className="font-bold text-sm">
                      ₦{SHIPPING.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total</span>
                    <span className="font-bold text-sm">
                      ₦{(total + SHIPPING).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full max-w-md mb-6">
                <h2 className="font-bold text-xl mb-3">Payment</h2>
                <div className="border border-black rounded overflow-hidden">
                  <label className="flex items-center justify-between px-4 py-3 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "paystack"}
                        onChange={() => setPaymentMethod("paystack")}
                        className="accent-black"
                      />
                      <span className="text-sm">Paystack</span>
                    </div>
                    <Image
                      src={paystackLogo}
                      alt="Paystack"
                      width={80}
                      height={24}
                    />
                  </label>
                </div>
              </div>
              <p className="text-center text-xs text-black mb-8">
                Clicking &quot;Complete order&quot; will securely launch
                Paystack to complete your transaction.
              </p>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-4">
            {!isCheckout ? (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full bg-black text-white py-2 font-bold hover:bg-gray-800 transition-colors text-sm tracking-wide"
                >
                  CHECKOUT
                </button>
                <button
                  type="button"
                  onClick={handleCheckoutViaChat}
                  className="w-full bg-white text-black border border-black py-2 font-bold hover:bg-gray-100 transition-colors text-sm tracking-wide"
                >
                  CHECKOUT VIA CHAT
                </button>
              </div>
            ) : !isDeliveryForm ? (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleBackToCart}
                  className="w-full border text-black py-3 font-bold hover:bg-gray-200 transition-colors text-sm tracking-wide"
                >
                  BACK TO CART
                </button>
                <button
                  type="button"
                  onClick={handleContinueAsGuest}
                  className="w-full bg-black text-white py-3 font-bold hover:bg-gray-800 transition-colors text-sm tracking-wide"
                >
                  CONTINUE AS A GUEST
                </button>
              </div>
            ) : !isPaymentForm ? null : (
              <>
                {error && (
                  <p className="text-red-500 text-center text-sm mb-2">
                    {error}
                  </p>
                )}
                <button
                  className={`w-full bg-black text-white py-3 font-bold transition-colors text-sm tracking-wide ${
                    !paymentMethod || loading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-800"
                  }`}
                  disabled={!paymentMethod || loading}
                  onClick={
                    paymentMethod === "paystack"
                      ? async () => {
                          await makePayment({
                            email: deliveryForm.email,
                            amount: total + SHIPPING,
                            order: {
                              items: cartItems,
                              total: total + SHIPPING,
                              deliveryDetails: deliveryForm,
                            },
                            onSuccess: () => {
                              const orderData = {
                                items: cartItems,
                                total: total + SHIPPING,
                                deliveryDetails: deliveryForm,
                                timestamp: new Date().toISOString(),
                              };
                              localStorage.setItem(
                                "lfw_order",
                                JSON.stringify(orderData),
                              );
                              handleClose();
                              dispatch(clearCart());
                            },
                          });
                        }
                      : undefined
                  }
                >
                  {loading ? "PROCESSING..." : "COMPLETE ORDER"}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
