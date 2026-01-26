import Navbar from "@/components/Navbar";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

export default async function Home() {
  const user = await currentUser();
  console.log(user, "----------------------------------------");
  return(
    <div className="w-full py-2.5 justify-start">
      <Navbar/>
      {user && <div>Welcome {user?.fullName}</div>}
    </div>
  )
}
