import Image from "next/image";

interface BrandLogoProps {
  variant?: "on-dark" | "on-light";
  className?: string;
}

export function BrandLogo({ variant = "on-dark", className }: BrandLogoProps) {
  const onDark = variant === "on-dark";

  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`} aria-label="Carise">
      <Image
        src={onDark ? "/brand/monogram-light.svg" : "/brand/monogram.svg"}
        alt=""
        width={38}
        height={35}
        aria-hidden="true"
        className="h-8 w-auto"
      />
      <Image
        src={onDark ? "/brand/wordmark-light.svg" : "/brand/wordmark.svg"}
        alt=""
        width={196}
        height={83}
        aria-hidden="true"
        className="h-7 w-auto"
      />
    </span>
  );
}
