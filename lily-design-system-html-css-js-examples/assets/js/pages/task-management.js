// The page script of task-management.html, in a file so a strict Content Security Policy needs no 'unsafe-inline'.
(function() {
  'use strict';

  var tasks = [
    { id: 1, title: 'Set up project repository', done: true, priority: 'high' },
    { id: 2, title: 'Draft API specification', done: true, priority: 'high' },
    { id: 3, title: 'Design database schema', done: false, priority: 'medium' },
    { id: 4, title: 'Write integration tests', done: false, priority: 'medium' },
    { id: 5, title: 'Prepare deployment scripts', done: false, priority: 'low' }
  ];
  var nextId = 6;

  function priorityBadgeType(p) {
    if (p === 'high') return 'error';
    if (p === 'medium') return 'warning';
    return 'info';
  }

  function updateStats() {
    var completed = tasks.filter(function(t) { return t.done; }).length;
    var total = tasks.length;
    var percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    document.getElementById('done-badge').textContent = completed + ' done';
    document.getElementById('remaining-badge').textContent = (total - completed) + ' remaining';
    document.getElementById('task-progress').value = percent;
    document.getElementById('percent-text').textContent = percent;

    var priorities = { high: 0, medium: 0, low: 0 };
    tasks.forEach(function(t) { priorities[t.priority]++; });
    document.getElementById('high-count').textContent = 'high: ' + priorities.high;
    document.getElementById('medium-count').textContent = 'medium: ' + priorities.medium;
    document.getElementById('low-count').textContent = 'low: ' + priorities.low;
  }

  function renderTasks() {
    var showCompleted = document.getElementById('show-completed').checked;
    var list = document.getElementById('task-list');
    list.innerHTML = '';

    var visible = showCompleted ? tasks : tasks.filter(function(t) { return !t.done; });
    visible.forEach(function(task) {
      var li = document.createElement('li');
      li.className = 'task-list-item';
      li.setAttribute('data-id', task.id);
      li.setAttribute('data-priority', task.priority);
      li.setAttribute('data-done', task.done);

      var checkbox = document.createElement('input');
      checkbox.className = 'checkbox-input';
      checkbox.type = 'checkbox';
      checkbox.setAttribute('aria-label', task.title);
      checkbox.checked = task.done;
      checkbox.addEventListener('change', function() {
        task.done = checkbox.checked;
        renderTasks();
        updateStats();
      });

      var span = document.createElement('span');
      span.textContent = task.title;
      if (task.done) span.style.textDecoration = 'line-through';

      var badge = document.createElement('span');
      badge.className = 'badge';
      badge.setAttribute('data-type', priorityBadgeType(task.priority));
      badge.textContent = task.priority;

      li.appendChild(checkbox);
      li.appendChild(document.createTextNode(' '));
      li.appendChild(span);
      li.appendChild(document.createTextNode(' '));
      li.appendChild(badge);
      list.appendChild(li);
    });

    updateStats();
  }

  // Add task
  document.getElementById('add-task-btn').addEventListener('click', function() {
    var input = document.getElementById('new-task-input');
    var title = input.value.trim();
    if (!title) return;
    tasks.push({ id: nextId++, title: title, done: false, priority: 'medium' });
    input.value = '';
    renderTasks();
  });

  // Show completed toggle
  document.getElementById('show-completed').addEventListener('change', function() {
    renderTasks();
  });

  renderTasks();
})();
