document.addEventListener('DOMContentLoaded', () => {
  // Placeholder for scroll reveal and fade animations.
  const animatedElements = document.querySelectorAll('[data-reveal]');
  animatedElements.forEach((element) => {
    element.classList.add('is-ready');
  });
});
