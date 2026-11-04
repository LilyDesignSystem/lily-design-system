// The page script of dashboard.html, in a file so a strict Content Security Policy needs no 'unsafe-inline'.
(function() {
  'use strict';
  var tasks = [
    { title: 'Design landing page', status: 'done' },
    { title: 'Implement auth flow', status: 'in-progress' },
    { title: 'Write unit tests', status: 'in-progress' },
    { title: 'Update documentation', status: 'todo' },
    { title: 'Code review', status: 'todo' }
  ];
  var completed = tasks.filter(function(t) { return t.status === 'done'; }).length;
  var total = tasks.length;
  var percent = Math.round((completed / total) * 100);
  document.getElementById('completed-count').textContent = completed;
  document.getElementById('total-count').textContent = total;
  document.getElementById('remaining-count').textContent = total - completed;
  document.getElementById('progress-percent').textContent = percent;
  var circle = document.querySelector('.progress-circle');
  if (circle) circle.setAttribute('aria-valuenow', percent);
})();
