
// server.js
const express = require('express');
const pool = require('./Config/db');

const app = express();
app.use(express.json());


// Retrieve the settings for a user
app.get('/users/:user_id/settings', async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM Settings WHERE user_id = $1', [user_id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Settings not found');
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Create a new notification for a user
app.post('/users/:user_id/notifications', async (req, res) => {
  const { user_id } = req.params;
  const { title, message, type } = req.body;
  const created_at = new Date();
  try {
    const result = await pool.query(
      'INSERT INTO Notifications (user_id, title, message, created_at, type) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, title, message, created_at, type]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Retrieve a specific notification by ID
app.get('/notifications/:notification_id', async (req, res) => {
  const { notification_id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM Notifications WHERE notification_id = $1', [notification_id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Notification not found');
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Create a new user
app.post('/users', async (req, res) => {
  const { username, email } = req.body;
  const created_at = new Date();
  try {
    const result = await pool.query(
      'INSERT INTO Users (user_id, username, email, created_at, updated_at) VALUES (uuid_generate_v4(), $1, $2, $3, $3) RETURNING *',
      [username, email, created_at]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update the settings for a user
app.put('/users/:user_id/settings', async (req, res) => {
  const { user_id } = req.params;
  const {
    notifications_enabled,
    theme,
    language,
    profile_visibility,
    data_sharing
  } = req.body;
  const updated_at = new Date();
  try {
    const result = await pool.query(
      `UPDATE Settings
       SET notifications_enabled = $1,
           theme = $2,
           language = $3,
           profile_visibility = $4,
           data_sharing = $5,
           updated_at = $6
       WHERE user_id = $7
       RETURNING *`,
      [notifications_enabled, theme, language, profile_visibility, data_sharing, updated_at, user_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send('Settings not found');
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete the settings for a user
app.delete('/users/:user_id/settings', async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query('DELETE FROM Settings WHERE user_id = $1 RETURNING *', [user_id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Settings not found');
    }
    res.json({ message: 'Settings deleted successfully' });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
