document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isExpanded));
      siteNav.classList.toggle('is-open');
    });
  }

  // Highlight active navigation link based on current page.
  const links = document.querySelectorAll('.site-nav a');
  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (href && window.location.pathname.endsWith(href)) {
      link.classList.add('active');
    }
  });
});
