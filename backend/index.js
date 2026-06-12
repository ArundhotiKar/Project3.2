const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();


const admin = require("firebase-admin");
const serviceAccount = require("./firebase-admin.json");

if (!serviceAccount || !serviceAccount.private_key) {
  throw new Error("Firebase service account missing or invalid");
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: serviceAccount.project_id,
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key?.replace(/\\n/g, "\n"),
  }),
});

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
  } catch (connectErr) {
    console.error("MongoDB connection error:", connectErr && connectErr.message ? connectErr.message : connectErr);
    console.error("Possible causes: incorrect MONGO_URI in .env, no internet/DNS, or Atlas IP access not whitelisted.");
    console.error("Quick checks: run 'nslookup <your-cluster-host>' or set MONGO_URI to a local MongoDB for development.");
    // Exit so nodemon can restart after you fix environment/configuration
    process.exit(1);
  }

  const db = client.db("pust_lab_management");

  const usersCollection = db.collection("users");
  const issuesCollection = db.collection("issues");
  const labsCollection = db.collection("labs");
  const equipmentCollection = db.collection("equipment");
  const departmentsCollection = db.collection("departments");

  // Seed sample labs and equipment (idempotent)
  const seedSampleData = async () => {
    try {
      const labsCount = await labsCollection.countDocuments();
      const eqCount = await equipmentCollection.countDocuments();

      if (labsCount === 0) {
        const sampleLabs = [
          { name: "Software Lab", description: "Software engineering and development", pcs: 20, equipment: 5, openIssues: 0, createdAt: new Date() },
          { name: "Network Lab", description: "Networking and infrastructure", pcs: 12, equipment: 6, openIssues: 0, createdAt: new Date() },
          { name: "ACL Lab", description: "Access control and security lab", pcs: 10, equipment: 4, openIssues: 0, createdAt: new Date() },
        ];

        const res = await labsCollection.insertMany(sampleLabs);
        console.log(`Seeded ${res.insertedCount} labs`);

        // seed corresponding equipment entries
        const equipmentToInsert = [
          { labId: "Software Lab", name: "PC 1", type: "pc", status: "working", createdAt: new Date() },
          { labId: "Software Lab", name: "PC 2", type: "pc", status: "working", createdAt: new Date() },
          { labId: "Software Lab", name: "Projector", type: "projector", status: "working", createdAt: new Date() },

          { labId: "Network Lab", name: "Router A", type: "network", status: "working", createdAt: new Date() },
          { labId: "Network Lab", name: "PC 1", type: "pc", status: "working", createdAt: new Date() },

          { labId: "ACL Lab", name: "PC 1", type: "pc", status: "working", createdAt: new Date() },
          { labId: "ACL Lab", name: "Multimeter", type: "meter", status: "working", createdAt: new Date() },
        ];

        const eqRes = await equipmentCollection.insertMany(equipmentToInsert);
        console.log(`Seeded ${eqRes.insertedCount} equipment items`);
      } else if (eqCount === 0) {
        // labs exist but equipment is empty — add a small default set per lab
        const labs = await labsCollection.find().toArray();
        const equipmentToInsert = [];
        labs.forEach((l, idx) => {
          equipmentToInsert.push({ labId: l.name, name: `PC 1`, type: 'pc', status: 'working', createdAt: new Date() });
          if ((l.pcs || 0) > 1) equipmentToInsert.push({ labId: l.name, name: `PC 2`, type: 'pc', status: 'working', createdAt: new Date() });
        });
        if (equipmentToInsert.length) {
          const eqRes = await equipmentCollection.insertMany(equipmentToInsert);
          console.log(`Seeded ${eqRes.insertedCount} equipment items for existing labs`);
        }
      } else {
        // already have data
      }
    } catch (e) {
      console.error('Seed error', e.message);
    }
  };

  // run seeding in background (non-blocking)
  seedSampleData().catch(e => console.error(e));

  app.post("/departments", async (req, res) => {
  try {
    const {
      name,
      chairmanName,
      chairmanEmail,
      chairmanPassword,
    } = req.body;

    if (!name || !chairmanEmail || !chairmanPassword) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    // 1. Firebase user create
    const firebaseUser = await admin.auth().createUser({
      email: chairmanEmail,
      password: chairmanPassword,
      displayName: chairmanName,
    });

    // 2. Save department
    const dept = {
      name,
      chairmanName,
      chairmanEmail,
      firebaseUid: firebaseUser.uid,
      createdAt: new Date(),
    };

    const deptResult = await departmentsCollection.insertOne(dept);

    // 3. ALSO SAVE IN USERS COLLECTION (IMPORTANT PART)
    const userDoc = {
      name: chairmanName,
      role: "chairman",
      email: chairmanEmail,
      department: name, // IMPORTANT LINK
      firebaseUid: firebaseUser.uid,
      status: "approved",
      createdAt: new Date(),
    };

    await usersCollection.insertOne(userDoc);

    res.json({
      success: true,
      departmentId: deptResult.insertedId,
      firebaseUid: firebaseUser.uid,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

  app.get("/departments", async (req, res) => {
  try {
    const departments = await departmentsCollection.find().toArray();
    const labs = await labsCollection.find().toArray();

    const enriched = departments.map((dept) => {
      const labCount = labs.filter(
        (lab) => lab.department === dept.name || lab.department === dept._id.toString()
      ).length;

      return {
        ...dept,
        labCount,
      };
    });

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/departments/:id/chairman", async (req, res) => {
  try {
    const { chairmanName, chairmanEmail } = req.body;

    const result = await departmentsCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          chairmanName,
          chairmanEmail,
          updatedAt: new Date(),
        },
      }
    );

    // optional: also update users collection
    await usersCollection.updateOne(
      { email: chairmanEmail },
      {
        $set: {
          role: "chairman",
          department: req.body.name,
        },
      }
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

  // =========================
  // SSE STORAGE (SAFE)
  // =========================
  const sseClients = {};

  const sendPendingCount = async (department) => {
    const count = await usersCollection.countDocuments({
      department,
      status: "pending",
    });

    const clients = sseClients[department] || new Set();

    const payload = `data: ${JSON.stringify({ pending: count })}\n\n`;

    clients.forEach((res) => {
      try {
        res.write(payload);
      } catch { }
    });
  };

  // =========================
  // USERS
  // =========================

  app.post("/users", async (req, res) => {
    try {
      const user = req.body;

      const exists = await usersCollection.findOne({ email: user.email });
      if (exists) {
        return res.status(400).json({ message: "User already exists" });
      }

      const status =
        user.role === "chairman" || user.role === "superadmin"
          ? "approved"
          : "pending";

      const userDoc = {
        ...user,
        status,
        createdAt: new Date(),
      };

      const result = await usersCollection.insertOne(userDoc);

      if (status === "pending" && user.department) {
        setTimeout(() => sendPendingCount(user.department), 100);
      }

      res.json({ insertedId: result.insertedId, status });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/users", async (req, res) => {
    try {
      const query = {};

      if (req.query.department) query.department = req.query.department;
      if (req.query.role) query.role = req.query.role;
      if (req.query.status) query.status = req.query.status;

      const users = await usersCollection.find(query).toArray();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/users/:email", async (req, res) => {
    try {
      const user = await usersCollection.findOne({ email: req.params.email });

      if (!user) return res.status(404).json({ message: "User not found" });

      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/users/:id", async (req, res) => {
    try {
      const result = await usersCollection.deleteOne({
        _id: new ObjectId(req.params.id),
      });

      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.patch("/users/approve/:id", async (req, res) => {
    try {
      const id = req.params.id;

      const result = await usersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: "approved" } }
      );

      const user = await usersCollection.findOne({
        _id: new ObjectId(id),
      });

      if (user?.department) {
        setTimeout(() => sendPendingCount(user.department), 100);
      }

      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // =========================
  // ISSUES (ORDER FIXED)
  // =========================

  app.get("/issues", async (req, res) => {
  try {
    const query = {};

    // ✅ status filter
    if (req.query.status) {
      query.status = req.query.status;
    }

    // ✅ department filter (MAIN FIX)
    if (req.query.department) {
      query.department = req.query.department;
    }

    const issues = await issuesCollection.find(query).toArray();

    const enrichedIssues = await Promise.all(
      issues.map(async (issue) => {
        let equipment = null;

        if (issue.equipmentId) {
          equipment = await equipmentCollection.findOne({
            _id: new ObjectId(issue.equipmentId),
          });
        }

        return {
          ...issue,

          equipmentName: equipment?.name || issue.equipmentName || "Unknown Equipment",

          labName:
            equipment?.lab ||
            equipment?.labId ||
            issue.labName ||
            issue.labId,
        };
      })
    );

    res.json(enrichedIssues);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

  app.get("/issues/:email", async (req, res) => {
    try {
      const issues = await issuesCollection
        .find({ email: req.params.email })
        .sort({ createdAt: -1 })
        .toArray();

      res.json(issues);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/issues", async (req, res) => {
  try {
    const result = await issuesCollection.insertOne({
      equipmentId: req.body.equipmentId,
      equipmentName: req.body.equipmentName,
      labId: req.body.labId,
      labName: req.body.labName,

      title: req.body.title,
      description: req.body.description,

      reportedBy: req.body.reportedBy,
      email: req.body.email,

      department: req.body.department, // ✅ ADD THIS

      status: "pending",
      createdAt: new Date(),
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

  app.patch("/issues/:id", async (req, res) => {
    try {
      const result = await issuesCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { status: req.body.status } }
      );

      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // =========================
  // LABS (FIXED + OPEN ISSUE CALC)
  // =========================

  app.get("/labs", async (req, res) => {
  try {
    const dept = req.query.department;

    const query = dept ? { department: dept } : {};

    const labs = await labsCollection.find(query).toArray();

    const issues = await issuesCollection.find().toArray();
    const equipment = await equipmentCollection.find().toArray();
    const users = await usersCollection.find().toArray();

    const enriched = labs.map((lab) => {
      const labId = lab._id.toString();
      const labName = lab.name;

      const openIssues = issues.filter((i) => {
        const candidateIds = [i.labId, i.lab].map(String);
        return (
          (candidateIds.includes(labId) || candidateIds.includes(labName)) &&
          i.status === "pending"
        );
      }).length;

      const labEquipment = equipment.filter((e) => {
        const cand = [String(e.labId || ""), String(e.lab || "")];
        return cand.includes(labId) || cand.includes(labName);
      });

      return {
        ...lab,
        openIssues,
        equipmentCount: labEquipment.length,
      };
    });

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

  app.get("/labs/:id", async (req, res) => {
    try {
      const lab = await labsCollection.findOne({ _id: new ObjectId(req.params.id) });

      if (!lab) return res.status(404).json({ message: "Lab not found" });

      const labId = lab._id.toString();
      const labName = lab.name;

      const issues = await issuesCollection.find().toArray();
      const equipment = await equipmentCollection.find().toArray();
      const users = await usersCollection.find().toArray();

      const openIssues = issues.filter((i) => {
        const candidateIds = [i.labId, i.lab].map(String);
        return (candidateIds.includes(labId) || candidateIds.includes(labName)) && i.status === "pending";
      }).length;

      const labEquipment = equipment.filter((e) => {
        const cand = [String(e.labId || ""), String(e.lab || "")];
        return cand.includes(labId) || cand.includes(labName);
      });

      const labUsers = users
        .filter((u) => {
          const cand = [String(u.labId || ""), String(u.lab || ""), String(u.department || "")];
          return cand.includes(labId) || cand.includes(labName);
        })
        .map((u) => ({ name: u.name, email: u.email, role: u.role, status: u.status }));

      res.json({
        ...lab,
        openIssues,
        equipmentCount: labEquipment.length,
        equipment: labEquipment,
        usersCount: labUsers.length,
        users: labUsers,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


  // =========================
  // CHAIRMAN DASHBOARD API
  // =========================
  app.get("/chairman/dashboard", async (req, res) => {
    try {
      const dept = req.query.department;

      if (!dept) {
        return res.status(400).json({ error: "department required" });
      }

      const [
        students,
        teachers,
        labincharge,
        pendingUsers,
        issues,
        labs
      ] = await Promise.all([
        usersCollection.countDocuments({
          department: dept,
          role: "student",
          status: "approved",
        }),

        usersCollection.countDocuments({
          department: dept,
          role: "teacher",
          status: "approved",
        }),

        usersCollection.countDocuments({
          department: dept,
          role: "labincharge",
          status: "approved",
        }),

        usersCollection.countDocuments({
          department: dept,
          status: "pending",
        }),

        issuesCollection.countDocuments({
          department: dept,
          status: "pending",
        }),

        labsCollection.countDocuments({
          department: dept,
        }),
      ]);

      res.json({
        students,
        teachers: teachers + labincharge,
        labs,
        issues,
        pendingApprovals: pendingUsers,
      });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/labs", async (req, res) => {
    try {
      const result = await labsCollection.insertOne({
        ...req.body,
        createdAt: new Date(),
      });

      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // =========================
  // EQUIPMENT (FULL FIXED)
  // =========================

  app.get("/equipment", async (req, res) => {
    try {
      const items = await equipmentCollection.find().toArray();
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/equipment", async (req, res) => {
    try {
      const { labId, name, type, status, specs, department } = req.body;

      if (!labId || !name) {
        return res.status(400).json({
          error: "labId and name required",
        });
      }

      const lab = await labsCollection.findOne({
        _id: new ObjectId(labId),
      });

      if (!lab) {
        return res.status(404).json({ error: "Lab not found" });
      }

      const newEquipment = {
        labId: lab._id.toString(),
        lab: lab.name,
        department: lab.department,
        name,
        type: type || "other",
        status: status || "Working",
        specs: specs || "",
        issue: null,
        createdAt: new Date(),
      };

      const result = await equipmentCollection.insertOne(newEquipment);

      await labsCollection.updateOne(
        { _id: lab._id },
        { $inc: { equipment: 1 } }
      );

      res.json({
        success: true,
        insertedId: result.insertedId,
        data: newEquipment,
      });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/equipment/:id", async (req, res) => {
    try {
      const item = await equipmentCollection.findOne({
        _id: new ObjectId(req.params.id),
      });

      if (!item) return res.status(404).json({ error: "Not found" });

      await equipmentCollection.deleteOne({
        _id: new ObjectId(req.params.id),
      });

      await labsCollection.updateOne(
        { _id: new ObjectId(item.labId) },
        { $inc: { equipment: -1 } }
      );

      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.patch("/equipment/:id", async (req, res) => {
    try {
      const result = await equipmentCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body }
      );

      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/equipment/lab/:labId", async (req, res) => {
    try {
      const raw = String(req.params.labId);

      // If caller passed a lab _id, resolve it to the lab name so we can match
      // legacy `lab` string fields as well as `labId`.
      let labName = null;
      try {
        if (ObjectId.isValid(raw)) {
          const found = await labsCollection.findOne({ _id: new ObjectId(raw) });
          if (found) labName = found.name;
        }
      } catch (e) {
        // ignore resolution errors and fall back to raw
      }

      const candidates = [raw];
      if (labName) candidates.push(labName);

      // Build case-insensitive regex alternatives for string matches
      const orClauses = candidates.flatMap((c) => [
        { labId: c },
        { lab: c },
        { lab: { $regex: `^${c}$`, $options: 'i' } },
      ]);

      const items = await equipmentCollection.find({ $or: orClauses }).toArray();

      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // =========================
  // ROLE
  // =========================

  app.get("/users/role/:email", async (req, res) => {
    try {
      const user = await usersCollection.findOne({
        email: req.params.email,
      });

      if (!user) {
        return res.status(404).json({
          role: null,
          message: "User not found",
        });
      }

      res.json({
        role: user.role,
        status: user.status || "approved",
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // =========================
  // SSE (SAFE)
  // =========================

  app.get("/sse/pending", async (req, res) => {
    const department = req.query.department;

    if (!department) {
      return res.status(400).send("department required");
    }

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    });

    res.write(": connected\n\n");

    if (!sseClients[department]) {
      sseClients[department] = new Set();
    }

    sseClients[department].add(res);

    await sendPendingCount(department);

    const interval = setInterval(() => {
      res.write(": keep-alive\n\n");
    }, 20000);

    req.on("close", () => {
      clearInterval(interval);
      sseClients[department].delete(res);
    });
  });

}

run();

app.get("/", (req, res) => {
  res.send("Server running...");
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '::';
app.listen(PORT, HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
});