import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ContentCard from "./ContentCard";

export default function ContentRow({ title, items, badge }) {
  const rowRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction) => {
    const el = rowRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
    setTimeout(checkScroll, 400);
  };

  const checkScroll = () => {
    const el = rowRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="mb-10 group/row">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-8 mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-white text-xl md:text-2xl font-bold">{title}</h2>
          {badge && (
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase">
              {badge}
            </span>
          )}
        </div>
        <span className="text-red-400 text-sm font-medium opacity-0 group-hover/row:opacity-100 transition-opacity cursor-pointer hover:text-red-300">
          Vedi tutti →
        </span>
      </div>

      {/* Scroll Container */}
      <div className="relative">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-0 bottom-0 z-10 w-14 flex items-center justify-center bg-gradient-to-r from-gray-950 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity hover:from-gray-900"
          >
            <ChevronLeft size={32} className="text-white drop-shadow-lg" />
          </button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-0 bottom-0 z-10 w-14 flex items-center justify-center bg-gradient-to-l from-gray-950 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity hover:from-gray-900"
          >
            <ChevronRight size={32} className="text-white drop-shadow-lg" />
          </button>
        )}

        <div
          ref={rowRef}
          onScroll={checkScroll}
          className="flex gap-3 overflow-x-auto scrollbar-hide px-4 md:px-8 pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
