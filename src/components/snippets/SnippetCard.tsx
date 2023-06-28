// import { Roboto } from "next/font/google"

// const titleFont = Roboto({
//     weight: '500',
//     subsets: ['latin'],
// })



type Props = {
    title: string
    description?: string,
    userEmail: string,
    language: string
}
const SnippetCard = (props: Props) => {
    const { title, language, userEmail } = props
    return (
        <div className="w-full border border-gray-200 shadow-md hover:shadow-lg px-5 py-3 rounded-lg cursor-pointer">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-semibold text-xl">{title}</h1>
          <p className="bg-gray-900 text-white rounded-full px-2 py-1 text-xs">{language}</p>
        </div>
        <div className="flex items-center justify-end">
          <p className="text-sm text-gray-600">{userEmail}</p>
        </div>
      </div>
    )
}

export default SnippetCard