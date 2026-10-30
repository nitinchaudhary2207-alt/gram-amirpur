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
  orderBy,
  updateDoc
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
        <p>समाचार और गाँव की Call Directory का प्रबंधन करें।</p>
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

          <div class="admin-stat">
            <span>📞</span>
            <h3 id="contact-count">0</h3>
            <p>डायरेक्टरी संपर्क</p>
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

        <section class="admin-form-card" id="directory">
          <h2>📞 गाँव की Call Directory</h2>
          <p>गाँव के लोगों का नाम और मोबाइल नंबर यहाँ जोड़ें।</p>

          <form id="contact-form">
            <input id="contact-id" type="hidden">

            <label for="person-name">व्यक्ति का पूरा नाम</label>
            <input id="person-name" type="text" required
              maxlength="100"
              placeholder="जैसे: राम सिंह">

            <label for="person-phone">मोबाइल नंबर</label>
            <input id="person-phone" type="tel" required
              inputmode="numeric"
              maxlength="10"
              pattern="[6-9][0-9]{9}"
              placeholder="10 अंकों का मोबाइल नंबर">

            <button type="submit" class="admin-button" id="contact-submit">
              संपर्क जोड़ें
            </button>

            <button type="button" id="cancel-edit" hidden>
              बदलाव रद्द करें
            </button>

            <p id="contact-message" aria-live="polite"></p>
          </form>
        </section>

        <section class="admin-form-card">
          <h2>👥 डायरेक्टरी में शामिल लोग</h2>
          <div id="directory-list">डायरेक्टरी लोड हो रही है...</div>
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
const contactForm = document.querySelector('#contact-form')
const contactMessage = document.querySelector('#contact-message')
const directoryList = document.querySelector('#directory-list')

const newsCollection = collection(db, 'news')
const directoryCollection = collection(db, 'directory')

let currentUser = null

function showMessage(element, message) {
  element.textContent = message
}

function makeTextElement(tag, text) {
  const element = document.createElement(tag)
  element.textContent = text
  return element
}

// समाचार लोड करें
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

      card.append(
        makeTextElement('h3', item.title || 'गाँव का समाचार'),
        makeTextElement('p', 'श्रेणी: ' + (item.category || 'सामान्य')),
        makeTextElement('p', item.description || '')
      )

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
          showMessage(formMessage, 'समाचार नहीं हट पाया।')
        }
      })

      card.append(removeButton)
      newsList.append(card)
    })
  } catch (error) {
    console.error(error)
    newsList.textContent = 'समाचार लोड नहीं हुए। Firebase Rules जाँचें।'
  }
}

// डायरेक्टरी लोड करें
async function renderDirectory() {
  directoryList.textContent = 'डायरेक्टरी लोड हो रही है...'

  try {
    const snapshot = await getDocs(
      query(directoryCollection, orderBy('name'))
    )

    directoryList.replaceChildren()
    document.querySelector('#contact-count').textContent = snapshot.size

    if (snapshot.empty) {
      directoryList.textContent = 'अभी कोई संपर्क नहीं जोड़ा गया है।'
      return
    }

    snapshot.forEach((personDoc) => {
      const person = personDoc.data()
      const card = document.createElement('article')
      card.className = 'admin-news-item'

      card.append(
        makeTextElement('h3', person.name || 'नाम उपलब्ध नहीं'),
        makeTextElement('p', 'मोबाइल: ' + (person.phone || ''))
      )

      const editButton = document.createElement('button')
      editButton.className = 'admin-button'
      editButton.textContent = 'बदलें'

      editButton.addEventListener('click', () => {
        document.querySelector('#contact-id').value = personDoc.id
        document.querySelector('#person-name').value = person.name || ''
        document.querySelector('#person-phone').value = person.phone || ''
        document.querySelector('#contact-submit').textContent = 'बदलाव सेव करें'
        document.querySelector('#cancel-edit').hidden = false
        document.querySelector('#person-name').focus()
      })

      const deleteButton = document.createElement('button')
      deleteButton.className = 'delete-button'
      deleteButton.textContent = 'हटाएँ'

      deleteButton.addEventListener('click', async () => {
        if (!currentUser) return

        if (!confirm('क्या इस व्यक्ति का नंबर हटाना चाहते हैं?')) return

        try {
          await deleteDoc(doc(db, 'directory', personDoc.id))
          showMessage(contactMessage, 'संपर्क हटा दिया गया है।')
          await renderDirectory()
        } catch (error) {
          console.error(error)
          showMessage(contactMessage, 'संपर्क नहीं हट पाया।')
        }
      })

      card.append(editButton, deleteButton)
      directoryList.append(card)
    })
  } catch (error) {
    console.error(error)
    directoryList.textContent =
      'डायरेक्टरी लोड नहीं हुई। Firebase Rules और इंटरनेट जाँचें।'
  }
}

