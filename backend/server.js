require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
console.log("URI:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ DB Connected"))
  .catch(err => console.log("❌ DB Error:", err));

// Model
const Note = require("./models/Note");

// ================= ROUTES =================

// CREATE
app.post("/notes", async (req, res) => {
  try {
    const note = new Note(req.body);
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ
app.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
app.put("/notes/:id", async (req, res) => {
  try {
    const updated = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
app.delete("/notes/:id", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SEARCH
app.get("/notes/search", async (req, res) => {
  try {
    const q = req.query.q;
    const notes = await Note.find({
      title: { $regex: q, $options: "i" }
    });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});