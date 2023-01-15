const express = require("express");
const router = express.Router();
const ToDo = require("../models/ToDo");
const requriesAuth = require("../middleware/permissions");
const validateTodoInput = require("../validation/toDoValidation");
// route - GET /api/todos/test
// desc -  test the auth route
// access public
router.get("/test", (req, res) => {
  res.send("hi");
});

// route - Post /api/todos/new
// desc -  to create new todo
// access private
router.post("/new", requriesAuth, async (req, res) => {
  try {
    const { errors, isValid } = validateTodoInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newTodo = new ToDo({
      user: req.user._id,
      content: req.body.content,
      complete: false,
    });

    await newTodo.save();
    return res.json(newTodo);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

// route - GET /api/todos/Current
// desc -  to create new todo
// access private
router.get("/current", requriesAuth, async (req, res) => {
  try {
    const completeTodos = await ToDo.find({
      user: req.user._id,
      complete: true,
    }).sort({ completedAt: -1 });

    const incompleteTodos = await ToDo.find({
      user: req.user._id,
      complete: false,
    }).sort({ completedAt: -1 });

    const Todos = await ToDo.find({
      user: req.user._id,
    }).sort({ completedAt: -1 });
    return res.json({ incomplete: incompleteTodos, complete: completeTodos });
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

// route - PUT /api/todos/:todoId/complete
// desc -  mark todo as complete
// access private
router.put("/:todoId/complete", requriesAuth, async (req, res) => {
  try {
    const toDo = await ToDo.findOne({
      user: req.user._id,
      _id: req.params.todoId,
    });

    if (!toDo) {
      res.status(404).json({ error: "Could not fine Todo " });
    }

    if (toDo.complete) {
      res.status(400).json({ error: "TOdo is already completed" });
    }

    const updatedTodo = await ToDo.findOneAndUpdate(
      {
        user: req.user._id,
        _id: req.params.todoId,
      },
      {
        complete: true,
        completedAt: new Date(),
      },
      {
        new: true,
      }
    );

    return res.json(updatedTodo);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

// route - PUT /api/todos/:todoId/incomplete
// desc -  mark todo as incomplete
// access private
router.put("/:todoId/incomplete", requriesAuth, async (req, res) => {
  try {
    const toDo = await ToDo.findOne({
      user: req.user._id,
      _id: req.params.todoId,
    });

    if (!toDo) {
      return res.status(404).json({ error: "Could not fine Todo " });
    }

    if (!toDo.complete) {
      return res.status(400).json({ error: "TOdo is already not completed" });
    }

    const updatedTodo = await ToDo.findOneAndUpdate(
      {
        user: req.user._id,
        _id: req.params.todoId,
      },
      {
        complete: false,
        completedAt: null,
      },
      {
        new: true,
      }
    );

    return res.json(updatedTodo);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
});

// route - PUT /api/todos/:todoId
// desc -  update the todo
// access private
router.put("/:todoId", requriesAuth, async (req, res) => {
  try {
    const toDo = await ToDo.findOne({
      user: req.user._id,
      _id: req.params.todoId,
    });

    if (!toDo) {
      res.status(404).json({ error: "Could not fine Todo " });
    }
    const { errors, isValid } = validateTodoInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const updatedTodo = await ToDo.findOneAndUpdate(
      {
        user: req.user._id,
        _id: req.params.todoId,
      },
      {
        content: req.body.content,
      },
      {
        new: true,
      }
    );

    return res.json(updatedTodo);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

// route - DELETE /api/todos/:todoId
// desc -  delete the todo
// access private
router.delete("/:todoId", requriesAuth, async (req, res) => {
  try {
    const toDo = await ToDo.findOne({
      user: req.user._id,
      _id: req.params.todoId,
    });

    if (!toDo) {
      res.status(404).json({ error: "Could not fine Todo " });
    }

    const deletedTodo = await ToDo.findOneAndRemove({
      user: req.user._id,
      _id: req.params.todoId,
    });

    return res.json(deletedTodo);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;
