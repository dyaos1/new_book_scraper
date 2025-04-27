'use client'
import Header from "@/component/Header";

export default function AdminLayout({children}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={
      ``
    }>
      <div>
        <Header />
      </div>
      <div>
        {children}
      </div>
    </div>
  )
}