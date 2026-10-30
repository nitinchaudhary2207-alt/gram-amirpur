import './style.css'
import { db } from './firebase.js'
import {
  collection,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore'

if (window.location.pathname === '/admin') {
  import('./admin.js')
} else {
  document.querySelector('#app').innerHTML = `
    <header class="topbar">
      <div class="brand">
        <div class="logo">🏡</div>
        <div>
          <h1>ग्राम अमीरपुर</h1>
          <p>बलदेव, मथुरा, उत्तर प्रदेश</p>
        </div>
      </div>
      <div class="digital">OUR VILLAGE • OUR PRIDE</div>
    </header>

    <nav class="navbar">
      <a href="#home">होम</a>
      <a href="#news">गाँव के समाचार</a>
      <a href="#schemes">सरकारी योजनाएँ</a>
      <a href="#farmers">किसान कॉर्नर</a>
      <a href="#notices">सरकारी सूचनाएँ</a>
      <a href="#panchayat">ग्राम पंचायत</a>
      <a href="#contact">संपर्क</a>
      <a href="/admin">Admin Login</a>
    </nav>

    <main id="home">
      <section class="hero">
        <div class="hero-content">
          <span class="tag">🌿 हमारी पहचान • हमारा अमीरपुर</span>
          <h2>डिजिटल ग्राम <span>अमीरपुर</span></h2>
          <p>
            अपने गाँव की खबरें, सरकारी योजनाएँ, कृषि जानकारी,
            पंचायत की सूचनाएँ और विकास कार्यों की जानकारी एक ही जगह पाएँ।
          </p>
          <a class="button" href="#news">ताजा समाचार देखें →</a>
        </div>
        <div class="hero-icon">🏡</div>
      </section>

      <section class="section" id="news">
        <div class="section-heading">
          <span>LATEST UPDATES</span>
          <h2>📰 गाँव के ताजा समाचार</h2>
          <p>अमीरपुर में होने वाली गतिविधियों और नई खबरों की जानकारी।</p>
        </div>
        <div id="public-news" class="cards">
          <p class="notice">📢 समाचार लोड हो रहे हैं...</p>
        </div>
      </section>

      <section class="section" id="schemes">
        <div class="section-heading">
          <span>GOVERNMENT SCHEMES</span>
          <h2>🏛️ सरकारी योजनाएँ</h2>
          <p>सरकारी योजनाओं की जानकारी और आवेदन से जुड़ी मदद।</p>
        </div>
        <div class="cards">
          <article class="card">
            <div class="icon">🏠</div>
            <h3>प्रधानमंत्री आवास योजना</h3>
            <p>आवास योजना की पात्रता और आवेदन संबंधी जानकारी प्राप्त करें।</p>
            <a href="https://pmayg.nic.in/" target="_blank" rel="noopener noreferrer">आधिकारिक वेबसाइट →</a>
          </article>

          <article class="card">
            <div class="icon">🌾</div>
            <h3>पीएम किसान सम्मान निधि</h3>
            <p>किसान सम्मान निधि की किस्त और लाभार्थी संबंधी जानकारी।</p>
            <a href="https://pmkisan.gov.in/" target="_blank" rel="noopener noreferrer">आधिकारिक वेबसाइट →</a>
          </article>

          <article class="card">
            <div class="icon">💳</div>
            <h3>ई-श्रम कार्ड</h3>
            <p>असंगठित क्षेत्र के श्रमिकों के लिए आधिकारिक जानकारी।</p>
            <a href="https://eshram.gov.in/" target="_blank" rel="noopener noreferrer">आधिकारिक वेबसाइट →</a>
          </article>

          <article class="card">
            <div class="icon">📋</div>
            <h3>अन्य सरकारी योजनाएँ</h3>
            <p>सरकारी योजनाओं की जानकारी संबंधित विभाग की वेबसाइट पर देखें।</p>
            <a href="https://www.myscheme.gov.in/" target="_blank" rel="noopener noreferrer">योजनाएँ देखें →</a>
          </article>
        </div>
      </section>

      <section class="section farmers" id="farmers">
        <div class="section-heading">
          <span>FARMER CORNER</span>
          <h2>🌾 किसान कॉर्नर</h2>
          <p>किसानों के लिए उपयोगी जानकारी और सरकारी सुविधाएँ।</p>
        </div>
        <div class="cards">
          <article class="card">
            <div class="icon">🌱</div>
            <h3>फसल और बीज</h3>
            <p>बुवाई, बीज चयन और फसल की देखभाल से जुड़ी जानकारी।</p>
          </article>

          <article class="card">
            <div class="icon">🧪</div>
            <h3>खाद और उर्वरक</h3>
            <p>खाद की उपलब्धता और उर्वरक के सही इस्तेमाल की जानकारी।</p>
          </article>

          <article class="card">
            <div class="icon">💰</div>
            <h3>किसान सहायता</h3>
            <p>किसान योजनाओं और कृषि विभाग की आधिकारिक सेवाओं के लिंक।</p>
            <a href="https://agriculture.up.gov.in/" target="_blank" rel="noopener noreferrer">कृषि विभाग →</a>
          </article>

          <article class="card">
            <div class="icon">🌦️</div>
            <h3>मौसम की जानकारी</h3>
            <p>खेती की योजना बनाने से पहले मौसम की जानकारी जरूर देखें।</p>
            <a href="https://mausam.imd.gov.in/" target="_blank" rel="noopener noreferrer">मौसम विभाग →</a>
          </article>
        </div>
      </section>

      <section class="section" id="notices">
        <div class="section-heading">
          <span>PUBLIC NOTICES</span>
          <h2>📢 सरकारी सूचनाएँ</h2>
          <p>पंचायत के नोटिस, घोषणाएँ और जरूरी अपडेट।</p>
        </div>
        <div class="information">
          <div>
            <h2>जरूरी सूचना</h2>
            <p>नई सूचनाएँ प्रकाशित होने पर यहाँ दिखाई देंगी।</p>
          </div>
          <div class="icon">📄</div>
        </div>
      </section>

      <section class="section lower-sections" id="panchayat">
        <div class="section-heading">
          <span>GRAM PANCHAYAT</span>
          <h2>🏡 ग्राम पंचायत अमीरपुर</h2>
          <p>गाँव के विकास कार्यों और पंचायत संबंधी जानकारी का केंद्र।</p>
        </div>
        <div class="cards">
          <article class="card">
            <div class="icon">🏛️</div>
            <h3>पंचायत परिचय</h3>
            <p>ग्राम पंचायत से जुड़ी आधिकारिक जानकारी यहाँ उपलब्ध कराई जाएगी।</p>
          </article>

          <article class="card">
            <div class="icon">🛠️</div>
            <h3>विकास कार्य</h3>
            <p>गाँव में होने वाले विकास कार्यों की जानकारी यहाँ साझा की जाएगी।</p>
          </article>

          <article class="card">
            <div class="icon">👥</div>
            <h3>जनसुविधाएँ</h3>
            <p>गाँव की सार्वजनिक सुविधाओं और जरूरी सेवाओं की जानकारी।</p>
          </article>

          <article class="card">
            <div class="icon">📣</div>
            <h3>जनसमस्याएँ</h3>
            <p>गाँव की समस्याओं और उनके समाधान से संबंधित अपडेट।</p>
          </article>
        </div>
      </section>

      <!-- CONTACT SECTION -->
      <section class="section contact" id="contact">
        <div class="section-heading">
          <span>CONTACT</span>
          <h2>📍 संपर्क और पता</h2>
          <p>ग्राम अमीरपुर, ब्लॉक बलदेव, जिला मथुरा, उत्तर प्रदेश।</p>
        </div>

        <div class="contact-details">
          <div class="icon">📞</div>
          <h3>हमसे संपर्क करें</h3>
          <p>संपर्क नंबर: <strong>9548772433</strong></p>

          <div class="contact-actions">
            <a class="button" href="tel:9548772433">
              📞 अभी कॉल करें
            </a>

            <a
              class="button"
              href="https://wa.me/919548772433"
              target="_blank"
              rel="noopener noreferrer"
            >
              🟢 WhatsApp पर संपर्क करें
            </a>
          </div>
        </div>

        <p class="small">
          यह वेबसाइट गाँव की जानकारी साझा करने के उद्देश्य से बनाई गई है।
        </p>
      </section>
    </main>

    <footer>
      <h3>🏡 ग्राम अमीरपुर</h3>
      <p>हमारा गाँव • हमारी पहचान • हमारा विकास</p>
      <small>© ग्राम अमीरपुर | सभी अधिकार सुरक्षित</small>
    </footer>
  `

  const newsContainer = document.querySelector('#public-news')

  const newsQuery = query(
    collection(db, 'news'),
    orderBy('date', 'desc')
  )

  onSnapshot(
    newsQuery,
    (snapshot) => {
      newsContainer.replaceChildren()

      if (snapshot.empty) {
        newsContainer.textContent = 'अभी कोई समाचार प्रकाशित नहीं हुआ है।'
        return
      }

      snapshot.forEach((newsDoc) => {
        const item = newsDoc.data()

        const article = document.createElement('article')
        article.className = 'card'

        const title = document.createElement('h3')
        title.textContent = item.title || 'गाँव का समाचार'

        const category = document.createElement('p')
        category.textContent = 'श्रेणी: ' + (item.category || 'सामान्य')

        const description = document.createElement('p')
        description.textContent = item.description || ''

        article.append(title, category, description)
        newsContainer.append(article)
      })
    },
    (error) => {
      console.error('समाचार लोड करने में समस्या:', error)
      newsContainer.textContent =
        'समाचार अभी लोड नहीं हो पाए। कृपया कुछ देर बाद फिर प्रयास करें।'
    }
  )
}