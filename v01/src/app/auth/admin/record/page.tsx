'use client'
import React, { useEffect, useState } from 'react'

interface Data {
  sequence: number
  type: string
  success: boolean
  bookCount: number
  startAt: string
  finishedAt: string
}

function RecordPage() {
  const [data, setData] = useState<Data[]>([])

  useEffect(() => {
    fetch('/api/manage/record', {
      method: 'GET',
    })
      .then(r => r.json())
      .then(r => {
        // eslint-disable-next-line
        const resData = r.data.map((e: any, i: any) => {
          return {
            sequence: i,
            type: e.targetSite,
            success: e.finished,
            bookCount: e._count.NewBook,
            startAt: e.createdAt,
            finishedAt: e.finishedAt,
          }
        })

        console.log(resData)
        setData(resData)
      })
  }, [])
  return (
    <div>
      {
        (data.length !== 0) && data.map((e, i) => {
          const startDate = new Date(e.startAt)
          const startAt = `${startDate.getFullYear()}-` 
            + `${String(startDate.getMonth() + 1).padStart(2, "0")}-`
            + `${String(startDate.getDate()).padStart(2, "0")}`
            + ` ${String(startDate.getHours()).padStart(2, "0")}:`
            + ` ${String(startDate.getMinutes()).padStart(2, "0")}:`
            + ` ${String(startDate.getSeconds()).padStart(2, "0")}`
          const finishedDate = new Date(e.finishedAt)
          const finishedAt = `${finishedDate.getFullYear()}-` 
            + `${String(finishedDate.getMonth() + 1).padStart(2, "0")}-`
            + `${String(finishedDate.getDate()).padStart(2, "0")}`
            + ` ${String(finishedDate.getHours()).padStart(2, "0")}:`
            + ` ${String(finishedDate.getMinutes()).padStart(2, "0")}:`
            + ` ${String(finishedDate.getSeconds()).padStart(2, "0")}`
          return <DataRow 
            key={i} 
            sequence={e.sequence}
            type={e.type}
            success={e.success}
            bookCount={e.bookCount}
            startAt={startAt}
            finishedAt={finishedAt}
          />
        })
      }
    </div>
  )
}

export default RecordPage


const DataRow = ({
  sequence,
  type,
  success,
  bookCount,
  startAt,
  finishedAt,
}: Data) => {
  return (
    <div className={`flex flex-row gap-4`}>
      <div>
        {sequence}
      </div>
      <div>
        {type}
      </div>
      <div>
        {bookCount}
      </div>
      <div>
        {success.toString()}
      </div>
      <div>
        {startAt}
      </div>
      <div>
        {finishedAt}
      </div>
    </div>
  )
}