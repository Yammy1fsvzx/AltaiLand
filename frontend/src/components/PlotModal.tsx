'use client'

import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { LandPlot } from '@/types/land-plot'
import { 
  XMarkIcon,
  MapPinIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  BoltIcon,
  CheckBadgeIcon,
  Square2StackIcon,
  GlobeAltIcon,
  ArrowRightIcon,
  PhoneIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'
import { api } from '@/utils/api'
import { getImageUrl } from '@/utils/image'

// Словарь для отображения названий локаций
const LOCATION_NAMES: Record<string, string> = {
  'gorno-altaysk': 'Горно-Алтайск',
  'maima': 'Майма',
  'chemal': 'Чемал',
  'altayskoe': 'Алтайское',
  'belokurikha': 'Белокуриха',
  'other': 'Другие районы'
}

interface PlotModalProps {
  plot: LandPlot | null
  isOpen: boolean
  onClose: () => void
}

export default function PlotModal({ plot, isOpen, onClose }: PlotModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [contactInfo, setContactInfo] = useState<any>(null)
  const [contacts, setContacts] = useState<any>(null)

  const formatPrice = (price: number | undefined) => {
    if (typeof price !== 'number') return '0'
    return price.toLocaleString('ru-RU')
  }

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await fetch('http://localhost:8000/contacts')
        if (response.ok) {
          const data = await response.json()
          setContactInfo(data)
        }
      } catch (error) {
        console.error('Error fetching contact info:', error)
      }
    }

    const fetchContacts = async () => {
      try {
        const data = await api.get('/contacts')
        setContacts(data)
      } catch (error) {
        console.error('Ошибка при загрузке контактов:', error)
      }
    }

    if (isOpen) {
      fetchContacts()
    }

    fetchContactInfo()
  }, [isOpen])

  if (!plot) return null

  const allImages = plot.images.map(img => img.path)

  // Добавим стили для галереи
  const galleryStyles = {
    height: '500px', // Увеличим высоту галереи
    buttonClasses: "absolute top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg transition-all hover:scale-110 focus:ring-2 focus:ring-primary/20 backdrop-blur-sm",
    paginationClasses: "absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2"
  };

  // Функция для скачивания файла
  const downloadFile = async (url: string, filename: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Ошибка при скачивании файла:', error);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                <div className="relative">
                  {/* Галерея */}
                  <div className="relative h-[500px] group">
                    <Swiper
                      modules={[Navigation, Pagination]}
                      navigation={{
                        prevEl: '.swiper-button-prev',
                        nextEl: '.swiper-button-next',
                      }}
                      pagination={{
                        clickable: true,
                        el: '.swiper-pagination',
                        bulletClass: 'w-2 h-2 rounded-full bg-white/50 transition-all cursor-pointer hover:bg-white',
                        bulletActiveClass: 'w-3 h-3 bg-white',
                      }}
                      onSlideChange={(swiper) => setCurrentImageIndex(swiper.activeIndex)}
                      className="h-full rounded-t-2xl overflow-hidden"
                    >
                      {allImages.map((image, index) => (
                        <SwiperSlide key={index}>
                          <div className="relative h-full bg-gray-100">
                            <img
                              src={getImageUrl(image)}
                              alt={`${plot.title} - фото ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                    
                    {/* Обновляем стили кнопок навигации */}
                    <button 
                      className="swiper-button-prev !w-10 !h-10 !mt-0 hidden group-hover:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white items-center justify-center rounded-full shadow-lg transition-all hover:scale-110 focus:ring-2 focus:ring-primary/20 backdrop-blur-sm after:!content-['']"
                    >
                      <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
                    </button>
                    <button 
                      className="swiper-button-next !w-10 !h-10 !mt-0 hidden group-hover:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white items-center justify-center rounded-full shadow-lg transition-all hover:scale-110 focus:ring-2 focus:ring-primary/20 backdrop-blur-sm after:!content-['']"
                    >
                      <ChevronRightIcon className="w-6 h-6 text-gray-800" />
                    </button>

                    {/* Счетчик изображений */}
                    <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
                      {currentImageIndex + 1} / {allImages.length}
                    </div>

                    {/* Улучшенная пагинация */}
                    <div className="swiper-pagination flex gap-2 justify-center" />
                  </div>

                  {/* Кнопка закрытия */}
                  <button
                    onClick={onClose}
                    className="absolute right-4 top-4 z-10 bg-white/80 hover:bg-white p-2 rounded-full 
                             shadow-lg transition-all hover:scale-110 hover:rotate-90 focus:ring-2 focus:ring-primary/20"
                  >
                    <XMarkIcon className="w-6 h-6 text-primary" />
                  </button>

                  {/* Контент */}
                  <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Основная информация */}
                      <div className="lg:col-span-2 space-y-6">
                        {/* Заголовок и локация */}
                        <div className="border-b pb-4">
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <MapPinIcon className="w-5 h-5 text-primary/60" />
                            <span className="text-lg">{LOCATION_NAMES[plot.location] || plot.location}, {plot.region}</span>
                          </div>
                          <h2 className="text-3xl font-bold text-gray-900">{plot.title}</h2>
                        </div>

                        {/* Основные характеристики */}
                        <div className="grid grid-cols-2 gap-4 py-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500 mb-1">Площадь участка</div>
                            <div className="text-lg font-medium">{plot.area} м²</div>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500 mb-1">Стоимость за м²</div>
                            <div className="text-lg font-medium">{formatPrice(plot.price_per_meter)} ₽</div>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500 mb-1">Категория земли</div>
                            <div className="text-lg font-medium">{plot.land_category}</div>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500 mb-1">Статус участка</div>
                            <div className={`text-lg font-medium ${
                              plot.status === 'available' ? 'text-green-600' :
                              plot.status === 'reserved' ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {plot.status === 'available' ? 'Свободен' :
                               plot.status === 'reserved' ? 'Забронирован' : 'Продан'}
                            </div>
                          </div>
                        </div>

                        {/* Кадастровые номера */}
                        {plot.cadastral_numbers.length > 0 && (
                          <div className="border-t pt-4">
                            <h3 className="text-lg font-semibold mb-3">Кадастровые номера</h3>
                            <div className="space-y-2">
                              {plot.cadastral_numbers.map((number, index) => (
                                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                  <span className="font-medium">{number}</span>
                                  <a 
                                    href={`https://pkk.rosreestr.ru/#/search/${number}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:text-primary-dark text-sm font-medium inline-flex items-center gap-1"
                                  >
                                    Смотреть на карте
                                    <ArrowRightIcon className="w-4 h-4" />
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Описание */}
                        {plot.description && (
                          <div className="border-t pt-4">
                            <h3 className="text-lg font-semibold mb-3">Описание участка</h3>
                            <p className="text-gray-600 whitespace-pre-line">{plot.description.text}</p>
                            
                            {/* Прикрепленные файлы */}
                            {plot.description.attachments.length > 0 && (
                              <div className="mt-4 space-y-2">
                                <h4 className="text-sm font-medium text-gray-500">Документы</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {plot.description.attachments.map((file, index) => (
                                    <button
                                      key={index}
                                      onClick={() => downloadFile(file.url, file.name)}
                                      className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
                                    >
                                      <DocumentTextIcon className="w-5 h-5 text-primary" />
                                      <span className="text-sm text-gray-600 truncate">{file.name}</span>
                                      <ArrowDownTrayIcon className="w-4 h-4 ml-auto text-gray-400" />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Коммуникации и особенности */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t pt-4">
                          {/* Коммуникации */}
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Коммуникации</h3>
                            <ul className="space-y-2">
                              {plot.communications.map((comm, index) => (
                                <li key={index} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                                  <BoltIcon className="w-5 h-5 text-primary" />
                                  <span className="text-gray-600">{comm}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Особенности */}
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Особенности</h3>
                            <ul className="space-y-2">
                              {plot.features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                                  <CheckBadgeIcon className="w-5 h-5 text-primary" />
                                  <span className="text-gray-600">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Сайдбар с ценой и контактами */}
                      <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm sticky top-4">
                          <div className="mb-6">
                            <p className="text-4xl font-bold text-primary mb-2">
                              {formatPrice(plot.price)} ₽
                            </p>
                            <p className="text-gray-600">
                              {formatPrice(plot.price_per_meter)} ₽ за м²
                            </p>
                          </div>

                          <div className="space-y-4">
                            <Link
                              href={`/catalog/${plot.id}`}
                              className="btn-primary w-full justify-center"
                              onClick={onClose}
                            >
                              Подробнее об участке
                            </Link>
                            {contactInfo && (
                              <>
                                <a
                                  href={`tel:${contactInfo.phone}`}
                                  className="btn-primary w-full flex items-center justify-center gap-2"
                                >
                                  <PhoneIcon className="w-5 h-5" />
                                  <span>{contactInfo.phone}</span>
                                </a>
                                <div className="grid grid-cols-2 gap-4">
                                  {contactInfo.social_links.whatsapp.enabled && (
                                    <a
                                      href={`https://wa.me/${contactInfo.social_links.whatsapp.username}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="btn-secondary flex items-center justify-center gap-2 py-3"
                                    >
                                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                      </svg>
                                      <span>WhatsApp</span>
                                    </a>
                                  )}
                                  {contactInfo.social_links.telegram.enabled && (
                                    <a
                                      href={`https://t.me/${contactInfo.social_links.telegram.username}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="btn-secondary flex items-center justify-center gap-2 py-3"
                                    >
                                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.347.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                                      </svg>
                                      <span>Telegram</span>
                                    </a>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
} 