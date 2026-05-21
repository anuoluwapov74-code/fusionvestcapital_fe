import Image from "next/image";

interface BrandLogoProps {
  /** Hide the text on screens narrower than lg (navbar behaviour) */
  mobileImageOnly?: boolean;
  /** Tailwind text-size classes, e.g. "text-xl lg:text-2xl" */
  textSize?: string;
  /** Tailwind h/w classes for the logo image, e.g. "h-8 w-8" */
  imageSize?: string;
  className?: string;
}

export default function BrandLogo({
  mobileImageOnly = false,
  textSize = "text-xl sm:text-2xl",
  imageSize = "h-9 w-9",
  className = "",
}: BrandLogoProps) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      {/* CSS-based theme switching — no JS / hydration flicker */}
      <Image
        src="/logo_light.png"
        alt="FusionVest Capital"
        width={48}
        height={48}
        className={`${imageSize} object-contain shrink-0 dark:hidden`}
      />
      <Image
        src="/logo_dark.png"
        alt="FusionVest Capital"
        width={48}
        height={48}
        className={`${imageSize} object-contain shrink-0 hidden dark:block`}
      />
      <span
        className={`font-extrabold tracking-tight text-gray-900 dark:text-white ${textSize} ${
          mobileImageOnly ? "hidden lg:inline" : ""
        }`}
      >
        FusionVest<span className="text-[#000080] dark:text-[#50C878]">Capital</span>
      </span>
    </span>
  );
}
