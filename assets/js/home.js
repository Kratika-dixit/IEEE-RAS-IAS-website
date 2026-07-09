document.addEventListener('DOMContentLoaded', () => {
  // Hero section load animations
  const animateElements = document.querySelectorAll('.animate-on-load');
  
  // Stagger the animations slightly
  animateElements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('is-visible');
    }, 150 + (index * 150));
  });
});

// Achievements Counter Animation
document.addEventListener('DOMContentLoaded', () => {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const countUp = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const prefix = el.getAttribute('data-prefix') || '';
    // Only add '+' suffix for large round numbers (funding etc.)
    const suffix = target >= 100 ? '+' : '';
    const duration = 2000;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.round(target * easeProgress);

      el.innerText = prefix + currentCount + (frame < totalFrames ? '' : suffix);

      if (frame === totalFrames) {
        clearInterval(counter);
        el.innerText = prefix + target + suffix;
      }
    }, frameDuration);
  };

  const observerOptions = {
    threshold: 0.5
  };

  const statObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  statNumbers.forEach(stat => {
    statObserver.observe(stat);
  });

  // Timeline Animations
  const timelineItems = document.querySelectorAll('.timeline-item');
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.5 });

  timelineItems.forEach(item => {
    timelineObserver.observe(item);
  });

  // Timeline Progress Line
  const timeline = document.querySelector('.timeline');
  const timelineProgress = document.querySelector('.timeline-progress');
  
  if (timeline && timelineProgress) {
    window.addEventListener('scroll', () => {
      const rect = timeline.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how much of the timeline is scrolled past the center of the screen
      const scrollPosition = windowHeight / 1.5;
      
      if (rect.top < scrollPosition && rect.bottom > 0) {
        let percentage = ((scrollPosition - rect.top) / rect.height) * 100;
        percentage = Math.max(0, Math.min(100, percentage)); // Clamp between 0 and 100
        timelineProgress.style.height = `${percentage}%`;
      } else if (rect.top >= scrollPosition) {
        timelineProgress.style.height = '0%';
      } else if (rect.bottom <= 0) {
        timelineProgress.style.height = '100%';
      }
    });
  }
});
