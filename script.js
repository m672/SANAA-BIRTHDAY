const slides = [...document.querySelectorAll('.slide')];
const dots = document.getElementById('dots');
const current = document.getElementById('current');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let active = 0;
let touchStartX = 0;

if (dots) {
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `اذهب إلى الشريحة ${index + 1}`);
    dot.addEventListener('click', () => goTo(index));
    dots.appendChild(dot);
  });
}

function goTo(index) {
  active = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => {
    slide.classList.toggle('is-active', i === active);
    if (i !== active) slide.querySelectorAll('video').forEach((video) => video.pause());
  });
  if (dots) [...dots.children].forEach((dot, i) => dot.classList.toggle('active', i === active));
  current.textContent = String(active + 1).padStart(2, '0');
}

prevBtn.addEventListener('click', () => goTo(active - 1));
nextBtn.addEventListener('click', () => goTo(active + 1));

document.addEventListener('keydown', (event) => {
  if (['ArrowRight', 'ArrowUp', 'PageUp'].includes(event.key)) goTo(active - 1);
  if (['ArrowLeft', 'ArrowDown', 'PageDown', ' '].includes(event.key)) goTo(active + 1);
  if (event.key === 'Home') goTo(0);
  if (event.key === 'End') goTo(slides.length - 1);
});

document.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
document.addEventListener('touchend', (event) => {
  const distance = event.changedTouches[0].screenX - touchStartX;
  // السحب للشمال = الصفحة التالية، والسحب لليمين = الصفحة السابقة.
  if (Math.abs(distance) > 50) goTo(active + (distance < 0 ? 1 : -1));
}, { passive: true });

goTo(0);
