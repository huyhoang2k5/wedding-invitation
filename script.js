const revealItems = document.querySelectorAll(".reveal");
    const movingPhotos = document.querySelectorAll(".moving-photo");
    const rsvpForm = document.querySelector("#rsvpForm");
    const formMessage = document.querySelector("#formMessage");
    const weddingMusic = document.querySelector("#weddingMusic");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    }, { threshold: 0.14 });

    revealItems.forEach((item) => observer.observe(item));

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

    function cleanCsvValue(value) {
      return `"${String(value).replaceAll('"', '""')}"`;
    }

    function downloadRsvpFile(data) {
      const header = ["Thời gian gửi", "Tên người gửi", "Lời chúc"];
      const row = [
        new Date().toLocaleString("vi-VN"),
        data.guestName,
        data.wish || ""
      ];
      const csvContent = [header, row]
        .map((items) => items.map(cleanCsvValue).join(","))
        .join("\n");
      const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8" });
      const link = document.createElement("a");

      link.href = URL.createObjectURL(blob);
      link.download = `loi-chuc-dung-anh-${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(link.href);
    }

    rsvpForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(rsvpForm);
      const data = {
        guestName: formData.get("guestName"),
        wish: formData.get("wish")
      };

      downloadRsvpFile(data);
      formMessage.textContent = "Cảm ơn bạn, file lời chúc đã được tải xuống.";
      formMessage.classList.add("is-visible");
      rsvpForm.reset();
    });

