const express = require('express');
const app = express();

app.use(express.json());

// In-memory storage for users
let users = {};
let nextId = 1;

// Create a new user
app.post('/users', (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: "Missing 'name' in request body." });
    }

    const userId = nextId++;
    users[userId] = name;

    res.status(201).json({ id: userId, name });
});

// Retrieve user by name
app.get('/users', (req, res) => {
    const { name } = req.query;
    if (!name) {
        return res.status(400).json({ error: "Missing 'name' query parameter." });
    }

    for (const userId in users) {
        if (users[userId] === name) {
            return res.status(200).json({ id: parseInt(userId), name });
        }
    }

    res.status(404).json({ error: "User not found." });
});

// Retrieve user by ID
app.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userName = users[userId];

    if (!userName) {
        return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ id: userId, name: userName });
});

// Update user by name
app.put('/users', (req, res) => {
    const { name: oldName } = req.query;
    const { name: newName } = req.body;

    if (!oldName) {
        return res.status(400).json({ error: "Missing 'name' query parameter." });
    }
    if (!newName) {
        return res.status(400).json({ error: "Missing 'name' in request body." });
    }

    for (const userId in users) {
        if (users[userId] === oldName) {
            users[userId] = newName;
            return res.status(200).json({ id: parseInt(userId), name: newName });
        }
    }

    res.status(404).json({ error: "User not found." });
});

// Update user by ID
app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const { name: newName } = req.body;

    if (!newName) {
        return res.status(400).json({ error: "Missing 'name' in request body." });
    }
    if (!users[userId]) {
        return res.status(404).json({ error: "User not found." });
    }

    users[userId] = newName;
    res.status(200).json({ id: userId, name: newName });
});

// Delete user by name
app.delete('/users', (req, res) => {
    const { name } = req.query;
    if (!name) {
        return res.status(400).json({ error: "Missing 'name' query parameter." });
    }

    for (const userId in users) {
        if (users[userId] === name) {
            delete users[userId];
            return res.status(200).json({ message: "User deleted successfully." });
        }
    }

    res.status(404).json({ error: "User not found." });
});

// Delete user by ID
app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    if (!users[userId]) {
        return res.status(404).json({ error: "User not found." });
    }

    delete users[userId];
    res.status(200).json({ message: "User deleted successfully." });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
