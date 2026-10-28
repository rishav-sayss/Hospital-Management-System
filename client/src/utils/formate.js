// 2400 -> "2.4k+", 800 -> "800"
export const formatCount = (n = 0) =>
  n >= 1000 ? `${(n / 1000).toFixed(1).replace(".0", "")}k+` : String(n);

export const getInitials = (name = "") =>
  name
    .replace(/^Dr\.?\s*/i, "")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();