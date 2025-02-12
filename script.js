// Функция для разблокировки звука (снимаем muted у всех audio и возобновляем AudioContext, если он был создан)
function unlockAudio() {
  // Если используется Web Audio API – создадим или возобновим аудиоконтекст
  if (!window.audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    window.audioCtx = new AudioContext();
  }
  if (window.audioCtx.state === 'suspended') {
    window.audioCtx.resume().catch(err => console.error(err));
  }
  // Снимаем muted у всех аудиоэлементов на странице
  document.querySelectorAll('audio').forEach(audio => {
    audio.muted = false;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // --- Код для transition-overlay и подмены страницы ---
  const transitionOverlay = document.getElementById("transitionOverlay");
  const transitionVideo = document.getElementById("transitionVideo");
  const iframeContainer = document.getElementById("iframeContainer");
  const pageContent = document.querySelector(".page-content");

  if (transitionOverlay && transitionVideo && iframeContainer && pageContent) {
    const CUT_POINT = 0.6; // время в секундах, когда содержимое меняется
    let pendingUrl = null;
    let cutDone = false;

    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
      link.addEventListener("click", event => {
        event.preventDefault();
        pendingUrl = link.getAttribute("href");
        cutDone = false;
        
        // Разблокируем звук при первом клике (даёт согласие на воспроизведение звука)
        unlockAudio();
        
        // Снимаем мьют с transitionVideo, чтобы его звук воспроизводился
        transitionVideo.muted = false;
        
        // Показываем overlay с видео, которое перекроет весь экран
        transitionOverlay.style.display = "block";
        transitionVideo.currentTime = 0;
        transitionVideo.play().catch(err => console.error(err));
      });
    });

    // Отслеживаем момент, когда видео достигает нужного времени (0.6 сек)
    transitionVideo.addEventListener("timeupdate", () => {
      if (!cutDone && transitionVideo.currentTime >= CUT_POINT) {
        cutDone = true;
        // Скрываем исходное содержимое, чтобы nav-buttons и прочие элементы не были видны
        pageContent.style.display = "none";
        
        // Отображаем контейнер с iframe, который «подменяет» страницу
        iframeContainer.style.display = "block";
        iframeContainer.innerHTML = `
          <iframe src="${pendingUrl}" 
                  style="border: none; width: 100%; height: 100%; background-color: #1a1a1a;">
          </iframe>
        `;
      }
    });

    transitionVideo.addEventListener("ended", () => {
      if (pendingUrl) {
        window.location.href = pendingUrl;
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
    scrollBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }
});

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}
