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
      <h1>ग्राम अमीरपुर</h1>
      <p>आपके गाँव की अपनी वेबसाइट</p>
    </header>

    <nav>
      <a href="#home">होम</a>
      <a href="#news">गाँव के समाचार</a>
      <a href="#development">गाँव का विकास</a>
      <a href="#contact">संपर्क</a>
      <a href="/admin">Admin Login</a>
    </nav>

    <main id="home">
      <section class="hero">
        <h2>अपने गाँव अमीरपुर में आपका स्वागत है</h2>
        <p>गाँव की खबरें, सरकारी योजनाएँ और जरूरी जानकारियाँ एक ही जगह।</p>
      </section>

      <section id="news">
        <h2>📰 गाँव के ताजा समाचार</h2>
        <p>यहाँ गाँव की नई खबरें पढ़ें।</p>
      </section>

      <section id="development">
        <h2>🏡 गाँव का विकास</h2>
        <p>गाँव में चल रहे विकास कार्यों की जानकारी यहाँ मिलेगी।</p>
      </section>

      <section id="contact">
        <h2>📞 संपर्क</h2>
        <p>ग्राम अमीरपुर, बलदेव, मथुरा, उत्तर प्रदेश</p>
      </section>
    </main>

    <footer>
      <p>© ग्राम अमीरपुर | सभी अधिकार सुरक्षित</p>
    </footer>
  `

  const newsContainer = document.createElement('div')
  newsContainer.id = 'public-news'
  newsContainer.className = 'public-news-list'
  newsContainer.textContent = '📢 समाचार लोड हो रहे हैं...'

  document.querySelector('#news').append(newsContainer)

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
        article.className = 'public-news-card'

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