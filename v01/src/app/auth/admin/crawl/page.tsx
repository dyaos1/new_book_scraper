'use client'

import { useEffect, useState } from "react";

export default function CrawlPage() {
  const [yes24Message, setYes24Message] = useState("")
  const [kyoboMessage, setKyoboMessage] = useState("")
  const [isYes24CrawlerOccupied, setYes24CrawlerOccupied] = useState(false)
  const [isKyoboCrawlerOccupied, setKyoboCrawlerOccupied] = useState(false)

  useEffect(() => {
    fetch('/api/crawler/status', {
      method: "GET",
    })
      .then(r => r.json())
      .then(r => {
        console.log(r);
        setYes24CrawlerOccupied(r);
      })
  }, [yes24Message, kyoboMessage])

  useEffect(() => {
    fetch('/api/crawler/status', {
      method: "GET",
    })
      .then(r => r.json())
      .then(r => {
        console.log(r);
        setKyoboCrawlerOccupied(r);
      })
  }, [yes24Message, kyoboMessage])

  const crawlYes24 = async () => {
    const flag = await fetch('/api/crawler/status', {
      method: "GET",
    })
      .then(r => r.json())
      .then(r => {
        return r
      })
    if(flag) return;

    setYes24Message('Yes24 크롤러 시작')
    let isDone = false;

    const eventSource = new EventSource("/api/crawler/yes24");
    eventSource.onmessage = (event) => {
      const data = event.data;
      if(data === '{%FINISHED%}') {
        isDone = true
        eventSource.close();
        setYes24Message('완료');
        return;
      }
      setYes24Message(data)
    }
  
    eventSource.onerror = (error) => {
      if (isDone) return;
      console.error(error);
      console.error("연결 종료");
      eventSource.close();
    };
  }

  const crawlKyobo = () => {
    let isDone = false;

    const eventSource = new EventSource("/api/crawler/kyobo");
    eventSource.onmessage = (event) => {
      const data = event.data;
      if(data === '{%FINISHED%}') {
        isDone = true
        eventSource.close();
        setKyoboMessage('완료');
        return;
      }
      setKyoboMessage(data)
    }
  
    eventSource.onerror = (error) => {
      if (isDone) return;
      console.error(error);
      console.error("연결 종료");
      eventSource.close();
    };
  }


  return (
    <div>
      <div className={`flex flex-col justify-center w-full`}>
        <ContentRow 
          bookStore={"Yes24"}
          onWorking={isYes24CrawlerOccupied}
          streamMessage={yes24Message}
          startCrawling={crawlYes24}
        />
        <ContentRow 
          bookStore={"Kyobo"}
          onWorking={isKyoboCrawlerOccupied}
          streamMessage={kyoboMessage}
          startCrawling={crawlKyobo}
        />
      </div>
    </div>
  )
}

interface ContentRowProps {
  bookStore: string
  onWorking: boolean
  streamMessage: string
  startCrawling: () => void
}

function ContentRow({
  bookStore,
  onWorking,
  streamMessage,
  startCrawling,
}: ContentRowProps) {
  return (
    <div className={`flex flex-row justify-baseline gap-2`}>
      <div
        className={`flex justify-center items-center p-2 w-1/6`}
      >
        <strong>
          {bookStore}
        </strong>
      </div>
      <div
        
        className={`flex justify-center items-center p-2`}
      >
        <button 
          className={
            `flex
            flex-row
            justify-center 
            items-center 
            gap-2
            hover:cursor-pointer
            rounded-sm
            border-2
            border-white
            px-2`}
          onClick={startCrawling}
        >
          <p>Run</p>
          <div className={`
          h-2
          w-2 
          rounded-full 
          ${onWorking? 'bg-red-500' : 'bg-green-500'}
        `}></div>
        </button>
      </div>
      <div
        
        className={`flex justify-center items-center p-2`}
      >
        <p>
          {streamMessage}
        </p>
      </div>
    </div>
  )
}