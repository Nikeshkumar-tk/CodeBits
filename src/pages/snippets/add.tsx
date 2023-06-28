import { Roboto } from "next/font/google"
import Editor from '@monaco-editor/react';
import Select from 'react-select';
import { useRef, useState } from "react";
import { Button } from "@/components/buttons";
import { api } from "@/utils/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

const roboto = Roboto({
    weight: '900',
    subsets: ['latin'],
})

type SnippetLanguageOptions = {
    language: string
    defaultComment: string
}


type NewSnippetObject = {
    title: string,
    description?: string,
    snippet: string,
    language:string,
    private:boolean
}

const AddTemplatePage = () => {
    const [languageOptions, setLanguageOptions] = useState<Array<SnippetLanguageOptions> | undefined>([])
    const [snippetLanguage, setSnippetLanguage] = useState<string>("javascript")
    const [newSnippet, setNewSnippet] = useState<string >("//Type your javascript code here")
    const newSnippetTitleRef = useRef<HTMLInputElement>(null)
    const newSnippetDescriptionRef = useRef<HTMLTextAreaElement>(null)
    const router = useRouter()
    const { isLoading: snippetLanguageconfigLoading } = api.configs.getConfig.useQuery("SnippetLanguages", {
        onSuccess:(response) => setLanguageOptions(response)
    })
    const {mutate:addSnippet, isLoading:addingNewSnippetLoading}  = api.user.snippet.add.useMutation({
        onSuccess:() => {
            toast.success("Snippet creatted sucessfully")
            void router.push("/snippets")
        }
    })

    const handleSnippetLanguageOptionChange = function (newValue: SnippetLanguageOptions) {
        setSnippetLanguage(newValue.language)
        setNewSnippet(newValue.defaultComment)
    }

    const handleAddingNewCodeSnippet =  function () {
        console.log(newSnippet)
        const newSnippetObject: NewSnippetObject = {
            title: newSnippetTitleRef.current?.value as string,
            snippet:newSnippet,
            language:snippetLanguage,
            private:false
        }
        if(newSnippetDescriptionRef.current?.value !== null){
            newSnippetObject.description = newSnippetDescriptionRef.current?.value
        }
        addSnippet(newSnippetObject)
    }


    return (
        <div className="pt-3 px-3 grid place-content-center ">
            <div className="mx-auto w-[65rem] ">
                <h1 className={`font-mono text-2xl ${roboto.className}`}>Add new code snippets</h1>
                <div className="mt-5">
                    <div className="flex gap-10">
                        <input type="text" ref={newSnippetTitleRef} className="flex h-10 rounded-md border border-black/30 bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursorallowed disable-not-d:opacity-50 w-1/2" placeholder="Enter a title" />
                        <Select
                            options={languageOptions}
                            placeholder="select language"
                            getOptionLabel={(option) => option.language}
                            getOptionValue={(option) => option.language}
                            defaultValue={{ language: "javascript", defaultComment: "//Type your javascript snippet here" }}
                            className="w-64"
                            onChange={newValue => handleSnippetLanguageOptionChange(newValue as SnippetLanguageOptions)}
                            isLoading={snippetLanguageconfigLoading}
                        />
                    </div>
                    <div className="mt-5 h-64 rounded-3xl w-full">
                        <Editor
                            height="100%"
                            language={snippetLanguage}
                            value={newSnippet}
                            theme="vs-dark"
                            className="w-full"
                            // onChange={value => setNewSnippet(value)}
                        />
                    </div>
                    <div>
                        <textarea name="" id="" ref={newSnippetDescriptionRef} className="flex h-32 rounded-md border border-black/30 bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 w-full resize-none mt-4" placeholder="Give your description (optional)" />
                    </div>
                    <div className="flex justify-end items-center mt-10">
                        <Button
                            text="Add"
                            className="px-6"
                            onClick={handleAddingNewCodeSnippet}
                            disabled={addingNewSnippetLoading}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddTemplatePage