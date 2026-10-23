# 🌍 WanderLust

A full-stack travel stay marketplace built with **Node.js, Express, MongoDB and EJS**. Users can discover places to stay, publish their own listings with photos, leave reviews, and see every listing's location on a map.

---

## ✨ Features

### 🏠 Landing Page
The first page you see. It explains what WanderLust is, shows its main features and how it works, and has a button to start exploring stays.

### 🔐 Sign Up, Sign In & Log Out
- Create an account with a username, email and password.
- Passwords are never saved as plain text. They are scrambled (hashed) before being stored.
- After you sign in, you stay logged in for up to 7 days, even if the server restarts, because your login session is saved in the database.
- If you try to do something that needs an account, the app asks you to sign in and then takes you back to the page you were on.

### 📋 Browse Listings
- See every stay on one page, with its photo, title and price per night.
- Click any listing to open its full details: description, price, location, country, who posted it, and its reviews.

### ➕ Create, Edit & Delete Your Own Listings
- Logged-in users can add a new stay with a title, description, price, location, country and photo.
- Only the person who created a listing can edit or delete it. Others don't see those buttons, and the server blocks them even if they try.
- When a listing is deleted, all of its reviews are deleted with it.

### 🖼 Photo Uploads
- Upload a JPG or PNG photo for your listing. It is stored online on Cloudinary, not on the server.
- If no photo is added, a default scenic picture is shown instead.
- When editing a listing, you can see the current photo and replace it.

### ⭐ Reviews & Ratings
- Logged-in users can give a listing a rating from 1 to 5 stars and write a comment.
- Each review shows who wrote it.
- Only the person who wrote a review can delete it.

### 🗺 Location Map
- Every listing shows a Google Map of where the stay is.
- An **"Open in Google Maps"** button opens the location in Google Maps for directions.
- The map only loads when you scroll to it, so the page opens faster.

### ✅ Input Checking
- The server checks every form before saving anything. For example, a listing must have a title, location, country and a price of at least 1, and a rating must be between 1 and 5.
- Wrong or broken links (like a listing that doesn't exist) don't crash the app. You are sent back to the listings page with a message.

### 💬 Pop-up Messages
Short messages appear at the top of the screen after actions like "New Listing Created!", "Review Added!" or "You are logged out!", and disappear on their own.

### 📱 Works on Any Screen
The layout adjusts to phones, tablets and desktops.

### 📄 Privacy Policy & Terms Pages
Separate pages for the Privacy Policy and Terms of Service, linked in the footer.

---

## 🛠 Tech Stack

| Layer      | Tools                                                  |
| ---------- | ------------------------------------------------------ |
| Frontend   | EJS, ejs-mate, HTML5, CSS3, JavaScript                 |
| Backend    | Node.js 22, Express 5                                  |
| Database   | MongoDB (Atlas), Mongoose                              |
| Auth       | Passport, passport-local, passport-local-mongoose      |
| Storage    | Cloudinary, Multer, multer-storage-cloudinary          |
| Validation | Joi                                                    |

---

## 📁 Project Structure

```
WanderLust/
├── app.js              # App entry point, middleware & session setup
├── cloudConfig.js      # Cloudinary + Multer storage config
├── schema.js           # Joi validation schemas
├── controllers/        # listings, reviews, user logic
├── models/             # Listing, Review, User (Mongoose)
├── routes/             # listing, reviews, user routers
├── utils/              # ExpressError, wrapAsync, middleware
├── init/               # Sample data + DB seed script
├── Dockerfile          # Builds the app image
├── docker-compose.yml  # Runs the app + MongoDB together
├── views/              # EJS templates (layouts, includes, listings, users)
└── public/             # Static CSS / JS / images
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 22+
- A MongoDB database (local or Atlas)
- A Cloudinary account

### 1. Clone and install

```bash
git clone https://github.com/vedantedwardian-commits/Wanderlust.git
cd Wanderlust
npm install
```

### 2. Configure environment

Create a `.env` file in the project root:

```env
ATLASDB_URI=your_mongodb_connection_string
CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
SESSION_SECRET=a_long_random_string
PORT=8080
NODE_ENV=development
```

### 3. (Optional) Seed sample data

The seed script connects to a local MongoDB at `mongodb://127.0.0.1:27017/wanderlust`.

```bash
node init/index.js
```

### 4. Run

```bash
npm run dev     # with nodemon
# or
npm start
```

Open **http://localhost:8080** in your browser.

---

## 🐳 Run with Docker

The easiest way to run WanderLust. Docker starts the app **and** its own MongoDB database, so you don't need to install Node.js or MongoDB yourself.

### 1. Install Docker
Get [Docker Desktop](https://www.docker.com/products/docker-desktop/) and make sure it is running.

### 2. Create your `.env` file

```bash
cp .env.example .env
```

Fill in your Cloudinary keys and a `SESSION_SECRET`. You can leave `ATLASDB_URI` as it is. Docker replaces it with its own database automatically.

### 3. Start everything

```bash
docker compose up -d --build
```

Open **http://localhost:8080**.

### 4. (Optional) Add sample listings

```bash
docker compose exec app node init/index.js
```

Press `Ctrl + C` once you see `Data was Initialized`.

### Useful commands

| What you want              | Command                     |
| -------------------------- | --------------------------- |
| See the app's logs         | `docker compose logs -f app` |
| Stop everything            | `docker compose down`        |
| Stop and delete all data   | `docker compose down -v`     |
| Rebuild after code changes | `docker compose up -d --build` |

Your database is saved in a Docker volume, so listings and users are kept when you stop and restart.

---

## 🏗 Architecture

WanderLust follows the **MVC** pattern:

```
Browser ──► Express Routes ──► Controllers ──► Mongoose Models ──► MongoDB
                                    │
                                    └──► Cloudinary (images) · Google Maps (location)
```

---

## 👤 Author

**Vedant**
GitHub: [@vedantedwardian-commits](https://github.com/vedantedwardian-commits)
LinkedIn: [Vedant Latawa](https://www.linkedin.com/in/vedant-latawa-3a996a2a5/)

---

## 📄 License

ISC
