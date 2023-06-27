import { Roboto } from "next/font/google"

const titleFont = Roboto({
    weight: '500',
    subsets: ['latin'],
})
const descriptionFont = Roboto({
    weight: '500',
    subsets: ['latin'],
})


type Props = {
    title: string
    description?: string,
    userEmail: string,
    language: string
}
const SnippetCard = (props: Props) => {
    const { title, description, language, userEmail } = props
    return (
        <div className={`w-full border`}>
            <div className="flex">
                <h1 className={`font-semibold ${titleFont.className}`}>{title}</h1>
                <p>{language}</p>
            </div>
        </div>
    )
}

export default SnippetCard