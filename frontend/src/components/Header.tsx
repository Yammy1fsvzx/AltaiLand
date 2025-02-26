'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { 
  Bars3Icon, 
  XMarkIcon, 
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'
import { formatPhoneNumber } from '@/utils/formatters'
import { api } from '@/utils/api'

interface ContactInfo {
  phone: string
  email: string
  social_links: {
    whatsapp: {
      enabled: boolean
      username: string
    }
    telegram: {
      enabled: boolean
      username: string
    }
    vk: {
      enabled: boolean
      username: string
    }
  }
}

const NAV_LINKS = [
  { name: 'Главная', href: '/' },
  { name: 'Каталог', href: '/catalog' },
  { name: 'О нас', href: '/about' },
  { name: 'Контакты', href: '/contacts' }
]

const CONTACT_LINKS = (contactInfo: ContactInfo | null) => [
  {
    name: 'Телефон',
    href: `tel:${contactInfo?.phone || ''}`,
    icon: PhoneIcon,
    text: contactInfo?.phone ? formatPhoneNumber(contactInfo.phone) : ''
  },
  ...(contactInfo?.social_links.whatsapp.enabled ? [{
    name: 'WhatsApp',
    href: `https://wa.me/7${contactInfo.social_links.whatsapp.username}`,
    icon: () => (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
    ),
    text: 'Написать в WhatsApp'
  }] : []),
  ...(contactInfo?.social_links.telegram.enabled ? [{
    name: 'Telegram',
    href: `https://t.me/${contactInfo.social_links.telegram.username}`,
    icon: () => (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
    text: 'Написать в Telegram'
  }] : [])
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await api.get('/contacts')
        setContactInfo(data)
      } catch (error) {
        console.error('Ошибка при загрузке контактов:', error)
      }
    }

    fetchContacts()
  }, [])

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <header className="fixed w-full z-50 bg-white shadow-sm py-3">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex items-center justify-between">
          {/* Логотип */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-10 h-10">
              <Image
                src="/images/logo.svg"
                alt="Логотип"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-bold text-xl text-green-800">
                ЗемлиАлтая
            </span>
          </Link>

          {/* Десктопное меню */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Навигация */}
            <div className="flex items-center space-x-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium text-green-800 hover:text-green-900 transition-colors ${
                    isActive(link.href) ? 'font-semibold' : ''
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Разделитель */}
            <div className="h-6 w-px bg-green-100"></div>

            {/* Контакты */}
            <div className="flex items-center space-x-2">
              {CONTACT_LINKS(contactInfo).map((link) => {
                const Icon = link.icon
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target={link.name !== 'Телефон' ? '_blank' : undefined}
                    rel={link.name !== 'Телефон' ? 'noopener noreferrer' : undefined}
                    className={`group flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                      link.name === 'Телефон' 
                        ? 'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow' 
                        : 'text-green-800 hover:text-green-900 hover:bg-green-50'
                    }`}
                    title={link.text}
                  >
                    <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                    {link.name === 'Телефон' && (
                      <span className="hidden lg:inline text-sm font-medium">{link.text}</span>
                    )}
                  </a>
                )
              })}
            </div>
          </div>

          {/* Мобильная кнопка меню */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-green-50 text-green-800"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </nav>

        {/* Мобильное меню */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4">
            <nav className="flex flex-col space-y-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-green-800 hover:text-green-900 hover:bg-green-50 ${
                    isActive(link.href) ? 'font-semibold bg-green-50' : ''
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {CONTACT_LINKS(contactInfo).map((link) => {
                const Icon = link.icon
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target={link.name !== 'Телефон' ? '_blank' : undefined}
                    rel={link.name !== 'Телефон' ? 'noopener noreferrer' : undefined}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all ${
                      link.name === 'Телефон'
                        ? 'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow'
                        : 'bg-green-50 hover:bg-green-100 text-green-800'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{link.name}</span>
                  </a>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  )
} 