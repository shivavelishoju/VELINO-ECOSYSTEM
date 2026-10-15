/* =========================================================
   VELINO — MAIN JAVASCRIPT
   ========================================================= */

   document.addEventListener("DOMContentLoaded", () => {

    /* =======================================================
       GLOBAL ELEMENTS
       ======================================================= */
  
    const splash = document.getElementById("splash-screen");
    const introSound = document.getElementById("introSound");
  
    const nav = document.getElementById("navMenu");
    const menuBtn = document.getElementById("menuBtn");
  
    const main = document.querySelector("main");
  
  
    /* =======================================================
       PAGE LOCK DURING SPLASH
       ======================================================= */
  
    document.body.classList.add("lock");
  
  
    /* =========================================================
       SPLASH SCREEN AUDIO
       ========================================================= */
  
    if (introSound) {
  
      introSound.volume = 1;
      introSound.load();
  
      const playIntroSound = () => {
  
        introSound.play().catch(() => {
          console.log(
            "Velino: Splash audio autoplay blocked."
          );
        });
  
      };
  
      if (introSound.readyState >= 3) {
  
        playIntroSound();
  
      } else {
  
        introSound.addEventListener(
          "canplaythrough",
          playIntroSound,
          { once: true }
        );
  
      }
  
    }
  
  
    /* =========================================================
       HERO VIDEO
       ========================================================= */
  
    const heroVideo =
      document.getElementById("heroBgVideo");
  
    const soundButton =
      document.getElementById("heroSoundBtn");
  
    const heroSection =
      document.querySelector(".hero");
  
  
    /*
     * IMPORTANT
     * ---------------------------------------------------------
     * Hero video is completely controlled from this one place.
     * No other code should call heroVideo.play() automatically.
     */
  
    let splashFinished = false;
  
  
    /* =======================================================
       HERO VIDEO SETTINGS
       ======================================================= */
  
    if (heroVideo) {
  
      heroVideo.loop = true;
      heroVideo.playsInline = true;
      heroVideo.volume = 1;
  
      /*
       * ALWAYS begin at the first frame.
       */
  
      heroVideo.pause();
  
      try {
        heroVideo.currentTime = 0;
      } catch (error) {
        console.log(error);
      }
  
      /*
       * Muted while splash is showing.
       */
  
      heroVideo.muted = true;
  
    }
  
  
    /* =======================================================
       SOUND BUTTON UI
       ======================================================= */
  
    function updateSoundButton() {
  
      if (!soundButton || !heroVideo) {
        return;
      }
  
  
      /* AUDIO OFF */
  
      if (heroVideo.muted) {
  
        soundButton.textContent = "🔇";
  
        soundButton.setAttribute(
          "aria-label",
          "Turn hero video sound on"
        );
  
        soundButton.setAttribute(
          "title",
          "Turn sound on"
        );
  
        soundButton.setAttribute(
          "aria-pressed",
          "false"
        );
  
      }
  
  
      /* AUDIO ON */
  
      else {
  
        soundButton.textContent = "🔊";
  
        soundButton.setAttribute(
          "aria-label",
          "Turn hero video sound off"
        );
  
        soundButton.setAttribute(
          "title",
          "Turn sound off"
        );
  
        soundButton.setAttribute(
          "aria-pressed",
          "true"
        );
  
      }
  
    }
  
  
    /* =======================================================
       START HERO VIDEO AFTER SPLASH
       ======================================================= */
  
    async function startHeroVideo() {
  
      if (!heroVideo) {
        return;
      }
  
  
      console.log(
        "VELINO: Starting hero video..."
      );
  
  
      splashFinished = true;
  
  
      /*
       * -------------------------------------------------------
       * RESET VIDEO TO BEGINNING
       * -------------------------------------------------------
       */
  
      heroVideo.pause();
  
      try {
  
        heroVideo.currentTime = 0;
  
      } catch (error) {
  
        console.log(
          "VELINO: Could not reset video position.",
          error
        );
  
      }
  
  
      /*
       * -------------------------------------------------------
       * FIRST ATTEMPT
       *
       * Try to start video WITH AUDIO.
       * -------------------------------------------------------
       */
  
      heroVideo.volume = 1;
      heroVideo.muted = false;
  
  
      try {
  
        await heroVideo.play();
  
        /*
         * SUCCESS
         * Video is playing with audio.
         */
  
        console.log(
          "VELINO: Hero video started WITH AUDIO."
        );
  
        heroVideo.muted = false;
  
        updateSoundButton();
  
      }
  
  
      /*
       * -------------------------------------------------------
       * BROWSER BLOCKED AUDIO AUTOPLAY
       * -------------------------------------------------------
       */
  
      catch (error) {
  
        console.log(
          "VELINO: Browser blocked autoplay with audio."
        );
  
  
        /*
         * Start video muted.
         */
  
        heroVideo.muted = true;
  
  
        try {
  
          await heroVideo.play();
  
          console.log(
            "VELINO: Hero video started muted."
          );
  
        }
  
        catch (videoError) {
  
          console.error(
            "VELINO: Hero video could not start.",
            videoError
          );
  
        }
  
  
        updateSoundButton();
  
      }
  
    }
  
  
    /* =======================================================
       SPLASH FINISH
       ======================================================= */
  
    function finishSplash() {
  
      if (splashFinished) {
        return;
      }
  
  
      console.log(
        "VELINO: Splash finished."
      );
  
  
      /*
       * Remove splash
       */
  
      if (splash) {
  
        splash.classList.remove(
          "fade-out"
        );
  
        splash.remove();
  
      }
  
  
      /*
       * Unlock page
       */
  
      document.body.classList.remove(
        "lock"
      );
  
  
      /*
       * Start hero video
       */
  
      startHeroVideo();
  
  
      /*
       * Focus main content
       */
  
      if (main && typeof main.focus === "function") {
  
        main.focus();
  
      }
  
    }
  
  
    /* =======================================================
       SPLASH TIMER
       ======================================================= */
  
    if (splash) {
  
      /*
       * Splash visible for 3500ms.
       */
  
      setTimeout(() => {
  
  
        /*
         * Start fade animation.
         */
  
        splash.classList.add(
          "fade-out"
        );
  
  
        /*
         * Fade splash audio.
         */
  
        if (introSound) {
  
          const fadeAudio =
            setInterval(() => {
  
              if (
                introSound.volume > 0.05
              ) {
  
                introSound.volume -= 0.05;
  
              }
  
              else {
  
                clearInterval(
                  fadeAudio
                );
  
                introSound.pause();
  
                try {
                  introSound.currentTime = 0;
                } catch (error) {}
  
                introSound.volume = 1;
  
              }
  
            }, 50);
  
        }
  
  
        /*
         * Wait for splash fade.
         *
         * Your CSS fade is assumed to be
         * approximately 800ms.
         */
  
        setTimeout(() => {
  
          finishSplash();
  
        }, 800);
  
  
      }, 3500);
  
    }
  
  
    else {
  
      /*
       * No splash found.
       */
  
      finishSplash();
  
    }
  
  
    /* =======================================================
       HERO SOUND BUTTON
       ======================================================= */
  
    if (soundButton && heroVideo) {
  
      soundButton.addEventListener(
        "click",
        async () => {
  
  
          /*
           * ===================================================
           * AUDIO CURRENTLY ON
           * ===================================================
           */
  
          if (!heroVideo.muted) {
  
            heroVideo.muted = true;
  
            console.log(
              "VELINO: Hero audio OFF."
            );
  
            updateSoundButton();
  
            return;
  
          }
  
  
          /*
           * ===================================================
           * AUDIO CURRENTLY OFF
           * ===================================================
           */
  
          try {
  
            heroVideo.volume = 1;
  
            heroVideo.muted = false;
  
  
            /*
             * Make sure video is playing.
             */
  
            await heroVideo.play();
  
  
            console.log(
              "VELINO: Hero audio ON."
            );
  
            updateSoundButton();
  
          }
  
          catch (error) {
  
            console.error(
              "VELINO: Could not enable hero audio.",
              error
            );
  
  
            /*
             * Keep audio muted if browser
             * refuses playback.
             */
  
            heroVideo.muted = true;
  
            updateSoundButton();
  
          }
  
        }
      );
  
    }
  
  
    /* =======================================================
       HERO VISIBILITY
       ======================================================= */
  
    if (heroSection && heroVideo) {
  
      const heroObserver =
        new IntersectionObserver(
          entries => {
  
            entries.forEach(entry => {
  
  
              /*
               * HERO NOT VISIBLE
               */
  
              if (!entry.isIntersecting) {
  
                /*
                 * Only mute audio.
                 *
                 * DO NOT pause video.
                 */
  
                heroVideo.muted = true;
  
                updateSoundButton();
  
  
                console.log(
                  "VELINO: Hero left viewport. Audio muted."
                );
  
              }
  
            });
  
          },
          {
            threshold: 0.35
          }
        );
  
  
      heroObserver.observe(
        heroSection
      );
  
    }
  
  
    /* =======================================================
       NAVIGATION
       ======================================================= */
  
    menuBtn?.addEventListener(
      "click",
      () => {
  
        nav?.classList.toggle(
          "open"
        );
  
      }
    );
  
  
    nav?.querySelectorAll("a").forEach(
      link => {
  
        link.addEventListener(
          "click",
          () => {
  
            nav.classList.remove(
              "open"
            );
  
  
            /*
             * Get destination.
             */
  
            const target =
              link.getAttribute(
                "href"
              );
  
  
            /*
             * If navigating away from Hero,
             * mute hero audio.
             */
  
            if (
              heroVideo &&
              target &&
              target !== "#hero" &&
              target !== "#home"
            ) {
  
              heroVideo.muted = true;
  
              updateSoundButton();
  
              console.log(
                "VELINO: Navigation away from hero. Audio muted."
              );
  
            }
  
          }
        );
  
      }
    );
  
  
    /* =======================================================
       PREVENT HERO VIDEO FROM PLAYING DURING SPLASH
       ======================================================= */
  
    if (heroVideo) {
  
      heroVideo.addEventListener(
        "play",
        () => {
  
          /*
           * If splash is still active,
           * immediately stop video.
           */
  
          if (
            !splashFinished ||
            (
              splash &&
              document.body.classList.contains(
                "lock"
              )
            )
          ) {
  
            console.log(
              "VELINO: Blocking hero video during splash."
            );
  
  
            heroVideo.pause();
  
  
            try {
  
              heroVideo.currentTime = 0;
  
            } catch (error) {}
  
          }
  
        }
      );
  
    }
  
  
    /* =======================================================
       VIDEO METADATA
       ======================================================= */
  
    if (heroVideo) {
  
      heroVideo.addEventListener(
        "loadedmetadata",
        () => {
  
          console.log(
            "VELINO: Hero video loaded."
          );
  
          console.log(
            "VELINO: Video duration:",
            heroVideo.duration
          );
  
  
          /*
           * Keep video at first frame
           * until splash finishes.
           */
  
          if (!splashFinished) {
  
            heroVideo.pause();
  
            try {
  
              heroVideo.currentTime = 0;
  
            } catch (error) {}
  
          }
  
        }
      );
  
  
      /* =====================================================
         VIDEO ERROR
         ===================================================== */
  
      heroVideo.addEventListener(
        "error",
        () => {
  
          console.error(
            "VELINO: Could not load hero video."
          );
  
        }
      );
  
    }
  
  
    /* =======================================================
       TAB VISIBILITY
       ======================================================= */
  
    document.addEventListener(
      "visibilitychange",
      () => {
  
        if (
          document.hidden ||
          !heroVideo
        ) {
  
          return;
  
        }
  
  
        /*
         * When user comes back to the tab,
         * continue video but KEEP AUDIO OFF.
         *
         * User must manually press sound button.
         */
  
        heroVideo.muted = true;
  
        heroVideo.play().catch(
          () => {}
        );
  
        updateSoundButton();
  
      }
    );
  
  
    /* =======================================================
       REVEAL ON SCROLL
       ======================================================= */
  
    const revealObserver =
      new IntersectionObserver(
        entries => {
  
          entries.forEach(entry => {
  
            if (
              entry.isIntersecting
            ) {
  
              entry.target.classList.add(
                "show"
              );
  
              revealObserver.unobserve(
                entry.target
              );
  
            }
  
          });
  
        },
        {
          threshold: 0.12
        }
      );
  
  
    document
      .querySelectorAll(
        ".reveal, .reveal-right"
      )
      .forEach(
        element =>
          revealObserver.observe(
            element
          )
      );
  
  
    /* =======================================================
       ACTIVE NAVIGATION
       ======================================================= */
  
    const sections =
      document.querySelectorAll(
        "main section[id]"
      );
  
    const navLinks =
      document.querySelectorAll(
        "#navMenu a"
      );
  
  
    const sectionObserver =
      new IntersectionObserver(
        entries => {
  
          entries.forEach(entry => {
  
            if (
              !entry.isIntersecting
            ) {
              return;
            }
  
  
            navLinks.forEach(link => {
  
              link.classList.toggle(
                "active",
                link.getAttribute(
                  "href"
                ) ===
                "#" + entry.target.id
              );
  
            });
  
          });
  
        },
        {
          rootMargin:
            "-35% 0px -55% 0px",
  
          threshold: 0
        }
      );
  
  
    sections.forEach(
      section =>
        sectionObserver.observe(
          section
        )
    );
  
  
    /* =======================================================
       CONTACT FORM
       ======================================================= */
  
    const form =
      document.getElementById(
        "contactForm"
      );
  
    const status =
      document.getElementById(
        "formStatus"
      );
  
  
    form?.addEventListener(
      "submit",
      event => {
  
        event.preventDefault();
  
  
        const name =
          document
            .getElementById(
              "contactName"
            )
            ?.value
            .trim() || "";
  
  
        const email =
          document
            .getElementById(
              "contactEmail"
            )
            ?.value
            .trim() || "";
  
  
        const message =
          document
            .getElementById(
              "contactMessage"
            )
            ?.value
            .trim() || "";
  
  
        const subject =
          encodeURIComponent(
            `Velino IDE enquiry from ${name}`
          );
  
  
        const body =
          encodeURIComponent(
            `Name: ${name}\n` +
            `Email: ${email}\n\n` +
            `Message:\n${message}`
          );
  
  
        window.location.href =
          `mailto:shivavelishoju0827@gmail.com?subject=${subject}&body=${body}`;
  
  
        if (status) {
  
          status.textContent =
            "Opening your email application...";
  
        }
  
      }
    );
  
  
    /* =======================================================
       HERO MOUSE REACTIVE EFFECT
       ======================================================= */
  
    const hero =
      document.querySelector(
        ".hero"
      );
  
    const techBg =
      document.querySelector(
        ".hero-tech-bg"
      );
  
  
    if (
      hero &&
      techBg &&
      !window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
  
      hero.addEventListener(
        "pointermove",
        event => {
  
          const rect =
            hero.getBoundingClientRect();
  
  
          const x =
            (
              event.clientX -
              rect.left
            ) /
            rect.width -
            0.5;
  
  
          const y =
            (
              event.clientY -
              rect.top
            ) /
            rect.height -
            0.5;
  
  
          techBg.style.setProperty(
            "--mouse-x",
            `${x * 18}px`
          );
  
  
          techBg.style.setProperty(
            "--mouse-y",
            `${y * 12}px`
          );
  
        }
      );
  
  
      hero.addEventListener(
        "pointerleave",
        () => {
  
          techBg.style.setProperty(
            "--mouse-x",
            "0px"
          );
  
          techBg.style.setProperty(
            "--mouse-y",
            "0px"
          );
  
        }
      );
  
    }
  
  
    /* =======================================================
       CURRENT YEAR
       ======================================================= */
  
    const year =
      document.getElementById(
        "year"
      );
  
  
    if (year) {
  
      year.textContent =
        new Date().getFullYear();
  
    }
  
  
    /* =======================================================
       INITIAL SOUND BUTTON
       ======================================================= */
  
    updateSoundButton();
  
  });
  
  
  
  /* =========================================================
     VELINO IDE FEATURE SHOWCASE
     ========================================================= */
  
  document.addEventListener(
    "DOMContentLoaded",
    () => {
  
      const featureItems =
        document.querySelectorAll(
          ".ide-feature-item"
        );
  
      const visualPanels =
        document.querySelectorAll(
          ".feature-visual-panel"
        );
  
      const visualFeatureName =
        document.getElementById(
          "visualFeatureName"
        );
  
      const featureSection =
        document.getElementById(
          "ide-features"
        );
  
  
      if (
        !featureItems.length ||
        !visualPanels.length
      ) {
  
        return;
  
      }
  
  
      const featureNames = [
  
        "AUTOMATIC PORT DETECTION",
  
        "VELINO SMART AI",
  
        "MODERN CODE EDITOR",
  
        "SERIAL MONITOR",
  
        "SERIAL PLOTTER",
  
        "ORGANIZED WORKFLOW"
  
      ];
  
  
      let currentFeature = 0;
  
      let autoPlayTimer = null;
  
      let userInteracting = false;
  
  
      /* =====================================================
         SHOW FEATURE
         ===================================================== */
  
      function showFeature(index) {
  
        if (
          index < 0 ||
          index >= featureItems.length
        ) {
  
          return;
  
        }
  
  
        currentFeature = index;
  
  
        featureItems.forEach(
          (item, i) => {
  
            item.classList.toggle(
              "active",
              i === index
            );
  
          }
        );
  
  
        visualPanels.forEach(
          panel => {
  
            const panelIndex =
              Number(
                panel.dataset.visual
              );
  
  
            panel.classList.toggle(
              "active",
              panelIndex === index
            );
  
          }
        );
  
  
        if (visualFeatureName) {
  
          visualFeatureName.textContent =
            featureNames[index];
  
        }
  
  
        const activePanel =
          document.querySelector(
            `.feature-visual-panel[data-visual="${index}"]`
          );
  
  
        if (activePanel) {
  
          activePanel.classList.remove(
            "feature-animation-restart"
          );
  
          void activePanel.offsetWidth;
  
          activePanel.classList.add(
            "feature-animation-restart"
          );
  
        }
  
      }
  
  
      /* =====================================================
         FEATURE INTERACTIONS
         ===================================================== */
  
      featureItems.forEach(
        (item, index) => {
  
  
          /* HOVER */
  
          item.addEventListener(
            "mouseenter",
            () => {
  
              userInteracting = true;
  
              showFeature(index);
  
            }
          );
  
  
          /* CLICK */
  
          item.addEventListener(
            "click",
            () => {
  
              userInteracting = true;
  
              showFeature(index);
  
              restartAutoPlay();
  
            }
          );
  
  
          /* KEYBOARD */
  
          item.setAttribute(
            "tabindex",
            "0"
          );
  
  
          item.addEventListener(
            "keydown",
            event => {
  
              if (
                event.key === "Enter" ||
                event.key === " "
              ) {
  
                event.preventDefault();
  
                userInteracting = true;
  
                showFeature(index);
  
                restartAutoPlay();
  
              }
  
            }
          );
  
  
          /* TOUCH */
  
          item.addEventListener(
            "touchstart",
            () => {
  
              userInteracting = true;
  
              showFeature(index);
  
              restartAutoPlay();
  
            },
            {
              passive: true
            }
          );
  
        }
      );
  
  
      /* =====================================================
         LEAVE FEATURE SECTION
         ===================================================== */
  
      if (featureSection) {
  
        featureSection.addEventListener(
          "mouseleave",
          () => {
  
            userInteracting = false;
  
          }
        );
  
      }
  
  
      /* =====================================================
         AUTOPLAY
         ===================================================== */
  
      function startAutoPlay() {
  
        clearInterval(
          autoPlayTimer
        );
  
  
        autoPlayTimer =
          setInterval(
            () => {
  
              if (
                userInteracting
              ) {
  
                return;
  
              }
  
  
              currentFeature++;
  
  
              if (
                currentFeature >=
                featureItems.length
              ) {
  
                currentFeature = 0;
  
              }
  
  
              showFeature(
                currentFeature
              );
  
            },
            4500
          );
  
      }
  
  
      /* =====================================================
         RESTART AUTOPLAY
         ===================================================== */
  
      function restartAutoPlay() {
  
        clearInterval(
          autoPlayTimer
        );
  
        startAutoPlay();
  
      }
  
  
      /* INITIAL */
  
      showFeature(0);
  
      startAutoPlay();
  
    }
  );
  
  
  
  /* =========================================================
     VELINO JOURNEY INTERACTIVE DETAILS
     ========================================================= */
  
  document.addEventListener(
    "DOMContentLoaded",
    () => {
  
      const journeyItems =
        document.querySelectorAll(
          ".timeline-item"
        );
  
      const journeyVersion =
        document.getElementById(
          "journeyVersion"
        );
  
      const journeyTitle =
        document.getElementById(
          "journeyTitle"
        );
  
      const journeyDescription =
        document.getElementById(
          "journeyDescription"
        );
  
      const journeyFeatures =
        document.getElementById(
          "journeyFeatures"
        );
  
      const journeyStage =
        document.getElementById(
          "journeyStage"
        );
  
      const journeyStatus =
        document.getElementById(
          "journeyStatus"
        );
  
      const journeyImage =
        document.getElementById(
          "journeyImage"
        );
  
      const journeyVisual =
        document.querySelector(
          ".journey-visual"
        );
  
      const journeyInfo =
        document.querySelector(
          ".journey-info"
        );
  
  
      if (
        !journeyItems.length ||
        !journeyVersion ||
        !journeyTitle ||
        !journeyDescription ||
        !journeyFeatures ||
        !journeyStage ||
        !journeyStatus
      ) {
  
        return;
  
      }
  
  
      /* =====================================================
         JOURNEY DATA
         ===================================================== */
  
      const journeyData = {
  
        idea: {
  
          version: "2023",
  
          title: "The Idea",
  
          description:
            "The concept of a dedicated embedded development environment began. The goal was to create a development experience focused around hardware, software and intelligent workflows.",
  
          features: [
  
            "Initial Velino concept",
  
            "Embedded development workflow",
  
            "Early interface experiments",
  
            "Foundation for future versions"
  
          ],
  
          stage: "BEGINNING",
  
          status: "COMPLETED",
  
          image: ""
  
        },
  
  
        foundation: {
  
          version: "v1 → v10",
  
          title: "Foundation",
  
          description:
            "The first major development phase focused on establishing the core application structure, interface design and essential development workflows.",
  
          features: [
  
            "Application architecture",
  
            "Initial IDE interface",
  
            "Core development workflow",
  
            "Interface experiments"
  
          ],
  
          stage: "FOUNDATION",
  
          status: "COMPLETED",
  
          image: ""
  
        },
  
  
        expansion: {
  
          version: "v11 → v20",
  
          title: "Expansion",
  
          description:
            "Velino IDE expanded beyond the initial foundation with additional utilities, board workflows, serial communication tools and desktop integration.",
  
          features: [
  
            "Board workflows",
  
            "Serial Monitor",
  
            "Serial Plotter",
  
            "Desktop integration"
  
          ],
  
          stage: "EXPANSION",
  
          status: "COMPLETED",
  
          image: ""
  
        },
  
  
        intelligence: {
  
          version: "v21 → v27",
  
          title: "Intelligence",
  
          description:
            "The development direction moved toward smarter hardware interaction, improved user experience and intelligent assistance within the development environment.",
  
          features: [
  
            "Improved UI / UX",
  
            "Automatic hardware detection",
  
            "Smarter workflows",
  
            "Intelligent assistance foundation"
  
          ],
  
          stage: "INTELLIGENCE",
  
          status: "EVOLVING",
  
          image: ""
  
        },
  
  
        current: {
  
          version: "v28",
  
          title: "Current Evolution",
  
          description:
            "Velino IDE continues evolving toward a broader intelligent embedded development ecosystem that connects development tools, hardware and intelligent assistance.",
  
          features: [
  
            "Velino Smart AI direction",
  
            "Hardware-aware workflows",
  
            "Modern development interface",
  
            "Future intelligent ecosystem"
  
          ],
  
          stage: "CURRENT",
  
          status: "IN DEVELOPMENT",
  
          image: ""
  
        }
  
      };
  
  
      /* =====================================================
         UPDATE JOURNEY
         ===================================================== */
  
      function updateJourney(key) {
  
        const data =
          journeyData[key];
  
  
        if (!data) {
          return;
        }
  
  
        if (journeyVisual) {
  
          journeyVisual.style.opacity =
            "0";
  
        }
  
  
        if (journeyInfo) {
  
          journeyInfo.style.opacity =
            "0";
  
        }
  
  
        setTimeout(
          () => {
  
            journeyVersion.textContent =
              data.version;
  
            journeyTitle.textContent =
              data.title;
  
            journeyDescription.textContent =
              data.description;
  
            journeyStage.textContent =
              data.stage;
  
            journeyStatus.textContent =
              data.status;
  
  
            journeyFeatures.innerHTML =
              "";
  
  
            data.features.forEach(
              (feature, index) => {
  
                const featureElement =
                  document.createElement(
                    "div"
                  );
  
  
                featureElement.className =
                  "feature";
  
  
                featureElement.innerHTML = `
                  <span>
                    ${String(index + 1).padStart(2, "0")}
                  </span>
  
                  <p>
                    ${feature}
                  </p>
                `;
  
  
                journeyFeatures.appendChild(
                  featureElement
                );
  
              }
            );
  
  
            if (
              journeyImage &&
              data.image &&
              data.image.trim() !== ""
            ) {
  
              journeyImage.src =
                data.image;
  
              journeyImage.alt =
                data.title;
  
              journeyVisual?.classList.add(
                "has-image"
              );
  
            }
  
            else {
  
              journeyImage?.removeAttribute(
                "src"
              );
  
              journeyVisual?.classList.remove(
                "has-image"
              );
  
            }
  
  
            if (journeyVisual) {
  
              journeyVisual.style.opacity =
                "1";
  
            }
  
  
            if (journeyInfo) {
  
              journeyInfo.style.opacity =
                "1";
  
            }
  
          },
          180
        );
  
      }
  
  
      /* =====================================================
         JOURNEY CLICK / HOVER
         ===================================================== */
  
      journeyItems.forEach(
        item => {
  
          const key =
            item.dataset.journey;
  
  
          item.addEventListener(
            "click",
            () => {
  
              journeyItems.forEach(
                i =>
                  i.classList.remove(
                    "active"
                  )
              );
  
  
              item.classList.add(
                "active"
              );
  
  
              updateJourney(
                key
              );
  
            }
          );
  
  
          item.addEventListener(
            "mouseenter",
            () => {
  
              journeyItems.forEach(
                i =>
                  i.classList.remove(
                    "active"
                  )
              );
  
  
              item.classList.add(
                "active"
              );
  
  
              updateJourney(
                key
              );
  
            }
          );
  
        }
      );
  
  
      /* INITIAL */
  
      updateJourney(
        "idea"
      );
  
    }
  );
  
  
  
  /* =========================================================
     VELINO VERSION AUTO ANIMATION
     ========================================================= */
  
  document.addEventListener(
    "DOMContentLoaded",
    () => {
  
      const versionSection =
        document.querySelector(
          "#versions"
        );
  
      const versionTrack =
        document.querySelector(
          ".version-track"
        );
  
  
      if (
        !versionSection ||
        !versionTrack
      ) {
  
        return;
  
      }
  
  
      /* =====================================================
         RESTART WHEN VISIBLE
         ===================================================== */
  
      const observer =
        new IntersectionObserver(
          entries => {
  
            entries.forEach(
              entry => {
  
                if (
                  entry.isIntersecting
                ) {
  
                  versionTrack.style.animation =
                    "none";
  
  
                  void versionTrack.offsetWidth;
  
  
                  versionTrack.style.animation =
                    "velinoVersionScroll 32s linear infinite";
  
                }
  
              }
            );
  
          },
          {
            threshold: 0.15
          }
        );
  
  
      observer.observe(
        versionSection
      );
  
  
      /* =====================================================
         PAUSE ON CARD HOVER
         ===================================================== */
  
      const cards =
        document.querySelectorAll(
          ".version-card"
        );
  
  
      cards.forEach(
        card => {
  
          card.addEventListener(
            "mouseenter",
            () => {
  
              versionTrack.style.animationPlayState =
                "paused";
  
            }
          );
  
  
          card.addEventListener(
            "mouseleave",
            () => {
  
              versionTrack.style.animationPlayState =
                "running";
  
            }
          );
  
        }
      );
  
    }
  );
  /* =========================================================
   VELINO GALLERY HOVER VIDEO
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const videoCards =
    document.querySelectorAll(".hover-video-card");


  videoCards.forEach((card) => {

    const video =
      card.querySelector(".hover-gallery-video");

    const poster =
      card.querySelector(".hover-video-poster");


    if (!video) return;


    /* =====================================================
       MOUSE ENTER
       ===================================================== */

    card.addEventListener("mouseenter", async () => {

      try {

        video.currentTime = 0;

        video.muted = false;

        await video.play();

        card.classList.add("video-playing");

      } catch (error) {

        console.log(
          "Video/audio playback blocked:",
          error
        );

        /*
          Fallback:
          Try muted playback if browser blocks audio.
        */

        try {

          video.muted = true;

          await video.play();

          card.classList.add("video-playing");

        } catch (fallbackError) {

          console.log(
            "Video playback failed:",
            fallbackError
          );

        }

      }

    });


    /* =====================================================
       MOUSE LEAVE
       ===================================================== */

    card.addEventListener("mouseleave", () => {

      video.pause();

      video.currentTime = 0;

      video.muted = false;

      card.classList.remove("video-playing");

    });


    /* =====================================================
       VIDEO ENDS
       ===================================================== */

    video.addEventListener("ended", () => {

      video.currentTime = 0;

      video.pause();

      card.classList.remove("video-playing");

    });

  });

});