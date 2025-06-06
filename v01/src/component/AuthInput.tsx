type AuthInputProp<T> = {
  value: string
  label: keyof T
  setter: React.Dispatch<React.SetStateAction<T>>
}

export default function AuthInput<T extends object>(
  {
    value, 
    label, 
    setter
  }: AuthInputProp<T>
) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setter((prev) => ({
      ...prev,
      [label]: value,
    }))
  }
  return(
    <div className={
      `relative 
      z-0`
    }>
      <input 
        type="text" 
        id={`floating_standard_${label.toString()}`}
        onChange={handleChange}
        className={
          `block 
          py-2.5 
          px-0 
          w-full 
          text-sm 
          text-gray-900 
          bg-transparent 
          border-0 
          border-b-2 
          border-gray-300 
          appearance-none 
          dark:text-white 
          dark:border-gray-600 
          dark:focus:border-blue-500
          focus:outline-none 
          focus:ring-0 
          focus:border-blue-600 
          peer
        `} 
        placeholder=" "
        value={value}
      />
      <label 
        htmlFor={`floating_standard_${label.toString()}`}
        className={
          `absolute 
          text-sm 
          text-gray-500 
          dark:text-gray-400 
          duration-300 
          transform
          -translate-y-6
          scale-75
          top-3
          -z-10
          origin-[0]
          peer-focus:start-0
        peer-focus:text-blue-600
        peer-focus:dark:text-blue-500
          peer-placeholder-shown:scale-100
          peer-placeholder-shown:translate-y-0 
          peer-focus:scale-75 
          peer-focus:-translate-y-6 
          rtl:peer-focus:translate-x-1/4 
          rtl:peer-focus:left-auto`                                           
      }>
        {label.toString()}
      </label>
    </div>
  )
}
