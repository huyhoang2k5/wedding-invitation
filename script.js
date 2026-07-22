const revealItems = document.querySelectorAll(".reveal");
    const movingPhotos = document.querySelectorAll(".moving-photo");
    const weddingMusic = document.querySelector("#weddingMusic");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    }, { threshold: 0.14 });

    revealItems.forEach((item) => observer.observe(item));
    movingPhotos.forEach((photo) => {
      photo.addEventListener("error", () => {
        photo.src = "preview-104.jpg";
      }, { once: true });
    });

    function updateMotion() {
      const viewportHeight = window.innerHeight;
      const isSmallScreen = window.innerWidth <= 520;
      const maxMovement = isSmallScreen ? 18 : 48;
      const speedMultiplier = isSmallScreen ? 0.45 : 1;

      movingPhotos.forEach((photo) => {
        const rect = photo.parentElement.getBoundingClientRect();
        const speed = (Number(photo.dataset.speed) || 0.12) * speedMultiplier;
        const motion = photo.dataset.motion || "vertical";
        const centerOffset = rect.top + rect.height / 2 - viewportHeight / 2;
        const amount = Math.max(-maxMovement, Math.min(maxMovement, centerOffset * speed * -1));

        let moveX = 0;
        let moveY = 0;
        let scale = 1.05;

        if (motion === "vertical") moveY = amount;
        if (motion === "horizontal") moveX = amount * 0.7;
        if (motion === "diagonal") {
          moveX = amount * 0.38;
          moveY = amount * 0.72;
        }
        if (motion === "zoom") {
          moveY = amount * 0.28;
          scale = 1.05 + Math.abs(amount) / 900;
        }

        photo.style.setProperty("--move-x", `${moveX}px`);
        photo.style.setProperty("--move-y", `${moveY}px`);
        photo.style.setProperty("--scale", scale.toFixed(3));
      });

      requestAnimationFrame(updateMotion);
    }

    updateMotion();

    function startBackgroundMusic() {
      weddingMusic.play().catch(() => {});
      document.removeEventListener("click", startBackgroundMusic);
      document.removeEventListener("touchstart", startBackgroundMusic);
    }

    startBackgroundMusic();
    document.addEventListener("click", startBackgroundMusic);
    document.addEventListener("touchstart", startBackgroundMusic);


