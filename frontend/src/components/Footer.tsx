'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatPhoneNumber } from '@/utils/formatters'
import { api } from '@/utils/api'

interface WorkHours {
  monday_friday: string
  saturday_sunday: string
}

interface ContactInfo {
  phone: string
  email: string
  work_hours: WorkHours
}

export default function Footer() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null)

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

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="relative w-10 h-10">
                <Image
                  src="/images/logo.svg"
                  alt="Логотип"
                  fill
                  className="object-contain brightness-0 invert"
                />
              </div>
              <span className="font-bold text-xl">
                ЗемлиАлтая
              </span>
            </Link>
            <p className="text-gray-400">
              Мы помогаем нашим клиентам найти идеальные земельные участки для строительства домов их мечты в живописных районах Алтая.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="text-gray-400 hover:text-white transition-colors">
                  Каталог участков
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  О компании
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="text-gray-400 hover:text-white transition-colors">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Контакты</h3>
            <ul className="space-y-2">
              <li>
                <a href={`tel:${contactInfo?.phone}`} className="text-gray-400 hover:text-white transition-colors">
                  {contactInfo?.phone ? formatPhoneNumber(contactInfo.phone) : ''}
                </a>
              </li>
              <li>
                <a href={`mailto:${contactInfo?.email}`} className="text-gray-400 hover:text-white transition-colors">
                  {contactInfo?.email}
                </a>
              </li>
              <li className="text-gray-400">
                Режим работы:<br />
                Пн-Пт: {contactInfo?.work_hours.monday_friday}<br />
                Сб-Вс: {contactInfo?.work_hours.saturday_sunday}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 ЗемлиАлтая. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  )
} 