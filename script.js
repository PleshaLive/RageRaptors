document.addEventListener("DOMContentLoaded", () => {
  const transitionOverlay = document.getElementById("transitionOverlay");
  const transitionVideo = document.getElementById("transitionVideo");
  const iframeContainer = document.getElementById("iframeContainer");
  const pageContent = document.querySelector(".page-content");

  // Если каких-то элементов нет, просто выходим
  if (!transitionOverlay || !transitionVideo || !iframeContainer || !pageContent) {
    return;
  }

  // Точка на таймлайне видео, где скрываем старую страницу (секунды)
  const CUT_POINT = 0.7;

  // URL, куда переходим
  let pendingUrl = null;
  // Флаг, чтобы "cut" сработал один раз за воспроизведение
  let cutDone = false;

  // Ищем все ссылки .nav-link
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      pendingUrl = link.getAttribute("href");

      // Сбрасываем флаг
      cutDone = false;

      // Показываем оверлей и включаем видео заново
      transitionOverlay.style.display = "block";
      transitionVideo.currentTime = 0;
      transitionVideo.play().catch(err => console.error(err));
    });
  });

  // Когда видео заканчивается, делаем реальный переход
  transitionVideo.addEventListener("ended", () => {
    if (pendingUrl) {
      window.location.href = pendingUrl;
    }
  });

  // "Подмена" страницы на определённом моменте (CUT_POINT)
  transitionVideo.addEventListener("timeupdate", () => {
    if (!cutDone && transitionVideo.currentTime >= CUT_POINT) {
      cutDone = true;

      // Скрываем старый контент
      pageContent.style.display = "none";
      // Показываем iframe-container
      iframeContainer.style.display = "block";

      // Вставляем новую страницу в iframe
      iframeContainer.innerHTML = `
        <iframe src="${pendingUrl}" 
                style="border:none; width:100%; height:100%;">
        </iframe>
      `;
    }
  });
});
