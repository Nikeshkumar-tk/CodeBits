import { Button } from "@/components/buttons"
import SnippetCard from "@/components/snippets/SnippetCard"
import { api } from "@/utils/api"
import { Roboto } from "next/font/google"
import { useRouter } from "next/router"


const roboto = Roboto({
    weight: '900',
    subsets: ['latin'],
})


const SnippetsHomePage = () => {
    const router = useRouter()
    const { data: AllSnippets } = api.user.snippet.getAllSnippets.useQuery(null)
    return (
        <div className="flex justify-center items-center mt-10 ">
            <div className="w-[60rem]">
                <div className=" flex justify-between  w-full">
                    <h1 className={`${roboto.className} font-bold text-3xl`}>Explore snippets</h1>
               <Button 
               text="Add"
               className="px-5"
               onClick={() => void router.push("/snippets/add")}
               />
                </div>

                <div className="mt-16">
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