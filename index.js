import 'dotenv/config'
import express from 'express';
import { connectDB } from './db/db.js';
import { dbname } from './src/constants.js';
connectDB()
let app=express();


