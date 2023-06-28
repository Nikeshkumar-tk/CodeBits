import { Button } from "@/components/buttons"
import Loading from "@/components/globals/Loading"
import SnippetCard from "@/components/snippets/SnippetCard"
import { api } from "@/utils/api"
import { Roboto } from "next/font/google"
import { useRouter } from "next/router"
import { AiOutlineSearch } from "react-icons/ai"

const roboto = Roboto({
    weight: '900',
    subsets: ['latin'],
})


const SnippetsHomePage = () => {
    const router = useRouter()
    const { data: AllSnippets, isLoading: snippetsLoading } = api.user.snippet.getAllSnippets.useQuery(null)
    return (
        <div className="flex justify-center items-center mt-10 ">
            <div className="w-[68rem]">
                <div className=" flex justify-between  w-full">
                    <h1 className={`${roboto.className} font-bold text-3xl`}>Explore snippets</h1>
                    <Button
                        text="Add"
                        className="px-5"
                        onClick={() => void router.push("/snippets/add")}
                    />
                </div>

                <div className="mt-2 flex  h-10 rounded-md items-center border border-black/30 bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus-within:ring-1 focus-within:ring-black/30 focus:ring-offset-1 disabled:cursorallowed focus-within:ring-offset-1 disable-not-d:opacity-50 w-1/2">
                    <input type="text" placeholder="Search snippets..." className="outline-none border-none w-full h-full flex-1" />
                    <AiOutlineSearch size={23} className="cursor-pointer" />
                </div>
                {snippetsLoading && 
                <div className="w-full flex justify-center items-center">
                    <div
                    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status" />
                </div>
                }
                <div className="mt-3 grid sm:grid-cols-3 gap-3">
                    {AllSnippets?.map(snippet => (
                        <SnippetCard
                            title={snippet.title}
                            description={snippet.description}
                            language={snippet.language}
                            userEmail={snippet.userEmail}
                            key={snippet._id as string}
                        />
                    ))

                    }
                </div>
            </div>
        </div>
    )
}

export default SnippetsHomePage