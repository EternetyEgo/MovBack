const mongoose = require("mongoose");

// Actor sub-schema
const ActorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
  },
  { _id: false }
);

// Movie schema
const MovieSchema = new mongoose.Schema(
  {
    rating: { type: String, required: true },
    title: { type: String, required: true },
    genre: { type: String, required: true },
    year: { type: String, required: true },
    time: { type: String, required: true },
    about: { type: String, required: true },
    actors: { type: [ActorSchema], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", MovieSchema);

// {
//     "rating": "PG-13",
//     "title": "The Dark Knight",
//     "genre": "Action",
//     "year": "2008",
//     "time": "2h 32min",
//     "about": "Batman battles the Joker to save Gotham City.",
//     "actors": [
//       {
//         "name": "Christian Bale",
//         "image": "https://example.com/christian-bale.jpg"
//       },
//       {
//         "name": "Heath Ledger",
//         "image": "https://example.com/heath-ledger.jpg"
//       }
//     ]
//   }
