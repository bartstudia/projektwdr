const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Lake = require('../models/Lake');
const FishingSpot = require('../models/FishingSpot');
const Reservation = require('../models/Reservation');
const Review = require('../models/Review');

dotenv.config();

const run = async () => {
  if (process.env.NODE_ENV === 'production') {
    console.error('Seed is disabled in production.');
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is required for seed.');
    process.exit(1);
  }

  await mongoose.connect(uri);

  await Promise.all([
    User.deleteMany({}),
    Lake.deleteMany({}),
    FishingSpot.deleteMany({}),
    Reservation.deleteMany({}),
    Review.deleteMany({})
  ]);

  const admin = await User.create({
    name: 'Admin',
    email: 'admin@test.pl',
    password: 'admin123',
    role: 'admin'
  });

  const user = await User.create({
    name: 'User',
    email: 'user@test.pl',
    password: 'user123',
    role: 'user'
  });

  const lake = await Lake.create({
    name: 'Jezioro Testowe',
    description: 'Przykladowe jezioro do testow E2E.',
    location: 'Testowo',
    createdBy: admin._id,
    isActive: true
  });

  const lake2 = await Lake.create({
    name: 'Jezioro Rezerwacji',
    description: 'Drugie jezioro do testow.',
    location: 'Rez Park',
    createdBy: admin._id,
    isActive: true
  });

  await Lake.create({
    name: 'Jezioro Bez Stanowisk',
    description: 'Jezioro bez stanowisk do testow pustego stanu.',
    location: 'Brakowo',
    createdBy: admin._id,
    isActive: true
  });

  await FishingSpot.insertMany([
    {
      lakeId: lake._id,
      name: 'Stanowisko 1',
      description: 'Pierwsze stanowisko testowe.',
      mapCoordinates: { shape: 'circle', coords: [120, 120, 30] },
      isActive: true
    },
    {
      lakeId: lake._id,
      name: 'Stanowisko 2',
      description: 'Drugie stanowisko testowe.',
      mapCoordinates: { shape: 'circle', coords: [220, 160, 30] },
      isActive: true
    },
    {
      lakeId: lake2._id,
      name: 'Stanowisko A',
      description: 'Stanowisko w drugim jeziorze.',
      mapCoordinates: { shape: 'circle', coords: [140, 140, 30] },
      isActive: true
    }
  ]);

  console.log('Seed completed.');
  console.log('Admin: admin@test.pl / admin123');
  console.log('User: user@test.pl / user123');

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
