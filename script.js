// 🔧 Ensure only current language text shows and stacks
// Clean, working version wrapped in DOMContentLoaded

document.addEventListener("DOMContentLoaded", () => {
    let isAudioPlaying = false;
    let hasPlayedAudio = false;
    let currentLanguage = "es"; // default
  
    const audioToggle = document.getElementById("audio-toggle"); 
    const audio = document.getElementById("ambient-audio");
    const collectedContainer = document.getElementById("collected-text");
    const langButtons = document.querySelectorAll(".lang-btn");
    const scrollingTexts = document.querySelectorAll(".scrolling-text");
    const heroTitle = document.getElementById("hero-title");
    const stackedLines = new Set();
  
    // 🔊 AUDIO TOGGLE BUTTON
    audioToggle.addEventListener("click", (event) => {
      event.stopPropagation();
  
      if (!hasPlayedAudio) {
        tryPlayAudioOnce();
      } else {
        if (isAudioPlaying) {
          audio.pause();
          isAudioPlaying = false;
          audioToggle.textContent = currentLanguage === "en"
            ? "Listen to the Memory"
            : "Escuchar la Memoria";
        } else {
          audio.play();
          isAudioPlaying = true;
          audioToggle.textContent = currentLanguage === "en"
            ? "Hold Silence"
            : "Guardar Silencio";
        }
      }
    });
  
    function tryPlayAudioOnce() {
      if (!hasPlayedAudio) {
        audio.volume = 0.4;
        audio.play().then(() => {
          hasPlayedAudio = true;
          isAudioPlaying = true;
          audioToggle.textContent = currentLanguage === "en"
            ? "Hold Silence"
            : "Guardar Silencio";
        }).catch(err => {
          console.log("Autoplay blocked:", err);
        });
      }
    }
  
    window.addEventListener("scroll", tryPlayAudioOnce);
    window.addEventListener("click", tryPlayAudioOnce);
    window.addEventListener("keydown", tryPlayAudioOnce);
  
    // 📜 SCROLL STACK VISIBILITY
    window.addEventListener("scroll", () => {
      if (window.scrollY < 40) {
        collectedContainer.classList.remove("visible");
      } else {
        collectedContainer.classList.add("visible");
      }
    });
  
    // 📜 SCROLL STACK VISIBILITY

window.addEventListener("scroll", () => {
    if (window.scrollY < 40) {
      collectedContainer.classList.remove("visible");
  
      // 🔄 Reset stacking behavior

      collectedContainer.innerHTML = "";
      stackedLines.clear();
      
      // Reset opacity and re-hide originals
      scrollingTexts.forEach(el => {
        el.style.opacity = 0;
      });

    } else {
      collectedContainer.classList.add("visible");
    }
  });

  
    // 🌐 LANGUAGE TOGGLING
    function setLanguage(lang) {
      currentLanguage = lang;
  
      langButtons.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.lang === lang);
      });
  
      scrollingTexts.forEach(el => {
        el.style.display = el.classList.contains(`lang-${lang}`) ? "block" : "none";
      });
  
      document.querySelectorAll(".stacked-line").forEach(el => {
        el.style.display = el.classList.contains(`lang-${lang}`) ? "block" : "none";
      });
  
      document.querySelectorAll(".scrolling-columns-static .lang").forEach(el => {
        el.style.display = el.classList.contains(`lang-${lang}`) ? "block" : "none";
      });
  
      document.getElementById("hero-title").textContent =
        lang === "en" ? "Someday I’ll Cross the Ocean" : "Algún Día Cruzaré el Océano";
  
      audioToggle.textContent =
        isAudioPlaying
          ? (lang === "en" ? "Hold Silence" : "Guardar Silencio")
          : (lang === "en" ? "Listen to the Memory" : "Escuchar la Memoria");
    }
  
    langButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        setLanguage(btn.dataset.lang);
      });
    });
  
    // ✍️ STACK LINES ON SCROLL
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const el = entry.target;
        const langMatch = el.classList.contains(`lang-${currentLanguage}`);
        const text = el.textContent.trim();
  
        if (entry.isIntersecting && langMatch && !stackedLines.has(text)) {
          const clone = document.createElement("div");
          clone.className = `stacked-line lang lang-${currentLanguage}`;
          clone.textContent = text;
          collectedContainer.appendChild(clone);
          stackedLines.add(text);
          el.style.opacity = 0;
        }
      });
    }, { threshold: 0.8 });
  
    scrollingTexts.forEach(el => {
      observer.observe(el);
      el.style.display = "none";
    });
  
    // 🔝 HERO TITLE SCROLL TO TOP
    heroTitle.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  
    // 🚀 Initialize
    setLanguage(currentLanguage);
  });
  
// Scroll Up arrows
const scrollDownIndicator = document.getElementById("scroll-down-indicator");
const scrollUpIndicator = document.getElementById("scroll-up-indicator");

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const windowHeight = window.innerHeight;
  const documentHeight = document.body.scrollHeight;

  // Show ↓ at the top
  if (scrollTop < 100) {
    scrollDownIndicator.classList.add("visible");
  } else {
    scrollDownIndicator.classList.remove("visible");
  }

  // Show ↑ near the bottom
  if (scrollTop + windowHeight >= documentHeight - 200) {
    scrollUpIndicator.classList.add("visible");
  } else {
    scrollUpIndicator.classList.remove("visible");
  }
});

scrollUpIndicator.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
