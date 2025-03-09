const mongoose = require('mongoose');
const Cruise = require('./src/models/Cruise'); // Adjust the path as necessary

// Connect to the database
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Database connected');
})
.catch(err => {
  console.error('Database connection error:', err);
});

// Mock cruise data
const cruises = [
  {
    id: "mediterranean-explorer",
    name: "Mediterranean Explorer",
    image: "/images/Cards/side-view-breakfast-with-baked-grape-omelette-white-plate-balc-ony-by-sea.jpg",
    startPort: "Barcelona",
    endPort: "Rome",
    price: 1599,
    duration: "10 days",
    description: "Embark on a luxurious journey through the Mediterranean's most enchanting ports.",
    itinerary: [],
    amenities: [],
    included: [],
    highlights: [],
    ship: {
      name: "MSC Seashore",
      details: {
        capacity: "5,632 guests",
        crew: "1,648 crew members",
        length: "339 meters",
        launched: "2021"
      },
      features: []
    },
    dining: {
      restaurants: []
    }
  },
  // Add more mock cruise entries as needed
];

// Seed the database
const seedDatabase = async () => {
  await Cruise.deleteMany(); // Clear existing data
  await Cruise.insertMany(cruises); // Insert mock data
  console.log('Database seeded');
  mongoose.connection.close(); // Close the connection
};

seedDatabase();
