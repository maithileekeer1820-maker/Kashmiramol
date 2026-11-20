
document.addEventListener("DOMContentLoaded", () => {
  const invitation = document.querySelector("#invitation");
  const openButton = document.querySelector("#open-invitation");
  const nextSectionButton = document.querySelector("#next-section-button");

  const welcomeSection = document.querySelector("#welcome-section");
  const inviteSection = document.querySelector("#invite-section");
  const saveDateSection = document.querySelector("#save-date-section");
  const weddingTimeSection = document.querySelector("#wedding-time-section");
  const weddingTimelineSection = document.querySelector("#wedding-timeline-section");
  const complimentsSection = document.querySelector("#compliments-section");
  const familyWelcomeSection = document.querySelector("#family-welcome-section");

  const contentSections = document.querySelector("#content-sections");

  const sections = [
    welcomeSection,
    inviteSection,
    saveDateSection,
    weddingTimeSection,
    weddingTimelineSection,
    complimentsSection,
    familyWelcomeSection
  ].filter(Boolean);

  const inviteCard = inviteSection?.querySelector(".invite-card");

  const saveDateImage = saveDateSection?.querySelector(".save-date-image");
  const saveDateContent = saveDateSection?.querySelector(".save-date-content");

  const weddingTimeImage = weddingTimeSection?.querySelector(".wedding-time-image");
  const weddingTimeContent = weddingTimeSection?.querySelector(".wedding-time-content");
  const weddingVenueContent = weddingTimeSection?.querySelector(".wedding-venue-content");

  const complimentsImage = complimentsSection?.querySelector(".compliments-image");
  const complimentsContent = complimentsSection?.querySelector(".compliments-content");

  const familyWelcomeImage = familyWelcomeSection?.querySelector(".family-welcome-image");
  const familyWelcomeContent = familyWelcomeSection?.querySelector(".family-welcome-content");

  if (
    !invitation ||
    !openButton ||
    !welcomeSection ||
    !contentSections ||
    !sections.length
  ) {
    console.error(
      "Check #invitation, #open-invitation, #welcome-section and #content-sections."
    );
    return;
  }

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const OPENING_TIME = reducedMotion ? 50 : 4900;
  const TRANSITION_TIME = reducedMotion ? 0 : 450;
  const NAVIGATION_LOCK_TIME = reducedMotion ? 0 : 900;
  const AUTO_TRANSITION_DELAY = 4200;

  let doorsFinished = false;
  let invitationOpened = false;
  let navigationLocked = true;
  let currentIndex = 0;

  let wheelAccumulator = 0;

  let wheelResetTimer = null;
  let openingTimer = null;
  let transitionTimer = null;
  let navigationTimer = null;
  let autoScrollTimer = null;
  let doorsFinishedTimer = null;

  let timelineObserver = null;
  let timelineScrollAnimation = null;

  /* TOUCH NAVIGATION STATE */

  let touchStartY = 0;
  let touchStartX = 0;
  let touchLastY = 0;
  let touchStartAtTop = false;
  let touchStartAtBottom = false;
  let touchNavigating = false;
  let touchMoved = false;

  const SWIPE_THRESHOLD = 65;

  const revealTimers = [];

  /* ========================================
     TIMER MANAGEMENT
  ======================================== */

  function clearRevealTimers() {
    revealTimers.forEach((timer) => {
      clearTimeout(timer);
    });

    revealTimers.length = 0;
  }

  function later(callback, delay) {
    const timer = setTimeout(() => {
      callback();
    }, reducedMotion ? 0 : delay);

    revealTimers.push(timer);
  }

  /* ========================================
     SCROLL LOCK
  ======================================== */

  function lockPageScroll() {
    document.documentElement.classList.add("no-scroll");
    document.body.classList.add("no-scroll");
  }

  function unlockPageScroll() {
    document.documentElement.classList.remove("no-scroll");
    document.body.classList.remove("no-scroll");
  }

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  lockPageScroll();
  window.scrollTo(0, 0);

  /* ========================================
     SAVE THE DATE IMAGE POSITION
  ======================================== */

  function positionSaveDateContent() {
    if (!saveDateImage || !saveDateContent) return;

    if (
      !saveDateImage.complete ||
      !saveDateImage.naturalWidth ||
      !saveDateImage.naturalHeight
    ) {
      return;
    }

    const imageWidth = saveDateImage.naturalWidth;
    const imageHeight = saveDateImage.naturalHeight;

    const containerWidth = saveDateImage.clientWidth;
    const containerHeight = saveDateImage.clientHeight;

    if (!containerWidth || !containerHeight) return;

    const scale = Math.min(
      containerWidth / imageWidth,
      containerHeight / imageHeight
    );

    const offsetX = (containerWidth - imageWidth * scale) / 2;
    const offsetY = (containerHeight - imageHeight * scale) / 2;

    saveDateContent.style.left =
      `${offsetX + 170 * scale}px`;

    saveDateContent.style.top =
      `${offsetY + 738 * scale}px`;

    saveDateContent.style.width =
      `${703 * scale}px`;

    saveDateContent.style.height =
      `${905 * scale}px`;
  }

  if (saveDateImage) {
    saveDateImage.addEventListener("load", positionSaveDateContent);
    window.addEventListener("resize", positionSaveDateContent);
    window.addEventListener("load", positionSaveDateContent);
  }

  /* ========================================
     WEDDING VENUE AND TIME IMAGE POSITION
  ======================================== */

  function positionWeddingTimeContent() {
    if (
      !weddingTimeImage ||
      !weddingVenueContent ||
      !weddingTimeContent
    ) {
      return;
    }

    if (
      !weddingTimeImage.complete ||
      !weddingTimeImage.naturalWidth ||
      !weddingTimeImage.naturalHeight
    ) {
      return;
    }

    const imageWidth = weddingTimeImage.naturalWidth;
    const imageHeight = weddingTimeImage.naturalHeight;

    const containerWidth = weddingTimeImage.clientWidth;
    const containerHeight = weddingTimeImage.clientHeight;

    if (!containerWidth || !containerHeight) return;

    const scale = Math.min(
      containerWidth / imageWidth,
      containerHeight / imageHeight
    );

    const offsetX = (containerWidth - imageWidth * scale) / 2;
    const offsetY = (containerHeight - imageHeight * scale) / 2;

    weddingVenueContent.style.left =
      `${offsetX + 263 * scale}px`;

    weddingVenueContent.style.top =
      `${offsetY + 500 * scale}px`;

    weddingVenueContent.style.width =
      `${567 * scale}px`;

    weddingVenueContent.style.height =
      `${66 * scale}px`;

    weddingTimeContent.style.left =
      `${offsetX + 353 * scale}px`;

    weddingTimeContent.style.top =
      `${offsetY + 1014 * scale}px`;

    weddingTimeContent.style.width =
      `${403 * scale}px`;

    weddingTimeContent.style.height =
      `${223 * scale}px`;
  }

  if (weddingTimeImage) {
    weddingTimeImage.addEventListener("load", positionWeddingTimeContent);
    window.addEventListener("resize", positionWeddingTimeContent);
    window.addEventListener("orientationchange", positionWeddingTimeContent);
    window.addEventListener("load", positionWeddingTimeContent);
  }

  /* ========================================
     WITH LOVE & BLESSINGS IMAGE POSITION
  ======================================== */

  function positionComplimentsContent() {
    if (!complimentsImage || !complimentsContent) return;

    if (
      !complimentsImage.complete ||
      !complimentsImage.naturalWidth ||
      !complimentsImage.naturalHeight
    ) {
      return;
    }

    const imageWidth = complimentsImage.naturalWidth;
    const imageHeight = complimentsImage.naturalHeight;

    const containerWidth = complimentsImage.clientWidth;
    const containerHeight = complimentsImage.clientHeight;

    if (!containerWidth || !containerHeight) return;

    const scale = Math.min(
      containerWidth / imageWidth,
      containerHeight / imageHeight
    );

    const offsetX = (containerWidth - imageWidth * scale) / 2;
    const offsetY = (containerHeight - imageHeight * scale) / 2;

    const left = 244;
    const top = 750;
    const right = 842;
    const bottom = 1063;

    complimentsContent.style.left =
      `${offsetX + left * scale}px`;

    complimentsContent.style.top =
      `${offsetY + top * scale}px`;

    complimentsContent.style.width =
      `${(right - left) * scale}px`;

    complimentsContent.style.height =
      `${(bottom - top) * scale}px`;
  }

  if (complimentsImage) {
    complimentsImage.addEventListener("load", positionComplimentsContent);
    window.addEventListener("resize", positionComplimentsContent);
    window.addEventListener("orientationchange", positionComplimentsContent);
    window.addEventListener("load", positionComplimentsContent);
  }

  /* ========================================
     FAMILY WELCOME IMAGE POSITION
  ======================================== */

  function positionFamilyWelcomeContent() {
    if (!familyWelcomeImage || !familyWelcomeContent) return;

    if (
      !familyWelcomeImage.complete ||
      !familyWelcomeImage.naturalWidth ||
      !familyWelcomeImage.naturalHeight
    ) {
      return;
    }

    const imageWidth = familyWelcomeImage.naturalWidth;
    const imageHeight = familyWelcomeImage.naturalHeight;

    const containerWidth = familyWelcomeImage.clientWidth;
    const containerHeight = familyWelcomeImage.clientHeight;

    if (!containerWidth || !containerHeight) return;

    const scale = Math.min(
      containerWidth / imageWidth,
      containerHeight / imageHeight
    );

    const offsetX = (containerWidth - imageWidth * scale) / 2;
    const offsetY = (containerHeight - imageHeight * scale) / 2;

    const left = 122;
    const top = 300;
    const right = 978;
    const bottom = 1561;

    familyWelcomeContent.style.left =
      `${offsetX + left * scale}px`;

    familyWelcomeContent.style.top =
      `${offsetY + top * scale}px`;

    familyWelcomeContent.style.width =
      `${(right - left) * scale}px`;

    familyWelcomeContent.style.height =
      `${(bottom - top) * scale}px`;
  }

  if (familyWelcomeImage) {
    familyWelcomeImage.addEventListener("load", positionFamilyWelcomeContent);
    window.addEventListener("resize", positionFamilyWelcomeContent);
    window.addEventListener("orientationchange", positionFamilyWelcomeContent);
    window.addEventListener("load", positionFamilyWelcomeContent);
  }

  /* ========================================
     DIRECTION
  ======================================== */

  function setDirection(direction) {
    document.documentElement.dataset.scrollDirection = direction;

    sections.forEach((section) => {
      section.classList.toggle("scrolling-down", direction === "down");
      section.classList.toggle("scrolling-up", direction === "up");
    });
  }

  /* ========================================
     NEXT SECTION ARROW VISIBILITY
  ======================================== */

  function updateNextArrowVisibility() {
    if (!nextSectionButton) return;

    const shouldShow =
      invitationOpened &&
      doorsFinished &&
      currentIndex >= 1 &&
      currentIndex < sections.length - 1;

    nextSectionButton.classList.toggle("is-visible", shouldShow);
  }

  /* ========================================
     RESET SECTION REVEALS
  ======================================== */

  function clearSectionReveal(index) {
    const section = sections[index];

    if (!section) return;

    section.classList.remove("is-revealed", "is-save-date-visible");

    section.querySelectorAll(
      ".is-visible, .is-card-visible"
    ).forEach((element) => {
      element.classList.remove("is-visible", "is-card-visible");
    });
  }

  /* ========================================
     WELCOME TEXT REVEAL
  ======================================== */

  function revealWelcome() {
    if (!welcomeSection) return;

    welcomeSection.classList.add("is-revealed");
  }

  /* ========================================
     INVITATION REVEAL
  ======================================== */

  function revealInvitation() {
    if (!inviteSection) return;

    inviteCard?.classList.add("is-card-visible");

    const elements = inviteSection.querySelectorAll(
      ".invitation-heading, .fine-rule, .person, " +
      ".person h3, .person p, .ampersand, .zoom-in"
    );

    elements.forEach((element, index) => {
      later(() => {
        if (!inviteSection.classList.contains("section-active")) return;

        element.classList.add("is-visible");
      }, index * 120);
    });
  }

  /* ========================================
     SAVE THE DATE REVEAL
  ======================================== */

  function revealSaveDate() {
    if (!saveDateSection) return;

    positionSaveDateContent();

    const elements = saveDateSection.querySelectorAll(".cinematic-item");

    elements.forEach((element, index) => {
      later(() => {
        if (!saveDateSection.classList.contains("section-active")) return;

        element.classList.add("is-visible");
      }, index * 120);
    });

    const calendarHeart = saveDateSection.querySelector(".calendar-heart");

    later(() => {
      if (!saveDateSection.classList.contains("section-active")) return;

      calendarHeart?.classList.add("is-visible");
    }, elements.length * 120 + 300);
  }

  /* ========================================
     WEDDING TIME REVEAL
  ======================================== */

  function revealWeddingTime() {
    if (!weddingTimeSection) return;

    positionWeddingTimeContent();

    const elements = weddingTimeSection.querySelectorAll(".cinematic-item");

    elements.forEach((element, index) => {
      later(() => {
        if (!weddingTimeSection.classList.contains("section-active")) return;

        element.classList.add("is-visible");
      }, 350 + index * 250);
    });
  }

  /* ========================================
     WEDDING TIMELINE REVEAL
  ======================================== */

  function revealWeddingTimeline() {
    if (!weddingTimelineSection) return;

    weddingTimelineSection.scrollTop = 0;

    if (timelineObserver) {
      timelineObserver.disconnect();
      timelineObserver = null;
    }

    const timelineHeader = weddingTimelineSection.querySelector(".timeline-header");

    const timelineEvents = weddingTimelineSection.querySelectorAll(".timeline-event");

    const timelineFooter = weddingTimelineSection.querySelector(".timeline-footer");

    if (timelineHeader) {
      later(() => {
        if (weddingTimelineSection.classList.contains("section-active")) {
          timelineHeader.classList.add("is-visible");
        }
      }, 150);
    }

    const firstThreeEvents = Array.from(timelineEvents).slice(0, 3);

    firstThreeEvents.forEach((event, index) => {
      later(() => {
        if (!weddingTimelineSection.classList.contains("section-active")) return;

        event.classList.add("is-visible");
      }, 700 + index * 350);
    });

    const remainingItems = [
      ...Array.from(timelineEvents).slice(3),
      timelineFooter
    ].filter(Boolean);

    timelineObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          if (!weddingTimelineSection.classList.contains("section-active")) return;

          entry.target.classList.add("is-visible");

          observer.unobserve(entry.target);
        });
      },
      {
        root: weddingTimelineSection,
        threshold: 0.15,
        rootMargin: "0px 0px -5% 0px"
      }
    );

    remainingItems.forEach((item) => {
      timelineObserver.observe(item);
    });
  }

  /* ========================================
     WITH LOVE & BLESSINGS REVEAL
  ======================================== */

  function revealCompliments() {
    if (!complimentsSection) return;

    positionComplimentsContent();

    const elements = complimentsSection.querySelectorAll(".cinematic-item");

    elements.forEach((element, index) => {
      later(() => {
        if (!complimentsSection.classList.contains("section-active")) return;

        element.classList.add("is-visible");
      }, 550 + index * 250);
    });
  }

  /* ========================================
     FAMILY WELCOME REVEAL
  ======================================== */

  function revealFamilyWelcome() {
    if (!familyWelcomeSection) return;

    positionFamilyWelcomeContent();

    const elements = familyWelcomeSection.querySelectorAll(".cinematic-item");

    elements.forEach((element, index) => {
      later(() => {
        if (!familyWelcomeSection.classList.contains("section-active")) return;

        element.classList.add("is-visible");
      }, 550 + index * 200);
    });
  }

  /* ========================================
     SECTION REVEAL CONTROLLER
  ======================================== */

  function revealSection(index) {
    const section = sections[index];

    if (section === welcomeSection) {
      revealWelcome();
    } else if (section === inviteSection) {
      revealInvitation();
    } else if (section === saveDateSection) {
      revealSaveDate();
    } else if (section === weddingTimeSection) {
      revealWeddingTime();
    } else if (section === weddingTimelineSection) {
      revealWeddingTimeline();
    } else if (section === complimentsSection) {
      revealCompliments();
    } else if (section === familyWelcomeSection) {
      revealFamilyWelcome();
    }
  }

  /* ========================================
     SECTION VISIBILITY
  ======================================== */

  function hideAllSections() {
    sections.forEach((section) => {
      section.classList.remove(
        "section-active",
        "section-entering",
        "section-exiting"
      );

      section.setAttribute("aria-hidden", "true");
    });
  }

  function activateSection(index) {
    const section = sections[index];

    if (!section) return;

    section.classList.remove("section-exiting");
    section.classList.add("section-active");

    section.setAttribute("aria-hidden", "false");

    currentIndex = index;

    updateNextArrowVisibility();

    if (section === welcomeSection) {
      contentSections.classList.remove("content-active");
    } else {
      contentSections.classList.add("content-active");
    }

    if (section !== welcomeSection && !reducedMotion) {
      void section.offsetWidth;
      section.classList.add("section-entering");
    }

    revealSection(index);

    if (section !== welcomeSection) {
      setTimeout(() => {
        section.classList.remove("section-entering");
      }, reducedMotion ? 0 : 1100);
    }
  }

  /* ========================================
     OPEN INVITATION
  ======================================== */

  function openInvitation(event) {
    event?.preventDefault();

    if (invitationOpened) return;

    document.documentElement.classList.remove("preload");

    console.log("Wedding invitation seal clicked.");

    invitationOpened = true;
    navigationLocked = true;

    openButton.disabled = true;
    openButton.setAttribute("aria-expanded", "true");

    doorsFinished = false;
    updateNextArrowVisibility();

    invitation.classList.add("is-open");
    invitation.classList.add("is-transitioning");

    doorsFinishedTimer = setTimeout(() => {
      doorsFinished = true;
      updateNextArrowVisibility();
    }, OPENING_TIME);

    openingTimer = setTimeout(() => {
      invitation.classList.remove("is-transitioning");

      revealWelcome();

      unlockPageScroll();
      navigationLocked = false;

      autoScrollTimer = setTimeout(() => {
        if (
          invitationOpened &&
          currentIndex === 0 &&
          !navigationLocked &&
          sections.length > 1
        ) {
          goToSection(1);
        }
      }, AUTO_TRANSITION_DELAY);
    }, OPENING_TIME - 2500);
  }

  document.addEventListener("click", openInvitation, { once: true });

  /* ========================================
     SECTION NAVIGATION
  ======================================== */

  function goToSection(nextIndex) {
    if (!invitationOpened || navigationLocked) return;

    if (nextIndex < 0 || nextIndex >= sections.length) return;
    if (nextIndex === currentIndex) return;

    clearTimeout(autoScrollTimer);

    setDirection(nextIndex > currentIndex ? "down" : "up");

    navigationLocked = true;

    clearTimeout(transitionTimer);
    clearTimeout(navigationTimer);

    clearRevealTimers();

    /* Stop an unfinished timeline arrow animation */

    if (timelineScrollAnimation !== null) {
      cancelAnimationFrame(timelineScrollAnimation);
      timelineScrollAnimation = null;
    }

    const previousSection = sections[currentIndex];

    if (previousSection === weddingTimelineSection && timelineObserver) {
      timelineObserver.disconnect();
      timelineObserver = null;
    }

    if (previousSection) {
      previousSection.classList.remove("section-entering");
      previousSection.classList.add("section-exiting");

      previousSection.setAttribute("aria-hidden", "true");

      clearSectionReveal(currentIndex);
    }

    clearSectionReveal(nextIndex);

    transitionTimer = setTimeout(() => {
      if (previousSection) {
        previousSection.classList.remove(
          "section-active",
          "section-exiting",
          "section-entering"
        );
      }

      activateSection(nextIndex);

      navigationTimer = setTimeout(() => {
        navigationLocked = false;
      }, NAVIGATION_LOCK_TIME);
    }, TRANSITION_TIME);
  }

  function navigateBy(direction) {
    goToSection(currentIndex + direction);
  }

  /* ========================================
     TIMELINE SCROLL POSITION HELPERS
  ======================================== */

  function isTimelineAtTop() {
    if (!weddingTimelineSection) return true;

    return weddingTimelineSection.scrollTop <= 2;
  }

  function isTimelineAtBottom() {
    if (!weddingTimelineSection) return true;

    return (
      weddingTimelineSection.scrollTop +
      weddingTimelineSection.clientHeight >=
      weddingTimelineSection.scrollHeight - 5
    );
  }

  /* ========================================
     SMOOTH TIMELINE SCROLL ANIMATION

     Used by the next arrow and keyboard.
  ======================================== */

  function smoothTimelineScroll(distance) {
    const timeline = weddingTimelineSection;

    if (!timeline) return;

    if (timelineScrollAnimation !== null) {
      cancelAnimationFrame(timelineScrollAnimation);
      timelineScrollAnimation = null;
    }

    const startPosition = timeline.scrollTop;

    const maxScroll = timeline.scrollHeight - timeline.clientHeight;

    const targetPosition = Math.max(
      0,
      Math.min(startPosition + distance, maxScroll)
    );

    const totalDistance = targetPosition - startPosition;

    if (Math.abs(totalDistance) <= 1) return;

    if (reducedMotion) {
      timeline.scrollTop = targetPosition;
      return;
    }

    const duration = 1200;
    let startTime = null;

    function animateScroll(timestamp) {
      if (startTime === null) startTime = timestamp;

      const elapsed = timestamp - startTime;

      const progress = Math.min(elapsed / duration, 1);

      const easedProgress =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      timeline.scrollTop =
        startPosition + totalDistance * easedProgress;

      if (progress < 1) {
        timelineScrollAnimation = requestAnimationFrame(animateScroll);
      } else {
        timelineScrollAnimation = null;
      }
    }

    timelineScrollAnimation = requestAnimationFrame(animateScroll);
  }

  /* ========================================
     NEXT SECTION ARROW CLICK
  ======================================== */

  if (nextSectionButton) {
    nextSectionButton.addEventListener("click", () => {
      if (navigationLocked) return;

      if (sections[currentIndex] === weddingTimelineSection) {
        const timeline = weddingTimelineSection;

        if (!isTimelineAtBottom()) {
          smoothTimelineScroll(timeline.clientHeight * 0.75);
          return;
        }

        navigateBy(1);
        return;
      }

      navigateBy(1);
    });
  }

  /* ========================================
     MOUSE WHEEL NAVIGATION

     Timeline uses natural wheel scrolling.
     Section navigation happens at its edges.
  ======================================== */

  window.addEventListener(
    "wheel",
    (event) => {
      if (!invitationOpened) {
        event.preventDefault();
        return;
      }

      if (navigationLocked) {
        event.preventDefault();
        return;
      }

      const direction = event.deltaY > 0 ? 1 : -1;

      if (sections[currentIndex] === weddingTimelineSection) {
        const canScrollInsideTimeline =
          direction > 0
            ? !isTimelineAtBottom()
            : !isTimelineAtTop();

        if (canScrollInsideTimeline) {
          return;
        }

        event.preventDefault();
      } else {
        event.preventDefault();
      }

      wheelAccumulator += event.deltaY;

      clearTimeout(wheelResetTimer);

      wheelResetTimer = setTimeout(() => {
        wheelAccumulator = 0;
      }, 180);

      if (Math.abs(wheelAccumulator) < 45) return;

      wheelAccumulator = 0;

      navigateBy(direction);
    },
    { passive: false }
  );

  /* ========================================
     MOBILE TOUCH NAVIGATION
  ======================================== */

  window.addEventListener(
    "touchstart",
    (event) => {
      if (event.touches.length !== 1) return;

      const touch = event.touches[0];

      touchStartY = touch.clientY;
      touchLastY = touch.clientY;
      touchStartX = touch.clientX;

      touchMoved = false;
      touchNavigating = false;

      if (sections[currentIndex] === weddingTimelineSection) {
        touchStartAtTop = isTimelineAtTop();
        touchStartAtBottom = isTimelineAtBottom();
      } else {
        touchStartAtTop = false;
        touchStartAtBottom = false;
      }
    },
    { passive: true }
  );

  window.addEventListener(
    "touchmove",
    (event) => {
      if (!invitationOpened) {
        event.preventDefault();
        return;
      }

      if (event.touches.length !== 1) return;

      const touch = event.touches[0];

      const difference = touchStartY - touch.clientY;
      const horizontalDifference = touch.clientX - touchStartX;

      touchLastY = touch.clientY;

      if (
        Math.abs(difference) > 8 ||
        Math.abs(horizontalDifference) > 8
      ) {
        touchMoved = true;
      }

      if (Math.abs(horizontalDifference) > Math.abs(difference)) {
        return;
      }

      if (sections[currentIndex] !== weddingTimelineSection) {
        if (Math.abs(difference) > 8) {
          event.preventDefault();
        }

        return;
      }

      const swipingUp = difference > 0;
      const swipingDown = difference < 0;

      const leavingTimelineAtBottom = touchStartAtBottom && swipingUp;
      const leavingTimelineAtTop = touchStartAtTop && swipingDown;

      if (leavingTimelineAtBottom || leavingTimelineAtTop) {
        event.preventDefault();
        touchNavigating = true;
      }
    },
    { passive: false }
  );

  window.addEventListener(
    "touchend",
    (event) => {
      if (!invitationOpened || navigationLocked) return;
      if (!event.changedTouches.length) return;
      if (!touchMoved) return;

      const touch = event.changedTouches[0];

      const difference = touchStartY - touch.clientY;
      const horizontalDifference = touch.clientX - touchStartX;

      if (Math.abs(horizontalDifference) > Math.abs(difference)) {
        return;
      }

      if (Math.abs(difference) < SWIPE_THRESHOLD) return;

      if (sections[currentIndex] === weddingTimelineSection) {
        if (!touchNavigating) return;

        if (difference > 0 && touchStartAtBottom) {
          navigateBy(1);
          return;
        }

        if (difference < 0 && touchStartAtTop) {
          navigateBy(-1);
          return;
        }

        return;
      }

      navigateBy(difference > 0 ? 1 : -1);
    },
    { passive: true }
  );

  window.addEventListener(
    "touchcancel",
    () => {
      touchMoved = false;
      touchNavigating = false;
      touchStartAtTop = false;
      touchStartAtBottom = false;
    },
    { passive: true }
  );

  /* ========================================
     KEYBOARD NAVIGATION
  ======================================== */

  window.addEventListener("keydown", (event) => {
    if (!invitationOpened || navigationLocked) return;

    const target = event.target;

    if (
      target instanceof HTMLElement &&
      (
        target.matches("input, textarea, select, button") ||
        target.isContentEditable
      )
    ) {
      return;
    }

    if (sections[currentIndex] === weddingTimelineSection) {
      if (["ArrowDown", "PageDown", " "].includes(event.key)) {
        const atBottom = isTimelineAtBottom();

        if (!atBottom) {
          event.preventDefault();

          smoothTimelineScroll(
            event.key === "PageDown"
              ? weddingTimelineSection.clientHeight * 0.8
              : 80
          );
        } else {
          event.preventDefault();
          navigateBy(1);
        }

        return;
      }

      if (["ArrowUp", "PageUp"].includes(event.key)) {
        const atTop = isTimelineAtTop();

        if (!atTop) {
          event.preventDefault();

          smoothTimelineScroll(
            -(event.key === "PageUp"
              ? weddingTimelineSection.clientHeight * 0.8
              : 80)
          );
        } else {
          event.preventDefault();
          navigateBy(-1);
        }

        return;
      }
    }

    if (["ArrowDown", "PageDown", " "].includes(event.key)) {
      event.preventDefault();
      navigateBy(1);
    } else if (["ArrowUp", "PageUp"].includes(event.key)) {
      event.preventDefault();
      navigateBy(-1);
    } else if (event.key === "Home") {
      event.preventDefault();
      goToSection(0);
    } else if (event.key === "End") {
      event.preventDefault();
      goToSection(sections.length - 1);
    }
  });

  /* ========================================
     BACK TO TOP - RESTART INVITATION
  ======================================== */

  const backToTopButton = document.querySelector(".to-top");

  if (backToTopButton) {
    backToTopButton.addEventListener("click", () => {
      window.location.reload();
    });
  }

  /* ========================================
     INITIAL PAGE STATE
  ======================================== */

  hideAllSections();

  invitation.classList.remove("is-open", "is-transitioning");

  contentSections.classList.remove("content-active");

  openButton.disabled = false;
  openButton.setAttribute("aria-expanded", "false");

  doorsFinished = false;
  invitationOpened = false;
  navigationLocked = true;

  nextSectionButton?.classList.remove("is-visible");

  welcomeSection.classList.add("section-active");
  welcomeSection.setAttribute("aria-hidden", "false");

  currentIndex = 0;

  lockPageScroll();
  window.scrollTo(0, 0);

  if (saveDateImage?.complete) {
    positionSaveDateContent();
  }

  if (weddingTimeImage?.complete) {
    positionWeddingTimeContent();
  }

  if (complimentsImage?.complete) {
    positionComplimentsContent();
  }

  if (familyWelcomeImage?.complete) {
    positionFamilyWelcomeContent();
  }
});
