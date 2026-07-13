"use client";

import StoreProvider from "@/store/StoreProvider";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { resetAddToBagAlert } from "@/store/cartSlice";
import dynamic from "next/dynamic";

const AddToBagAlert = dynamic(() => import("./AddToBagAlert"), { ssr: false });

function ClientLayoutInner({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const showAlert = useAppSelector((state) => state.cart.showAddToBagAlert);

  useEffect(() => {
    if (!showAlert) return;

    const timer = setTimeout(() => {
      dispatch(resetAddToBagAlert());
    }, 5000);

    return () => clearTimeout(timer);
  }, [showAlert, dispatch]);

  return (
    <>
      {children}

      <AddToBagAlert
        show={showAlert}
        onClose={() => dispatch(resetAddToBagAlert())}
      />
    </>
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <ClientLayoutInner>{children}</ClientLayoutInner>
    </StoreProvider>
  );
}
