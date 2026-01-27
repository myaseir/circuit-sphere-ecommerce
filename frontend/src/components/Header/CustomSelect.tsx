"use client";
import React, { useState, useEffect, useRef } from "react";

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  options: Option[];
  selectedCategory: string; // ✅ ADDED
  onChange: (value: string) => void;
}

const CustomSelect = ({ options, selectedCategory, onChange }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ Find the current label based on the value passed from Header
  const currentLabel = options.find(opt => opt.value === selectedCategory)?.label || options[0].label;

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: Option, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(option.value); // ✅ Pass the value back up to Header
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative cursor-pointer z-[999] custom-select" style={{ width: "160px" }}>
      <div
        className={`flex items-center justify-between h-[46px] w-full px-3.5 py-2 border rounded-l-md transition-all duration-200 bg-white ${
          isOpen ? "border-blue shadow-sm" : "border-gray-3"
        }`}
        onClick={toggleDropdown}
      >
        <span className="block truncate text-sm font-medium text-dark">
          {currentLabel} {/* ✅ Display the synced label */}
        </span>
        <svg className={`w-4 h-4 text-dark-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <div
        className={`absolute left-0 right-0 z-[10000] mt-1.5 max-h-[300px] overflow-y-auto rounded-md border border-gray-3 bg-white shadow-2xl transition-all duration-200 ${
          isOpen ? "translate-y-0 opacity-100 visible" : "-translate-y-2 opacity-0 invisible"
        }`}
      >
        {options.map((option, index) => (
          <div
            key={index}
            onClick={(e) => handleOptionClick(option, e)}
            className={`cursor-pointer px-4 py-2.5 text-sm transition-colors border-b border-gray-1 last:border-none hover:bg-gray-2 ${
              selectedCategory === option.value ? "text-blue font-semibold" : "text-dark"
            }`}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomSelect;