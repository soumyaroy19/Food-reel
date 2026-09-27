const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes =require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const foodPartnerRoutes=require('./routes/food-partner.routes');
const cors=require('cors')




const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://food-reel-fronend.onrender.com"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/food-partner', foodPartnerRoutes)



module.exports = app;
