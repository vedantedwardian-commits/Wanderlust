const Listing = require("../models/listing");

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Attach avgRating / reviewCount to listings whose reviews are populated
const withRatings = (listings) => {
  for (const listing of listings) {
    const ratings = (listing.reviews || []).map((r) => r.rating).filter(Boolean);
    listing.reviewCount = ratings.length;
    listing.avgRating = ratings.length
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
      : null;
  }
  return listings;
};

module.exports.home = async (req, res) => {
  const listings = withRatings(
    await Listing.find({}).populate("reviews", "rating").lean(),
  );

  // Group listings by country for the "Popular homes in ..." rows
  const byCountry = new Map();
  for (const listing of listings) {
    const country = listing.country || "Other";
    if (!byCountry.has(country)) byCountry.set(country, []);
    byCountry.get(country).push(listing);
  }
  const sections = [...byCountry.entries()]
    .map(([country, items]) => ({ country, items }))
    .sort((a, b) => b.items.length - a.items.length);

  // Destinations for the "Inspiration" tabs: unique locations per country
  const destinations = sections.slice(0, 6).map(({ country, items }) => {
    const counts = new Map();
    for (const item of items) {
      if (item.location) counts.set(item.location, (counts.get(item.location) || 0) + 1);
    }
    return {
      country,
      places: [...counts.entries()].map(([location, count]) => ({ location, count })),
    };
  });

  res.render("home.ejs", { listings, sections, destinations, hideNavSearch: true });
};

module.exports.index = async (req, res) => {
  const q = (req.query.q || "").trim();
  let filter = {};
  if (q) {
    const pattern = new RegExp(escapeRegex(q), "i");
    filter = {
      $or: [
        { title: pattern },
        { location: pattern },
        { country: pattern },
        { description: pattern },
      ],
    };
  }
  const listings = withRatings(
    await Listing.find(filter).populate("reviews", "rating").lean(),
  );
  res.render("listings/index.ejs", { listings, q });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
        select: "username",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings");
  }
  const { avgRating, reviewCount } = withRatings([{ reviews: listing.reviews }])[0];
  const ownerUsername = listing.owner?.username || "Unknown";
  const mapQuery = encodeURIComponent(
    `${listing.location}, ${listing.country}`,
  );
  res.render("listings/show.ejs", {
    listing,
    ownerUsername,
    mapQuery,
    avgRating,
    reviewCount,
  });
};

module.exports.createListing = async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }
  await newListing.save();
  req.flash("Success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (!listing) {
    req.flash("error", "Listing does not exist!");
    return res.redirect("/listings");
  }
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
    await listing.save();
  }
  req.flash("Update", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id, { ...req.body.listing });
  req.flash("Delete", "Listing Deleted!");
  res.redirect("/listings");
};
