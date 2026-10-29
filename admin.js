import './style.css'

const app = document.querySelector('#app')

app.innerHTML = `
  <div class="admin-page">
    <header class="admin-header">
      <div>
        <h1>🏡 ग्राम अमीरपुर</h1>
        <p>Admin Dashboard</p>
      </div>
      <a href="/" class="back-link">← मुख्य वेबसाइट</a>
    </header>

    <main class="admin-container">
      <section class="admin-welcome">
        <span>ADMINISTRATION</span>
        <h2>वेबसाइट प्रबंधन</h2>
        <p>गाँव के समाचार और जानकारी यहाँ प्रबंधित करें।</p>
      </section>

      <section class="admin-stats">
        <div class="admin-stat">
          <span>📰</span>
          <h3 id="news-count">0</h3>
          <p>कुल समाचार</p>
        </div>
        <div class="admin-stat">
          <span>📢</span>
          <h3 id="notice-count">0</h3>
          <p>घोषणाएँ</p>
        </div>
        <div class="admin-stat">
          <span>📝</span>
          <h3 id="complaint-count">0</h3>
          <p>शिकायतें</p>
        </div>
      </section>

      <section class="admin-form-card">
        <h2>➕ नया समाचार जोड़ें</h2>

        <form id="news-form">
          <label for="news-title">समाचार का शीर्षक</label>
          <input
            id="news-title"
            type="text"
            placeholder="समाचार का शीर्षक लिखें"
            required
          >

          <label for="news-category">समाचार की श्रेणी</label>
          <select id="news-category" required>
            <option value="गाँव के समाचार">गाँव के समाचार</option>
            <option value="ग्राम पंचायत">ग्राम पंचायत</option>
            <option value="किसान समाचार">किसान समाचार</option>
            <option value="सरकारी योजना">सरकारी योजना</option>
            <option value="कार्यक्रम">कार्यक्रम</option>
          </select>

          <label for="news-description">समाचार का विवरण</label>
          <textarea
            id="news-description"
            rows="5"
            placeholder="समाचार का पूरा विवरण लिखें"
            required
          ></textarea>

          <button type="submit" class="admin-button">
            समाचार जोड़ें
          </button>

          <p id="form-message" aria-live="polite"></p>
        </form>
      </section>

      <section class="admin-form-card">
        <h2>📋 समाचारों की सूची</h2>
        <div id="news-list"></div>
      </section>
    </main>
  </div>
`

const STORAGE_KEY = 'gram-amirpur-news'

function getNews() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

function renderNews() {
  const news = getNews()
  const list = document.querySelector('#news-list')

  document.querySelector('#news-count').textContent = news.length
  list.replaceChildren()

  if (news.length === 0) {
    const emptyMessage = document.createElement('p')
    emptyMessage.textContent = 'अभी कोई समाचार नहीं जोड़ा गया है।'
    list.append(emptyMessage)
    return
  }

  news.forEach((item) => {
    const card = document.createElement('article')
    card.className = 'admin-news-item'

    const title = document.createElement('h3')
    title.textContent = item.title

    const category = document.createElement('p')
    category.textContent = `श्रेणी: ${item.category}`

    const description = document.createElement('p')
    description.textContent = item.description

    const removeButton = document.createElement('button')
    removeButton.className = 'delete-button'
    removeButton.textContent = 'समाचार हटाएँ'

    removeButton.addEventListener('click', () => {
      const confirmed = confirm('क्या आप यह समाचार हटाना चाहते हैं?')
      if (!confirmed) return

      const updatedNews = getNews().filter((newsItem) => newsItem.id !== item.id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNews))
      renderNews()
    })

    card.append(title, category, description, removeButton)
    list.append(card)
  })
}

document.querySelector('#news-form').addEventListener('submit', (event) => {
  event.preventDefault()

  const title = document.querySelector('#news-title').value.trim()
  const category = document.querySelector('#news-category').value
  const description = document.querySelector('#news-description').value.trim()

  if (!title || !description) return

  const news = getNews()

  news.unshift({
    id: crypto.randomUUID(),
    title,
    category,
    description,
    date: new Date().toISOString()
  })

  localStorage.setItem(STORAGE_KEY, JSON.stringify(news))

  event.target.reset()
  document.querySelector('#form-message').textContent =
    'समाचार इस ब्राउज़र में सेव हो गया है।'

  renderNews()
})

renderNews()