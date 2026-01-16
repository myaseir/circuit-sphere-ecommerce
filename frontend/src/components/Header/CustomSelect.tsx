"use client";
import React, { useState, useEffect, useRef } from "react";

const CustomSelect = ({ options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onChange) {
      onChange(option.value);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div 
      ref={dropdownRef} 
      // ✅ Added 'before:hidden' and 'after:hidden' to kill the CSS arrows
      className="dropdown-content custom-select relative cursor-pointer before:hidden after:hidden" 
      style={{ width: "160px" }} // Adjusted width to fit better in header
    >
      <div
        className={`select-selected whitespace-nowrap bg-gray-100 p-2 border rounded-l-md flex items-center justify-between h-[46px] ${
          isOpen ? "border-blue" : "border-gray-3"
        }`}
        onClick={toggleDropdown}
        // ✅ This style ensures no extra arrows are drawn by global CSS
        style={{ backgroundImage: 'none' }} 
      >
        <span className="block truncate text-sm text-dark pr-2">
          {selectedOption.label}
        </span>
        
        {/* ✅ This is your clean React arrow */}
        <svg 
          className={`w-4 h-4 text-gray-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>

      <div
        className={`select-items absolute left-0 right-0 z-50 bg-white border border-gray-3 rounded-b-md shadow-lg mt-1
        ${isOpen ? "block" : "hidden"} 
        max-h-[300px] overflow-y-auto`}
      >
        {options.map((option, index) => (
          <div
            key={index}
            onClick={() => handleOptionClick(option)}
            className={`select-item px-4 py-2.5 hover:bg-gray-100 cursor-pointer text-sm transition-colors ${
              selectedOption.value === option.value ? "bg-gray-2 text-blue font-medium" : "text-dark"
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