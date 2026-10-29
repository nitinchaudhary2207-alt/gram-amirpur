import './style.css'
import { auth, db } from './firebase.js'
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'firebase/auth'
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy
} from 'firebase/firestore'

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
        <p>गाँव के समाचार यहाँ से प्रकाशित करें।</p>
      </section>

      <section class="admin-form-card" id="login-card">
        <h2>🔐 Admin Login</h2>
        <form id="login-form">
          <label for="email">ईमेल</label>
          <input id="email" type="email" required
            autocomplete="username"
            placeholder="अपना Admin ईमेल लिखें">

          <label for="password">पासवर्ड</label>
          <input id="password" type="password" required
            autocomplete="current-password"
            placeholder="अपना पासवर्ड लिखें">

          <button type="submit" class="admin-button">लॉगिन करें</button>
          <p id="login-message" aria-live="polite"></p>
        </form>
      </section>

      <div id="dashboard" hidden>
        <section class="admin-form-card">
          <p id="logged-in-user"></p>
          <button id="logout-button" class="delete-button">
            Logout
          </button>
        </section>

        <section class="admin-stats">
          <div class="admin-stat">
            <span>📰</span>
            <h3 id="news-count">0</h3>
            <p>कुल समाचार</p>
          </div>
        </section>

        <section class="admin-form-card">
          <h2>➕ नया समाचार जोड़ें</h2>
          <form id="news-form">
            <label for="news-title">समाचार का शीर्षक</label>
            <input id="news-title" type="text" required
              placeholder="समाचार का शीर्षक लिखें">

            <label for="news-category">समाचार की श्रेणी</label>
            <select id="news-category" required>
              <option value="गाँव के समाचार">गाँव के समाचार</option>
              <option value="ग्राम पंचायत">ग्राम पंचायत</option>
              <option value="किसान समाचार">किसान समाचार</option>
              <option value="सरकारी योजना">सरकारी योजना</option>
              <option value="कार्यक्रम">कार्यक्रम</option>
            </select>

            <label for="news-description">समाचार का विवरण</label>
            <textarea id="news-description" rows="5" required
              placeholder="समाचार का पूरा विवरण लिखें"></textarea>

            <button type="submit" class="admin-button">
              समाचार प्रकाशित करें
            </button>
            <p id="form-message" aria-live="polite"></p>
          </form>
        </section>

        <section class="admin-form-card">
          <h2>📋 प्रकाशित समाचार</h2>
          <div id="news-list">समाचार लोड हो रहे हैं...</div>
        </section>
      </div>
    </main>
  </div>
`

const loginCard = document.querySelector('#login-card')
const dashboard = document.querySelector('#dashboard')
const loginMessage = document.querySelector('#login-message')
const formMessage = document.querySelector('#form-message')
const newsList = document.querySelector('#news-list')
const newsCollection = collection(db, 'news')

let currentUser = null

function showMessage(element, message) {
  element.textContent = message
}

async function renderNews() {
  newsList.textContent = 'समाचार लोड हो रहे हैं...'

  try {
    const newsQuery = query(newsCollection, orderBy('date', 'desc'))
    const snapshot = await getDocs(newsQuery)

    newsList.replaceChildren()
    document.querySelector('#news-count').textContent = snapshot.size

    if (snapshot.empty) {
      newsList.textContent = 'अभी कोई समाचार प्रकाशित नहीं हुआ है।'
      return
    }

    snapshot.forEach((newsDoc) => {
      const item = newsDoc.data()
      const card = document.createElement('article')
      card.className = 'admin-news-item'

      const title = document.createElement('h3')
      title.textContent = item.title || 'गाँव का समाचार'

      const category = document.createElement('p')
      category.textContent = 'श्रेणी: ' + (item.category || 'सामान्य')

      const description = document.createElement('p')
      description.textContent = item.description || ''

      const removeButton = document.createElement('button')
      removeButton.className = 'delete-button'
      removeButton.textContent = 'समाचार हटाएँ'

      removeButton.addEventListener('click', async () => {
        if (!currentUser) return

        if (!confirm('क्या आप यह समाचार हटाना चाहते हैं?')) return

        try {
          await deleteDoc(doc(db, 'news', newsDoc.id))
          showMessage(formMessage, 'समाचार हटा दिया गया है।')
          await renderNews()
        } catch (error) {
          console.error(error)
          showMessage(formMessage, 'समाचार नहीं हट पाया। कृपया फिर प्रयास करें।')
        }
      })

      card.append(title, category, description, removeButton)
      newsList.append(card)
    })
  } catch (error) {
    console.error(error)
    newsList.textContent =
      'समाचार लोड नहीं हुए। Firebase सेटिंग और इंटरनेट कनेक्शन जाँचें।'
  }
}

document.querySelector('#login-form').addEventListener('submit', async (event) => {
  event.preventDefault()
  showMessage(loginMessage, 'लॉगिन हो रहा है...')

  const email = document.querySelector('#email').value.trim()
  const password = document.querySelector('#password').value

  try {
    await signInWithEmailAndPassword(auth, email, password)
    showMessage(loginMessage, '')
  } catch (error) {
    console.error(error)
    showMessage(loginMessage, 'लॉगिन नहीं हुआ। ईमेल और पासवर्ड जाँचें।')
  }
})

document.querySelector('#logout-button').addEventListener('click', async () => {
  await signOut(auth)
})

document.querySelector('#news-form').addEventListener('submit', async (event) => {
  event.preventDefault()

  if (!currentUser) {
    showMessage(formMessage, 'पहले Admin लॉगिन करें।')
    return
  }

  const title = document.querySelector('#news-title').value.trim()
  const category = document.querySelector('#news-category').value
  const description = document.querySelector('#news-description').value.trim()

  if (!title || !description) return

  showMessage(formMessage, 'समाचार प्रकाशित हो रहा है...')

  try {
    await addDoc(newsCollection, {
      title,
      category,
      description,
      date: Date.now(),
      author: currentUser.email
    })

    event.target.reset()
    showMessage(formMessage, 'समाचार ऑनलाइन प्रकाशित हो गया है!')
    await renderNews()
  } catch (error) {
    console.error(error)
    showMessage(
      formMessage,
      'समाचार प्रकाशित नहीं हुआ। Firebase Rules और लॉगिन जाँचें।'
    )
  }
})

onAuthStateChanged(auth, async (user) => {
  currentUser = user

  loginCard.hidden = Boolean(user)
  dashboard.hidden = !user

  if (user) {
    document.querySelector('#logged-in-user').textContent =
      'लॉगिन: ' + user.email
    await renderNews()
  } else {
    newsList.replaceChildren()
    document.querySelector('#news-count').textContent = '0'
  }
})