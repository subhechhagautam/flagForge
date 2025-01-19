import React from "react";
import { IoFilter } from "react-icons/io5";

export default function FilterSidebar() {
  return (
    <div>
      <div className="shadow-xl p-6 rounded-xl sm:flex flex-col gap-[36px] hidden">
        <div className="text-2xl font-bold flex gap-2 items-center text-center ml-12">
          <IoFilter />
          Filters
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-lg">Topics</h1>
          <ul className="flex flex-col gap-2 font-base">
            <li className="shadow p-3 rounded-md hover:text-rose-500 hover:font-bold hover:bg-gray-100 cursor-pointer">
              All
            </li>
            <li className="shadow p-3 rounded-md hover:text-rose-500 hover:font-bold hover:bg-gray-100 cursor-pointer">
              Web Exploitation
            </li>
            <li className="shadow p-3 rounded-md hover:text-rose-500 hover:font-bold hover:bg-gray-100 cursor-pointer">
              Cryptography
            </li>
            <li className="shadow p-3 rounded-md hover:text-rose-500 hover:font-bold hover:bg-gray-100 cursor-pointer">
              Reverse Engineering
            </li>
            <li className="shadow p-3 rounded-md hover:text-rose-500 hover:font-bold hover:bg-gray-100 cursor-pointer">
              Forensics
            </li>
            <li className="shadow p-3 rounded-md hover:text-rose-500 hover:font-bold hover:bg-gray-100 cursor-pointer">
              General Skills
            </li>
            <li className="shadow p-3 rounded-md hover:text-rose-500 hover:font-bold hover:bg-gray-100 cursor-pointer">
              Binary Exploitation
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
