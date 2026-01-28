const list = require("../models/listing.js");
const user = require("../models/userModel.js");
const { isLoggedIn, saveRedirectUrl } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../CloudConfig.js");
const upload = multer({ storage });
const geocodeAddress = require("../public/js/cordinate.js");

module.exports.index = async (req, res) => {
  let listData = await list.find();
  res.render("listing/index", { listData });
};

// get request for new listing page
module.exports.newListing = async (req, res) => {
  res.render("listing/new", { currpage: "/new" });
};

// create new
module.exports.createListing = async (req, res, next) => {
  try {
    let body = req.body;
    let data = {
      title: body.title,
      description: body.description,
      image: {
        filename: req.file.filename, // Use the filename from the uploaded file
        url: req.file.path,
      },
      price: body.price,
      location: body.location,
      country: body.country,
    };

    let cordinate = await geocodeAddress(req.body.location);

    let dt = new list(data);
    console.log(req.user._id);
    dt.owner = req.user._id;
    dt.geometry = cordinate;

    // console.log(dt);
    // Save the owner ID to the listing
    // Assuming req.user is set by the authentication middleware
    await dt.save();

    req.flash("success", "Listing is Created");
    res.redirect("listing");
  } catch (error) {
    next(error);
  }
};

// My Listings
module.exports.MyListing = async (req, res) => {
  let Ownerid = req.user._id;
  let show = await list
    .find({
      owner: Ownerid,
    })
    .populate({ path: "review", populate: { path: "Author" } })
    .populate("owner");
  console.log(show);
  if (!show) {
    req.flash("error", "Listing is not Exist");
    res.redirect("/listing");
  } else {
    res.render("listing/mylisting", { show });
  }
};

// Perticuler property
module.exports.PerticularListing = async (req, res, next) => {
  try {
    let { id } = req.params;
    let show = await list
      .findById(id)
      .populate({ path: "review", populate: { path: "Author" } })
      .populate("owner");

    if (!show) {
      req.flash("error", "Listing is not Exist");
      res.redirect("/listing");
    } else {
      res.render("listing/show", { show });
    }
  } catch (error) {
    next(error);
  }
};

// get edit page
module.exports.getedit=async (req, res) => {
  let { id } = req.params;
  let lt = await list.findById(id);
  // console.log(lt);
  res.render("listing/edit", { lt });
};

// update listing(Edit)
module.exports.updateListing =  async (req, res) => {
  let { id } = req.params;
  let listData = await list.findById(id);

  let body = req.body;
  let data = {
    title: body.title,
    description: body.description,
    image: {
      filename: listData.image.filename,
      url: listData.image.url,
    },
    price: body.price,
    location: body.location,
    country: body.country,
  };

  if (
    !(res.locals.currUser && listData.owner.equals(res.locals.currUser._id))
  ) {
    // Check if the listing exists and if the current user is the owner

    req.flash("error", "You are not authorized to edit this listing");
    return res.redirect(`/listing/${id}`);
  }
  // If the listing exists and the user is authorized, proceed with the update
  let updateData = await list.findByIdAndUpdate(id, data, { new: true });
  if (typeof req.file !== "undefined") {
    updateData.image.filename = req.file.filename; // Update the filename if a new file is uploaded
    updateData.image.url = req.file.path; // Update the URL if a new file is uploaded
    await updateData.save();
  }
  req.flash("success", "Listing is Updated");
  res.redirect(`/listing/${id}`);
};

// delete listing
module.exports.deleteListing =  async (req, res) => {
  let { id } = req.params;
  let listData = await list.findById(id);
  if (
    !(res.locals.currUser && listData.owner.equals(res.locals.currUser._id))
  ) {
    // Check if the listing exists and if the current user is the owner

    req.flash("error", "You are not authorized to Delete this listing");
    return res.redirect(`/listing/${id}`);
  }
  await list.findByIdAndDelete(id);
  req.flash("success", "Listing is Deleted");
  res.redirect("/listing");
};

// Reserve Route
module.exports.reserveListing = async (req, res) => {
    let { id } = req.params;
  if (!(res.locals.currUser)) {

    req.flash("error", "You must be logged in to Reserve the property");
        return res.redirect(`/listing/${id}`);
  }
 
  
  let reserveData = req.body;
  checkin = new Date(reserveData.checkin);
  checkout = new Date(reserveData.checkout);
  const utcCheckin = Date.UTC(
    checkin.getFullYear(),
    checkin.getMonth(),
    checkin.getDate()
  );
  const utcCheckout = Date.UTC(
    checkout.getFullYear(),
    checkout.getMonth(),
    checkout.getDate()
  );

  const timeDiff = utcCheckout - utcCheckin;
  const nights = timeDiff / (1000 * 60 * 60 * 24);

  let month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  data = {
    checkin:
      new Date(reserveData.checkin).getDate() +
      " " +
      month[new Date(reserveData.checkin).getMonth()],
    checkout:
      new Date(reserveData.checkout).getDate() +
      " " +
      month[new Date(reserveData.checkout).getMonth()],
    guests: reserveData.guests,
    nights: nights,
  };

  let show = await list.findById(id);
  if (!show) {
    req.flash("error", "Listing is not Exist");
    return res.redirect("/listing");
  }
  res.render("listing/reserve", { show, data });
}

