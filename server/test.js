import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  try {
    console.log("Connecting...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected!");
    
    const Car = mongoose.model('Car', new mongoose.Schema({
      name: String, brand: String, pricePerDay: Number
    }));
    
    console.log("Querying...");
    const cars = await Car.find({});
    console.log("Cars:", cars.length);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    process.exit(0);
  }
}
test();
