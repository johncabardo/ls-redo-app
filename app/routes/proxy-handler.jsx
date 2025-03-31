import { json } from "@remix-run/node";

export const loader = async ({ request }) => {
    const url = new URL(request.url);
    const shop = url.searchParams.get("shop");

    if (!shop) {
        return json({ error: "Missing shop parameter" }, { status: 400 });
    }

    return json({ success: true, message: "Welcome to the Returns Portal!" });
};
