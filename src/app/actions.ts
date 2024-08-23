import { ActionGetResponse } from "@solana/actions";

export const actions = [
  {
    key: "tensor",
    url: "https://www.tensor.trade/trade/madlads",
    action_url: "https://tensor.dial.to/buy-floor/madlads",
  },
  {
    key: "helius",
    url: "https://app.sanctum.so/trade/SOL-hSOL",
    action_url: "https://sanctum.dial.to/trade/SOL-hSOL",
  },
  {
    key: "jupiter",
    url: "https://jup.ag/swap/SOL-SEND",
    action_url: "https://worker.jup.ag/blinks/swap/SOL-SEND",
  },
];

export const getAction = async (key: string) => {
  let action = actions.find((action) => action.key === key);

  if (!action) {
    throw new Error("Action not found");
  }

  let data = (await (
    await fetch(action.action_url)
  ).json()) as ActionGetResponse;

  if (!data.links) {
    data.links = {
      actions: [
        {
          label: data.label,
          href: action.action_url,
        },
      ],
    };
  } else {
    const baseDomain = new URL(action.action_url).origin;

    // Prepend action.action_url to href if it starts with '/'
    data.links.actions = data.links.actions.map((item) => ({
      ...item,
      href: item.href.startsWith("/") ? `${baseDomain}${item.href}` : item.href,
    }));
  }

  return data;
};
