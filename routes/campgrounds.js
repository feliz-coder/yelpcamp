const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const Review = require('../models/review');
const campgrounds = require('../controllers/campgrounds')

router.get('/', catchAsync(campgrounds.index))
router.get('/new', isLoggedIn, campgrounds.renderNewForm)
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        })
        .populate('author');

    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
}))
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}))
router.put('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated a campground')
    res.redirect(`/campgrounds/${camp._id}`)
}))
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a campground')
    res.redirect('/campgrounds');
}))
router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

module.exports = router;