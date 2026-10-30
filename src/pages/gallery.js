import { db } from '../firebase.js'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'

export function renderGallery() {
  return `
    <section class="section">
      <div class="section-heading">
        <span class="tag">📸 हमारी यादें</span>
        <h2>ग्राम अमीरपुर फोटो गैलरी</h2>
        <p>हमारे गाँव की तस्वीरें यहाँ देखें।</p>
      </div>

      <div id="gallery-list" class="grid">
        <div class="card">
          <p>फोटो लोड हो रही हैं...</p>
        </div>
      </div>
    </section>
  `
}

export function loadGallery() {
  const target = document.querySelector('#gallery-list')
  if (!target) return

  const galleryQuery = query(
    collection(db, 'gallery'),
    orderBy('createdAt', 'desc')
  )

  onSnapshot(galleryQuery, (snapshot) => {
    if (snapshot.empty) {
      target.innerHTML = `
        <div class="card">
          <div class="icon">📷</div>
          <h3>अभी कोई फोटो उपलब्ध नहीं है</h3>
          <p>Admin Panel से फोटो अपलोड होने पर यहाँ दिखाई देंगी।</p>
        </div>
      `
      return
    }

    target.innerHTML = snapshot.docs.map((doc) => {
      const photo = doc.data()
      const title = String(photo.title || 'ग्राम अमीरपुर').replace(/[&<>"']/g, '')
      const url = String(photo.url || '')

      if (!url.startsWith('https://')) return ''

      return `
        <article class="card">
          <img
            src="${url}"
            alt="${title}"
            loading="lazy"
            style="width:100%;height:220px;object-fit:cover;border-radius:12px"
          >
          <h3>${title}</h3>
        </article>
      `
    }).join('')
  }, (error) => {
    console.error('Gallery loading error:', error)
    target.innerHTML = `
      <div class="card">
        <p>फोटो लोड नहीं हो सकीं। कृपया बाद में प्रयास करें।</p>
      </div>
    `
  })
}