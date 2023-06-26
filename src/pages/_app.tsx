import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "@/utils/api";
import "@/styles/globals.css";
import Head from "next/head";
import { useRouter } from "next/router";
import NavigationMenu from "@/components/NavBar";
import SideBar from "@/components/SideBar";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter()
  const currentPath = router.asPath
  const authPageIdentificationPattern = /^\/auth/
  return (
    <>
      <Head>
        <title>CodeBits</title>
      </Head>
      <SessionProvider session={session}>
        {!authPageIdentificationPattern.test(currentPath) && (
          <>
            <NavigationMenu />
            <SideBar />
          </>
        )}
        <div className='ml-64 pt-10 overflow-y-scroll'>
          <Component {...pageProps} />
        </div>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
