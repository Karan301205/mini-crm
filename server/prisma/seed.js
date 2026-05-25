require("dotenv").config();

const { faker } = require("@faker-js/faker");

const prisma = require("./client");
const bcrypt = require("bcryptjs");
const courses = [
  "Data Science",
  "Data Analytics",
  "Full Stack Development",
  "Digital Marketing",
];

const leadStages = [
  "New Lead",
  "Interested",
  "Call Back",
  "Follow-Up",
  "Walk-In Scheduled",
  "Walk-In Missed",
  "Visited",
  "Converted",
  "Not Interested",
  "Lost Lead",
  "Re-Engagement",
];

const priorities = [
  "High",
  "Medium",
  "Low",
];

async function main() {

  console.log("Seeding started...");

  // DELETE OLD DATA

  await prisma.followUp.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.user.deleteMany();

  // CREATE COUNSELORS

  const counselors = [];
  const hashedPassword =
  await bcrypt.hash("password123", 10);
  for (let i = 0; i < 5; i++) {

  const counselor = await prisma.user.create({

    data: {

      name:
        i === 0
          ? "Test Counselor"
          : faker.person.fullName(),

      email:
        i === 0
          ? "counselor@crm.com"
          : `counselor.${i}.${faker.internet.email().toLowerCase()}`,

      password: hashedPassword,

      role: "COUNSELOR",
    },

  });

  counselors.push(counselor);
}

  // CREATE ADMIN

  await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@crm.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  // CREATE LEADS

  const leadsData = [];
  for (let i = 0; i < 1000; i++) {
    const randomCounselor =
      counselors[
        Math.floor(Math.random() * counselors.length)
      ];

    leadsData.push({
      name: faker.person.fullName(),
      phone: `98${String(i).padStart(8, "0")}`,
      email: `lead${i}@crm.com`,
      course:
        courses[
          Math.floor(Math.random() * courses.length)
        ],
      stage:
        leadStages[
          Math.floor(Math.random() * leadStages.length)
        ],
      priority:
        priorities[
          Math.floor(Math.random() * priorities.length)
        ],
      counselorId: randomCounselor.id,
    });
  }

  await prisma.lead.createMany({
    data: leadsData,
  });

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });