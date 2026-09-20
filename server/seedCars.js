import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const cities = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad",
  "Chennai", "Kolkata", "Surat", "Pune", "Jaipur",
  "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane",
  "Bhopal", "Visakhapatnam", "Patna", "Vadodara", "Ghaziabad",
  "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut"
];

const baseCars = [
  { name: "Maruti Swift", brand: "Maruti Suzuki", type: "Hatchback", basePrice: 1500, fuelType: "Petrol", transmission: "Manual", seatingCapacity: 5, image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80" },
  { name: "Hyundai i20", brand: "Hyundai", type: "Hatchback", basePrice: 1800, fuelType: "Petrol", transmission: "Automatic", seatingCapacity: 5, image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80" },
  { name: "Honda City", brand: "Honda", type: "Sedan", basePrice: 2500, fuelType: "Petrol", transmission: "Automatic", seatingCapacity: 5, image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80" },
  { name: "Hyundai Creta", brand: "Hyundai", type: "SUV", basePrice: 2800, fuelType: "Diesel", transmission: "Automatic", seatingCapacity: 5, image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80" },
  { name: "Toyota Innova Crysta", brand: "Toyota", type: "SUV", basePrice: 3500, fuelType: "Diesel", transmission: "Manual", seatingCapacity: 7, image: "https://images.unsplash.com/photo-1583122620071-02264c676d1e?auto=format&fit=crop&w=800&q=80" },
  { name: "Tata Nexon", brand: "Tata", type: "SUV", basePrice: 2200, fuelType: "Petrol", transmission: "Automatic", seatingCapacity: 5, image: "https://images.unsplash.com/photo-1620002093551-073c683b51b7?auto=format&fit=crop&w=800&q=80" },
  { name: "Mahindra Thar", brand: "Mahindra", type: "SUV", basePrice: 3000, fuelType: "Diesel", transmission: "Manual", seatingCapacity: 4, image: "https://images.unsplash.com/photo-1632245889029-e406faaa34cd?auto=format&fit=crop&w=800&q=80" },
  { name: "Kia Seltos", brand: "Kia", type: "SUV", basePrice: 2700, fuelType: "Petrol", transmission: "Automatic", seatingCapacity: 5, image: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=800&q=80" },
  { name: "Toyota Fortuner", brand: "Toyota", type: "SUV", basePrice: 5000, fuelType: "Diesel", transmission: "Automatic", seatingCapacity: 7, image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80" },
  { name: "Mercedes C-Class", brand: "Mercedes-Benz", type: "Luxury", basePrice: 8000, fuelType: "Petrol", transmission: "Automatic", seatingCapacity: 5, image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80" },
  { name: "BMW 3 Series", brand: "BMW", type: "Luxury", basePrice: 8000, fuelType: "Diesel", transmission: "Automatic", seatingCapacity: 5, image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80" },
  { name: "Mahindra XUV700", brand: "Mahindra", type: "SUV", basePrice: 3200, fuelType: "Petrol", transmission: "Automatic", seatingCapacity: 7, image: "https://images.unsplash.com/photo-1599824647303-34e857410403?auto=format&fit=crop&w=800&q=80" }
];

// Helper to get random number between min and max
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper to shuffle array
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const seedDB = async () => {
  try {
    console.log("Cleaning up old cars...");
    await prisma.car.deleteMany({}); // Delete existing cars before seeding new ones

    console.log("Seeding PostgreSQL with top 25 cities in India...");
    let totalCarsAdded = 0;

    for (const city of cities) {
      // Pick 5 to 6 random cars for each city
      const numCars = getRandomInt(5, 6);
      const selectedBaseCars = shuffleArray(baseCars).slice(0, numCars);

      for (const baseCar of selectedBaseCars) {
        // Vary the price slightly (between -10% and +10%) for realism
        const priceVariation = 1 + (getRandomInt(-10, 10) / 100);
        const finalPrice = Math.round(baseCar.basePrice * priceVariation / 100) * 100; // Round to nearest 100

        await prisma.car.create({
          data: {
            name: baseCar.name,
            brand: baseCar.brand,
            type: baseCar.type,
            pricePerDay: finalPrice,
            fuelType: baseCar.fuelType,
            transmission: baseCar.transmission,
            seatingCapacity: baseCar.seatingCapacity,
            location: city,
            image: baseCar.image,
            available: true,
            averageRating: (Math.random() * 1.5 + 3.5).toFixed(1) * 1, // Random rating between 3.5 and 5.0
            totalReviews: getRandomInt(5, 150)
          }
        });
        totalCarsAdded++;
      }
    }

    console.log(`✅ Successfully added ${totalCarsAdded} cars across 25 top cities!`);
  } catch (error) {
    console.error("Error seeding cars:", error);
  } finally {
    await prisma.$disconnect();
    process.exit();
  }
};

seedDB();
