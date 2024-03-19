const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const methodOverride = require('method-override');
const path = require('path');

const app = express();
const port = 3000;

// Connect to SQLite database
const db = new sqlite3.Database('tasks.db');

// Create tasks table
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT)");
});

// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Set the Content-Type header for CSS files
app.get('/styles.css', (req, res) => {
  res.setHeader('Content-Type', 'text/css');
  res.sendFile(path.join(__dirname, 'public', 'styles.css'));
});

// API endpoint to get all tasks
app.get('/tasks', (req, res) => {
  db.all("SELECT * FROM tasks", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.send(`
      <html>
      <head>
        <link rel="stylesheet" type="text/css" href="/styles.css">
      </head>
      <body>
        <div class="container">
          <h2>Task List</h2>
          <form action="/tasks" method="post">
            <input type="text" name="title" placeholder="Enter task title" required>
            <button type="submit">Add Task</button>
          </form>
          <table>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Action</th>
            </tr>
            ${rows.map(row => `
              <tr>
                <td>${row.id}</td>
                <td>${row.title}</td>
                <td>
                  <form action="/tasks/${row.id}?_method=DELETE" method="post">
                    <button type="submit">Delete</button>
                  </form>
                </td>
              </tr>
            `).join('')}
          </table>
        </div>
      </body>
      </html>
    `);
  });
});

// API endpoint to add a task
app.post('/tasks', (req, res) => {
  const { title } = req.body;
  db.run("INSERT INTO tasks (title) VALUES (?)", [title], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.redirect('/tasks');
  });
});

// API endpoint to delete a task
app.delete('/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  db.run("DELETE FROM tasks WHERE id = ?", taskId, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.redirect('/tasks');
  });
});

// Root path handler to redirect to the tasks route
app.get('/', (req, res) => {
  res.redirect('/tasks');
});

// Start the server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
