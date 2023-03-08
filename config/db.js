//* Import Modules
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    //remove warning
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(process.env.DB_URI);
    console.log(`Database connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;
