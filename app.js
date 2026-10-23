if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const path = require("path");
const express = require("express");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const ExpressError = require("./utils/ExpressError.js");
const methodOverride = require("method-override");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const wrapAsync = require("./utils/wrapAsync.js");
const { home } = require("./controllers/listings.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

const app = express();
const DB_URL = process.env.ATLASDB_URI;
const SESSION_SECRET = process.env.SESSION_SECRET || "mySecretCode";
const PORT = Number(process.env.PORT) || 8080;

if (!DB_URL) {
  throw new Error("ATLASDB_URI is missing. Set it in your environment.");
}

if (process.env.NODE_ENV === "production" && !process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is required in production.");
}

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

async function main() {
  await mongoose.connect(DB_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

app.engine("ejs", ejsMate);

const store = MongoStore.create({
  mongoUrl: DB_URL,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret: SESSION_SECRET,
  },
});

store.on("error", () => {
  console.log("ERROR in MONGO SESSION STORE");
});

const sessionOptions = {
  store,
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  },
};

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currUser = req.user;
  res.locals.success = req.flash("Success");
  res.locals.update = req.flash("Update");
  res.locals.deleteMsg = req.flash("Delete");
  res.locals.review = req.flash("Review");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", wrapAsync(home));

app.get("/privacy", (req, res) => {
  res.render("privacy.ejs");
});

app.get("/terms", (req, res) => {
  res.render("terms.ejs");
});

app.use("/listings", listingRouter);
app.use("/listings/:id/review", reviewRouter);
app.use("/", userRouter);

app.use((req, res, next) => {
  next(new ExpressError(404, "Page not Found!"));
});

app.use((err, req, res, next) => {
  console.error(err);
  let { statusCode = 500, message = "Something went Wrong" } = err;
  res.status(statusCode).render("error.ejs", { statusCode, message });
});

app.listen(PORT, () => {
  console.log(`Server is started on http://localhost:${PORT}/`);
});
