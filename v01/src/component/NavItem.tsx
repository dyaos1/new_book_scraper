"use client"
import { User } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";

interface UserSession {
  currentUser?: User | null
}

export default function NavItem({currentUser}: UserSession) {
  return (
    <ul className={
      `flex
      justify-center
      items-center
      gap-4
      w-full
      text-lg`
    }>
      <li>
        <Link href="/content/yes24">NewBooks</Link>
      </li>
      <li>
        <Link href="/auth/admin">Admin</Link>
      </li>
      <li>
        <Link href="/auth/user">User</Link>

      </li>
      {
        currentUser ? 
          (<li>
            <button onClick={() => signOut()}>Logout</button>
          </li>) :
          (<li>
            <button onClick={() => signIn()}>Login</button>
          </li>)
      }
    </ul>
  )
}