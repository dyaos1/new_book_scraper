"use client"
import Link from "next/link";
import NavItem from "./NavItem";
import { User } from "@prisma/client";

interface UserSession {
  currentUser?: User | null
}

export default function NavBar({currentUser}: UserSession) {
  console.log('Navbar', currentUser)
  return (
    <div 
      className={
        `flex
        justify-between
        items-center
        mx-5
        sm:mx-10
        lg:mx-20
        `
      }
    >
      <div
        className={
          `flex
          items-center
          text-2xl
          h-14`
        }
      >
        <Link href="/">Logo</Link>
      </div>
      <div>
        <NavItem currentUser={currentUser} />
      </div>
    </div>
  )
}