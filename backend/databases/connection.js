const mongoose = require("mongoose");
const PORT = 27017;

const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb://127.0.0.1:${PORT}/QuickCart`);
    console.log(`Server successfully connected to MongoDB on port ${PORT}`);
  } catch (error) {
    console.log(`Server failed to connect to MongoDB: ${error}`);
  }
};

module.exports = connectDB;
