const express = require("express");
const mongoose = require("mongoose");
const router = express.Router({ mergeParams: true });
const list = require("../models/listing");
const Review = require("../models/review");
const { ValidList, ValidReview } = require("../schema.js");
const ExpressError = require("../utils/ExpressError");

// function
const ValidateReview = (req, res, next) => {
  let { error } = ValidReview.validate(req.body);
  // console.log(result);
  if (error) {
    errorMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errorMsg);
  } else {
    next();
  }
};

// ----------------Review-----------------------

router.post("/", ValidateReview, async (req, res, next) => {
  try {
    let listing = await list.findById(req.params.id);
    let body = req.body;
    let data = {
      comment: body.comment,
      rating: body.rating,
    };

    if (!res.locals.currUser) {
      req.flash("error", "You must be logged in to post a review");
      return res.redirect(`/listing/${req.params.id}`);
    }

    let NewReview = new Review(data);
    NewReview.Author = req.user._id;
    listing.review.push(NewReview);
    await NewReview.save();
    let rest = await listing.save();
    // console.log(rest);
    req.flash("success", "Review is posted");
    res.redirect(`/listing/${req.params.id}`);
  } catch (error) {
    next(error);
  }
});

// delete review
router.delete("/:reviewid", async (req, res, next) => {
  try {
    let id = req.params.id;
    let reviewid = req.params.reviewid;

    let ReviewData = await Review.findById(reviewid);
    if ( !(res.locals.currUser && ReviewData.Author.equals(res.locals.currUser._id))) {

      req.flash("error", "You are not the Author of this review");
      return res.redirect(`/listing/${id}`);
    }

    await list.findByIdAndUpdate(id, { $pull: { review: reviewid } });
    await Review.findByIdAndDelete(reviewid);
    req.flash("success", "Review Deleted");
    res.redirect(`/listing/${id}`);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
