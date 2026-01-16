"use client";

import { useState, useEffect } from "react";

type Category = {
  name: string;
  products: number;
};

interface ItemProps {
  category: Category;
  isSelected: boolean;
  onClick: (categoryName: string) => void;
}

const CategoryItem = ({ category, isSelected, onClick }: ItemProps) => {
  return (
    <button
      className={`${
        isSelected ? "text-blue font-semibold" : "text-dark"
      } group flex items-center justify-between ease-out duration-200 hover:text-blue w-full text-left`}
      onClick={() => onClick(category.name)}
    >
      <div className="flex items-center gap-2">
        <div
          className={`flex items-center justify-center rounded w-4 h-4 border transition-all ${
            isSelected ? "border-blue bg-blue shadow-sm" : "bg-white border-gray-3"
          }`}
        >
          <svg
            className={isSelected ? "block" : "hidden"}
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.33317 2.5L3.74984 7.08333L1.6665 5"
              stroke="white"
              strokeWidth="1.94437"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="text-sm">{category.name}</span>
      </div>

      <span
        className={`${
          isSelected ? "text-white bg-blue" : "bg-gray-2 text-dark"
        } inline-flex rounded-[30px] text-[10px] px-2 py-0.5 ease-out duration-200 group-hover:text-white group-hover:bg-blue`}
      >
        {category.products}
      </span>
    </button>
  );
};

interface DropdownProps {
  categories: Category[]; // Ensure this is always an array
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
}

const CategoryDropdown = ({ 
  categories = [], // ✅ Default value prevents "reading map of undefined"
  onSelectCategory, 
  selectedCategory 
}: DropdownProps) => {
  const [toggleDropdown, setToggleDropdown] = useState(true);

  // Auto-open if a category is selected via Home Page
  useEffect(() => {
    if (selectedCategory) setToggleDropdown(true);
  }, [selectedCategory]);

  const handleSelect = (categoryName: string) => {
    const newCategory = selectedCategory === categoryName ? "" : categoryName;
    onSelectCategory(newCategory); 
  };

  return (
    <div className="bg-white shadow-1 rounded-lg overflow-hidden">
      <div
        onClick={() => setToggleDropdown(!toggleDropdown)}
        className={`cursor-pointer flex items-center justify-between py-3 pl-6 pr-5.5 transition-colors ${
          toggleDropdown ? "bg-gray-50 border-b border-gray-2" : ""
        }`}
      >
        <p className="text-dark font-medium">Category</p>
        <div className={`text-dark transition-transform duration-300 ${toggleDropdown ? "rotate-180" : ""}`}>
          <svg className="fill-current" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M4.43057 8.51192C4.70014 8.19743 5.17361 8.161 5.48811 8.43057L12 14.0122L18.5119 8.43057C18.8264 8.16101 19.2999 8.19743 19.5695 8.51192C19.839 8.82642 19.8026 9.29989 19.4881 9.56946L12.4881 15.5695C12.2072 15.8102 11.7928 15.8102 11.5119 15.5695L4.51192 9.56946C4.19743 9.29989 4.161 8.82641 4.43057 8.51192Z" />
          </svg>
        </div>
      </div>

      <div className={`flex-col gap-4 py-6 pl-6 pr-5.5 ${toggleDropdown ? "flex" : "hidden"}`}>
        {categories.length > 0 ? (
          categories.map((category, key) => (
            <CategoryItem 
              key={key} 
              category={category} 
              isSelected={selectedCategory === category.name}
              onClick={handleSelect} 
            />
          ))
        ) : (
          <p className="text-xs text-gray-400">Loading categories...</p>
        )}
      </div>
    </div>
  );
};

export default CategoryDropdown;