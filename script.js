document.addEventListener("DOMContentLoaded", () => {
  // --- Код для transition-overlay и подмены страницы ---
  const transitionOverlay = document.getElementById("transitionOverlay");
  const transitionVideo = document.getElementById("transitionVideo");
  const iframeContainer = document.getElementById("iframeContainer");
  const pageContent = document.querySelector(".page-content");

  if (transitionOverlay && transitionVideo && iframeContainer && pageContent) {
    const CUT_POINT = 0.5;
    let pendingUrl = null;
    let cutDone = false;

    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
      link.addEventListener("click", event => {
        event.preventDefault();
        pendingUrl = link.getAttribute("href");
        cutDone = false;
        transitionOverlay.style.display = "block";
        transitionVideo.currentTime = 0;
        transitionVideo.play().catch(err => console.error(err));
      });
    });

    transitionVideo.addEventListener("ended", () => {
      if (pendingUrl) {
        window.location.href = pendingUrl;
      }
    });

    transitionVideo.addEventListener("timeupdate", () => {
      if (!cutDone && transitionVideo.currentTime >= CUT_POINT) {
        cutDone = true;
        pageContent.style.display = "none";
        iframeContainer.style.display = "block";
        iframeContainer.innerHTML = `
          <iframe src="${pendingUrl}" 
                  style="border:none; width:100%; height:100%; background-color: #1a1a1a;">
          </iframe>
        `;
      }
    });
  }

  // --- Код для кнопки "Прокрутить вверх" ---
  const scrollBtn = document.getElementById("scrollToTopBtn");
  if (scrollBtn) {
    window.addEventListener("scroll", () => {
      if (document.documentElement.scrollTop > 300 || document.body.scrollTop > 300) {
        scrollBtn.style.display = "block";
      } else {
        scrollBtn.style.display = "none";
      }
    });
  }
});

// Глобальная функция для плавной прокрутки наверх
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}
