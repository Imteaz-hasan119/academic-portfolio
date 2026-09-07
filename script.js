/* =====================================================
   script.js
   Every function below has plain-English comments so a
   beginner can follow exactly what each line is doing.
===================================================== */

/* ---------------------------------------------------
   1) THEME TOGGLE (Day/Night) with localStorage memory
--------------------------------------------------- */
function initThemeToggle() {
  // Grab the <html> tag, because that's where we store data-theme="dark"/"light"
  const htmlEl = document.documentElement;
  // Grab the toggle button from the navbar
  const toggleBtn = document.getElementById('themeToggle');

  // Check if the user already picked a theme before (saved in localStorage)
  const savedTheme = localStorage.getItem('portfolio-theme');

  // If we found a saved theme, apply it immediately so the page loads correctly
  if (savedTheme) {
    htmlEl.setAttribute('data-theme', savedTheme);
  }

  // When the button is clicked...
  toggleBtn.addEventListener('click', function () {
    // Read whatever theme is currently active
    const currentTheme = htmlEl.getAttribute('data-theme');
    // Flip it: if it's dark, switch to light, and vice versa
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    // Apply the new theme to the <html> tag (this is what the CSS reads)
    htmlEl.setAttribute('data-theme', newTheme);
    // Save the choice in localStorage so it's remembered next time they visit
    localStorage.setItem('portfolio-theme', newTheme);
  });
}

/* ---------------------------------------------------
   2) TYPEWRITER EFFECT in the navbar brand
--------------------------------------------------- */
function initTypewriter() {
  // ✏️ Edit: the list of words/phrases the typewriter cycles through
  const words = ['Imtiaz Hasan', 'CSE Student', 'Problem Solver', 'Web Developer', 'Always Learning'];

  // Grab the <span> where the typed text will appear
  const typedSpan = document.getElementById('typewriter');

  // These variables track where we are in the animation
  let wordIndex = 0;      // which word from the array we're currently on
  let charIndex = 0;      // how many characters of that word are typed so far
  let isDeleting = false; // are we typing forward, or deleting backward?

  // This function runs repeatedly (via setTimeout calling itself) to animate the text
  function type() {
    // Get the full word we're currently working on
    const currentWord = words[wordIndex];

    if (!isDeleting) {
      // We're typing: show one more letter than before
      charIndex++;
      typedSpan.textContent = currentWord.substring(0, charIndex);
    } else {
      // We're deleting: show one less letter than before
      charIndex--;
      typedSpan.textContent = currentWord.substring(0, charIndex);
    }

    // Decide how long to wait before the next letter (typing vs deleting speed)
    let delay = isDeleting ? 60 : 110;

    // If we just finished typing the whole word, pause, then start deleting
    if (!isDeleting && charIndex === currentWord.length) {
      delay = 1400; // pause so people can read the full word
      isDeleting = true;
    }
    // If we just finished deleting the whole word, move on to the next word
    else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length; // loop back to the first word at the end
      delay = 300; // small pause before typing the next word starts
    }

    // Schedule the next step of the animation
    setTimeout(type, delay);
  }

  // Kick off the animation
  type();
}

/* ---------------------------------------------------
   3) ANIMATED SKILL BARS (fills when scrolled into view)
--------------------------------------------------- */
function initSkillBars() {
  // Grab every skill bar fill element on the page
  const skillBars = document.querySelectorAll('.skill-fill');

  // IntersectionObserver watches elements and tells us when they enter the viewport
  const observer = new IntersectionObserver(function (entries) {
    // "entries" is a list of every watched element and whether it's now visible
    entries.forEach(function (entry) {
      // Only act when the element has actually scrolled into view
      if (entry.isIntersecting) {
        const bar = entry.target;
        // Read the target percentage we stored in the data-percent attribute
        const percent = bar.getAttribute('data-percent');
        // Set the width, which triggers the CSS transition to animate it filling up
        bar.style.width = percent + '%';
        // Add a brief brightness-flicker class for extra "glow while filling" punch
        bar.classList.add('filling');
        // Stop watching this bar once it has animated, so it doesn't re-trigger
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.4 }); // fires once 40% of the bar is visible on screen

  // Tell the observer to watch every skill bar we found
  skillBars.forEach(function (bar) {
    observer.observe(bar);
  });
}

/* ---------------------------------------------------
   4) STICKY NAVBAR SHADOW + ACTIVE LINK ON SCROLL
--------------------------------------------------- */
function initScrollSpy() {
  // Grab all the sections that have an id (these are our "pages" to track)
  const sections = document.querySelectorAll('section[id], header[id]');
  // Grab all the nav links so we can turn their "active" state on/off
  const navLinks = document.querySelectorAll('.nav-section');

  // This runs every time the user scrolls
  window.addEventListener('scroll', function () {
    // Current scroll position, with a small offset so the highlight feels natural
    const scrollPos = window.scrollY + 120;

    // Loop through every section to figure out which one we're inside of
    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        // We're inside this section, so highlight the matching nav link
        navLinks.forEach(function (link) {
          link.classList.remove('active-link');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active-link');
          }
        });
      }
    });
  });
}

