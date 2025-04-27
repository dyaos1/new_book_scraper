'use client'
import AuthButton from "@/component/AuthButton"
import AuthInput from "@/component/AuthInput"
import Title from "@/component/Title"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useState } from "react"

interface UserData {
  email: string
  password: string
}

export default function RegisterPage() {
  const [userData, setUserData] = useState<UserData>({
    email: "",
    password: "",
  })

  const registerNewUser = async () => {
    try {
      const login = await signIn("credentials", {
        redirect: false,
        email: userData.email,
        password: userData.password
      })
      console.log(login)
      
    } catch (e) {
      console.error(e)
    }
  }

  return (
  <div>
    <div>
      <Title label={"Login"} />
    </div>
    <div className={
      `flex
      flex-col
      gap-4`
    }>
      <AuthInput<UserData> value={userData.email} label={"email"} setter={setUserData} />
      <AuthInput<UserData> value={userData.password} label={"password"} setter={setUserData} />
      <AuthButton label={"Submit"} onClickFunction={() => registerNewUser()} />
    </div>
    <div>
      <Link href="/auth/register">Register</Link>
    </div>
  </div>)
}
