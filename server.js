import "dotenv/config";
import app from "./app.js";
import connectToDatabase from "./database.js";

const connection = connectToDatabase();

connection.then(() => {
    console.log("Connected");
    
    app.listen(process.env.SERVER_PORT, () => {
        console.log("Server listening on http://localhost:" + process.env.SERVER_PORT)
    });
}).catch((err) =>{
    console.log(err.message)
});