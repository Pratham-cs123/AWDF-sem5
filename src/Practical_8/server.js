const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

// In-memory Task dataset
let tasks = [
  {
    id: 1,
    title: 'Study Richardson Maturity Model',
    description: 'Learn Level 0 to Level 3 HATEOAS principles',
    completed: true,
    category: 'Research'
  },
  {
    id: 2,
    title: 'Implement HATEOAS Links',
    description: 'Attach _links object to JSON API representations',
    completed: false,
    category: 'Coding'
  },
  {
    id: 3,
    title: 'Build Client Navigation with Hypermedia',
    description: 'Allow clients to discover available actions dynamically',
    completed: false,
    category: 'Architecture'
  }
];

// Helper to decorate a single task with HATEOAS hypermedia links
const withTaskLinks = (req, task) => {
  const host = `${req.protocol}://${req.get('host')}`;
  return {
    ...task,
    _links: {
      self: {
        href: `${host}/tasks/${task.id}`,
        method: 'GET',
        description: 'Get this specific task details'
      },
      update: {
        href: `${host}/tasks/${task.id}`,
        method: 'PUT',
        description: 'Update title, description, or completed status'
      },
      delete: {
        href: `${host}/tasks/${task.id}`,
        method: 'DELETE',
        description: 'Delete this task'
      },
      ...(!task.completed
        ? {
            complete: {
              href: `${host}/tasks/${task.id}/complete`,
              method: 'PATCH',
              description: 'Mark this task as completed'
            }
          }
        : {
            reopen: {
              href: `${host}/tasks/${task.id}/reopen`,
              method: 'PATCH',
              description: 'Reopen this completed task'
            }
          }),
      collection: {
        href: `${host}/tasks`,
        method: 'GET',
        description: 'Return to tasks collection'
      }
    }
  };
};

// Root endpoint: API Entrypoint & Service Index (Level 3 Discovery)
app.get('/', (req, res) => {
  const host = `${req.protocol}://${req.get('host')}`;
  res.json({
    message: 'Practical 08: HATEOAS RESTful API',
    description: 'Hypermedia as the Engine of Application State Demonstration',
    maturity_level: 'Richardson Maturity Model - Level 3',
    _links: {
      self: { href: `${host}/`, method: 'GET' },
      tasks: { href: `${host}/tasks`, method: 'GET', description: 'Access all tasks' },
      create_task: { href: `${host}/tasks`, method: 'POST', description: 'Create a new task' },
      filter_completed: { href: `${host}/tasks?completed=true`, method: 'GET' },
      filter_pending: { href: `${host}/tasks?completed=false`, method: 'GET' },
      documentation: { href: `${host}/docs`, method: 'GET' }
    }
  });
});

// GET /tasks - Get all tasks with collection links and item links
app.get('/tasks', (req, res) => {
  const host = `${req.protocol}://${req.get('host')}`;
  const { completed } = req.query;

  let filtered = tasks;
  if (completed !== undefined) {
    const isComp = completed === 'true';
    filtered = tasks.filter((t) => t.completed === isComp);
  }

  const items = filtered.map((task) => withTaskLinks(req, task));

  res.status(200).json({
    total: items.length,
    tasks: items,
    _links: {
      self: { href: `${host}/tasks${req.url === '/' ? '' : req.url.replace('/tasks', '')}`, method: 'GET' },
      all: { href: `${host}/tasks`, method: 'GET' },
      create: { href: `${host}/tasks`, method: 'POST' },
      filter_completed: { href: `${host}/tasks?completed=true`, method: 'GET' },
      filter_pending: { href: `${host}/tasks?completed=false`, method: 'GET' }
    }
  });
});

// GET /tasks/:id - Get task by ID with hypermedia controls
app.get('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({
      error: 'Task not found',
      _links: {
        collection: { href: `${req.protocol}://${req.get('host')}/tasks`, method: 'GET' }
      }
    });
  }

  res.status(200).json(withTaskLinks(req, task));
});

// POST /tasks - Create task and return links
app.post('/tasks', (req, res) => {
  const { title, description, category } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newTask = {
    id: tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1,
    title: title.trim(),
    description: description || '',
    category: category || 'General',
    completed: false
  };

  tasks.push(newTask);
  const decorated = withTaskLinks(req, newTask);

  res.location(decorated._links.self.href);
  res.status(201).json({
    message: 'Task created successfully with HATEOAS links',
    task: decorated
  });
});

// PUT /tasks/:id - Update task
app.put('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const { title, description, completed, category } = req.body;
  tasks[index] = {
    ...tasks[index],
    ...(title && { title: title.trim() }),
    ...(description !== undefined && { description }),
    ...(completed !== undefined && { completed: !!completed }),
    ...(category && { category })
  };

  res.status(200).json({
    message: 'Task updated successfully',
    task: withTaskLinks(req, tasks[index])
  });
});

// PATCH /tasks/:id/complete - Quick action transition
app.patch('/tasks/:id/complete', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  task.completed = true;
  res.status(200).json({
    message: 'Task marked as completed',
    task: withTaskLinks(req, task)
  });
});

// PATCH /tasks/:id/reopen - Quick action transition
app.patch('/tasks/:id/reopen', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  task.completed = false;
  res.status(200).json({
    message: 'Task reopened',
    task: withTaskLinks(req, task)
  });
});

// DELETE /tasks/:id - Delete task and return back-navigation link
app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return res.status(404).json({ error: 'Task not found' });

  const deleted = tasks.splice(index, 1)[0];
  const host = `${req.protocol}://${req.get('host')}`;

  res.status(200).json({
    message: `Task #${id} deleted successfully`,
    deletedTask: deleted,
    _links: {
      collection: { href: `${host}/tasks`, method: 'GET', description: 'Back to remaining tasks' },
      create: { href: `${host}/tasks`, method: 'POST', description: 'Create a replacement task' }
    }
  });
});

app.listen(PORT, () => {
  console.log(`Practical 08 HATEOAS Server running at http://localhost:${PORT}`);
});

module.exports = app;
