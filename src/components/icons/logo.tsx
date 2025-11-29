import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 20"
      width="100"
      height="20"
      aria-label="Eggstech Salon Logo"
      {...props}
    >
      <text
        x="0"
        y="15"
        fontFamily="'PT Sans', sans-serif"
        fontSize="16"
        fontWeight="bold"
        fill="currentColor"
        className="text-foreground"
      >
        Eggstech Salon
      </text>
    </svg>
  );
}
