require("dotenv").config();
const mongoose = require("mongoose");
const Task = require("./models/Task");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/taskdb";

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Remove existing test tasks to have a clean benchmark baseline
    await Task.deleteMany({});

    const sampleTasks = [];
    for (let i = 1; i <= 50; i++) {
      sampleTasks.push({
        title: `Practical Task #${i}: Implement caching feature ${i}`,
        description: `Detailed description for task #${i} requiring optimization and database query index analysis.`,
        completed: i % 2 === 0
      });
    }

    const inserted = await Task.insertMany(sampleTasks);
    console.log(`Successfully seeded ${inserted.length} sample tasks!`);

    await mongoose.disconnect();
    console.log("Database disconnected. Seeding complete!");
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();
