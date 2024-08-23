import Image from "next/image";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("https://dial.to/developer?url=https://www.exploresolana.fun/&cluster=mainnet")
  return (
    <div>
      <h1>Home</h1>
      <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
    </div>
  );
}
