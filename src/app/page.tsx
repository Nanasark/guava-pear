"use client";

import { useState } from "react";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";
import BuyCryptoCard from "../components/BuyCryptoCard";
import SellCryptoCard from "../components/SellCryptoCard";
import Link from "next/link";
import { contract } from "./contract";
import { useReadContract } from "thirdweb/react";
import { supabase } from "@/utils/supabase-server";

export default function Dashboard() {
  const [isBuyCrypto, setIsBuyCrypto] = useState(true);

  // Fetch merchants from the smart contract
  const {
    data: merchants,
    isLoading,
    error,
  } = useReadContract({
    contract,
    method: "getAllMerchants",
  });

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">
            BuyCryptoPlatform
          </h1>
          <div className="flex items-center space-x-4">
            <button
              className="flex items-center text-blue-600 hover:text-blue-700"
              onClick={() => setIsBuyCrypto(!isBuyCrypto)}
            >
              {isBuyCrypto ? (
                <FaToggleOn className="mr-2 text-2xl" />
              ) : (
                <FaToggleOff className="mr-2 text-2xl" />
              )}
              {isBuyCrypto ? "Buy Crypto" : "Sell Crypto"}
            </button>
            <Link
              href="/profile"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              My Profile
            </Link>
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Register
            </Link>
          </div>
        </div>

        {isLoading ? (
          <p className="text-center text-blue-500">Loading merchants...</p>
        ) : error ? (
          <p className="text-center text-red-500">Error loading merchants</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {merchants?.map((merchant, index) =>
              isBuyCrypto ? (
                <BuyCryptoCard key={index} merchant={merchant} />
              ) : (
                <SellCryptoCard key={index} merchant={merchant} />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
