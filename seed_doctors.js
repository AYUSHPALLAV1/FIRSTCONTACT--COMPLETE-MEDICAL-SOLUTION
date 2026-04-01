const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Doctor = require('./models/Doctor');

// Load env vars
dotenv.config();

console.log('Script started...');

const connectDB = async () => {
  console.log('Connecting to MongoDB...');
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
        throw new Error('MONGO_URI is not defined in .env file');
    }
    console.log(`Attempting to connect to MongoDB...`);
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

const seedDoctors = async () => {
  await connectDB();

  try {
    // 1. Clear existing doctors (and maybe users created by this script?)
    // For safety, let's just clear doctors. 
    // If we re-run, we might duplicate users unless we check.
    console.log('Clearing existing doctors...');
    await Doctor.deleteMany({});
    console.log('Doctors cleared.');

    const doctorsData = [
      {
        name: 'Dr. Sarah Wilson',
        email: 'sarah.wilson@example.com',
        specialty: 'Cardiologist',
        hospital: 'City General Hospital',
        location: 'New York, NY',
        experience: 12,
        fees: 1500,
        about: 'Dr. Wilson is a leading cardiologist with over a decade of experience in treating heart conditions.',
        image: 'https://randomuser.me/api/portraits/women/68.jpg',
        rating: 4.9,
        availability: ['Mon 10:00-14:00', 'Wed 10:00-14:00', 'Fri 09:00-13:00']
      },
      {
        name: 'Dr. James Chen',
        email: 'james.chen@example.com',
        specialty: 'Neurologist',
        hospital: 'Metro Medical Center',
        location: 'San Francisco, CA',
        experience: 8,
        fees: 1200,
        about: 'Specializing in neurological disorders and brain health.',
        image: 'https://randomuser.me/api/portraits/men/32.jpg',
        rating: 4.7,
        availability: ['Tue 11:00-16:00', 'Thu 11:00-16:00']
      },
      {
        name: 'Dr. Emily Patel',
        email: 'emily.patel@example.com',
        specialty: 'Pediatrician',
        hospital: 'Sunshine Childrens Hospital',
        location: 'Chicago, IL',
        experience: 15,
        fees: 1000,
        about: 'Dedicated to the health and well-being of children from infancy through adolescence.',
        image: 'https://randomuser.me/api/portraits/women/44.jpg',
        rating: 4.8,
        availability: ['Mon 09:00-17:00', 'Tue 09:00-17:00', 'Wed 09:00-17:00']
      },
      {
        name: 'Dr. Robert Johnson',
        email: 'robert.johnson@example.com',
        specialty: 'Orthopedic Surgeon',
        hospital: 'St. Marys Hospital',
        location: 'London, UK',
        experience: 20,
        fees: 2000,
        about: 'Expert in joint replacement and sports medicine.',
        image: 'https://randomuser.me/api/portraits/men/85.jpg',
        rating: 5.0,
        availability: ['Thu 08:00-12:00', 'Fri 08:00-12:00']
      }
    ];

    for (const doc of doctorsData) {
      // Check if user exists
      let user = await User.findOne({ email: doc.email });
      if (!user) {
        user = await User.create({
          name: doc.name,
          email: doc.email,
          password: 'password123', // Default password
          role: 'Doctor'
        });
        console.log(`Created user for ${doc.name}`);
      } else {
        console.log(`User for ${doc.name} already exists. Using existing user.`);
      }

      await Doctor.create({
        user: user._id,
        name: doc.name,
        specialty: doc.specialty, // Note: Schema uses 'specialty', frontend might use 'specialization' - let's check frontend
        // Frontend uses 'doc.specialization' in renderDoctors but 'specialty' in model. 
        // Wait, I created the model with 'specialty'.
        // Frontend renderDoctors: <div class="doctor-spec">${doc.specialization}</div>
        // I need to match the model to the frontend or vice versa.
        // Let's check my model creation again.
        // My model has 'specialty'. Frontend expects 'specialization'.
        // I should fix the model or the seed. 
        // I'll add both fields to be safe or change the model.
        // Actually, I'll update the seed to use 'specialty' and I'll update the frontend to use 'specialty' or 'specialization'.
        // Wait, I created the model in the previous turn. I used 'specialty'.
        // Frontend code: <div class="doctor-spec">${doc.specialization}</div>
        // This is a mismatch! The frontend will show "undefined" if I don't fix it.
        // I will update the seed to save 'specialty' and I will Update the frontend to read 'specialty'.
        // Or I can add 'specialization' to the model. 
        // Let's stick to 'specialization' as it seems more formal, but 'specialty' is what I wrote in the model.
        // I'll update the model to use 'specialization' instead of 'specialty' to match frontend, 
        // OR I'll update the frontend.
        // Updating frontend is easier as I can see it right now.
        // Actually, updating the model is cleaner if I haven't deployed yet.
        // But wait, the previous turn I created the model with 'specialty'.
        // Let's change the model to 'specialization' to match the frontend expectation.
        hospital: doc.hospital,
        location: doc.location,
        experience: doc.experience,
        fees: doc.fees,
        about: doc.about,
        image: doc.image,
        rating: doc.rating,
        availability: doc.availability,
        // Adding specialization to match frontend if I update model
        specialization: doc.specialty 
      });
      console.log(`Created doctor profile for ${doc.name}`);
    }

    console.log('Doctors seeded successfully.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDoctors();
