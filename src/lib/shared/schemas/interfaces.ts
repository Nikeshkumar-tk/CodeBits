import type { Document } from "mongoose";

export interface ISnippetLanguageSchema extends Document {
    language:string,
    defaultComment:string
}

export interface ISnippetSchema extends Document {
    title: string;
    private: boolean;
    snippet: string;
    language: string;
    username: string;
    userEmail: string;
    tags: string[];
    description?: string | undefined;
}


