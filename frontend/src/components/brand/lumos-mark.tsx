import type { SVGProps } from "react";

type LumosMarkProps = SVGProps<SVGSVGElement> & {
  variant?: "photo" | "lab" | "admin";
};

const accents = {
  photo: "#F2C572",
  lab: "#83D6C5",
  admin: "#B9B5ED",
};

/** Lumos 공통 CI: L 모노그램, 렌즈, 빛점. 옆의 서비스명이 접근성 이름을 제공합니다. */
export function LumosMark({ variant = "photo", ...props }: LumosMarkProps) {
  const accent = accents[variant];
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden="true" focusable="false" {...props}>
      <rect width="64" height="64" rx="16" fill="#172522" />
      <path d="M16 17h8v23h25v8H16Z" fill="#FAF7EF" />
      <circle cx="40" cy="26" r="9" stroke={accent} strokeWidth="6" />
      <circle cx="51" cy="13" r="3" fill={accent} />
    </svg>
  );
}

export function LumosPhotoMark(props: SVGProps<SVGSVGElement>) {
  return <LumosMark {...props} variant="photo" />;
}

export function LumosLabMark(props: SVGProps<SVGSVGElement>) {
  return <LumosMark {...props} variant="lab" />;
}

export function LumosAdminMark(props: SVGProps<SVGSVGElement>) {
  return <LumosMark {...props} variant="admin" />;
}
