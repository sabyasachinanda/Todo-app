const Todo = require("../models/Todo");

exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (todo.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.createTodo = async (req, res) => {
  const { title, description, status } = req.body;

  try {
    const todo = new Todo({
      user: req.user.id,
      title,
      description,
      status,
    });

    const createdTodo = await todo.save();
    res.status(201).json(createdTodo);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateTodo = async (req, res) => {
  const { title, description, status } = req.body;

  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (todo.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    todo.title = title || todo.title;
    todo.description = description || todo.description;
    todo.status = status || todo.status;

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (todo.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await todo.remove();
    res.json({ message: "Todo removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
