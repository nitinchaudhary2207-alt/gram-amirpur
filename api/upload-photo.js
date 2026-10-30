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

async function verifyAdmin(req) {
  const token = req.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    throw new Error('UNAUTHORIZED')
  }

  const decoded = await getAuth(firebaseApp).verifyIdToken(token)

  if (decoded.uid !== process.env.ADMIN_UID) {
    throw new Error('FORBIDDEN')
  }

  return decoded
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'केवल POST अनुरोध स्वीकार है।'
    })
  }

  try {
    await verifyAdmin(req)

    const { action, file, title, publicId } = req.body || {}

    // फोटो डिलीट करें
    if (action === 'delete') {
      if (
        typeof publicId !== 'string' ||
        !publicId.startsWith('gram-amirpur-gallery/')
      ) {
        return res.status(400).json({
          error: 'फोटो की ID सही नहीं है।'
        })
      }

      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'image',
        invalidate: true
      })

      if (result.result !== 'ok' && result.result !== 'not found') {
        return res.status(500).json({
          error: 'Cloudinary से फोटो नहीं हट पाई।'
        })
      }

      return res.status(200).json({
        success: true,
        message: 'फोटो Cloudinary से हटा दी गई।'
      })
    }

    // नई फोटो अपलोड करें
    if (
      typeof file !== 'string' ||
      !file.startsWith('data:image/') ||
      file.length > 7_000_000
    ) {
      return res.status(400).json({
        error: 'फोटो गलत है या बहुत बड़ी है।'
      })
    }

    const result = await cloudinary.uploader.upload(file, {
      folder: 'gram-amirpur-gallery',
      resource_type: 'image'
    })

    return res.status(200).json({
      url: result.secure_url,
      publicId: result.public_id,
      title: typeof title === 'string' ? title.trim().slice(0, 150) : ''
    })
  } catch (error) {
    console.error('Photo API error:', error.message)

    if (error.message === 'UNAUTHORIZED') {
      return res.status(401).json({
        error: 'पहले Admin Login करें।'
      })
    }

    if (error.message === 'FORBIDDEN') {
      return res.status(403).json({
        error: 'Admin अनुमति नहीं है।'
      })
    }

    return res.status(500).json({
      error: 'फोटो पर कार्रवाई नहीं हो पाई।'
    })
  }
}