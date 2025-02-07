const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());               // Чтобы фронтенд мог делать запросы, если нужно
app.use(express.json());       // Парсим JSON-тело в POST/PUT запросах

// Пусть у нас данные хранятся в tournamentsData.json в корне
const DATA_FILE = path.join(__dirname, 'tournamentsData.json');

// Функция для чтения файла
function readData() {
  try {
    const json = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(json);
  } catch (err) {
    // Если файла нет или пуст - вернем пустой массив
    return [];
  }
}

// Функция для записи в файл
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// ============ API ЭНДПОИНТЫ ============ //

// 1) Получить все турниры
app.get('/api/tournaments', (req, res) => {
  const data = readData();
  res.json(data);
});

// 2) Создать новый турнир
app.post('/api/tournaments', (req, res) => {
  let data = readData();
  const { date, game, championship, link } = req.body;

  // Генерируем ID
  const newId = "_" + Math.random().toString(36).substr(2,9);

  const newTournament = {
    id: newId,
    date: date || '10/10/2017',
    game: game || 'CS:GO',
    championship: championship || 'Major Championship',
    link: link || '#'
  };

  data.push(newTournament);
  writeData(data);

  res.status(201).json(newTournament);
});

// 3) Обновить турнир по ID
app.put('/api/tournaments/:id', (req, res) => {
  let data = readData();
  const tId = req.params.id;

  const index = data.findIndex(t => t.id === tId);
  if (index === -1) {
    return res.status(404).json({ error: 'Tournament not found' });
  }

  const { date, game, championship, link } = req.body;
  if (date !== undefined)       data[index].date = date;
  if (game !== undefined)       data[index].game = game;
  if (championship !== undefined) data[index].championship = championship;
  if (link !== undefined)       data[index].link = link;

  writeData(data);
  res.json(data[index]);
});

// 4) Удалить турнир по ID
app.delete('/api/tournaments/:id', (req, res) => {
  let data = readData();
  const tId = req.params.id;

  const index = data.findIndex(t => t.id === tId);
  if (index === -1) {
    return res.status(404).json({ error: 'Tournament not found' });
  }

  const deletedItem = data.splice(index, 1)[0];
  writeData(data);

  res.json(deletedItem);
});

// ======================================== //

// Запускаем сервер
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
