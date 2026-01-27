import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

function Navbar() {

  return (
    <div className="w-full py-3 flex justify-around items-center" >
      <Link href={'/'}>Home</Link>
      <SignedOut>
        <Link href={'/sign-in'}>Sign in</Link>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  )
}

export default Navbar;