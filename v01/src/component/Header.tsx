'use client'
import Link from "next/link";

import { Playfair } from "next/font/google";
import { usePathname } from "next/navigation";

const playFair = Playfair({
  variable: "--font-palyFair",
  weight: ["400", "600", "700"],
  subsets: ["latin"],

})

export default function Header() {
  const data: HeaderItemProps[] = [
    {
      label: 'crawler',
      url: '/auth/admin/crawl',
    },
    {
      label: 'manage',
      url: '/auth/admin/manage',
    },
    {
      label: 'record',
      url: '/auth/admin/record',
    },
  ]

  return (
    <div className={
      `flex flex-row w-full justify-center gap-4`
    }>
      {data.map((e, i) => {
        return (
          <HeaderItem key={`headerItem-${i}`} label={e.label} url={e.url}/>
        )
      })}
    </div>
  )
}

interface HeaderItemProps {
  label: string
  url: string
}

function HeaderItem({
  label,
  url,
}: HeaderItemProps) {
  const pathname = usePathname()
  const isActive = pathname.includes(url)
  return (
    <div className={playFair.className}>
      <Link href={url}>
        <div className={`flex w-32 h-14 justify-center items-center --font-playFair text-xl`}>
          <p className={`border-b-[1px] px-2 ${isActive || 'opacity-50'}`}>
          {label}
          </p>
        </div>
      </Link>
    </div>
  )
}