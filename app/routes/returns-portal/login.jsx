import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import crypto from "crypto";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams);
  
  // Verify Shopify App Proxy request
  if (!verifyShopifyProxy(params)) {
    throw new Response("Unauthorized", { status: 401 });
  }

  return json({ message: "Welcome to the Returns Portal" });
};

// Function to verify Shopify App Proxy request
function verifyShopifyProxy(params) {
  const { hmac, ...otherParams } = params;

  const sortedParams = Object.keys(otherParams)
    .sort()
    .map((key) => `${key}=${otherParams[key]}`)
    .join("&");

  const calculatedHmac = crypto
    .createHmac("sha256", process.env.SHOPIFY_API_SECRET)
    .update(sortedParams)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(hmac, "utf-8"),
    Buffer.from(calculatedHmac, "utf-8")
  );
}

export default function ReturnsPortal() {
  const data = useLoaderData();
  
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Returns Portal</h1>
      <p>{data.message}</p>
    </div>
  );
}
