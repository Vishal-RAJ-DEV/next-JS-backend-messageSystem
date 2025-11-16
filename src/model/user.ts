import mongoose , {Schema , Document} from "mongoose";

//document is an interface provided by mongoose which represents a document in MongoDB and its needed for type checking
export interface message extends Document { //here interface is used to define the structure of a message document in MongoDB
    content  : string;
    createdAt: Date;
}

const messageSchema = new Schema<message>({//here we define the schema for the message document this is used by mongoose to create the model and interact with the database
    content :{
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


export interface User extends Document {
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    verifiedcode : string;
    verifiedCodeExpiry : Date;
    isVerified : boolean;
    isAcceptingMessages : boolean;
    messages : message[]; //array of message subdocuments
}

const userSchema = new Schema<User>({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique : true,
        trim: true,
    },
    email: {
        type: String,
        required: true,     
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    verifiedcode: {
        type: String,
        required: true
    },
    verifiedCodeExpiry: {
        type: Date,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessages: {
        type: Boolean,
        default: false
    },
    messages: [messageSchema] //array of message subdocuments
    
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User', userSchema);
//here we are using the mongoose.models object to check if the model already exists if it does we use it otherwise we create a new model this is needed to prevent overwriting the model when using hot reloading in development mode in Next.js

export default UserModel;