interface AuthButtonProp {
  label: string
  onClickFunction: () => void
}

export default function AuthButton({label, onClickFunction}: AuthButtonProp) {
  return (
    <div className={
      `w-full`
    }>
      <button 
        onClick={onClickFunction}
        className={
          `w-full
          p-2.5
          rounded-lg
          bg-sky-500
          text-md
          hover:cursor-pointer`
        }
      >
        {label}
      </button>
    </div>
  )
}