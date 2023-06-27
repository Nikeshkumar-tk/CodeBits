import mongoose from "mongoose";
import type { ISnippetSchema, ISnippetLanguageSchema } from "./interfaces";


const snippetSchema = new mongoose.Schema<ISnippetSchema>({
    userEmail: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    snippet: {
        type: String
    },
    tags: [String],
    title: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    language: {
        type: String
    },
    private: {
        type: Boolean
    }
});

const snippetLanguageConfigSchema = new mongoose.Schema<ISnippetLanguageSchema>(
    {
        language: {
            type: String,
            required: true,
            unique: true
        },
        defaultComment: {
            type: String
        }
    }
);


const Snippet = mongoose.models.Snippet || mongoose.model("Snippet", snippetSchema);
const SnippetLanguages = mongoose.models.SnippetLanguages || mongoose.model("SnippetLanguages", snippetLanguageConfigSchema);
export class GetMongoSchemas {
    Snippet: mongoose.Model<ISnippetSchema>
    SnippetLanguages: mongoose.Model<ISnippetLanguageSchema>
    constructor() {
        this.Snippet = Snippet;
        this.SnippetLanguages = SnippetLanguages
    }
}
