import 'dotenv/config'
import { connectDB } from './src/db/db.js';
import { app } from './src/app.js';
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 5173,()=>{
        console.log(`Server is running at port ${process.env.PORT || 5173}`);
    })
})
.catch((err)=>{
    console.log(`MONGODB CONNECTION ERROR`,err);
})
