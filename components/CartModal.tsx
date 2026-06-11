"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import bagIcon from "@/assets/Empty bag.png";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { addToCart, clearCart, removeFromCart } from "@/store/cartSlice";
import { CartItem } from "@/store/cartSlice";
import paystackLogo from "@/assets/Paystack-CeruleanBlue-StackBlue-HL 2.png";
import { usePaystackApi } from "@/hooks/usePayment";
import emailjs from "@emailjs/browser";
import { useRouter } from "next/navigation"

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
  const { makePayment, loading, error } = usePaystackApi();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { color = '', price = 0 } = useAppSelector((state) => state?.cart?.items?.[0] || {});
  // console.log(price)
  // console.log("Selected color in CartModal:", color);
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
    place: ""
    // selectedSize: size || "",
  });

  const SHIPPING = 5000;
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const requiredFields = [
      'email', 'country', 'firstName', 'lastName',
      'houseNumber', 'street', 'city', 'state', 'phone'
    ] as const;
    
    requiredFields.forEach(field => {
      if (!deliveryForm[field]?.trim()) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });
    
    // Email validation
    if (deliveryForm.email && !/^\S+@\S+\.\S+$/.test(deliveryForm.email)) {
      errors.email = 'Please enter a valid email address';
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
  }, [color]);

  if (!isOpen) return null;

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
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
    setIsPaymentForm(false); // Reset payment form state on close
    onClose();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

  // const handlePaystackSuccess = () => {
  
  // };

  const generateWhatsAppMessage = () => {
    const itemsList = cartItems
      .map((item) => `${item.name} x${item.quantity} – ₦${(item.price * item.quantity).toLocaleString()}`)
      .join("\n");
    
    const message = `Hi LFW,\nI want to place an order:\nItems:\n${itemsList}\nSubtotal – ₦${total.toLocaleString()}`;
    return encodeURIComponent(message);
  };

  const handleCheckoutViaChat = () => {
    const whatsappNumber = "2347087547858"; // Replace with your WhatsApp number
    const message = generateWhatsAppMessage();
    const url = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.location.href = url;
  };

  return (
    <div className="fixed inset-0 z-50 flex font-syne">
      <div
        className="flex-1 bg-black/30"
        onClick={handleClose}
        aria-label="Close modal"
      />
      <div
        className={`relative ${
          isDeliveryForm ? "w-full max-w-sm" : "w-full max-w-sm"
        } h-full bg-white shadow-xl flex flex-col`}
      >
        {/* Header */}
        <div className="px-6 ">
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

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {!isCheckout ? (
            // Cart Items View
            cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Image
                  src={bagIcon}
                  alt="Empty bag"
                  width={60}
                  height={60}
                  className="mb-4 opacity-50"
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
                    {/* Close button in top right */}
                    <button
                      className="absolute top-2 right-2 text-black text-lg leading-none hover:bg-gray-100 w-6 h-6 flex items-center justify-center"
                      onClick={() => dispatch(removeFromCart(item))}
                    >
                      ×
                    </button>

                    {/* Product name and price centered at top */}
                    <div className="text-center mb-4 flex flex-col m-auto w-fit">
                      <h3 className="font-medium text-sm mb-1">{item.name}</h3>
                      <p className="text-sm font-medium self-start">₦{item.price}</p>
                    </div>

                    {/* Product image and quantity selector */}
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
            // Checkout View
            <div className="flex flex-col h-full">
              {/* Order Summary */}
              <div className="mb-4">
                <h3 className="text-[1rem] font-medium mb-3">Order Summary</h3>
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.name} className="flex justify-between">
                      <span className="text-[1rem]">
                        {item.name} (x{item.quantity})
                      </span>
                      <span>₦{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="pt-2 flex justify-between font-semibold border-gray-200">
                    <span className="text-[1rem]">Subtotal</span>
                    <span>₦{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : // Delivery Form View
          !isPaymentForm ? (
            <form
              ref={formRef}
              className="space-y-6"
              onSubmit={e => {
                e.preventDefault();
                if (isDeliveryForm) handleContinue();
              }}
            >
              {/* Top Bar with light blue line */}
              {/* <div className="border-t-2 border-blue-300 pt-4"> */}
              <div className="flex items-center ">
                <button
                  onClick={handleBackToCheckout}
                  className="text-sm text-black hover:text-gray-600"
                >
                  ← Back
                </button>
                <h2 className="text-lg font-semibold text-center flex-1">
                  Delivery
                </h2>
              </div>
              {/* </div> */}

              {/* Main Title */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold uppercase">
                  COMPLETE YOUR INFO
                </h1>
              </div>

              {/* Contact Section */}
              <div className="mb-6">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg mb-1">Contact</h3>
                  <span className="text-sm text-black">Required *</span>
                </div>
                <input
                  id='email'
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} text-sm focus:outline-none focus:border-black"
                  value={deliveryForm.email}
                  onChange={handleInputChange}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                )}
              </div>

              {/* Delivery Section */}
              <div>
                <h3 className="font-bold text-lg mb-2">Delivery</h3>
                <div className="space-y-4">
                  {/* Country/Region */}
                  <div className="relative">
                    <select
                      id="country"
                      name="country"
                      className="w-full p-4 border ${formErrors.country ? 'border-red-500' : 'border-gray-300'} text-sm appearance-none bg-white focus:outline-none focus:border-black"
                      value={deliveryForm.country}
                      onChange={handleInputChange}
                    >
                      <option value="">Country/Region*</option>
                      <option value="nigeria">Nigeria</option>
                      <option value="united-states">United States</option>
                      <option value="united-kingdom">United Kingdom</option>
                      <option value="canada">Canada</option>
                      <option value="australia">Australia</option>
                      <option value="germany">Germany</option>
                      <option value="france">France</option>
                      <option value="italy">Italy</option>
                      <option value="spain">Spain</option>
                      <option value="netherlands">Netherlands</option>
                      <option value="belgium">Belgium</option>
                      <option value="switzerland">Switzerland</option>
                      <option value="sweden">Sweden</option>
                      <option value="norway">Norway</option>
                      <option value="denmark">Denmark</option>
                      <option value="finland">Finland</option>
                      <option value="south-africa">South Africa</option>
                      <option value="egypt">Egypt</option>
                      <option value="ghana">Ghana</option>
                      <option value="kenya">Kenya</option>
                      <option value="brazil">Brazil</option>
                      <option value="mexico">Mexico</option>
                      <option value="zimbabwe">Zimbabwe</option>
                      <option value="cameroon">Cameroon</option>
                      <option value="morocco">Morocco</option>
                      <option value="belgium">Belgium</option>
                      <option value="philippines">Philippines</option>
                      <option value="poland">Poland</option>
                      <option value="malaysia">Malaysia</option>
                      <option value="thailand">Thailand</option>
                      <option value="ukraine">Ukraine</option>
                      <option value="turkey">Turkey</option>
                      <option value="ireland">Ireland</option>
                      <option value="romania">Romania</option>
                      <option value="austria">Austria</option>
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
                      <p className="text-red-500 text-xs mt-1">{formErrors.country}</p>
                    )}
                  </div>

                  {/* First Name and Last Name */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="First Name*"
                        className="flex-1 px-4 py-2 border ${formErrors.firstName ? 'border-red-500' : 'border-gray-300'} text-sm focus:outline-none focus:border-black w-full"
                        value={deliveryForm.firstName}
                        onChange={handleInputChange}
                      />
                      {formErrors.firstName && (
                        <p className="text-red-500 text-xs mt-1">{'First name required'}</p>
                      )}
                    </div>

                    <div className="flex-1">
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Last Name*"
                        className="flex-1 px-4 py-2 border ${formErrors.lastName ? 'border-red-500' : 'border-gray-300'} text-sm focus:outline-none focus:border-black w-full"
                        value={deliveryForm.lastName}
                        onChange={handleInputChange}
                      />
                      {formErrors.lastName && (
                        <p className="text-red-500 text-xs mt-1">{'Last name is required'}</p>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="relative">
                    <select
                      id="place"
                      name="place"
                      className="w-full py-2 px-4 border border-gray-300 text-sm appearance-none bg-white focus:outline-none focus:border-black"
                      value={deliveryForm.place}
                      onChange={handleInputChange}
                    >
                      <option value="">Address</option>
                      <option value="home">Home</option>
                      <option value="work">Work</option>
                      <option value="other">Other</option>
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
                  </div>

                  {/* House Number and Street/Apartment */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input
                        id="houseNumber"
                        name="houseNumber"
                        type="text"
                        placeholder="House Number"
                        className="flex-1 px-4 py-2 border border-gray-300 text-sm focus:outline-none focus:border-black w-full"
                        value={deliveryForm.houseNumber}
                        onChange={handleInputChange}
                      />
                      {formErrors.houseNumber && (
                        <p className="text-red-500 text-xs mt-1">{'House number is required'}</p>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        id="street"
                        name="street"
                        type="text"
                        placeholder="Street/apartment"
                        className="flex-1 px-4 py-2 border ${formErrors.street ? 'border-red-500' : 'border-gray-300'} text-sm focus:outline-none focus:border-black w-full"
                        value={deliveryForm.street}
                        onChange={handleInputChange}
                      />
                      {formErrors.street && (
                        <p className="text-red-500 text-xs mt-1">{'Street is required'}</p>
                      )}
                    </div>
                  </div>

                  {/* City, State, and Postcode */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input
                        id="city"
                        name="city"
                        type="text"
                        placeholder="City*"
                        className="w-full px-4 py-2 border ${formErrors.city ? 'border-red-500' : 'border-gray-300'} text-sm focus:outline-none focus:border-black"
                        value={deliveryForm.city}
                        onChange={handleInputChange}
                      />
                      {formErrors.city && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="w-full relative">
                        {deliveryForm.country === 'nigeria' ? (
                                <select
                                  className="w-full px-4 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} text-sm appearance-none bg-white focus:outline-none focus:border-black"
                                  id="state"
                                  name="state"
                                  value={deliveryForm.state}
                                  onChange={handleInputChange}
                                >
                                  <option value="">State*</option>
                                  <option value="abia">Abia</option>
                                  <option value="adamawa">Adamawa</option>
                                  <option value="akwa-ibom">Akwa Ibom</option>
                                  <option value="anambra">Anambra</option>
                                  <option value="bauchi">Bauchi</option>
                                  <option value="bayelsa">Bayelsa</option>
                                  <option value="benue">Benue</option>
                                  <option value="borno">Borno</option>
                                  <option value="cross-river">Cross River</option>
                                  <option value="delta">Delta</option>
                                  <option value="ebonyi">Ebonyi</option>
                                  <option value="edo">Edo</option>
                                  <option value="ekiti">Ekiti</option>
                                  <option value="enugu">Enugu</option>
                                  <option value="gombe">Gombe</option>
                                  <option value="imo">Imo</option>
                                  <option value="jigawa">Jigawa</option>
                                  <option value="kaduna">Kaduna</option>
                                  <option value="kano">Kano</option>
                                  <option value="katsina">Katsina</option>
                                  <option value="kebbi">Kebbi</option>
                                  <option value="kogi">Kogi</option>
                                  <option value="kwara">Kwara</option>
                                  <option value="lagos">Lagos</option>
                                  <option value="nasarawa">Nasarawa</option>
                                  <option value="niger">Niger</option>
                                  <option value="ogun">Ogun</option>
                                  <option value="ondo">Ondo</option>
                                  <option value="osun">Osun</option>
                                  <option value="oyo">Oyo</option>
                                  <option value="plateau">Plateau</option>
                                  <option value="rivers">Rivers</option>
                                  <option value="sokoto">Sokoto</option>
                                  <option value="taraba">Taraba</option>
                                  <option value="yobe">Yobe</option>
                                  <option value="zamfara">Zamfara</option>
                                  <option value="fct">FCT</option>
                                </select>
                              ) : (
                                <input
                                  type="text"
                                  className="w-full px-4 py-2 border border-gray-300 text-sm bg-gray-100 focus:outline-none focus:border-black"
                                  value=""
                                  readOnly
                                  placeholder="Select states"
                                />
                              )}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg
                            width="12"
                            height="8"
                            viewBox="0 0 12 8"
                            fill="none"
                          >
                            <path
                              d="M1 1L6 6L11 1"
                              stroke="black"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                      {formErrors.state && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        id="postcode"
                        name="postcode"
                        type="text"
                        placeholder="Postcode"
                        className="w-full px-4 py-2 border border-gray-300 text-sm focus:outline-none focus:border-black"
                        value={deliveryForm.postcode}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="+234"
                        value="+234"
                        readOnly
                        className="w-24 px-4 py-2 border border-gray-300 text-sm text-center focus:outline-none focus:border-black"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Phone Number*"
                        className="flex-1 px-4 py-2 border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} text-sm focus:outline-none focus:border-black"
                        value={deliveryForm.phone}
                        onChange={handleInputChange}
                      />
                      {formErrors.phone && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                      )}
                    </div>
                    
                  </div>
                </div>
              </div>

              {/* Opt-in Checkbox */}
              <div className="flex items-center gap-3 pt-4">
                <input
                  type="checkbox"
                  id="email-offers"
                  className="w-5 h-5 border border-gray-300 rounded focus:outline-none focus:border-black"
                />
                <label htmlFor="email-offers" className="text-sm text-black">
                  Email me with offers and promo
                </label>
              </div>

              {/* Hidden fields for color and size */}
              <input
                type="hidden"
                name="selectedColor"
                value={deliveryForm.selectedColor || ""}
              />
              {/* <input
                type="hidden"
                name="selectedSize"
                value={deliveryForm.selectedSize || ""}
              /> */}

              <button
                type="submit"
                disabled={!isDeliveryForm}
                className={`w-full bg-black text-white py-2 font-bold transition-colors text-sm tracking-wide mt-6 ${
                  !isDeliveryForm ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"
                }`}
              >
                CONTINUE
              </button>
            </form>
          ) : (
            // Payment Form View
            <div className="flex flex-col items-center justify-center py-8">
              <h1 className="text-2xl font-bold uppercase mb-8 text-center">
                COMPLETE YOUR INFO
              </h1>
              {/* Summary */}
              <div className="w-full max-w-md mb-6">
                <h2 className="font-bold text-xl mb-3">Summary</h2>
                <div className="border border-black p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Subtotal</span>
                    <span className="font-bold text-sm">₦{total}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Shipping</span>
                    <span className="font-bold text-sm">₦{SHIPPING}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total</span>
                    <span className="font-bold text-sm">₦{total + SHIPPING}</span>
                  </div>
                </div>
              </div>
              {/* Payment */}
              <div className="w-full max-w-md mb-6">
                <h2 className="font-bold text-xl mb-3">Payment</h2>
                <div className="border border-black rounded overflow-hidden">
                  {/* Card Option */}
                  {/* <label className="flex items-center justify-between px-4 py-3 border-b border-gray-300 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "card"}
                          onChange={() => setPaymentMethod("card")}
                          className="accent-black"
                        />
                        <span className="text-sm">Credit/debit card</span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Image src={visaLogo} alt="Visa" width={40} height={24} />
                        <Image src={mastercardLogo} alt="Mastercard" width={40} height={24} />
                      </div>
                    </label> */}
                  {/* Paystack Option */}
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
                {/* Card Form - Only show if card is selected */}
                {paymentMethod === "card" && (
                  <div className="border border-gray-300 rounded p-4 mt-4">
                    <input
                      type="text"
                      placeholder="Card Name*"
                      className="w-full px-4 py-2 border border-gray-300 text-sm mb-2"
                    />
                    <input
                      type="text"
                      placeholder="2345 2345 5678 6789"
                      className="w-full px-4 py-2 border border-gray-300 text-sm mb-2"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="(MM/YY)"
                        className="w-1/2 px-4 py-2 border border-gray-300 text-sm mb-2"
                      />
                      <input
                        type="text"
                        placeholder="Security code* (CVV)"
                        className="w-1/2 px-4 py-2 border border-gray-300 text-sm mb-2"
                      />
                    </div>
                  </div>
                )}
              </div>
              {/* Info Text */}
              <p className="text-center text-xs text-black mb-8">
                Clicking &quot;Complete order&quot; will redirect you to
                Paystack to complete your order.
              </p>
            </div>
          )}
        </div>

        {/* Footer - Buttons */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200">
            {!isCheckout ? (
              <div className="space-y-2 p-2">
                <button disabled
                  onClick={handleCheckout}
                  className="w-full bg-black text-white py-2 font-bold hover:bg-gray-800 transition-colors text-sm tracking-wide"
                >
                  CHECKOUT
                </button>
                <button
                  onClick={handleCheckoutViaChat}
                  className="w-full bg-white text-black border border-black py-2 font-bold hover:bg-gray-100 transition-colors text-sm tracking-wide"
                >
                  CHECKOUT VIA CHAT
                </button>
              </div>
            ) : !isDeliveryForm ? (
              <div className="space-y-2">
                <button
                  onClick={handleBackToCart}
                  className="w-full border text-black py-3 font-bold hover:bg-gray-300 transition-colors text-sm tracking-wide"
                >
                  BACK TO CART
                </button>
                <button
                  onClick={handleContinueAsGuest}
                  className="w-full bg-black text-white py-3 font-bold hover:bg-gray-800 transition-colors text-sm tracking-wide"
                >
                  CONTINUE AS A GUEST
                </button>
              </div>
            ) : !isPaymentForm ? null : (
              <>
                {error && (
                  <p className="text-red-500 text-center text-sm mt-2 transition-opacity duration-200">
                    {error}
                  </p>
                )}
                <button
                  className={`w-full bg-black text-white py-2 font-bold transition-colors text-sm tracking-wide mt-6 ${
                    !paymentMethod
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-800"
                  }`}
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
                          onSuccess: async () => {
                            const orderData = {
                              items: cartItems,
                              total: total + SHIPPING,
                              deliveryDetails: deliveryForm,
                              timestamp: new Date().toISOString()
                            };
                            localStorage.setItem("lfw_order", JSON.stringify(orderData));
                            handleClose()
                            dispatch(clearCart());
                          },
                        });
                        // handlePaystackSuccess(); // Call after payment is confirmed
                        }
                      : undefined
                  }
                  disabled={!paymentMethod || loading}
                >
                  {loading ? "PROCESSING..." : "COMPLETE"}
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