// नया संपर्क जोड़ें या बदलें
contactForm.addEventListener('submit', async (event) => {
  event.preventDefault()

  if (!currentUser) {
    showMessage(contactMessage, 'पहले Admin Login करें।')
    return
  }

  const name = document.querySelector('#person-name').value.trim()
  const phone = document.querySelector('#person-phone').value.trim()
  const contactId = document.querySelector('#contact-id').value

  if (!name || !/^[6-9]\d{9}$/.test(phone)) {
    showMessage(contactMessage, 'सही नाम और 10 अंकों का मोबाइल नंबर लिखें।')
    return
  }

  try {
    showMessage(contactMessage, 'संपर्क सेव हो रहा है...')

    if (contactId) {
      await updateDoc(doc(db, 'directory', contactId), {
        name,
        phone,
        updatedAt: Date.now()
      })
      showMessage(contactMessage, 'संपर्क अपडेट हो गया है।')
    } else {
      await addDoc(directoryCollection, {
        name,
        phone,
        createdAt: Date.now()
      })
      showMessage(contactMessage, 'नया संपर्क जोड़ दिया गया है।')
    }

    contactForm.reset()
    document.querySelector('#contact-id').value = ''
    document.querySelector('#contact-submit').textContent = 'संपर्क जोड़ें'
    document.querySelector('#cancel-edit').hidden = true

    await renderDirectory()
  } catch (error) {
    console.error(error)
    showMessage(contactMessage, 'संपर्क सेव नहीं हुआ। Firebase Rules जाँचें।')
  }
})

document.querySelector('#cancel-edit').addEventListener('click', () => {
  contactForm.reset()
  document.querySelector('#contact-id').value = ''
  document.querySelector('#contact-submit').textContent = 'संपर्क जोड़ें'
  document.querySelector('#cancel-edit').hidden = true
  showMessage(contactMessage, '')
})

// Admin Login
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

// Logout
document.querySelector('#logout-button').addEventListener('click', async () => {
  await signOut(auth)
})

// नया समाचार प्रकाशित करें
document.querySelector('#news-form').addEventListener('submit', async (event) => {
  event.preventDefault()

  if (!currentUser) {
    showMessage(formMessage, 'पहले Admin Login करें।')
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
    showMessage(formMessage, 'समाचार प्रकाशित नहीं हुआ। Firebase Rules जाँचें।')
  }
})

// Login स्थिति
onAuthStateChanged(auth, async (user) => {
  currentUser = user

  loginCard.hidden = Boolean(user)
  dashboard.hidden = !user

  if (user) {
    document.querySelector('#logged-in-user').textContent =
      'लॉगिन: ' + user.email

    await renderNews()
    await renderDirectory()
  } else {
    newsList.replaceChildren()
    directoryList.replaceChildren()
    document.querySelector('#news-count').textContent = '0'
    document.querySelector('#contact-count').textContent = '0'
  }
})