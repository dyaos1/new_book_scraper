'use client'

import { Dispatch, SetStateAction, useEffect, useState } from "react"

interface PaginatorProps {
  totalCount: number
  setOffset: Dispatch<SetStateAction<number>>
}

export default function Paginator({
  totalCount,
  setOffset,
}: PaginatorProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [paginatorUnits, setPaginatorUnits] = useState<(string | number)[]>([])

  useEffect(() => {
    setPaginatorUnits(paginatorUnitGenerator(totalCount, currentPage))
    setOffset((currentPage - 1) * 10)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, totalCount])

  return (
    <div className='flex flex-row justify-between text-center gap-2 p-4'>
      {
        paginatorUnits.map(
          (e, i) => <PaginatorUnit 
                      key={`paginatorUnit${i}`}
                      value={e} 
                      setter={setCurrentPage}
                      totalCount={totalCount}
                      currentPage={currentPage}
                      mobile={Number.isNaN(Number(e))}
                    />
        )
      }
    </div>
  )
}

const PaginatorUnit = ({
  value,
  totalCount,
  currentPage,
  mobile,
  setter,
}: {
  value: string|number,
  totalCount: number,
  currentPage: number,
  mobile: boolean,
  setter: Dispatch<SetStateAction<number>>
}) => {
  const last = Math.ceil((totalCount - 1) / 10)

  const hidden = (value === "<" && currentPage === 1) 
                || (value === "<<" && currentPage === 1)
                || (value === ">" && currentPage === last)
                || (value === ">>" && Math.floor((currentPage - 1)/ 10) === Math.floor((totalCount - 1) / 100))

  const clickPaginatorUnit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    switch(value) {
      case '<<':
        setter(1)
        break;
      case '<':
        setter(prev => prev-1)
        break;
      case '>':
        setter(prev => prev+1)
        break;
      case '>>':
        setter(last)
        break;
      default :
        setter(Number((e.target as HTMLButtonElement).innerText))
        break;
    }
  }
  return (
    <div className={``}>
      <button 
        disabled={currentPage === value}
        className={
        `hover:cursor-pointer
        disabled:cursor-default
        disabled:bg-blue-500
        ${mobile && !hidden ? 'block' : 'hidden'}
        ${mobile && 'border-2 rounded-md'}
        ${hidden || 'sm:block'}
        text-2xl
        font-light
        sm:text-base
        px-2`
        }
        onClick={clickPaginatorUnit}
      >{value}</button>
    </div>
  )
}

const paginatorUnitGenerator = (totalItemsCount: number, currentPage: number) => {
  if (!totalItemsCount) return [];

  const deci = Math.floor((currentPage - 1) / 10);

  let max = 11;
  if (deci === Math.floor((totalItemsCount - 1) / 100)) {
    max = (Math.floor((totalItemsCount - 1) / 10) % 10) + 2;
  }
  // console.log('currentPage', currentPage)
  // console.log('totalItemsCount', currentPage)
  // console.log('max', max);

  const units: (string | number)[] = []
  let i = 1
  while(i < 11) {
    if (i<max) {
      units.push((deci * 10) + i)
    } else {
      units.push(" ")
    }
    i++;
  }

  return ["<<", "<", ...units, ">", ">>"];
}