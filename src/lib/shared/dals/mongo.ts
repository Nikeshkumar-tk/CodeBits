/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import mongoose,  { type MongooseError } from "mongoose"
import {type MONGO_COLLECTIONS } from "../enums"
import { GetMongoSchemas } from "../schemas/mongoSchema"
import type { ISnippetLanguageSchema, ISnippetSchema } from "../schemas/interfaces"


export interface IMongoDal{
    mongoUrl:string,
    getMongoSchema:GetMongoSchemas
}

export interface  ICreateItem{
    data:any
    resource:string
    uniqueCheck?:any
}

type MongoPromiseType = Promise<
ISnippetLanguageSchema |
ISnippetLanguageSchema[] |
ISnippetSchema |
ISnippetSchema[] |
undefined |
MongooseError
> | undefined | MongooseError

export interface IGetItems{
    resource:MONGO_COLLECTIONS,
    queryObj?:any
}

class MongoDal implements IMongoDal {
    mongoUrl: string;
    getMongoSchema: GetMongoSchemas;
    constructor() {
      this.mongoUrl = process.env.MONGODB_URL!;
      this.getMongoSchema = new GetMongoSchemas();
      this.createItem = this.createItem.bind(this);
      this.getItems = this.getItems.bind(this);
    }
    async createItem({ data, resource, uniqueCheck }: ICreateItem) {
      await mongoose.connect(this.mongoUrl);
      const model:mongoose.Model<any> = mongoose.model(resource)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      if (uniqueCheck && Object.entries(uniqueCheck).length !== 0) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const duplicate = await model.findOne(uniqueCheck);
        console.log("Duplicate data", duplicate);
        if (duplicate) {
          const errorObj = new Error();
          errorObj.message = "Duplicate entry";
          errorObj.name = "401 error";
          throw errorObj;
        }
      }
      const result:MongoPromiseType= await model.create(data);
      return result;
      
    }
    async getItems({ resource, queryObj }: IGetItems) {
      await mongoose.connect(this.mongoUrl);
      let result;
      try {
        const model = mongoose.model(resource);
        if (!queryObj) {
          result = await model.find({});
        }
        return result;
      } catch (error) {
      }
     
  }
  }

  export default MongoDal