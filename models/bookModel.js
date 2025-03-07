import mongoose,{Schema} from "mongoose";
import { type } from "os";
import AutoIncrement from "mongoose-sequence";


const bookSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please provide a book name"],
    },
    id: {
        type: Number,
        unique: true
    },
    bookId:{
        type:String
    },
    author:{
        type:String,
        required:[true,"Please provide a author"],
    },
    publication:{
        type:String,
        required:[true,"Please provide a publication"]
    },
   price:{
    type:Number,
    required:true
   },
   issue:{
    type:Boolean,
    default:false
   },
   borrower:{
  type:String
   },
   number:{
type:Number
   },
   issueDate:{
    type:Date
   },
})

bookSchema.plugin(AutoIncrement(mongoose), { inc_field: "id" });
const Book= mongoose.models.books || mongoose.model("books",bookSchema)

export default Book