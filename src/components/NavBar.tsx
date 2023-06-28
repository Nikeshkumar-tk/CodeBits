/* eslint-disable @typescript-eslint/no-misused-promises */
import { signIn, signOut, useSession } from "next-auth/react"
import {RoundedButton} from "./buttons"
import { useRouter } from 'next/router';
import Loading from "./globals/Loading";
import { useEffect, useState } from "react";
const NavigationMenu = () => {
    const { data, status } = useSession()
    const router = useRouter()
    const [hydrated, setHydrated] = useState<boolean>(false)
    useEffect(() => {
        setHydrated(true)
    }, [])
    if(!hydrated) return null
    console.log("from ui", data?.user)
    return (
        <div className="fixed w-full px-20 py-5">
            <div className="flex justify-end w-full items-center">
                <div className="flex gap-1">
                    <RoundedButton
                        text={status === "authenticated" ? "Sign out" : "Sign in"}
                        onClick={() => status === "authenticated" ? signOut() : signIn()}
                    />
                    {
                        status === "unauthenticated" && (
                            <RoundedButton text="Sign up" onClick={() => router.push("/auth/register")}/>
                        )
                    }
                </div>
            </div>
            {status === "loading" && <Loading />}
        </div>
    )
}

export default NavigationMenu