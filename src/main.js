import "./style.css";

import { db } from "./firebase.js";

import {
  collection,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";

import {
  renderGallery,
  loadGallery
} from "./pages/gallery.js";

// Current page
const path = window.location.pathname.replace(/\/+$/, "") || "/";

// Admin Panel
if (path === "/admin") {
  import("./admin.js");
} else {
  const app = document.querySelector("#app");

  const navLinks = [
    ["/", "होम"],
    ["/about", "गाँव का परिचय"],
    ["/news", "गाँव के समाचार"],
    ["/gallery", "फोटो गैलरी"],
    ["/schemes", "सरकारी योजनाएँ"],
    ["/farmers", "किसान कॉर्नर"],
    ["/notices", "सूचनाएँ"],
    ["/panchayat", "ग्राम पंचायत"],
    ["/directory", "गाँव की डायरेक्टरी"],
    ["/contact", "संपर्क करें"]
  ];

  const pages = {
    "/": {
      title: "ग्राम अमीरपुर",
      subtitle: "अपना गाँव, अपनी पहचान",
      content: `
        <section class="hero">
          <div class="hero-content">
            <span class="tag">🌿 डिजिटल ग्राम अमीरपुर</span>

            <h2>
              अपने गाँव की<br>
              <span>अपनी वेबसाइट</span>
            </h2>

            <p>
              ग्राम अमीरपुर की जानकारी, गाँव के समाचार,
              सरकारी योजनाएँ और जरूरी सूचनाएँ अब एक ही जगह।
            </p>

            <div class="hero-buttons">
              <a class="button" href="/about">
                गाँव के बारे में जानें →
              </a>

              <a class="button button-gold" href="/news">
                ताजा समाचार देखें
              </a>
            </div>
          </div>

          <div class="hero-icon">🏡</div>
        </section>

        <section class="section">
          <div class="section-heading">
            <span class="tag">हमारा गाँव</span>
            <h2>ग्राम अमीरपुर में आपका स्वागत है</h2>
            <p>गाँव की जानकारी अब डिजिटल माध्यम से सभी तक।</p>
          </div>

          <div class="grid">
            <a class="card" href="/about">
              <div class="icon">🏡</div>
              <h3>गाँव का परिचय</h3>
              <p>ग्राम अमीरपुर के बारे में जानें।</p>
              <span>और जानें →</span>
            </a>

            <a class="card" href="/news">
              <div class="icon">📰</div>
              <h3>गाँव के समाचार</h3>
              <p>गाँव से जुड़ी खबरें और महत्वपूर्ण अपडेट।</p>
              <span>समाचार देखें →</span>
            </a>

            <a class="card" href="/gallery">
              <div class="icon">📸</div>
              <h3>फोटो गैलरी</h3>
              <p>गाँव की तस्वीरें और यादगार पल देखें।</p>
              <span>फोटो देखें →</span>
            </a>

            <a class="card" href="/schemes">
              <div class="icon">📋</div>
              <h3>सरकारी योजनाएँ</h3>
              <p>सरकारी योजनाओं की जानकारी और उपयोगी लिंक।</p>
              <span>जानकारी देखें →</span>
            </a>

            <a class="card" href="/farmers">
              <div class="icon">🌾</div>
              <h3>किसान कॉर्नर</h3>
              <p>कृषि, खेती और किसानों के लिए उपयोगी जानकारी।</p>
              <span>यहाँ देखें →</span>
            </a>

            <a class="card" href="/panchayat">
              <div class="icon">🏛️</div>
              <h3>ग्राम पंचायत</h3>
              <p>पंचायत से संबंधित जानकारी और सुविधाएँ।</p>
              <span>जानकारी देखें →</span>
            </a>

            <a class="card" href="/directory">
              <div class="icon">👥</div>
              <h3>गाँव की डायरेक्टरी</h3>
              <p>उपलब्ध संपर्क और जरूरी जानकारी खोजें।</p>
              <span>डायरेक्टरी खोलें →</span>
            </a>

            <a class="card" href="/notices">
              <div class="icon">📢</div>
              <h3>महत्वपूर्ण सूचनाएँ</h3>
              <p>गाँव से जुड़ी जरूरी सूचनाएँ देखें।</p>
              <span>सूचनाएँ देखें →</span>
            </a>
          </div>
        </section>

        <section class="section">
          <div class="section-heading">
            <h2>गाँव की ताजा खबरें</h2>
            <p>ग्राम अमीरपुर से संबंधित नवीनतम समाचार।</p>
          </div>

          <div id="home-news" class="grid">
            <div class="card">
              <p>समाचार लोड हो रहे हैं...</p>
            </div>
          </div>

          <p class="center-link">
            <a class="button" href="/news">सभी समाचार देखें →</a>
          </p>
        </section>

        <section class="village-message">
          <div>
            <span class="tag">हमारी पहचान</span>
            <h2>एक गाँव, एक परिवार</h2>
            <p>
              हमारा उद्देश्य ग्राम अमीरपुर की जानकारी को
              डिजिटल माध्यम से लोगों तक पहुँचाना है।
            </p>
          </div>
        </section>
      `
    },

    "/about": {
      title: "ग्राम अमीरपुर का परिचय",
      subtitle: "हमारे गाँव के बारे में जानें",
      content: `
        <section class="section">
          <div class="card">
            <div class="icon">🏡</div>
            <h2>हमारा गाँव, हमारी पहचान</h2>
            <p>ग्राम अमीरपुर की वेबसाइट पर आपका स्वागत है।</p>
            <p>
              इस वेबसाइट का उद्देश्य गाँव से जुड़ी महत्वपूर्ण
              जानकारी को डिजिटल रूप में उपलब्ध कराना है।
            </p>
          </div>

          <div class="card">
            <h2>ग्राम की मुख्य जानकारी</h2>
            <p><strong>गाँव का नाम:</strong> अमीरपुर</p>
            <p><strong>जिला:</strong> मथुरा, उत्तर प्रदेश</p>
            <p><strong>उद्देश्य:</strong> गाँव की जानकारी ऑनलाइन उपलब्ध कराना।</p>
          </div>
        </section>
      `
    },

    "/news": {
      title: "गाँव के समाचार",
      subtitle: "ग्राम अमीरपुर से जुड़ी खबरें और अपडेट",
      content: `
        <section class="section">
          <div class="section-heading">
            <h2>ताजा समाचार</h2>
            <p>प्रकाशित समाचार यहाँ दिखाई देंगे।</p>
          </div>

          <div id="news-list" class="grid">
            <div class="card">
              <p>समाचार लोड हो रहे हैं...</p>
            </div>
          </div>
        </section>
      `
    },

    "/gallery": {
      title: "गाँव की फोटो गैलरी",
      subtitle: "ग्राम अमीरपुर की तस्वीरें और यादगार पल",
      content: renderGallery()
    },

    "/schemes": {
      title: "सरकारी योजनाएँ",
      subtitle: "सरकारी योजनाओं से जुड़ी उपयोगी जानकारी",
      content: `
        <section class="section">
          <div class="grid">
            <div class="card">
              <div class="icon">🌾</div>
              <h3>पीएम किसान सम्मान निधि</h3>
              <p>किसान सम्मान निधि से संबंधित जानकारी प्राप्त करें।</p>
              <a href="https://pmkisan.gov.in/" target="_blank" rel="noopener noreferrer">
                आधिकारिक वेबसाइट →
              </a>
            </div>

            <div class="card">
              <div class="icon">🏠</div>
              <h3>प्रधानमंत्री आवास योजना</h3>
              <p>आवास योजनाओं से संबंधित आधिकारिक जानकारी प्राप्त करें।</p>
              <a href="https://pmayg.nic.in/" target="_blank" rel="noopener noreferrer">
                आधिकारिक वेबसाइट →
              </a>
            </div>

            <div class="card">
              <div class="icon">🪪</div>
              <h3>डिजिटल सेवाएँ</h3>
              <p>सरकारी सेवाओं और ऑनलाइन सुविधाओं की जानकारी।</p>
              <a href="https://india.gov.in/" target="_blank" rel="noopener noreferrer">
                भारत सरकार का पोर्टल →
              </a>
            </div>
          </div>

          <p class="small">
            योजनाओं की पात्रता और नियम संबंधित आधिकारिक वेबसाइट पर जाँचें।
          </p>
        </section>
      `
    },

    "/farmers": {
      title: "किसान कॉर्नर",
      subtitle: "खेती और किसानों के लिए उपयोगी जानकारी",
      content: `
        <section class="section">
          <div class="grid">
            <div class="card">
              <div class="icon">🌱</div>
              <h3>फसल की जानकारी</h3>
              <p>फसलों की बुवाई, बीज और खेती की तकनीकों की जानकारी।</p>
            </div>

            <div class="card">
              <div class="icon">🌦️</div>
              <h3>मौसम की जानकारी</h3>
              <p>खेती के काम की योजना बनाने के लिए मौसम देखें।</p>
              <a href="https://mausam.imd.gov.in/" target="_blank" rel="noopener noreferrer">
                मौसम विभाग →
              </a>
            </div>

            <div class="card">
              <div class="icon">💰</div>
              <h3>किसान योजनाएँ</h3>
              <p>कृषि और किसान कल्याण से जुड़ी सरकारी योजनाएँ।</p>
              <a href="https://agriwelfare.gov.in/" target="_blank" rel="noopener noreferrer">
                कृषि विभाग →
              </a>
            </div>
          </div>
        </section>
      `
    },

    "/notices": {
      title: "महत्वपूर्ण सूचनाएँ",
      subtitle: "गाँव के लोगों के लिए जरूरी सूचना",
      content: `
        <section class="section">
          <div class="section-heading">
            <h2>सूचना बोर्ड</h2>
            <p>गाँव की महत्वपूर्ण सूचनाएँ यहाँ उपलब्ध होंगी।</p>
          </div>

          <div id="notice-list" class="grid">
            <div class="card">
              <div class="icon">📢</div>
              <h3>सूचना बोर्ड</h3>
              <p>अभी कोई सूचना उपलब्ध नहीं है।</p>
            </div>
          </div>
        </section>
      `
    },

    "/panchayat": {
      title: "ग्राम पंचायत",
      subtitle: "पंचायत से जुड़ी जानकारी और सुविधाएँ",
      content: `
        <section class="section">
          <div class="grid">
            <div class="card">
              <div class="icon">🏛️</div>
              <h3>पंचायत की जानकारी</h3>
              <p>ग्राम पंचायत से संबंधित प्रमाणित जानकारी यहाँ उपलब्ध कराई जा सकती है।</p>
            </div>

            <div class="card">
              <div class="icon">📄</div>
              <h3>सरकारी सेवाएँ</h3>
              <p>उत्तर प्रदेश की सरकारी सेवाओं की जानकारी प्राप्त करें।</p>
              <a href="https://up.gov.in/" target="_blank" rel="noopener noreferrer">
                उत्तर प्रदेश सरकार →
              </a>
            </div>

            <div class="card">
              <div class="icon">📣</div>
              <h3>जनहित सूचनाएँ</h3>
              <p>पंचायत और गाँव के लिए महत्वपूर्ण सूचनाएँ देखें।</p>
            </div>
          </div>
        </section>
      `
    },

    "/directory": {
      title: "गाँव की डायरेक्टरी",
      subtitle: "उपलब्ध संपर्क जानकारी खोजें",
      content: `
        <section class="section">
          <div class="search-box">
            <input
              id="directory-search"
              type="search"
              placeholder="नाम या पद से खोजें..."
              aria-label="डायरेक्टरी खोजें"
            >
          </div>

          <div id="directory-list" class="grid">
            <div class="card">
              <p>डायरेक्टरी लोड हो रही है...</p>
            </div>
          </div>
        </section>
      `
    },

    "/contact": {
      title: "संपर्क करें",
      subtitle: "ग्राम अमीरपुर की वेबसाइट से संपर्क",
      content: `
        <section class="section">
          <div class="card">
            <div class="icon">✉️</div>
            <h2>हमसे संपर्क करें</h2>
            <p>
              वेबसाइट पर किसी जानकारी में सुधार या नई जानकारी
              जोड़ने के लिए व्यवस्थापक से संपर्क करें।
            </p>
            <a class="button" href="/admin">Admin Panel खोलें</a>
          </div>
        </section>
      `
    }
  };

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function renderHeader() {
    return `
      <header class="site-header">
        <div class="container header-inner">
          <a class="brand" href="/">
            <span class="brand-icon">🌿</span>
            <span>ग्राम अमीरपुर</span>
          </a>

          <button
            class="menu-toggle"
            id="menu-toggle"
            aria-label="मेन्यू खोलें"
            aria-expanded="false"
          >☰</button>

          <nav class="main-nav" id="main-nav">
            ${navLinks.map(([url, label]) => `
              <a href="${url}" ${url === path ? 'aria-current="page"' : ""}>
                ${label}
              </a>
            `).join("")}

            <a href="/admin">Admin</a>
          </nav>
        </div>
      </header>
    `;
  }

  function renderFooter() {
    return `
      <footer class="site-footer">
        <h2>🌿 ग्राम अमीरपुर</h2>
        <p>अपना गाँव, अपनी पहचान</p>
        <p>जिला मथुरा, उत्तर प्रदेश</p>

        <p>
          <a href="/">होम</a> ·
          <a href="/about">गाँव का परिचय</a> ·
          <a href="/gallery">फोटो गैलरी</a> ·
          <a href="/contact">संपर्क</a>
        </p>

        <p>© ${new Date().getFullYear()} ग्राम अमीरपुर</p>
      </footer>
    `;
  }

  const currentPage = pages[path] || {
    title: "पेज नहीं मिला",
    subtitle: "आपके द्वारा माँगा गया पेज उपलब्ध नहीं है।",
    content: `
      <section class="section">
        <div class="card">
          <h2>404 — पेज नहीं मिला</h2>
          <p>कृपया होमपेज पर वापस जाएँ।</p>
          <a class="button" href="/">होमपेज पर जाएँ</a>
        </div>
      </section>
    `
  };

  app.innerHTML = `
    ${renderHeader()}

    ${path === "/" ? "" : `
      <section class="page-heading">
        <div class="container">
          <span class="tag">🌿 ग्राम अमीरपुर</span>
          <h1>${escapeHTML(currentPage.title)}</h1>
          <p>${escapeHTML(currentPage.subtitle)}</p>
        </div>
      </section>
    `}

    <main class="page-content">
      ${currentPage.content}
    </main>

    ${renderFooter()}
  `;

  // Mobile navigation
  const menuButton = document.querySelector("#menu-toggle");
  const nav = document.querySelector("#main-nav");

  menuButton?.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("show");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  nav?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("show");
      menuButton?.setAttribute("aria-expanded", "false");
    });
  });

  // Load news from Firestore
  function loadNews(targetId, limitCount = 6) {
    const target = document.getElementById(targetId);
    if (!target) return;

    const newsQuery = query(
      collection(db, "news"),
      orderBy("date", "desc")
    );

    onSnapshot(newsQuery, snapshot => {
      if (snapshot.empty) {
        target.innerHTML = `
          <div class="card">
            <div class="icon">📰</div>
            <h3>अभी समाचार उपलब्ध नहीं हैं</h3>
            <p>नए समाचार प्रकाशित होने पर यहाँ दिखाई देंगे।</p>
          </div>
        `;
        return;
      }

      const docs = snapshot.docs.slice(0, limitCount);

      target.innerHTML = docs.map(doc => {
        const item = doc.data();

        return `
          <article class="card">
            <div class="icon">📰</div>
            <h3>${escapeHTML(item.title || "गाँव का समाचार")}</h3>
            <p>${escapeHTML(item.content || item.description || "")}</p>
            ${item.date ? `<p class="small">${escapeHTML(item.date)}</p>` : ""}
          </article>
        `;
      }).join("");
    }, error => {
      console.error("News loading error:", error);

      target.innerHTML = `
        <div class="card">
          <p>समाचार लोड नहीं हो सके। कृपया बाद में प्रयास करें।</p>
        </div>
      `;
    });
  }

  if (path === "/") {
    loadNews("home-news", 3);
  }

  if (path === "/news") {
    loadNews("news-list", 30);
  }

  // Load photo gallery
  if (path === "/gallery") {
    loadGallery();
  }

  // Load directory from Firestore
  function loadDirectory() {
    const target = document.getElementById("directory-list");
    const searchInput = document.getElementById("directory-search");

    if (!target) return;

    let allPeople = [];

    function renderPeople() {
      const term = (searchInput?.value || "").trim().toLowerCase();

      const filtered = allPeople.filter(person => {
        const text = [
          person.name,
          person.title,
          person.role,
          person.post,
          person.phone,
          person.mobile
        ].join(" ").toLowerCase();

        return text.includes(term);
      });

      if (filtered.length === 0) {
        target.innerHTML = `
          <div class="card">
            <div class="icon">👥</div>
            <h3>कोई जानकारी नहीं मिली</h3>
            <p>दूसरा नाम या शब्द लिखकर खोजें।</p>
          </div>
        `;
        return;
      }

      target.innerHTML = filtered.map(person => {
        const name = person.name || "नाम उपलब्ध नहीं";
        const role = person.role || person.title || person.post || "";
        const phone = person.phone || person.mobile || "";

        return `
          <article class="card">
            <div class="icon">👤</div>
            <h3>${escapeHTML(name)}</h3>

            ${role ? `<p>${escapeHTML(role)}</p>` : ""}

            ${phone ? `
              <p>
                <a href="tel:${escapeHTML(phone)}">
                  📞 ${escapeHTML(phone)}
                </a>
              </p>
            ` : ""}
          </article>
        `;
      }).join("");
    }

    searchInput?.addEventListener("input", renderPeople);

    onSnapshot(collection(db, "directory"), snapshot => {
      allPeople = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      renderPeople();
    }, error => {
      console.error("Directory loading error:", error);

      target.innerHTML = `
        <div class="card">
          <p>डायरेक्टरी लोड नहीं हो सकी।</p>
        </div>
      `;
    });
  }

  if (path === "/directory") {
    loadDirectory();
  }
}