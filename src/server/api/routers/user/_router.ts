import { createTRPCRouter } from "../../trpc";
import { snippetRouter } from "./snippets";


export const userRouter = createTRPCRouter({
    snippet:snippetRouter
})