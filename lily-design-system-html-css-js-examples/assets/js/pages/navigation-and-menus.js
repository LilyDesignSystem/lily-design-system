// The page script of navigation-and-menus.html, in a file so a strict Content Security Policy needs no 'unsafe-inline'.
(function() {
  'use strict';

  // Menu bar keyboard navigation
  var menuBar = document.querySelector('.menu-bar');
  if (menuBar) {
    var items = menuBar.querySelectorAll('[role="menuitem"]');
    menuBar.addEventListener('keydown', function(e) {
      var index = Array.from(items).indexOf(document.activeElement);
      if (index < 0) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        items[(index + 1) % items.length].focus();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        items[(index - 1 + items.length) % items.length].focus();
      }
    });
  }

  // Dropdown menus
  var fileMenuBtn = document.getElementById('file-menu-btn');
  var editMenuBtn = document.getElementById('edit-menu-btn');
  var fileMenu = document.getElementById('file-menu');
  var editMenu = document.getElementById('edit-menu');

  function closeAllMenus() {
    fileMenu.hidden = true;
    editMenu.hidden = true;
    fileMenuBtn.setAttribute('aria-expanded', 'false');
    editMenuBtn.setAttribute('aria-expanded', 'false');
  }

  fileMenuBtn.addEventListener('click', function() {
    var isOpen = !fileMenu.hidden;
    closeAllMenus();
    if (!isOpen) {
      fileMenu.hidden = false;
      fileMenuBtn.setAttribute('aria-expanded', 'true');
    }
  });

  editMenuBtn.addEventListener('click', function() {
    var isOpen = !editMenu.hidden;
    closeAllMenus();
    if (!isOpen) {
      editMenu.hidden = false;
      editMenuBtn.setAttribute('aria-expanded', 'true');
    }
  });

  // Hamburger menu
  var hamburgerBtn = document.getElementById('hamburger-btn');
  var mobileNav = document.getElementById('mobile-nav');
  hamburgerBtn.addEventListener('click', function() {
    var expanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
    hamburgerBtn.setAttribute('aria-expanded', String(!expanded));
    mobileNav.hidden = expanded;
  });

  // Close menus on outside click
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.menu-bar') && !e.target.closest('.dropdown-menu')) {
      closeAllMenus();
    }
  });
})();
