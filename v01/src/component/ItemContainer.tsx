interface ItemContainerProps {
  id: number
  title?: string
  url?: string
  price?: string
  author?: string
  mainAuthor?: string
  publisher?: string
  pubDate?: string
  description?: string
}

export default function ItemContainer({
    id,
    title,
    url,
    price,
    author,
    mainAuthor,
    publisher,
    pubDate,
    description,
  }: ItemContainerProps) {
  return (
    <div className={
      `flex
      flex-col
      w-full`
    }>
      {/* header */}
      <div className={
        `flex
        flex-row
        items-top
        gap-2`
      }>
        <div>
          {id}
        </div>
        <div>
          <div className={`hidden sm:flex`}>
            {title}
          </div>
          <a href={url} className={`flex sm:hidden`}>
            {title}
          </a>
        </div>
        <div className={`hidden sm:flex`}>
          <a href={url}>
            <small>
              {url}
            </small>
          </a>
        </div>
      </div>

      {/* body */}
      <div className={`h-15 text-sm overflow-hidden text-ellipsis opacity-70`}>
        {description}
      </div>

      {/* footer */}
      <div className={
        `flex
        flex-row
        items-center
        gap-2`
      }>
        <div className={`font-bold`}>
          {price} 원
        </div>
        <div className={`hidden font-light sm:flex`}>
          {author}
        </div>
        <div className={`flex font-light sm:hidden`}>
          {mainAuthor ? mainAuthor : '-'}
        </div>
        <div className={`font-light`}>
          {publisher}
        </div>
        <div className={`font-medium`}>
          {pubDate}
        </div>
      </div>
      <div className={`h-[1px] w-full bg-white opacity-40`}></div>
    </div>
  )
}