import mongoose from "mongoose";

type connectionObject = { //here we define a type for the connection object to keep track of the connection status
    isConnected?: number;
}

const connection: connectionObject = {} //here we define a connection object to keep track of the connection status

async function dbConnect() : Promise<void> {
    if (connection.isConnected) { //if we are already connected we return
        console.log('already connected  in the database');
        return;
    }

    try {
        //in the or clause we provide a fallback empty string to avoid passing undefined to mongoose.connect this is a TypeScript requirement as the type of process.env.MONGODB_URI is string | undefined and also empty brackets are passed to mongoose.connect as the second argument to avoid deprecation warnings
        const db = await mongoose.connect(process.env.MONGODB_URI as string || "" , {}); //here we connect to the database using the connection string from the environment variable

        connection.isConnected = db.connections[0].readyState; //here we set the connection status to the readyState of the first connection in the connections array
        console.log('connected to database');
    } catch (error) {
        console.error('Error connecting to database:', error);
        process.exit(1); //if there is an error we exit the process with a failure code
    }
}

export default dbConnect;