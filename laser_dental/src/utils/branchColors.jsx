// utils/branchColors.js
// Shared color palette for branches — keeps Locations, AppointmentPage,
// and the Dashboard BranchForm visually consistent.

export const BRANCH_COLOR_SCHEMES = {
  sky:     { color: "#0ea5e9", colorDark: "#0284c7", colorBg: "#e0f2fe" },
  violet:  { color: "#8b5cf6", colorDark: "#7c3aed", colorBg: "#ede9fe" },
  emerald: { color: "#10b981", colorDark: "#059669", colorBg: "#d1fae5" },
  amber:   { color: "#f59e0b", colorDark: "#d97706", colorBg: "#fef3c7" },
  rose:    { color: "#f43f5e", colorDark: "#e11d48", colorBg: "#ffe4e6" },
  cyan:    { color: "#06b6d4", colorDark: "#0891b2", colorBg: "#cffafe" },
};

export const getBranchColors = (colorScheme) =>
  BRANCH_COLOR_SCHEMES[colorScheme] || BRANCH_COLOR_SCHEMES.sky;

export const COLOR_SCHEME_OPTIONS = Object.keys(BRANCH_COLOR_SCHEMES);