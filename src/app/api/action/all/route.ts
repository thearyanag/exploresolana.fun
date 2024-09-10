import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  createPostResponse,
  ACTIONS_CORS_HEADERS,
  ActionGetResponse,
} from "@solana/actions";
import {
  Transaction,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Connection,
  clusterApiUrl,
} from "@solana/web3.js";
import { getAction } from "@/app/actions";

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const body = (await req.json()) as { account: string; signature: string };

  let app_name = searchParams.get("app_name");

  let registry = await fetch("https://registry.dial.to/v1/list");
  let registry_data = await registry.json();
  registry_data = registry_data.results;

  //   do fuzzy search on app_name
  let fuzzy_search = registry_data.filter((item: any) =>
    item.blinkUrl?.toLowerCase().includes(app_name?.toLowerCase() ?? "")
  );

  fuzzy_search = fuzzy_search[0];

  let action_url = fuzzy_search.actionUrl;

  console.log(action_url);

  let action = await fetch(action_url);
  let action_data = (await action.json()) as ActionGetResponse;

  if (!action_data.links) {
    action_data.links = {
      actions: [
        {
          label: action_data.label,
          href: action_url,
        },
      ],
    };
  } else {
    const baseDomain = new URL(action_url).origin;

    // Prepend action.action_url to href if it starts with '/'
    action_data.links.actions = action_data.links.actions.map((item) => ({
      ...item,
      href: item.href.startsWith("/") ? `${baseDomain}${item.href}` : item.href,
    }));
  }

  const sender = new PublicKey(body.account);
  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: sender,
      toPubkey: new PublicKey("CRtPaRBqT274CaE5X4tFgjccx5XXY5zKYfLPnvitKdJx"),
      lamports: LAMPORTS_PER_SOL * 0,
    })
  );
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  tx.feePayer = sender;

  const payload = await createPostResponse({
    fields: {
      links: {
        // any condition to determine the next action
        next: {
          type: "inline",
          action: {
            type: "action",
            ...action_data,
          },
        },
      },
      transaction: tx,
      message: "happy chaining",
    },
  });

  return NextResponse.json(payload,{
    headers: ACTIONS_CORS_HEADERS,
  });
}
