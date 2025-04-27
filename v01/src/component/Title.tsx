interface TitleProps {
  label: string
}

export default function Title({label}: TitleProps) {
  return (
    <div
      className={
        `w-full
        my-4
        border-b-2`
    }>
      <p
        className={
          `text-2xl
          font-light
          font-serif`
      }>
        {label}
      </p>

    </div>
  )
}