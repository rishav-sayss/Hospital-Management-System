// Sets the access & refresh tokens as httpOnly cookies so client-side JS can never read them
export const setAuthCookies = (res, accessToken, refreshToken) => {
  // const isProd = process.env.NODE_ENV === "production";

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false, // HTTPS only in production
    sameSite: "lax",
    maxAge: 15 * 60 * 1000, // 1 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const clearAuthCookies = (res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
};