import { v2 as cloudinary } from 'cloudinary'
import { getAuth } from 'firebase-admin/auth'
import { initializeApp, getApps, cert } from 'firebase-admin/app'

const firebaseApp = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      })
    })

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'केवल POST अनुरोध स्वीकार है।' })
  }

  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ error: 'पहले Admin Login करें।' })
    }

    const decoded = await getAuth(firebaseApp).verifyIdToken(token)

    if (decoded.uid !== process.env.ADMIN_UID) {
      return res.status(403).json({ error: 'Admin अनुमति नहीं है।' })
    }

    const { file, title } = req.body || {}

    if (
      typeof file !== 'string' ||
      !file.startsWith('data:image/') ||
      file.length > 7_000_000
    ) {
      return res.status(400).json({ error: 'फोटो गलत है या बहुत बड़ी है।' })
    }

    const result = await cloudinary.uploader.upload(file, {
      folder: 'gram-amirpur-gallery',
      resource_type: 'image'
    })

    return res.status(200).json({
      url: result.secure_url,
      title: typeof title === 'string' ? title.slice(0, 150) : ''
    })
  } catch (error) {
    console.error('Photo upload error:', error.message)
    return res.status(500).json({ error: 'फोटो अपलोड नहीं हो पाई।' })
  }
}