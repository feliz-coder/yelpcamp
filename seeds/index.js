// const express = require('express');
// const path = require('path');
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)]

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            image: 'https://source.unsplash.com/collection/1114848/1600x900',
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.Iusto nemo suscipit veniam perspiciatis dolores in unde aliquam explicabo! Esse perferendis eveniet facilis est dicta accusantium eos a molestias in nulla. Praesentium adipisci dignissimos saepe asperiores maiores exercitationem maxime, facere, necessitatibus, consequatur qui totam soluta.Deleniti ipsum iure perspiciatis dolor ratione magni maxime recusandae delectus quod, nemo vel voluptatibus doloribus non! Nulla quisquam, molestiae ad, impedit nam consequuntur eligendi qui asperiores placeat, culpa vero minus cupiditate illum atque magnam voluptatibus labore! Suscipit eligendi eius soluta veritatis eum excepturi cum nesciunt iste!',
            price
        })
        await camp.save()
    }
}

seedDB().then(() => {
    console.log(db.close())
})