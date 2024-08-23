import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createPostResponse, ACTIONS_CORS_HEADERS } from "@solana/actions";
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

export async function POST(
  req: NextRequest,
  { params }: { params: { app_name: string } }
) {
  try {
    const body = (await req.json()) as { account: string; signature: string };

    const app_name = params.app_name;

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

    let app_data = await getAction(app_name);

    const payload = await createPostResponse({
      fields: {
        links: {
          // any condition to determine the next action
          next: {
            type: "inline",
            action: {
              ...app_data,
            },
          },
        },
        transaction: tx,
        message: "happy chaining",
      },
    });

    return NextResponse.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    console.log("Error in POST /api/action", err);
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;
    return new Response(message, {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }
}
