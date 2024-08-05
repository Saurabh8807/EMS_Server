import dotenv from 'dotenv'
import { app } from './app.js'
import connectDB from './src/db/index.js'

dotenv.config({
    path:'./.env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server running on port ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("MongoDB Connection Failed !!!", err)
})