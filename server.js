import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory data store (for simplicity)
let items = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
];
let nextId = 4;
// root route
app.get('/', (req, res) => {
  res.send('Hello World!');
});
// GET all items
app.get('/api/items', (req, res) => {
  res.json(items);
});

// GET a single item by ID
app.get('/api/items/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  const item = items.find(i => i.id === itemId);
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// POST a new item
app.post('/api/items', (req, res) => {
  const newItem = {
    id: nextId++,
    name: req.body.name,
  };
  if (!newItem.name) {
    return res.status(400).json({ message: 'Item name is required' });
  }
  items.push(newItem);
  res.status(201).json(newItem);
});

// PUT (update) an existing item by ID
app.put('/api/items/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  const itemIndex = items.findIndex(i => i.id === itemId);

  if (itemIndex !== -1) {
    if (!req.body.name) {
      return res.status(400).json({ message: 'Item name is required for update' });
    }
    items[itemIndex] = { ...items[itemIndex], ...req.body };
    res.json(items[itemIndex]);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// DELETE an item by ID
app.delete('/api/items/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  const itemIndex = items.findIndex(i => i.id === itemId);

  if (itemIndex !== -1) {
    const deletedItem = items.splice(itemIndex, 1);
    res.json({ message: 'Item deleted successfully', item: deletedItem[0] });
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});