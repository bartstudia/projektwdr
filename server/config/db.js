const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Opcje połączenia (nowe wersje Mongoose nie wymagają useNewUrlParser i useUnifiedTopology)
    });

    console.log(`MongoDB połączone: ${conn.connection.host}`);

    // Obsługa błędów połączenia
    mongoose.connection.on('error', (err) => {
      console.error(`Błąd MongoDB: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB rozłączone');
    });

  } catch (error) {
    console.error(`Błąd połączenia z MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
