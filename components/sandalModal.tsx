


// export const SandalModal = () => {
//     return (
//             <div className="fixed inset-0 z-50 flex font-syne">
//               <div
//                 className="flex-1 bg-black/30"
//                 onClick={handleClose}
//                 aria-label="Close modal"
//               />
//               <div className="relative w-full max-w-md h-full bg-white flex flex-col justify-between overflow-hidden">
//                 {/* Header */}
//                 <button
//                   onClick={handleClose}
//                   className="absolute top-4 right-4 text-sm font-medium text-black z-50"
//                 >
//                   Close
//                 </button>
      
//                 {/* Hero section */}
//                 <div className="relative flex-1">
//                   <Image
//                     src={bg}
//                     alt="ATM Sandal"
//                     fill
//                     className="object-cover mt-20"
//                   />
//                   <div className="absolute top-8 w-full text-center text-black">
//                     <h1 className="text-sm uppercase font-bold tracking-wide">
//                       ATM SANDAL — PRE-ORDER OPEN
//                     </h1>
//                     <p className="text-xs mt-1">
//                       Pre-orders are now open for the first release of the ATM Sandal.
//                     </p>
//                   </div>
//                 </div>
      
//                 {/* Cart box */}
//                 <div className="bg-white border border-black mx-4 mb-4 p-4 relative shadow-md">
//                   {cartItems.map((item) => (
//                     <div key={item.name}>
//                       <button
//                         className="absolute top-2 right-2 text-black text-lg leading-none hover:bg-gray-100 w-6 h-6 flex items-center justify-center"
//                         onClick={() => dispatch(clearCart())}
//                       >
//                         ×
//                       </button>
//                       <div className="text-center mb-4 flex flex-col m-auto w-fit">
//                         <h3 className="font-medium text-sm mb-1">{item.name}</h3>
//                         <p className="text-sm font-medium self-start">
//                           ₦{item.price.toLocaleString()}
//                         </p>
//                       </div>
      
//                       <div className="flex items-end gap-3">
//                         <Image
//                           src={item.imageUrl}
//                           alt={item.name}
//                           width={60}
//                           height={60}
//                           className="object-contain"
//                         />
//                         <div className="flex items-center gap-2 text-xs bg-white px-3 py-1 border border-gray-300">
//                           <span className="mr-1">Qty</span>
//                           <button
//                             className="px-1"
//                             onClick={() => dispatch(removeFromCart(item))}
//                           >
//                             -
//                           </button>
//                           <span>{item.quantity}</span>
//                           <button
//                             disabled={item.quantity >= 3}
//                             className="px-1"
//                             onClick={() => dispatch(addToCart(item))}
//                           >
//                             +
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
      
//                 {/* Checkout button */}
//                 <button
//                   onClick={handleCheckout}
//                   className="w-full bg-black text-white py-3 font-bold text-sm tracking-wide hover:bg-gray-800"
//                 >
//                   CHECKOUT
//                 </button>
//               </div>
//             </div>
//           );
// }