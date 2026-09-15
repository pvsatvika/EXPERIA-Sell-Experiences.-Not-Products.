const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');
const Product = require('./models/Product');

// Fallback to public DNS servers if local Windows resolver blocks SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Use default if custom DNS servers fail to set
}

dotenv.config();

const experiences = [
  {
    title: 'Mars Expedition',
    description: 'Immersive Mars expedition using VR, motion simulation and environmental effects to explore the Martian surface, operate a rover and visit a simulated Mars habitat.',
    price: 1250000,
    category: 'Immersive Simulation',
    realityType: 'IMMERSIVE',
    duration: '5 Days',
    location: 'Mars Simulation Center',
    image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80',
    rating: 4.95,
    available: true
  },
  {
    title: 'Zero-Gravity Space Tour',
    description: 'A futuristic concept preview exploring commercial suborbital shuttle travel and low Earth orbit zero-gravity weightlessness.',
    price: 850000,
    category: 'Space Concept',
    realityType: 'FUTURE CONCEPT',
    duration: '3 Hours',
    location: 'Earth Low Orbit',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    available: true
  },
  {
    title: 'Moon Base Escape',
    description: 'Hyper-realistic lunar dome simulation with 1/6th gravity harness systems, lunar terrain buggies and Earth-rise projections.',
    price: 750000,
    category: 'Lunar Simulation',
    realityType: 'IMMERSIVE',
    duration: '3 Days',
    location: 'Lunar Simulation Facility',
    image: 'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?auto=format&fit=crop&w=800&q=80',
    rating: 4.91,
    available: true
  },
  {
    title: 'Deep Ocean Expedition',
    description: 'Real-world descent into the deepest trench on Earth inside a titanium-hulled deep submergence ocean vehicle.',
    price: 520000,
    category: 'Oceanic Deep-Dive',
    realityType: 'REAL-WORLD',
    duration: '12 Hours',
    location: 'Challenger Deep, Pacific Ocean',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    rating: 4.85,
    available: true
  },
  {
    title: 'Underwater City Discovery',
    description: 'A visionary future concept preview exploring submerged bio-dome living habitats and pressurized abyssal marine environments.',
    price: 350000,
    category: 'Submerged Concept',
    realityType: 'FUTURE CONCEPT',
    duration: '2 Days',
    location: 'Sub-Pacific Bio-Dome',
    image: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=800&q=80',
    rating: 4.87,
    available: true
  },
  {
    title: 'Time-Travel Simulation',
    description: 'Quantum neural sensory reconstruction allowing guests to experience ancient Alexandria and Cretaceous Earth in full fidelity.',
    price: 290000,
    category: 'Quantum Neural',
    realityType: 'IMMERSIVE',
    duration: '6 Hours',
    location: 'Chronos Quantum Chamber',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    rating: 4.92,
    available: true
  },
  {
    title: 'Hyperloop Racing',
    description: 'Full-motion magnetic levitation pod racing inside vacuum subterranean simulator tubes at supersonic speeds.',
    price: 235000,
    category: 'High-Velocity',
    realityType: 'IMMERSIVE',
    duration: '2 Hours',
    location: 'Neo-Tokyo Simulation Center',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
    rating: 4.88,
    available: true
  },
  {
    title: 'Future City Exploration',
    description: 'Guided spatial exploration of 2150 sustainable megacity architecture, sky-bridges and vertical rainforests.',
    price: 180000,
    category: 'Spatial Exploration',
    realityType: 'IMMERSIVE',
    duration: '1 Day',
    location: 'Singapore Cyber-District',
    image: 'https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    available: true
  },
  {
    title: 'Aurora Sky Flight',
    description: 'Authentic stratospheric night flight through dancing green and violet aurora borealis curtains in a glass-canopy aircraft.',
    price: 150000,
    category: 'Atmospheric Flight',
    realityType: 'REAL-WORLD',
    duration: '5 Hours',
    location: 'Arctic Circle',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=800&q=80',
    rating: 4.96,
    available: true
  },
  {
    title: 'Virtual Reality Art World',
    description: 'Step into interactive volumetric dreamscapes where thoughts manifest as living geometric light sculptures and auditory waves.',
    price: 100000,
    category: 'Digital Canvas',
    realityType: 'IMMERSIVE',
    duration: '4 Hours',
    location: 'Aetheria Neural Matrix',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    rating: 4.75,
    available: true
  }
];

const seedDB = async () => {
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI || mongoURI.includes('YOUR_MONGODB_CONNECTION_STRING')) {
    console.error('❌ Cannot seed database: MONGO_URI is missing or unconfigured in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI);
    console.log('⚡ Connected to MongoDB for seeding...');
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products.');
    const inserted = await Product.insertMany(experiences);
    console.log(`✅ Successfully seeded ${inserted.length} futuristic experiences into MongoDB!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDB();
