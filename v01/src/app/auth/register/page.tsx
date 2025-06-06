'use client'
import AuthButton from "@/component/AuthButton"
import AuthInput from "@/component/AuthInput"
import Title from "@/component/Title"
import { signIn } from "next-auth/react"
import { useState } from "react"

interface UserData {
  name: string
  email: string
  password1: string
  password2: string
}

export default function RegisterPage() {
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    password1: "",
    password2: "",
  })

  const registerNewUser = async () => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password1,
        })
      }).then(r => r.json())

      if (response.success) {
        const login = await signIn("credentials", {
          redirect: false,
          email: userData.email,
          password: userData.password1
        })
        console.log(login)
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
  <div>
    <div>
      <Title label={"Register"} />
    </div>
    <div className={
      `flex
      flex-col
      gap-4`
    }>
      <AuthInput<UserData> value={userData.name} label={"name"} setter={setUserData} />
      <AuthInput<UserData> value={userData.email} label={"email"} setter={setUserData} />
      <AuthInput<UserData> value={userData.password1} label={"password1"} setter={setUserData} />
      <AuthInput<UserData> value={userData.password2} label={"password2"} setter={setUserData} />
      <AuthButton label={"Submit"} onClickFunction={() => registerNewUser()} />
    </div>
  </div>)
}
