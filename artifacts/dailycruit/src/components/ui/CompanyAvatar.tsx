import type { CSSProperties } from "react";

type CompanyAvatarProps = {
  companyName: string;
  companyLogo?: string;
  companyColor?: string;
  size?: number;
  className?: string;
};

export function CompanyAvatar({
  companyName,
  companyLogo,
  companyColor = "#6366F1",
  size = 36,
  className,
}: CompanyAvatarProps) {
  const fallbackInitial = companyName.trim().charAt(0).toUpperCase() || "C";
  const avatarStyle: { [key: string]: string | number } = {
    width: size,
    height: size,
    minWidth: size,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: companyLogo ? "transparent" : companyColor,
    color: "#ffffff",
    fontSize: size * 0.45,
    fontWeight: 700,
    overflow: "hidden",
  };

  if (companyLogo) {
    return (
      <img
        src={companyLogo}
        alt={`${companyName} logo`}
        className={className}
        style={{
          ...avatarStyle,
          objectFit: "cover",
        }}
      />
    );
  }

  return (
    <div className={className} style={avatarStyle}>
      {fallbackInitial}
    </div>
  );
}
