require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const DB_URL =
  process.env.ATLASDB_URI ||
  process.env.MONGO_URL ||
  "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(DB_URL);
  console.log("Connected to", mongoose.connection.host);

  // Give the sample listings a host if any user has signed up
  const owner = await User.findOne({});

  await Listing.deleteMany({});
  await Listing.insertMany(
    initData.data.map((listing) => ({ ...listing, owner: owner?._id })),
  );
  console.log(
    `Inserted ${initData.data.length} listings` +
      (owner ? ` hosted by ${owner.username}` : " (no users yet, so no host)"),
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
