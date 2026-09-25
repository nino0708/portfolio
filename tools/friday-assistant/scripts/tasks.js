const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/tasks.json');

function readAll() {
  if (!fs.existsSync(DATA_FILE)) return { tasks: [] };
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeAll(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function addTask({ title, priority = 'medium', category = 'today', dueDate = null }) {
  const data = readAll();
  const task = {
    id: genId(),
    title,
    priority,
    category,
    dueDate,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  data.tasks.push(task);
  writeAll(data);
  return task;
}

function completeTask(query) {
  const data = readAll();
  const task = data.tasks.find(t =>
    !t.completed && (t.id === query || t.title.includes(query))
  );
  if (task) {
    task.completed = true;
    task.completedAt = new Date().toISOString();
    writeAll(data);
  }
  return task;
}

function getTodayTasks() {
  const today = new Date().toISOString().split('T')[0];
  return readAll().tasks.filter(t =>
    !t.completed && (t.category === 'today' || t.dueDate === today)
  );
}

function getVipTasks() {
  return readAll().tasks.filter(t => !t.completed && t.category === 'vip');
}

function getUpcomingTasks() {
  return readAll().tasks.filter(t => !t.completed && t.category === 'upcoming');
}

function getAllActive() {
  return readAll().tasks.filter(t => !t.completed);
}

// 期日が来た upcoming タスクを today に昇格
function advanceTasks() {
  const data = readAll();
  const today = new Date().toISOString().split('T')[0];
  let count = 0;
  data.tasks.forEach(t => {
    if (!t.completed && t.category === 'upcoming' && t.dueDate && t.dueDate <= today) {
      t.category = 'today';
      count++;
    }
  });
  if (count > 0) writeAll(data);
  return count;
}

// CLI: node scripts/tasks.js add "タイトル" [high|medium|low] [today|upcoming|someday] [YYYY-MM-DD]
if (require.main === module) {
  const [,, cmd, ...args] = process.argv;
  if (cmd === 'add') {
    const task = addTask({ title: args[0], priority: args[1], category: args[2], dueDate: args[3] });
    console.log('✅ タスク追加:', task.title);
  } else if (cmd === 'list') {
    const tasks = getAllActive();
    tasks.forEach(t => console.log(`[${t.category}] ${t.title} (${t.priority})`));
  }
}

module.exports = { addTask, completeTask, getTodayTasks, getVipTasks, getUpcomingTasks, getAllActive, advanceTasks };
