/**
 * Site Configuration
 * Centralized configuration for company details, contact info, and social links
 * Use environment variables for sensitive or deployment-specific values
 */

export const siteConfig = {
  // Company Information
  company: {
    name: process.env.NEXT_PUBLIC_COMPANY_NAME || 'Amanah Best Credit Sdn Bhd',
    registration: process.env.NEXT_PUBLIC_COMPANY_REG || '123456-A',
    tagline: {
      en: 'Your Trusted Financial Partner in Malaysia',
      ms: 'Rakan Kewangan Terpercaya Anda di Malaysia',
    },
    description: {
      en: 'Fast and easy personal loans in Malaysia with competitive rates and trusted service',
      ms: 'Pinjaman peribadi yang cepat dan mudah di Malaysia dengan kadar kompetitif dan perkhidmatan yang dipercayai',
    },
  },

  // Contact Information
  contact: {
    phone: process.env.NEXT_PUBLIC_PHONE_NUMBER || '60142992867',
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '60142992867',
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'amanahbestcredit@gmail.com',
    support: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'amanahbestcredit@gmail.com',
  },

  // Office Address
  address: {
    street: 'Level 15, Menara ABC',
    city: 'Kuala Lumpur',
    postcode: '50450',
    state: 'Wilayah Persekutuan',
    country: 'Malaysia',
    full:
      process.env.NEXT_PUBLIC_COMPANY_ADDRESS ||
      'Level 15, Menara ABC, 123 Jalan Ampang, 50450 Kuala Lumpur, Malaysia',
    coordinates: {
      lat: 3.1569,
      lng: 101.7123,
    },
  },

  // Operating Hours
  hours: {
    weekdays: {
      en: 'Monday - Friday: 9:00 AM - 6:00 PM',
      ms: 'Isnin - Jumaat: 9:00 AM - 6:00 PM',
    },
    saturday: {
      en: 'Saturday: 9:00 AM - 1:00 PM',
      ms: 'Sabtu: 9:00 AM - 1:00 PM',
    },
    sunday: {
      en: 'Sunday: Closed',
      ms: 'Ahad: Tutup',
    },
    schema: 'Mo-Fr 09:00-18:00, Sa 09:00-13:00',
  },

  // Social Media Links
  social: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://www.facebook.com/amanahbestcredit',
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/amanahbestcredit',
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/company/amanahbestcredit',
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || 'https://twitter.com/amanahbestcredit',
  },

  // URLs
  urls: {
    base: process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
    api: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  },

  // License & Compliance
  licensing: {
    bankNegara: true,
    licenseNumber: 'ML-123456',
    registeredWith: 'Bank Negara Malaysia',
  },

  // Loan Products
  products: {
    personal: {
      minAmount: 5000,
      maxAmount: 250000,
      minRate: 2.5,
      maxRate: 12.0,
      minTenure: 12,
      maxTenure: 84,
    },
    home: {
      minAmount: 100000,
      maxAmount: 2000000,
      minRate: 3.5,
      maxRate: 6.5,
      minTenure: 60,
      maxTenure: 360,
    },
    car: {
      minAmount: 20000,
      maxAmount: 500000,
      minRate: 2.8,
      maxRate: 5.5,
      minTenure: 12,
      maxTenure: 108,
    },
    business: {
      minAmount: 50000,
      maxAmount: 1000000,
      minRate: 4.0,
      maxRate: 10.0,
      minTenure: 12,
      maxTenure: 120,
    },
  },

  // Feature Flags
  features: {
    chatbot: process.env.NEXT_PUBLIC_ENABLE_CHATBOT === 'true',
    liveChat: process.env.NEXT_PUBLIC_ENABLE_LIVE_CHAT === 'true',
    testimonials: process.env.NEXT_PUBLIC_ENABLE_TESTIMONIALS === 'true',
    blog: process.env.NEXT_PUBLIC_ENABLE_BLOG === 'true',
    calculator: process.env.NEXT_PUBLIC_ENABLE_CALCULATOR !== 'false', // default true
  },
} as const

// Helper function to format phone number for display
export function formatPhoneNumber(phone: string, includePrefix = true): string {
  // Assume Malaysian format: 60312345678 -> +60 3-1234 5678
  if (!phone) return ''

  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('60')) {
    const areaCode = cleaned.slice(2, 3) === '3' ? cleaned.slice(2, 3) : cleaned.slice(2, 4)
    const prefix = cleaned.slice(0, 2)
    const middle = cleaned.slice(2 + areaCode.length, 2 + areaCode.length + 4)
    const last = cleaned.slice(2 + areaCode.length + 4)
    return includePrefix ? `+${prefix} ${areaCode}-${middle} ${last}` : `${areaCode}-${middle} ${last}`
  }

  return phone
}

// Helper function to create WhatsApp link
export function getWhatsAppLink(message?: string, lang: 'en' | 'ms' = 'en'): string {
  const defaultMessage =
    lang === 'en'
      ? 'Hello, I would like to inquire about a loan.'
      : 'Halo, saya ingin bertanya tentang pinjaman.'

  const text = encodeURIComponent(message || defaultMessage)
  return `https://wa.me/${siteConfig.contact.whatsapp}?text=${text}`
}

// Helper function to create phone link
export function getPhoneLink(phone?: string): string {
  const number = phone || siteConfig.contact.phone
  return `tel:+${number}`
}

// Helper function to create email link
export function getEmailLink(email?: string, subject?: string, body?: string): string {
  const address = email || siteConfig.contact.email
  const params = new URLSearchParams()
  if (subject) params.set('subject', subject)
  if (body) params.set('body', body)
  const query = params.toString()
  return `mailto:${address}${query ? `?${query}` : ''}`
}

export type SiteConfig = typeof siteConfig
