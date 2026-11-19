
const root = document.documentElement;
const themeBtn = document.getElementById('themeBtn');

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  themeBtn.textContent = theme === 'dark' ? '☀' : '☾';
  themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}
let saved = null;
try { saved = localStorage.getItem('theme'); } catch (e) {}
applyTheme(saved || 'dark');

themeBtn.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try { localStorage.setItem('theme', next); } catch (e) {}
});
const nav = document.getElementById('nav');
const menuBtn = document.getElementById('menuBtn');

menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
nav.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
});

const links = [...nav.querySelectorAll('a')];
const sections = links.map((a) => document.querySelector(a.getAttribute('href')));

function highlightLink() {
  const y = window.scrollY + 140;
  let current = 0;
  sections.forEach((s, i) => { if (s.offsetTop <= y) current = i; });
  links.forEach((a, i) => a.classList.toggle('active', i === current));
}
window.addEventListener('scroll', highlightLink, { passive: true });
highlightLink();
const fills = document.querySelectorAll('.fill');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.w + '%';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  fills.forEach((f) => observer.observe(f));
} else {
  fills.forEach((f) => (f.style.width = f.dataset.w + '%'));
}
const form = document.getElementById('form');
const statusBox = document.getElementById('status');

const rules = {
  name: (v) => (v.trim().length < 2 ? 'Enter your name (at least 2 characters).' : ''),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Enter a valid email, like name@example.com.'),
  msg: (v) => (v.trim().length < 10 ? 'Write a message of at least 10 characters.' : ''),
};

function validateField(id) {
  const input = document.getElementById(id);
  const message = rules[id](input.value);
  document.getElementById('e-' + id).textContent = message;
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
  return !message;
}

Object.keys(rules).forEach((id) => {
  const input = document.getElementById(id);
  input.addEventListener('blur', () => validateField(id));
  input.addEventListener('input', () => {
    if (input.getAttribute('aria-invalid') === 'true') validateField(id);
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  statusBox.textContent = '';
  const allValid = Object.keys(rules).map(validateField).every(Boolean);
  if (!allValid) {
    form.querySelector('[aria-invalid="true"]').focus();
    return;
  }
  statusBox.textContent = 'Thanks, ' + document.getElementById('name').value.trim() + '. Your message was sent.';
  form.reset();
});
document.getElementById('yr').textContent = new Date().getFullYear();