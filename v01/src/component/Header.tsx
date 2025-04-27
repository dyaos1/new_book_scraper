'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";

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
    <div>
      <Link href={url}>
        <div className={`flex w-32 h-14 justify-center items-center text-xl`}>
          <p className={`border-b-[1px] px-2 font-main ${isActive || 'opacity-50'}`}>
          {label}
          </p>
        </div>
      </Link>
    </div>
  )
}