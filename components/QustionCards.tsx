import React from "react";
import { Questions } from "@/interfaces";
import Link from "next/link";

const QustionCards = ({
  title,
  description,
  category,
  points,
  done,
  _id,
}: Questions) => {
  return (
    <Link
      href={done ? "/" : `/problems/${_id}`}
      className="w-full h-full bg-[white]/40 backdrop-blur-[150px] mx-auto my-0 flex flex-col gap-4 shadow-lg shadow-gray-200/50 px-6 py-5 rounded-2xl z-2 hover:bg-gray-100/70 border border-gray-200"
    >
      <div className="flex flex-col">
        <h1 className="text-[1.5rem] text-start font-bold tracking-tight line-clamp-2">
          {title}
        </h1>
        <div className="flex flex-col gap-2 justify-between">
          <h1 className="text-sm sm:text-base font-medium">
            Points : <span className="text-rose-500">{points}</span>
          </h1>
          <div className="text-sm sm:text-base font-bold">
            <span className="text-white text-xs tracking-tight font-bold px-2 py-1 bg-rose-400 rounded-full">
              {category}
            </span>
          </div>
        </div>
      </div>
      <h3 className="font-base font-[0.5rem] text-black line-clamp-2">
        {description}
        {"..."} <span className="text-rose-500 font-bold">more</span>
      </h3>
    </Link>
  );
};

export default QustionCards;
