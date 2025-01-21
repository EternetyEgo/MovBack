"use strict";
const express = require("express");
const router = express.Router();
const Movie = require("../modules/Movie");
const auth = require("../middleware/token");

// Create movie
router.post("/create", auth, async (req, res) => {
  try {
    const { rating, title, genre, year, time, about, actors } = req.body;

    // Validation
    if (!rating || !title || !genre || !year || !time || !about || !actors || actors.length === 0) {
      return res.status(400).json({
        status: false,
        message: "Barcha ma'lumotlar to'liq kiritilishi kerak.",
      });
    }

    // Check for duplicate title
    const existingMovie = await Movie.findOne({ title });
    if (existingMovie) {
      return res.status(400).json({
        status: false,
        message: "Bu nomdagi kino allaqachon mavjud.",
      });
    }

    // Create movie
    const newMovie = new Movie({
      rating,
      title,
      genre,
      year,
      time,
      about,
      actors,
    });

    await newMovie.save();

    res.status(201).json({
      status: true,
      message: "Kino muvaffaqiyatli yaratildi.",
      data: newMovie,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Serverda xatolik yuz berdi.",
    });
  }
});

// Get all movies
router.get("/all", auth, async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json({
      status: true,
      message: "Barcha kinolar ro'yxati.",
      data: movies,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Serverda xatolik yuz berdi.",
    });
  }
});

// Get movie by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({
        status: false,
        message: "Kino topilmadi.",
      });
    }

    res.json({
      status: true,
      message: "Kino topildi.",
      data: movie,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Serverda xatolik yuz berdi.",
    });
  }
});

// Edit movie
router.put("/edit/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, title, genre, year, time, about, actors } = req.body;

    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({
        status: false,
        message: "Kino topilmadi.",
      });
    }

    movie.rating = rating || movie.rating;
    movie.title = title || movie.title;
    movie.genre = genre || movie.genre;
    movie.year = year || movie.year;
    movie.time = time || movie.time;
    movie.about = about || movie.about;
    movie.actors = actors || movie.actors;

    await movie.save();

    res.json({
      status: true,
      message: "Kino muvaffaqiyatli yangilandi.",
      data: movie,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Serverda xatolik yuz berdi.",
    });
  }
});

// Delete movie
router.delete("/del/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({
        status: false,
        message: "Kino topilmadi.",
      });
    }

    await movie.deleteOne();

    res.json({
      status: true,
      message: "Kino muvaffaqiyatli o'chirildi.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Serverda xatolik yuz berdi.",
    });
  }
});

module.exports = router;