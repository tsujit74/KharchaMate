"use client";

import { useState } from "react";
import SupportSidebar from "./components/SupportSidebar";
import CreateTicketModal from "./components/CreateTicketModal";
import RouteLoader from "@/app/components/RouteLoader";

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="flex h-[calc(100vh-64px)]">

     
      <div className="w-64 border-r bg-white">
        <SupportSidebar onCreateClick={() => setOpenModal(true)} />
      </div>

     <RouteLoader/>
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {children}
      </div>

      
      <CreateTicketModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        refreshTickets={() => {}}
      />

    </div>
  );
}