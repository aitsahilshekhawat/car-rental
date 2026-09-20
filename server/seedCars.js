import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const dummyCars = [
  {
    name: "Mercedes-Benz S-Class",
    brand: "Mercedes",
    type: "Luxury",
    pricePerDay: 15000,
    fuelType: "Petrol",
    transmission: "Automatic",
    seatingCapacity: 5,
    location: "Mumbai",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80",
    available: true,
  },
  {
    name: "BMW M4 Competition",
    brand: "BMW",
    type: "Premium",
    pricePerDay: 18000,
    fuelType: "Petrol",
    transmission: "Automatic",
    seatingCapacity: 4,
    location: "Delhi",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
    available: true,
  },
  {
    name: "Porsche 911 Carrera",
    brand: "Porsche",
    type: "Premium",
    pricePerDay: 25000,
    fuelType: "Petrol",
    transmission: "Automatic",
    seatingCapacity: 2,
    location: "Pune",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
    available: true,
  },
  {
    name: "Range Rover Velar",
    brand: "Land Rover",
    type: "SUV",
    pricePerDay: 12000,
    fuelType: "Diesel",
    transmission: "Automatic",
    seatingCapacity: 5,
    location: "Bangalore",
    image: "https://images.unsplash.com/photo-1606016159991-dde622eb1f4a?auto=format&fit=crop&w=800&q=80",
    available: true,
  },
  {
    name: "Audi RS7 Sportback",
    brand: "Audi",
    type: "Premium",
    pricePerDay: 20000,
    fuelType: "Petrol",
    transmission: "Automatic",
    seatingCapacity: 4,
    location: "Chandigarh",
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80",
    available: true,
  },
  {
    name: "Tesla Model S Plaid",
    brand: "Tesla",
    type: "Electric",
    pricePerDay: 16000,
    fuelType: "Electric",
    transmission: "Automatic",
    seatingCapacity: 5,
    location: "Mumbai",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80",
    available: true,
  },
  {
    name: "Volvo XC90 Inscription",
    brand: "Volvo",
    type: "SUV",
    pricePerDay: 14000,
    fuelType: "Hybrid",
    transmission: "Automatic",
    seatingCapacity: 7,
    location: "Delhi",
    image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=800&q=80",
    available: true,
  },
  {
    name: "Mercedes-AMG G63",
    brand: "Mercedes",
    type: "SUV",
    pricePerDay: 35000,
    fuelType: "Petrol",
    transmission: "Automatic",
    seatingCapacity: 5,
    location: "Pune",
    image: "https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=800&q=80",
    available: true,
  },
];

const seedDB = async () => {
  try {
    console.log("Seeding PostgreSQL via Prisma...");

    for (const car of dummyCars) {
      await prisma.car.create({ data: car });
    }

    console.log("8 Luxury Cars added successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding cars:", error);
    process.exit(1);
  }
};

seedDB();
