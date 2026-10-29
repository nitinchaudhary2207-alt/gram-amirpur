import './style.css'
if (window.location.pathname === '/admin') {
  import('./admin.js')
}

document.querySelector('#app').innerHTML = `
  <header class="topbar">
    <div class="brand">
      <div class="logo">🏡</div>
      <div>
        <h1>ग्राम अमीरपुर</h1>
        <p>बलदेव, मथुरा, उत्तर प्रदेश</p>
      </div>
    </div>
    <span class="digital">DIGITAL VILLAGE</span>
  </header>

  <nav class="navbar">
    <a href="#home">होम</a>
    <a href="#about">गाँव के बारे में</a>
    <a href="#news">समाचार</a>
    <a href="#panchayat">ग्राम पंचायत</a>
    <a href="#farmers">किसान कॉर्नर</a>
    <a href="#contact">संपर्क</a>
  </nav>

  <main>
    <section class="hero" id="home">
      <div class="hero-content">
        <span class="tag">हमारा गाँव, हमारी पहचान</span>
        <h2>अपने गाँव<br> <span>अमीरपुर</span> में आपका स्वागत है!</h2>
        <p>
          गाँव की जानकारी, स्थानीय समाचार और जनसुविधाएँ—
          सब कुछ एक ही जगह।
        </p>
        <a class="button" href="#about">गाँव के बारे में जानें →</a>
      </div>
      <div class="hero-icon">🌳</div>
    </section>

    <section class="section" id="about">
      <div class="section-heading">
        <span>हमारी पहचान</span>
        <h2>हमारा प्यारा गाँव</h2>
        <p>ग्राम अमीरपुर की डिजिटल जानकारी के लिए आपका अपना पोर्टल।</p>
      </div>

      <div class="cards">
        <article class="card">
          <div class="icon">🏛️</div>
          <h3>ग्राम पंचायत</h3>
          <p>पंचायत और गाँव के विकास से संबंधित जानकारी।</p>
          <a href="#panchayat">और जानें →</a>
        </article>

        <article class="card">
          <div class="icon">📰</div>
          <h3>गाँव के समाचार</h3>
          <p>गाँव की गतिविधियों और स्थानीय समाचारों के लिए।</p>
          <a href="#news">समाचार देखें →</a>
        </article>

        <article class="card">
          <div class="icon">🌾</div>
          <h3>किसान कॉर्नर</h3>
          <p>खेती, खाद, बीज और सरकारी योजनाओं की जानकारी।</p>
          <a href="#farmers">जानकारी देखें →</a>
        </article>

        <article class="card">
          <div class="icon">📝</div>
          <h3>शिकायत एवं सुझाव</h3>
          <p>गाँव की समस्याओं और सुझावों को हमारे साथ साझा करें।</p>
          <a href="#contact">फॉर्म खोलें →</a>
        </article>
      </div>
    </section>

    <section class="information" id="news">
      <div>
        <span class="label">LATEST UPDATES</span>
        <h2>गाँव के समाचार</h2>
        <p>ग्राम अमीरपुर की ताजा खबरें और घोषणाएँ।</p>
  </div>
      <div class="notice">📢 समाचार जल्द ही यहाँ दिखाई देंगे।</div>
    </section>

    <section class="section lower-sections" id="panchayat">
      <h2>ग्राम पंचायत</h2>
      <p>यहाँ ग्राम पंचायत, विकास कार्यों और सार्वजनिक सुविधाओं की सत्यापित जानकारी जोड़ी जाएगी।</p>
    </section>

    <div id="public-news" class="public-news-list">
    <p class="notice">📢 समाचार लोड हो रहे हैं...</p>
  </div>
    </section>

    <section class="section contact" id="contact">
      <h2>शिकायत एवं सुझाव</h2>
      <p>अगले चरण में यहाँ ऑनलाइन शिकायत और सुझाव फॉर्म जोड़ा जाएगा।</p>
      <p class="small">अभी यह शुरुआती डिजाइन है। फॉर्म और डेटा सुरक्षित रूप से सहेजने की सुविधा बाद में जोड़ेंगे।</p>
    </section>
  </main>

  <footer>
    <h3>🏡 ग्राम अमीरपुर</h3>
    <p>हमारा गाँव, हमारी पहचान।</p>
    <p>बलदेव, मथुरा, उत्तर प्रदेश</p>
    <small>© 2026 ग्राम अमीरपुर डिजिटल पोर्टल</small>
  </footer>
`
if (window.location.pathname !== '/admin') {
  const newsContainer = document.querySelector('#public-news')
  const savedNews = JSON.parse(
    localStorage.getItem('gram-amirpur-news') || '[]'
  )

  if (newsContainer) {
    newsContainer.replaceChildren()

    if (savedNews.length === 0) {
      newsContainer.textContent = 'अभी कोई समाचार प्रकाशित नहीं हुआ है।'
    } else {
      savedNews.forEach((item) => {
        const article = document.createElement('article')
        article.className = 'public-news-card'

        const title = document.createElement('h3')
        title.textContent = item.title

        const category = document.createElement('p')
       category.textContent = 'श्रेणी: ' + item.category
        const description = document.createElement('p')
        description.textContent = item.description

        article.append(title, category, description)
        newsContainer.append(article)
      })
    }
  }
}
`
javascript
// मुख्य वेबसाइट पर Admin Panel के समाचार दिखाएँ
if (window.location.pathname !== '/admin') {
  const newsContainer = document.querySelector('#public-news');

  if (newsContainer) {
    let savedNews = [];

    try {
      savedNews = JSON.parse(
        localStorage.getItem('gram-amirpur-news') || '[]'
      );
    } catch (error) {
      savedNews = [];
    }

    newsContainer.replaceChildren();

    if (savedNews.length === 0) {
      newsContainer.textContent = 'अभी कोई समाचार प्रकाशित नहीं हुआ है।';
    } else {
      savedNews.forEach((item) => {
        const article = document.createElement('article');
        article.className = 'public-news-card';

        const title = document.createElement('h3');
        title.textContent = item.title || 'गाँव का समाचार';

        const category = document.createElement('p');
        category.textContent = 'श्रेणी: ' + (item.category || 'सामान्य');

        const description = document.createElement('p');
        description.textContent = item.description || '';

        article.append(title, category, description);
        newsContainer.append(article);
      });
    }
  }
}
  `