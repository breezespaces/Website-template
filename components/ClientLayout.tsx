"use client";

import StoreProvider from "@/store/StoreProvider";
import AddToBagAlert from "@/components/AddToBagAlert";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { resetAddToBagAlert } from "@/store/cartSlice";

function ClientLayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();

  const showAlert = useSelector(
    (state: RootState) => state.cart.showAddToBagAlert
  );

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
      <ClientLayoutInner>
        {children}
      </ClientLayoutInner>
    </StoreProvider>
  );
}
