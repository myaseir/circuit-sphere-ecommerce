"use client";
import React from "react";

interface BillingProps {
  formData: any; // You can define a specific interface for stricter typing
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const Billing: React.FC<BillingProps> = ({ formData, handleInputChange }) => {
  return (
    <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5 mb-7.5">
      <div className="border-b border-gray-3 pb-4 mb-8">
        <h3 className="font-medium text-xl text-dark">Address Details</h3>
      </div>

      <div className="flex flex-col gap-6">
        {/* Row 1: First Name & Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block mb-2.5 text-sm font-medium text-dark">
              First Name <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              placeholder="Enter your first name"
              value={formData.firstName || ""}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-3 bg-gray-1 py-3 px-5 text-dark outline-none transition focus:border-blue focus:shadow-input-blue"
              required
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block mb-2.5 text-sm font-medium text-dark">
              Last Name <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Enter your last name"
              value={formData.lastName || ""}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-3 bg-gray-1 py-3 px-5 text-dark outline-none transition focus:border-blue focus:shadow-input-blue"
              required
            />
          </div>
        </div>

        {/* Row 2: Country */}
        <div>
          <label htmlFor="country" className="block mb-2.5 text-sm font-medium text-dark">
            Country <span className="text-red">*</span>
          </label>
          <div className="relative z-20 bg-gray-1 rounded-md border border-gray-3">
            <select
              name="country"
              id="country"
              value={formData.country || ""}
              onChange={handleInputChange}
              className="relative z-20 w-full appearance-none rounded-md bg-transparent py-3 px-5 outline-none transition focus:border-blue active:border-blue text-dark"
            >
             
              <option value="PK">Pakistan</option>
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.25 0.55C0.25 0.55 0.5 0.25 0.75 0.25C1 0.25 1.25 0.55 1.25 0.55L5 4.3L8.75 0.55C8.75 0.55 9 0.25 9.25 0.25C9.5 0.25 9.75 0.55 9.75 0.55C9.75 0.55 10 0.8 10 1.05C10 1.3 9.75 1.55 9.75 1.55L5.5 5.8C5.5 5.8 5.25 6.05 5 6.05C4.75 6.05 4.5 5.8 4.5 5.8L0.25 1.55C0.25 1.55 0 1.3 0 1.05C0 0.8 0.25 0.55 0.25 0.55Z"
                  fill="#64748B"
                />
              </svg>
            </span>
          </div>
        </div>

        {/* Row 3: Street Address */}
        <div>
          <label htmlFor="address" className="block mb-2.5 text-sm font-medium text-dark">
            Street Address <span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="address"
            id="address"
            placeholder="House number and street name"
            value={formData.address || ""}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-3 bg-gray-1 py-3 px-5 text-dark outline-none transition focus:border-blue focus:shadow-input-blue mb-4"
            required
          />
        </div>

        {/* Row 4: City & Zip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="city" className="block mb-2.5 text-sm font-medium text-dark">
              Town / City <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name="city"
              id="city"
              placeholder="City"
              value={formData.city || ""}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-3 bg-gray-1 py-3 px-5 text-dark outline-none transition focus:border-blue focus:shadow-input-blue"
              required
            />
          </div>

          <div>
            <label htmlFor="zip" className="block mb-2.5 text-sm font-medium text-dark">
              Post Code / Zip <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name="zip"
              id="zip"
              placeholder="Zip Code"
              value={formData.zip || ""}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-3 bg-gray-1 py-3 px-5 text-dark outline-none transition focus:border-blue focus:shadow-input-blue"
              required
            />
          </div>
        </div>

        {/* Row 5: Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="phone" className="block mb-2.5 text-sm font-medium text-dark">
              Phone <span className="text-red">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              placeholder="Phone number"
              value={formData.phone || ""}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-3 bg-gray-1 py-3 px-5 text-dark outline-none transition focus:border-blue focus:shadow-input-blue"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2.5 text-sm font-medium text-dark">
              Email Address <span className="text-red">*</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email address"
              value={formData.email || ""}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-3 bg-gray-1 py-3 px-5 text-dark outline-none transition focus:border-blue focus:shadow-input-blue"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;