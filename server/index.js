const prisma = require("./prisma/client");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
const https = require("https");
const csv = require("csv-parser");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Mini CRM Backend Running"
  });
});


app.get("/users", async (req, res) => {

  const users = await prisma.user.findMany();

  res.json(users);

});


app.get("/leads", async (req, res) => {

  try {
    const { search, stage, counselorId, course } = req.query;

    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (stage && stage !== "All Stages" && stage !== "") {
      where.stage = stage;
    }

    if (counselorId && counselorId !== "All Counselors" && counselorId !== "") {
      where.counselorId = counselorId;
    }

    if (course && course !== "All Courses" && course !== "") {
      where.course = course;
    }

    const leads = await prisma.lead.findMany({
      where,
      include: {
        counselor: true,
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 100,

    });

    res.json(leads);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to fetch leads",
    });

  }

});

app.get("/dashboard/stats", async (req, res) => {

  try {
    const { counselorId } = req.query;
    const where = {};
    if (counselorId) {
      where.counselorId = counselorId;
    }

    const totalLeads =
      await prisma.lead.count({ where });

    const newLeads =
      await prisma.lead.count({
        where: {
          ...where,
          stage: "New Lead",
        },
      });

    const convertedLeads =
      await prisma.lead.count({
        where: {
          ...where,
          stage: "Converted",
        },
      });

    const hotLeads =
      await prisma.lead.count({
        where: {
          ...where,
          priority: "High",
        },
      });

    // 1. Stage Distribution
    const stageDistributionRaw = await prisma.lead.groupBy({
      where,
      by: ["stage"],
      _count: { id: true },
    });
    const stageDistribution = stageDistributionRaw.map((item) => ({
      stage: item.stage,
      count: item._count.id,
    }));

    // 2. Course Distribution
    const courseDistributionRaw = await prisma.lead.groupBy({
      where,
      by: ["course"],
      _count: { id: true },
    });
    const courseDistribution = courseDistributionRaw.map((item) => ({
      course: item.course,
      count: item._count.id,
    }));

    // 3. Priority Distribution
    const priorityDistributionRaw = await prisma.lead.groupBy({
      where,
      by: ["priority"],
      _count: { id: true },
    });
    const priorityDistribution = priorityDistributionRaw.map((item) => ({
      priority: item.priority,
      count: item._count.id,
    }));

    // 4. Trend Data (last 7 days signups)
    const trendData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const nextD = new Date(d);
      nextD.setDate(nextD.getDate() + 1);

      const count = await prisma.lead.count({
        where: {
          ...where,
          createdAt: {
            gte: d,
            lt: nextD,
          },
        },
      });

      trendData.push({
        date: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        count,
      });
    }

    // 5. Recent 5 Leads
    const recentLeads = await prisma.lead.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      include: {
        counselor: true,
      },
    });

    res.json({
      totalLeads,
      newLeads,
      convertedLeads,
      hotLeads,
      stageDistribution,
      courseDistribution,
      priorityDistribution,
      trendData,
      recentLeads,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to fetch dashboard stats",
    });

  }

});

// GET /followups
app.get("/followups", async (req, res) => {
  try {
    const { leadId, counselorId, status } = req.query;
    const where = {};
    if (leadId) where.leadId = leadId;
    if (counselorId) where.counselorId = counselorId;
    if (status) where.status = status;

    const followups = await prisma.followUp.findMany({
      where,
      include: {
        lead: true,
        counselor: true,
      },
      orderBy: [
        { scheduledAt: "asc" },
        { createdAt: "desc" }
      ],
      take: 50,
    });

    res.json(followups);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch follow-ups",
    });
  }
});

// POST /followups
app.post("/followups", async (req, res) => {
  try {
    const { title, comment, status, leadId, counselorId, scheduledAt } = req.body;

    if (!title || !status || !leadId || !counselorId) {
      return res.status(400).json({
        error: "Missing required fields: title, status, leadId, counselorId",
      });
    }

    const followup = await prisma.followUp.create({
      data: {
        title,
        comment: comment || "",
        status,
        leadId,
        counselorId,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      },
      include: {
        lead: true,
        counselor: true,
      }
    });

    res.status(201).json(followup);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to create follow-up",
    });
  }
});

// PATCH /followups/:id
app.patch("/followups/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, comment, status, scheduledAt } = req.body;

    const followup = await prisma.followUp.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(comment !== undefined && { comment }),
        ...(status && { status }),
        ...(scheduledAt !== undefined && { scheduledAt: scheduledAt ? new Date(scheduledAt) : null }),
      },
      include: {
        lead: true,
        counselor: true,
      }
    });

    res.json(followup);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to update follow-up",
    });
  }
});

app.post("/auth/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const isPasswordValid =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const token = jwt.sign(

      {
        userId: user.id,
        role: user.role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      }

    );

    res.json({

      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Login failed",
    });

  }

});

app.post("/leads", async (req, res) => {

  try {

    const {
      name,
      phone,
      email,
      course,
      stage,
      priority,
      counselorId,
    } = req.body;

    const lead =
      await prisma.lead.create({

        data: {
          name,
          phone,
          email,
          course,
          stage,
          priority,
          counselorId: counselorId === "" ? null : counselorId,
        },

      });

    res.status(201).json(lead);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to create lead",
    });

  }

});

app.get("/users", async (req, res) => {

  try {

    const users =
      await prisma.user.findMany();

    res.json(users);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to fetch users",
    });

  }

});

app.post("/users", async (req, res) => {

  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        error: "Missing required fields: name, email, password, role",
      });
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return res.status(400).json({
        error: "User with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role.toUpperCase(),
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to create user",
    });

  }

});

function getWithRedirects(url, callback) {
  https.get(url, (response) => {
    if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
      getWithRedirects(response.headers.location, callback);
    } else {
      callback(response);
    }
  });
}

app.post("/import-google-sheet", async (req, res) => {

  try {

    const SHEET_ID =
      "1FWKiMJvy9Yq3Dks1Hh49PBllExlbdPsyfccxzWWw-5U";

    const url =
      `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

    const results = [];

    getWithRedirects(url, (response) => {

      response
        .pipe(csv())

        .on("data", (data) => {

          results.push(data);

        })

        .on("end", async () => {

          try {

            const formattedLeads =
              results.map((row) => ({

                name: row.Name,

                phone: row.Phone,

                email: row.Email,

                course: row.Course,

                stage:
                  row.Stage || "New Lead",

                priority:
                  row.Priority || "Medium",

              }));

            await prisma.lead.createMany({

              data: formattedLeads,

              skipDuplicates: true,

            });

            res.json({

              message:
                "Google Sheet imported successfully",

              imported:
                formattedLeads.length,

            });

          } catch (error) {

            console.error(error);

            res.status(500).json({
              error:
                "Database import failed",
            });

          }

        });

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error:
        "Google Sheet import failed",
    });

  }

});

app.patch("/leads/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const {
      name,
      phone,
      email,
      course,
      stage,
      priority,
      counselorId,
    } = req.body;

    const updatedLead =
      await prisma.lead.update({

        where: {
          id,
        },

        data: {
          name,
          phone,
          email,
          course,
          stage,
          priority,
          counselorId: counselorId === "" ? null : counselorId,
        },

        include: {
          counselor: true,
        },

      });

    res.json(updatedLead);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to update lead",
    });

  }

});

app.get("/lead-count", async (req, res) => {

  try {

    const count =
      await prisma.lead.count();

    res.json({ count });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to count leads",
    });

  }

});


const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});