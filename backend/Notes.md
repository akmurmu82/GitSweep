res.cookie("accessToken", token, {
    httpOnly: true,
    sameSite: "lax", // change to "none" + secure:true if HTTPS + cross-site
    secure: false, // true in production HTTPS
});

res.cookie("token", token, {
  httpOnly: true,
  sameSite: "None", // needed for cross-origin cookies
  secure: true,     // needed on HTTPS
  maxAge: 24 * 60 * 60 * 1000, // 1 day
});

<!-- why sameSite is used -->