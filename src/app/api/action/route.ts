import { NextRequest, NextResponse } from "next/server";
import { ACTIONS_CORS_HEADERS, ActionGetResponse } from "@solana/actions";

export async function GET(req: NextRequest) {
  let response: ActionGetResponse = {
    type: "action",
    icon: `https://www.exploresolana.fun/banner.png`,
    title: "Explore Solana",
    description: "Explore Solana with just a link",
    label: "Explore Solana",
    links: {
      actions: [
        {
          label: "Buy a MADLAD", // button text
          href: "/api/action/tensor", // api endpoint
        },
        {
          label: "Trade SOL-hSOL", // button text
          href: "/api/action/helius", // api endpoint
        },
        {
          label: "Trade SOL-SEND", // button text
          href: "/api/action/jupiter", // api endpoint
        },
        {
          parameters: [
            {
              type: "text",
              name: "app_name",
              required: true,
              label: "Name of the project",
            },
          ],
          href: "/api/action/all?app_name={app_name}",
          label: "Explore Solana",
        },
      ],
    },
  };

  return NextResponse.json(response, {
    headers: ACTIONS_CORS_HEADERS,
  });
}

// ensures cors
export const OPTIONS = GET;
