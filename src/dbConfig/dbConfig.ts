//todo: Read up on:-
//todo:   (1) process.exit()
//todo:   (2) connection events 

import mongoose from "mongoose";

export async function connectMongo() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || "";                      //? This is done to make sure that mongoose.connect is passed a string
    mongoose.connect(MONGODB_URI);

    const connection = mongoose.connection;                                 //? This stores the connection object

    connection.on("connected", () => {
      console.log("Connected to MongoDB");
    });

    connection.on("error", (error) => {
      console.error("Error connecting to MongoDB :: \n" + error);
      console.log("Please make sure that MongoDB is up and running");
      process.exit(1);                                                      //? This is done to stop the execution of code because there is an error
    });

  } catch (error) {
    console.error("Error connecting to MongoDB :: \n" + error);
  }
}


    // mongoose.connect(process.env.MONGODB_URI); 
    // This shows an error because of typeSafety issues
    // could have also added an ! after process.env.MONGODB_URI