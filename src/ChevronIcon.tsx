import React from "react";

export const ChevronIcon = ({
  direction,
  width = 20,
  height = 20,
  ...props
}: { direction: "left" | "right" } & Omit<
  React.SVGProps<SVGSVGElement>,
  "children"
>) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline
      points={direction === "left" ? "15 18 9 12 15 6" : "9 6 15 12 9 18"}
    />
  </svg>
);
