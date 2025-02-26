'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPinIcon, ArrowsPointingOutIcon, Square2StackIcon, ChevronDoubleUpIcon, EyeIcon, TagIcon } from '@heroicons/react/24/outline'
import { LandPlot } from '@/types/land-plot'

// Словарь для отображения названий локаций
const LOCATION_NAMES: Record<string, string> = {
  'gorno-altaysk': 'Горно-Алтайск',
  'maima': 'Майма',
  'chemal': 'Чемал',
  'altayskoe': 'Алтайское',
  'belokurikha': 'Белокуриха',
  'other': 'Другие районы'
}

interface LandPlotCardProps {
  plot: LandPlot
  viewMode?: 'grid' | 'list'
  onQuickView: (plot: LandPlot) => void
}

export default function LandPlotCard({ plot, viewMode = 'grid', onQuickView }: LandPlotCardProps) {
  const formatPrice = (price: number | undefined) => {
    if (typeof price !== 'number') return '0'
    return price.toLocaleString('ru-RU')
  }

  const getStatusBadge = () => {
    switch (plot.status) {
      case 'available':
        return <span className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full">Доступен</span>
      case 'reserved':
        return <span className="absolute top-4 right-4 px-3 py-1 bg-yellow-500 text-white text-sm font-medium rounded-full">Забронирован</span>
      case 'sold':
        return <span className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full">Продан</span>
      default:
        return null
    }
  }

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Изображение как ссылка */}
          <Link 
            href={`/catalog/${plot.id}`}
            className="relative md:w-72 flex-shrink-0 block"
          >
            <div className="aspect-[4/3] md:h-full relative">
              <Image
                src={plot.images[0]?.path || '/images/plot-placeholder.jpg'}
                alt={plot.title}
                fill
                className="object-cover"
              />
              {getStatusBadge()}
            </div>
            {/* Кнопка быстрого просмотра */}
            <button
              onClick={(e) => {
                e.preventDefault() // Предотвращаем переход по ссылке
                onQuickView(plot)
              }}
              className="absolute bottom-2 right-2 bg-white/90 p-2 rounded-lg shadow-lg"
            >
              <EyeIcon className="w-5 h-5" />
            </button>
          </Link>

          {/* Контент */}
          <div className="flex-1 p-4 flex flex-col">
            {/* Локация */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <MapPinIcon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{LOCATION_NAMES[plot.location] || plot.location}</span>
            </div>

            {/* Заголовок как ссылка */}
            <Link 
              href={`/catalog/${plot.id}`}
              className="block mb-2 text-lg font-semibold text-gray-900 hover:text-primary transition-colors"
            >
              <h3 className="line-clamp-2">{plot.title}</h3>
            </Link>

            {/* Характеристики */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Square2StackIcon className="w-5 h-5 text-gray-400" />
                <span className="text-sm">{plot.area} м²</span>
              </div>
              <div className="flex items-center gap-2">
                <TagIcon className="w-5 h-5 text-gray-400" />
                <span className="text-sm truncate">{plot.land_category}</span>
              </div>
            </div>

            {/* Цена */}
            <div className="mt-auto">
              <p className="text-2xl font-bold text-primary">
                {formatPrice(plot.price)} ₽
              </p>
              <p className="text-sm text-gray-500">
                {formatPrice(plot.price_per_meter)} ₽/м²
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Grid view
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
      {/* Изображение как ссылка */}
      <Link 
        href={`/catalog/${plot.id}`}
        className="relative block"
      >
        <div className="aspect-[4/3]">
          <Image
            src={plot.images[0]?.path || '/images/plot-placeholder.jpg'}
            alt={plot.title}
            fill
            className="object-cover"
          />
        </div>
        {getStatusBadge()}
        {/* Кнопка быстрого просмотра */}
        <button
          onClick={(e) => {
            e.preventDefault() // Предотвращаем переход по ссылке
            onQuickView(plot)
          }}
          className="absolute bottom-2 right-2 bg-white/90 p-2 rounded-lg shadow-lg"
        >
          <EyeIcon className="w-5 h-5" />
        </button>
      </Link>

      {/* Контент */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
          <MapPinIcon className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{LOCATION_NAMES[plot.location] || plot.location}</span>
        </div>

        {/* Заголовок как ссылка */}
        <Link 
          href={`/catalog/${plot.id}`}
          className="block mb-2 text-lg font-semibold text-gray-900 hover:text-primary transition-colors"
        >
          <h3 className="line-clamp-2">{plot.title}</h3>
        </Link>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Square2StackIcon className="w-5 h-5 text-gray-400" />
            <span className="text-sm">{plot.area} м²</span>
          </div>
          <div className="flex items-center gap-2">
            <TagIcon className="w-5 h-5 text-gray-400" />
            <span className="text-sm truncate">{plot.land_category}</span>
          </div>
        </div>

        <div className="mt-auto">
          <p className="text-2xl font-bold text-primary">
            {formatPrice(plot.price)} ₽
          </p>
          <p className="text-sm text-gray-500">
            {formatPrice(plot.price_per_meter)} ₽/м²
          </p>
        </div>
      </div>
    </div>
  )
} 