/* ---------------------------------------------------
   5) REVEAL-ON-SCROLL for cards/timeline (subtle fade+rise)
--------------------------------------------------- */
function initRevealOnScroll() {
  // Select the elements we want to fade/slide in as the user scrolls to them
  const targets = document.querySelectorAll(
    '.info-card, .tools-card, .project-card, .timeline-item, .skill-item'
  );

  // Add the starting (invisible) class to each one
  targets.forEach(function (el) {
    el.classList.add('reveal-on-scroll');
  });

  // Watch each element and add "is-visible" once it scrolls into view
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // only animate once
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(function (el) {
    observer.observe(el);
  });
}

/* ---------------------------------------------------
   6) CONTACT FORM VALIDATION (Bootstrap-style, alert on submit)
--------------------------------------------------- */
function initContactForm() {
  // Grab the form element
  const form = document.getElementById('contactForm');

  // Listen for the submit event (when the user clicks "Send Message")
  form.addEventListener('submit', function (event) {
    // Stop the page from reloading, which is the default browser behavior on submit
    event.preventDefault();

    // Ask the browser's built-in validation: are all "required" fields filled correctly?
    if (!form.checkValidity()) {
      // Stop any further action (like actually sending data) if something is invalid
      event.stopPropagation();
      // Add Bootstrap's class that reveals the red "invalid-feedback" messages
      form.classList.add('was-validated');
      return;
    }

    // ✏️ Edit: this alert is a placeholder so the form "works" without a backend.
    // To send REAL emails instead of showing this alert:
    //   1) Sign up at https://formspree.io and create a form there
    //   2) Set the <form action="..."> in index.html to your Formspree endpoint
    //   3) Delete the two lines below (the alert + form.reset()) and the
    //      event.preventDefault() above, so the browser submits normally to Formspree
    alert('Thanks for reaching out! This is a demo form — connect Formspree (see comment in the code) to receive real emails.');

    // Clear the form fields and validation styling after the "submission"
    form.reset();
    form.classList.remove('was-validated');
  });
}

/* ---------------------------------------------------
   7) FOOTER YEAR (always shows the current year)
--------------------------------------------------- */
function initFooterYear() {
  // Grab the <span> in the footer meant to hold the year
  const yearSpan = document.getElementById('year');
  // Insert the current year, read live from the user's device clock
  yearSpan.textContent = new Date().getFullYear();
}

/* ---------------------------------------------------
   8) PRELOADER (hides once the page has fully loaded)
--------------------------------------------------- */
function initPreloader() {
  // Grab the full-screen spinner overlay
  const preloader = document.getElementById('preloader');
  // "load" fires once everything (images, fonts, etc.) is ready, not just the HTML
  window.addEventListener('load', function () {
    // Add the "hidden" class, which CSS fades out with a transition
    preloader.classList.add('hidden');
    // Fully remove it from the page after the fade so it can't block clicks
    setTimeout(function () {
      preloader.remove();
    }, 500);
  });
}

/* ---------------------------------------------------
   9) NAVBAR SHRINK ON SCROLL
--------------------------------------------------- */
function initNavShrink() {
  // Grab the navbar element
  const nav = document.getElementById('mainNav');
  // Every time the user scrolls, check how far down the page they are
  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      // Past 40px, add the "scrolled" class (CSS makes it slimmer + adds shadow)
      nav.classList.add('scrolled');
    } else {
      // Back near the top, remove it so the navbar returns to full size
      nav.classList.remove('scrolled');
    }
  });
}

/* ---------------------------------------------------
   10) CURSOR-FOLLOWING GLOW (desktop only, purely visual)
--------------------------------------------------- */
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  // Skip entirely on touch devices, since there's no mouse cursor to follow
  if (window.matchMedia('(hover: none)').matches) return;

  // Every time the mouse moves, reposition the glow element to follow it
  document.addEventListener('mousemove', function (e) {
    // clientX/clientY = the mouse's current pixel position on screen
    glow.style.transform = 'translate(' + e.clientX + 'px, ' + e.clientY + 'px) translate(-50%, -50%)';
  });
}

/* ---------------------------------------------------
   11) SCROLL-TO-TOP BUTTON
--------------------------------------------------- */
function initScrollTopButton() {
  const btn = document.getElementById('scrollTopBtn');

  // Show the button only after the user has scrolled down a bit
  window.addEventListener('scroll', function () {
    if (window.scrollY > 500) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });

  // When clicked, smoothly scroll the page back to the top
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------------------------------------------------
   12) SECTION TITLE UNDERLINE ANIMATES IN ON SCROLL
--------------------------------------------------- */
function initTitleUnderline() {
  // Grab every section heading that should get the animated underline
  const titles = document.querySelectorAll('.section-title');

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // Adding this class triggers the CSS width transition on ::after
        entry.target.classList.add('underline-in');
        observer.unobserve(entry.target); // only needs to happen once
      }
    });
  }, { threshold: 0.5 });

  titles.forEach(function (title) {
    observer.observe(title);
  });
}

/* ---------------------------------------------------
   RUN EVERYTHING once the HTML has fully loaded
   (DOMContentLoaded fix: ensures elements exist before we touch them)
--------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  initThemeToggle();
  initTypewriter();
  initSkillBars();
  initScrollSpy();
  initRevealOnScroll();
  initContactForm();
  initFooterYear();
  initPreloader();
  initNavShrink();
  initCursorGlow();
  initScrollTopButton();
  initTitleUnderline();
});
