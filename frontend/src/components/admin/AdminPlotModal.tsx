import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, PhotoIcon, MapPinIcon, GlobeAltIcon, ChevronLeftIcon, ChevronRightIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { LandPlot } from '@/types/land-plot'
import { getImageUrl } from '@/utils/image'

interface AdminPlotModalProps {
  plot: LandPlot | null
  isOpen: boolean
  onClose: () => void
}

export default function AdminPlotModal({ plot, isOpen, onClose }: AdminPlotModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!plot) return null

  console.log('Plot data in modal:', plot)

  const formatNumber = (num: number | undefined) => {
    if (num === undefined || num === null) return '0'
    return num.toLocaleString('ru-RU')
  }

  const hasImages = plot.images && plot.images.length > 0
  const totalImages = hasImages ? plot.images.length : 0

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % totalImages)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages)
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
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
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
                <div className="absolute right-0 top-0 pr-4 pt-4 z-10">
                  <button
                    type="button"
                    className="rounded-full bg-white/80 backdrop-blur-sm p-2 text-gray-400 hover:text-gray-500 focus:outline-none shadow-md"
                    onClick={onClose}
                  >
                    <span className="sr-only">Закрыть</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Галерея изображений */}
                <div className="relative aspect-[16/9] bg-gray-100">
                  {hasImages ? (
                    <>
                      <img
                        src={getImageUrl(plot.images[currentImageIndex].path)}
                        alt={`${plot.title} - изображение ${currentImageIndex + 1}`}
                        className="h-full w-full object-cover"
                      />
                      
                      {/* Кнопки навигации */}
                      {totalImages > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-colors"
                          >
                            <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-colors"
                          >
                            <ChevronRightIcon className="h-6 w-6 text-gray-700" />
                          </button>
                        </>
                      )}

                      {/* Индикатор изображений */}
                      {totalImages > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {plot.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                index === currentImageIndex
                                  ? 'bg-white w-4'
                                  : 'bg-white/60 hover:bg-white/80'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <PhotoIcon className="h-24 w-24 text-gray-300" />
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <Dialog.Title as="h3" className="text-2xl font-semibold text-gray-900 mb-2">
                      {plot.title}
                    </Dialog.Title>
                    
                    {/* Местоположение */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center text-gray-600">
                        <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <span>{plot.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <GlobeAltIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <span>{plot.region}</span>
                      </div>
                    </div>
                  </div>

                  {/* Основная информация */}
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-3">Характеристики участка</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-gray-500">Площадь:</div>
                          <div className="font-medium">{plot.area} м²</div>
                          {plot.specified_area && (
                            <div className="text-sm text-gray-500">
                              Уточненная: {plot.specified_area} м²
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Кадастровые номера:</div>
                          <div className="space-y-1">
                            {plot.cadastral_numbers.map((number, index) => (
                              <div key={index} className="font-medium">{number}</div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Категория земель:</div>
                          <div className="font-medium">{plot.land_category}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Виды разрешенного использования(ВРИ):</div>
                          <div className="font-medium">{plot.permitted_use}</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-3">Стоимость</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-gray-500">Стоимость участка:</div>
                          <div className="text-xl font-semibold text-gray-900">
                            {formatNumber(plot.price)} ₽
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Цена за сотку:</div>
                          <div className="font-medium">
                            {formatNumber(plot.price_per_meter)} ₽/м²
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Особенности и коммуникации */}
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    {plot.features && plot.features.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Особенности участка</h4>
                        <ul className="space-y-1">
                          {plot.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 mr-2 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {plot.communications && plot.communications.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Коммуникации</h4>
                        <ul className="space-y-1">
                          {plot.communications.map((comm, index) => (
                            <li key={index} className="flex items-start">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 mr-2 flex-shrink-0" />
                              <span className="text-sm">{comm}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Описание */}
                  {plot.description && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Описание</h4>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-sm whitespace-pre-line">{plot.description.text}</p>
                      </div>
                      {plot.description.attachments.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">Прикрепленные файлы</h4>
                          <div className="space-y-2">
                            {plot.description.attachments.map((file, index) => (
                              <a
                                key={index}
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                              >
                                <DocumentTextIcon className="w-5 h-5" />
                                {file.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
} 