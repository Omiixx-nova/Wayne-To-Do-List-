document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('task-input');
  const addBtn = document.getElementById('add-btn');
  const taskList = document.getElementById('task-list');
  const taskStats = document.getElementById('task-stats');

  let tasks = [];
  try {
    tasks = JSON.parse(localStorage.getItem('wayneTasks')) || [];
  } catch {
    tasks = [];
  }

  renderTasks();
  updateStats();

  addBtn.addEventListener('click', () => {
    addTask(taskInput.value);
  });

  taskInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      addTask(taskInput.value);
    }
  });

  function addTask(text) {
    if (!text.trim()) return;
    tasks.push({ text: text.trim(), completed: false });
    taskInput.value = '';
    saveAndRender();
  }

  function saveAndRender() {
    try {
      localStorage.setItem('wayneTasks', JSON.stringify(tasks));
    } catch {
      // ignore localStorage errors silently
    }
    renderTasks();
    updateStats();
  }

  function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.className = 'task-item';
      if (task.completed) li.classList.add('completed');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;
      checkbox.setAttribute('aria-label', `Mark task "${task.text}" completed`);
      checkbox.addEventListener('change', () => {
        tasks[index].completed = checkbox.checked;
        saveAndRender();
      });

      const taskText = document.createElement('input');
      taskText.type = 'text';
      taskText.className = 'task-text';
      taskText.value = task.text;
      taskText.setAttribute('aria-label', `Edit task: ${task.text}`);
      taskText.addEventListener('change', () => {
        tasks[index].text = taskText.value.trim();
        saveAndRender();
      });

      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.textContent = '✖';
      removeBtn.setAttribute('aria-label', `Remove task: ${task.text}`);
      removeBtn.addEventListener('click', () => {
        tasks.splice(index, 1);
        saveAndRender();
      });

      li.appendChild(checkbox);
      li.appendChild(taskText);
      li.appendChild(removeBtn);
      taskList.appendChild(li);
    });
  }

  function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    taskStats.textContent = `Total Tasks: ${total} | Completed: ${completed}`;
  }
});
