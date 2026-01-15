import Note from "../models/note.model.js";

export const getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({
      updatedAt: -1,
    });

    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

export const postNote = async (req, res, next) => {
  console.log(req.user);

  try {
    const { title, note } = req.body;

    if (!title || !note) {
      return next({
        status: 400,
        message: "All fields are required.",
      });
    }
    const newNote = await Note.create({
      title,
      note,
      user: req.user._id,
    });
    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { title, note } = req.body;
    const { id } = req.params;

    if (!title || !note) {
      return next({ status: 400, message: "All fields are required." });
    }

    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { title, note },
      { new: true }
    );

    if (!updatedNote) {
      return next({ status: 404, message: "Note not found or not authorized" });
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await Note.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!deleted) {
      return next({ status: 404, message: "Note not found or not authorized" });
    }

    res.status(200).json(deleted);
  } catch (error) {
    next(error);
  }
};