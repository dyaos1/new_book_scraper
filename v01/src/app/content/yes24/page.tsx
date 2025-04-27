'use client'
import ItemContainer from "@/component/ItemContainer"
import Paginator from "@/component/Paginator"
import { useEffect, useState } from "react"

interface NewBookItems {
  data: {
    sequence: number
    title?: string
    url?: string
    price?: string
    author?: string
    mainAuthor?: string
    publisher?: string
    pubDate?: string
    description?: string
  }[]
}

export default function ContentPage() {
  const [newBooks, setNewBooks] = useState<NewBookItems>({
    data: []
  })
  const [totalCount, setTotalCount] = useState(0)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    fetch(`/api/content/yes24?offset=${offset}`, {
      method: "GET",
    })
      .then(r => r.json())
      .then(r => {
        setNewBooks({
          // eslint-disable-next-line
          data: r.data.NewBook.map((e: any) => 
            {
              return {
                title: e.name,
                url: e.url,
                price: e.price,
                author: e.author,
                mainAuthor: e.mainAuthor,
                publisher: e.publisher,
                pubDate: e.pubDate,
                description: e.description,
                sequence: e.sequence,
              }
            }
          )
        })
        setTotalCount(r.data._count.NewBook);
      }
        
      )
  }, [offset])
  return (
    <div>
      <div>
      {
        (newBooks.data.length > 0) && newBooks.data.map((e, idx: number) => 
        {
          return (<ItemContainer 
            key={idx}
            id={offset + idx+1}
            title={e.title}
            url={e.url}
            price={e.price}
            author={e.author}
            mainAuthor={e.mainAuthor}
            publisher={e.publisher}
            pubDate={e.pubDate}
            description={e.description}
          />)
        }
        )
      }
      </div>
      <div>
        <Paginator totalCount={totalCount} setOffset={setOffset}/>
      </div>
    </div>
  )
}