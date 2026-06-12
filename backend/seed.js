const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function seedDatabase() {
  try {
    await client.connect();

    console.log("MongoDB Connected");

    const db = client.db("pust_lab_management");

    const labsCollection = db.collection("labs");
    const equipmentCollection = db.collection("equipment");
    const issuesCollection = db.collection("issues");

    // =========================
    // CLEAN OLD DATA
    // =========================
    await labsCollection.deleteMany({});
    await equipmentCollection.deleteMany({});
    await issuesCollection.deleteMany({});

    console.log("Old data removed");

    // =========================
    // LABS
    // =========================
    const labs = [
      {
        name: "ACL Lab",
        department: "CSE Department",
        description:
          "Advanced Computing Lab with high-performance systems",
        pcs: 40,
        createdAt: new Date(),
      },
      {
        name: "Network Lab",
        department: "CSE Department",
        description:
          "Networking equipment and hardware lab",
        pcs: 24,
        createdAt: new Date(),
      },
      {
        name: "Software Lab",
        department: "CSE Department",
        description:
          "Computer lab for software development and programming courses",
        pcs: 40,
        createdAt: new Date(),
      },
    ];

    await labsCollection.insertMany(labs);
    console.log("Labs inserted");

    // =========================
    // EQUIPMENT (AUTO FROM LAB PCS)
    // =========================
    const equipmentData = [];

    const specs = "Intel Core i5, 8GB RAM, 256GB SSD";

    for (const lab of labs) {
      for (let i = 1; i <= lab.pcs; i++) {
        let status = "Working";
        let issue = null;

        // realistic status rules
        if (i % 20 === 0) status = "Under maintenance";
        if (i % 33 === 0) status = "Not working";

        // keyboard issue PCs
        if ([8, 12, 23, 30, 32, 37, 38].includes(i)) {
          issue = "Keyboard not responding";
        }

        equipmentData.push({
          labId: lab.name,
          lab: lab.name,
          name: `PC-${String(i).padStart(2, "0")}`,
          type: "pc",
          status,
          specs,
          issue,
          createdAt: new Date(),
        });
      }
    }

    await equipmentCollection.insertMany(equipmentData);
    console.log("Equipment inserted");

    // =========================
    // ISSUES
    // =========================
    const issues = [
      {
        lab: "Software Lab",
        title: "Monitor not working",
        description: "One PC monitor is not turning on",
        email: "aa@gmail.com",
        status: "pending",
        createdAt: new Date(),
      },
      {
        lab: "Software Lab",
        title: "Keyboard issue",
        description: "Some keys are not responding",
        email: "aa@gmail.com",
        status: "pending",
        createdAt: new Date(),
      },
      {
        lab: "ACL Lab",
        title: "PC overheating",
        description: "System gets very hot after long usage",
        email: "mm@gmail.com",
        status: "pending",
        createdAt: new Date(),
      },
      {
        lab: "Network Lab",
        title: "Internet downtime",
        description: "Network is frequently disconnecting",
        email: "mm@gmail.com",
        status: "pending",
        createdAt: new Date(),
      },
      {
        lab: "Network Lab",
        title: "Router issue",
        description: "Router restarting automatically",
        email: "ppp@gmail.com",
        status: "pending",
        createdAt: new Date(),
      },
    ];

    await issuesCollection.insertMany(issues);

    console.log("Issues inserted");
    console.log("Database Seeded Successfully");
  } catch (error) {
    console.log("Seed Error:", error);
  } finally {
    await client.close();
    console.log("MongoDB Connection Closed");
  }
}

seedDatabase();