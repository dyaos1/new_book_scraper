'use client'
import { signIn } from "next-auth/react"

export default function TestPage() {
  const onCllick = () => {
    signIn('google')
  }

  return(
    <>    
      <div>test page</div>
      <button onClick={onCllick}>click</button>
    </>

  )
}