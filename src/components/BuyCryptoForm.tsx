"use client";

import React, { useState } from "react";
import {
  FaExchangeAlt,
  FaDollarSign,
  FaPhoneAlt,
  FaUser,
  FaNetworkWired,
} from "react-icons/fa";
import { baseUrl } from "@/app/strings";
import {
  ConnectButton,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";
import { client } from "@/app/client";
import { polygonAmoy } from "thirdweb/chains";
import { contract } from "@/app/contract";
import { formatPhoneNumber } from "./phoneNumber";
import ConnectWallet from "./connectWallet";

interface BuyCryptoFormProps {
  merchantAddress: string;
}

export default function BuyCryptoForm({ merchantAddress }: BuyCryptoFormProps) {
  const address = useActiveAccount()?.address;
  const [phoneNumber, setPhoneNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [amount, setAmount] = useState("");
  const [network, setNetwork] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // const { data: merchant } = useReadContract({
  //   contract,
  //   method: "getAllMerchants",
  // });

  const formattedPhone = formatPhoneNumber(phoneNumber);
  const ghsRate = 20;
  const payingAmount = (Number(amount) * ghsRate).toString();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/momo-transaction/send-crypto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_TRANSACT_KEY}`,
        },
        body: JSON.stringify({
          customer: {
            phoneNumber: formattedPhone,
            accountName: address,
            network,
          },
          amount: parseFloat(payingAmount),
          currency: "GHS",
          callbackUrl: `${baseUrl}/api/momo-status/collection-status`,
          address: address,
          merchantAddress: merchantAddress,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setTransactionId(data.data.transactionId);
      }
    } catch (error) {
      console.error("Error initiating transaction:", error);
    }
  };

  const checkStatus = async () => {
    try {
      const response = await fetch(
        `/api/momo-status/collection-status/${transactionId}`
      );
      const data = await response.json();
      if (data.success) {
        setStatus(data.data.status);
      }
    } catch (error) {
      console.error("Error checking status:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-blue-200">
      <h2 className="text-2xl font-semibold text-blue-600 mb-6">Buy Crypto</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Phone Number
          </label>
          <div className="relative">
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-2 pl-10 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              placeholder="Enter phone number"
              required
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaPhoneAlt className="text-gray-400" />
            </div>
          </div>
        </div>
        <div>
          <label
            htmlFor="accountName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Account Name
          </label>
          <div className="relative">
            <input
              type="text"
              id="accountName"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="w-full p-2 pl-10 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              placeholder="Enter account name"
              required
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaUser className="text-gray-400" />
            </div>
          </div>
        </div>
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Amount of token to Buy
          </label>
          <div className="relative">
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 pl-10 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              placeholder="Enter amount"
              required
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaDollarSign className="text-gray-400" />
            </div>
          </div>
        </div>
        <div>
          <label
            htmlFor="network"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Network
          </label>
          <div className="relative">
            <select
              id="network"
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              className="w-full p-2 pl-10 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-300 focus:border-blue-300 appearance-none"
              required
            >
              <option value="">Select a network</option>
              <option value="MTN">MTN</option>
              <option value="Vodafone">Vodafone</option>
              <option value="AirtelTigo">AirtelTigo</option>
            </select>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaNetworkWired className="text-gray-400" />
            </div>
          </div>
        </div>
        <p className="text-sm text-blue-600">
          You are paying {payingAmount} GHS at rate of 20GHS per token
        </p>
        <div>
          {address ? (
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
            >
              <FaExchangeAlt className="mr-2" />
              {loading ? "Processing..." : "Initiate Transaction"}
            </button>
          ) : (
            <ConnectWallet />
          )}
        </div>
      </form>

      {transactionId && (
        <div className="mt-6 space-y-4">
          <p className="text-sm text-gray-600">
            Transaction ID: {transactionId}
          </p>
          <button
            onClick={checkStatus}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
          >
            Check Status
          </button>
          {status && <p className="text-sm text-gray-600">Status: {status}</p>}
        </div>
      )}
    </div>
  );
}
