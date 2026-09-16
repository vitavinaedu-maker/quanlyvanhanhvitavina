"use client";

import { useState } from "react";

export default function Tabs({
  tabs,
}: {
  tabs: { label: string; content: React.ReactNode }[];
}) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="flex gap-1 border-b border-gray-200 mb-4">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActive(i)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
              active === i
                ? "border-brand-600 text-brand-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{tabs[active].content}</div>
    </div>
  );
}
