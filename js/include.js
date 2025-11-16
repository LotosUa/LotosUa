document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  const isThankYouPage = path.includes("dziekujemy");
  const isMasazePage = path.includes("/masaze/");

  // якщо ми на сторінці в папці masaze → треба "../" для header/footer/logo
  const prefix = isMasazePage ? "../" : "";

  if (!isThankYouPage || isMasazePage) {
    // --- HEADER ---
    fetch(prefix + "header.html")
      .then((res) => res.text())
      .then((data) => {
        document.body.insertAdjacentHTML("afterbegin", data);

        // LOGO (в хедері)
        const logo = document.querySelector(".logo img");
        if (logo) {
          logo.src = prefix + "img/logo2.svg";
        }

        // ===== ВИПРАВЛЯЄМО ЛІНКИ МЕНЮ ДЛЯ СТОРІНОК У MASAZE =====
        if (isMasazePage) {
          const menuLinks = document.querySelectorAll(".menu a");

          menuLinks.forEach((link) => {
            let href = link.getAttribute("href");
            if (
              !href ||
              href.startsWith("http") ||
              href.startsWith("#") ||
              href.startsWith("mailto:")
            ) {
              return; // зовнішні / якорі / mailto — не чіпаємо
            }

            // Якщо це посилання на масажі (masaze/...)
            if (href.startsWith("masaze/")) {
              // з масажних сторінок нам не потрібне "masaze/" перед файлом
              // було: masaze/twarz.html -> стане: twarz.html
              href = href.replace(/^masaze\//, "");
              link.setAttribute("href", href);
            } else {
              // Інші сторінки (index.html, cennik.html, oferta.html...)
              // з масажних сторінок треба вийти на рівень вище: ../index.html
              if (!href.startsWith("../")) {
                link.setAttribute("href", "../" + href);
              }
            }
          });
        }
        // ===== КІНЕЦЬ ВИПРАВЛЕННЯ ЛІНКІВ =====

        // SCROLLED header
        const content = document.querySelector(".header");
        if (content) {
          window.addEventListener("scroll", () => {
            const scrollPosition =
              window.scrollY || document.documentElement.scrollTop;
            content.classList.toggle("scrolled", scrollPosition >= 100);
          });
        }

        // MOBILE MENU
        const mobileButton = document.querySelector(".mobile-button");
        const menu = document.querySelector(".menu");
        const body = document.querySelector("body");

        if (mobileButton && menu && body) {
          mobileButton.addEventListener("click", function () {
            const isHidden = menu.classList.contains("is-hidden");
            this.classList.toggle("is-open", isHidden);
            menu.classList.toggle("is-hidden", !isHidden);
            body.classList.toggle("no-scroll", isHidden);
          });
        }
      });

    // --- FOOTER ---
    fetch(prefix + "footer.html")
      .then((res) => res.text())
      .then((data) => {
        document.body.insertAdjacentHTML("beforeend", data);

        // === ФІКС ШЛЯХІВ ДО ЗОБРАЖЕНЬ У ФУТЕРІ ===
        const footerImages = document.querySelectorAll("footer img");

        footerImages.forEach((img) => {
          let src = img.getAttribute("src");
          if (!src) return;

          // не чіпаємо абсолютні й data-URL
          if (src.startsWith("http") || src.startsWith("data:")) return;

          // якщо вже є "../" — теж не чіпаємо, щоб не подвоїти
          if (src.startsWith("../")) return;

          // прибираємо можливі початкові "/" або "./"
          src = src.replace(/^\/+/, "").replace(/^.\//, "");

          // додаємо prefix: "" в корені, "../" у masaze
          img.setAttribute("src", prefix + src);
        });
        // === КІНЕЦЬ ФІКСУ ФУТЕРА ===
      });
  }
});
