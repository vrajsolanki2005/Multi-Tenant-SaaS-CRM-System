const app = require('./app');
const db = require('./config/db')

const PORT = process.env.PORT || 3000;

async function startServer(){
    try{
        const conn = await db.getConnection();
        console.log("DataBase Connected Successfully!")
        conn.release();

        app.listen(PORT, ()=>{
            console.log(`Server is running on port ${PORT}`);
        })
    }
    catch(err){
        console.log("Error while connecting to DB", err)
    }
}

startServer();