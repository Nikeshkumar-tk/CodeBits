import { type ButtonHTMLAttributes } from "react"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    text: string
}

const RoundedButton = (props: ButtonProps) => {
    const { text, ...otherProperties } = props
    return (
        <button
            type="button"
            className="rounded-full bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            {...otherProperties}
        >
            {text}
        </button>)
}

const Button = (props: ButtonProps) => {
    const { text, className, ...otherProperties } = props
    return (
        <button
            className={`rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${className}`}
            {...otherProperties}
        >
            {text}
        </button>
    )
}
export { RoundedButton, Button }