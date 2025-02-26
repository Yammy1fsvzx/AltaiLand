'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { LandPlot, PlotStatus } from '@/types/land-plot'
import LandPlotCard from '@/components/LandPlotCard'
import PlotModal from '@/components/PlotModal'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { 
  ViewColumnsIcon, 
  ListBulletIcon,
  MapIcon,
  FunnelIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import { api } from '@/utils/api'

type ViewMode = 'grid' | 'list'
type SortOption = 'price-asc' | 'price-desc' | 'area-asc' | 'area-desc'

interface Filters {
  search: string
  land_category: string
  priceMin: string
  priceMax: string
  areaMin: string
  areaMax: string
  region: string
  isNearRiver: boolean
  isNearMountains: boolean
  isNearForest: boolean
  isNearLake: boolean
  hasViewOnMountains: boolean
  status: PlotStatus | ''
}

interface FilterKey {
  [key: string]: string | boolean | number | undefined
}

const INITIAL_FILTERS: Filters = {
  search: '',
  land_category: '',
  priceMin: '',
  priceMax: '',
  areaMin: '',
  areaMax: '',
  region: '',
  isNearRiver: false,
  isNearMountains: false,
  isNearForest: false,
  isNearLake: false,
  hasViewOnMountains: false,
  status: ''
}

const PLOT_STATUSES: PlotStatus[] = ['available', 'reserved', 'sold']

export default function CatalogPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [plots, setPlots] = useState<LandPlot[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlot, setSelectedPlot] = useState<LandPlot | null>(null)
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS)
  const [showFilters, setShowFilters] = useState(false)
  const [sortOption, setSortOption] = useState<SortOption>('price-asc')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [regions, setRegions] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const ITEMS_PER_PAGE = 9

  useEffect(() => {
    // Восстанавливаем фильтры из URL при загрузке
    const urlFilters: Partial<Filters> = {}
    for (const [key, value] of searchParams.entries()) {
      const filterKey = key as keyof Filters
      if (filterKey in INITIAL_FILTERS) {
        if (filterKey === 'isNearRiver' || filterKey === 'isNearMountains' || 
            filterKey === 'isNearForest' || filterKey === 'isNearLake' || 
            filterKey === 'hasViewOnMountains') {
          urlFilters[filterKey] = value === 'true'
        } else {
          urlFilters[filterKey] = value as any
        }
      }
    }
    setFilters({ ...INITIAL_FILTERS, ...urlFilters })
    
    const urlPage = searchParams.get('page')
    if (urlPage) setPage(parseInt(urlPage))
    
    const urlSort = searchParams.get('sort')
    if (urlSort && ['price-asc', 'price-desc', 'area-asc', 'area-desc'].includes(urlSort)) {
      setSortOption(urlSort as SortOption)
    }
    
    const urlView = searchParams.get('view')
    if (urlView && ['grid', 'list'].includes(urlView)) {
      setViewMode(urlView as ViewMode)
    }
  }, [])

  // Добавляем функцию для загрузки регионов
  const fetchRegions = async () => {
    try {
      const data = await api.get('/plots/regions')
      setRegions(data)
    } catch (error) {
      console.error('Error fetching regions:', error)
    }
  }

  // Добавим функцию для загрузки категорий
  const fetchCategories = async () => {
    try {
      const data = await api.get('/plots/categories')
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  useEffect(() => {
    fetchRegions()
    fetchCategories() // Добавляем вызов
  }, [])

  const fetchPlots = async () => {
    try {
      setLoading(true)
      
      // Формируем параметры запроса
      const params = new URLSearchParams()
      params.append('skip', ((page - 1) * ITEMS_PER_PAGE).toString())
      params.append('limit', ITEMS_PER_PAGE.toString())
      
      if (filters.search) params.append('search', filters.search)
      if (filters.status) params.append('status', filters.status)
      if (filters.region) params.append('region', filters.region)
      if (filters.priceMin) params.append('price_min', filters.priceMin)
      if (filters.priceMax) params.append('price_max', filters.priceMax)
      if (filters.areaMin) params.append('area_min', filters.areaMin)
      if (filters.areaMax) params.append('area_max', filters.areaMax)
      
      // Добавляем фильтры по особенностям местности
      const terrain: any = {}
      if (filters.isNearRiver) terrain.isNearRiver = true
      if (filters.isNearMountains) terrain.isNearMountains = true
      if (filters.isNearForest) terrain.isNearForest = true
      if (filters.isNearLake) terrain.isNearLake = true
      if (filters.hasViewOnMountains) terrain.hasViewOnMountains = true
      if (Object.keys(terrain).length > 0) {
        params.append('terrain', JSON.stringify(terrain))
      }

      // Используем api утилиту вместо fetch
      const [plotsData, countData] = await Promise.all([
        api.get(`/plots?${params}`),
        api.get(`/plots/count?${params}`)
      ])
      
      // Форматируем данные
      const formattedPlots = plotsData.map((plot: any) => ({
        ...plot,
        id: String(plot.id),
        features: Array.isArray(plot.features) ? plot.features : JSON.parse(plot.features || '[]'),
        communications: Array.isArray(plot.communications) ? plot.communications : JSON.parse(plot.communications || '[]'),
        terrain: typeof plot.terrain === 'object' ? plot.terrain : JSON.parse(plot.terrain || '{}'),
        price: Number(plot.price),
        price_per_meter: Number(plot.price_per_meter), // Изменили с price_per_sotka
        area: Number(plot.area),
        specified_area: Number(plot.specified_area),
        imageUrl: plot.images?.[0]?.path ? `${process.env.NEXT_PUBLIC_API_URL}${plot.images[0].path}` : '/images/plot-placeholder.jpg',
        images: (plot.images || []).map((img: any) => ({
          ...img,
          path: `${process.env.NEXT_PUBLIC_API_URL}${img.path}`
        }))
      }))
      
      setPlots(formattedPlots)
      setTotalPages(Math.ceil(countData.total / ITEMS_PER_PAGE))
    } catch (error) {
      console.error('Error fetching plots:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlots()
  }, [page, filters, sortOption])

  const handleFilterChange = (name: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [name]: value }))
    setPage(1) // Сбрасываем страницу при изменении фильтров
    
    // Обновляем URL
    const newParams = new URLSearchParams(searchParams.toString())
    if (value) {
      newParams.set(name, value.toString())
    } else {
      newParams.delete(name)
    }
    newParams.set('page', '1')
    router.push(`/catalog?${newParams.toString()}`)
  }

  const clearFilters = () => {
    setFilters(INITIAL_FILTERS)
    setPage(1)
    router.push('/catalog')
  }

  const sortPlots = (plots: LandPlot[], sortOption: SortOption) => {
    return [...plots].sort((a, b) => {
      switch (sortOption) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'area-asc':
          return a.area - b.area
        case 'area-desc':
          return b.area - a.area
        default:
          return 0
      }
    })
  }

  const handleQuickView = (plot: LandPlot) => {
    setSelectedPlot(plot)
  }

  const SORT_OPTIONS = {
    'price-asc': 'Цена (по возрастанию)',
    'price-desc': 'Цена (по убыванию)',
    'area-asc': 'Площадь, м² (по возрастанию)',
    'area-desc': 'Площадь, м² (по убыванию)'
  }

  const LOCATION_NAMES: Record<string, string> = {
    'gorno-altaysk': 'г. Горно-Алтайск',
    'maima': 'с. Майма',
    'chemal': 'с. Чемал',
    'altayskoe': 'с. Алтайское',
    'belokurikha': 'г. Белокуриха',
    'other': 'Другие населенные пункты'
  }

  const getFilterLabel = (key: string, value: string | boolean | number | undefined) => {
    switch (key) {
      case 'land_category':
        return value as string
      case 'status':
        return value === 'available' ? 'Доступен' : 
               value === 'reserved' ? 'Забронирован' : 
               'Продан'
      case 'region':
        return LOCATION_NAMES[value as string] || value as string
      default:
        return value?.toString() || ''
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-20" style={{paddingTop: '4rem'}}>
        {/* Hero секция */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Каталог земельных участков</h1>
            <p className="text-lg text-gray-600">Найдено {plots.length} вариантов для покупки</p>
          </div>
        </div>

        {/* Основной контент */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Панель управления */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Фильтры и сортировка */}
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <FunnelIcon className="w-5 h-5" />
                  <span>Фильтры</span>
                  {Object.keys(filters).some(key => filters[key as keyof Filters]) && (
                    <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                      Активны
                    </span>
                  )}
                </button>

                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="form-select py-2 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-primary/20"
                >
                  {Object.entries(SORT_OPTIONS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Вид отображения */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-white shadow text-primary' 
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                  title="Плитка"
                >
                  <ViewColumnsIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'list' 
                      ? 'bg-white shadow text-primary' 
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                  title="Список"
                >
                  <ListBulletIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Активные фильтры */}
            {Object.keys(filters).some(key => filters[key as keyof Filters]) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {Object.entries(filters).map(([key, value]) => {
                  if (!value) return null;
                  return (
                    <button
                      key={key}
                      onClick={() => handleFilterChange(key as keyof Filters, '')}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
                    >
                      <span>{getFilterLabel(key, value)}</span>
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  );
                })}
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:text-primary-dark"
                >
                  Сбросить все
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Боковая панель с фильтрами */}
            <div className={`md:w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
              <div className="bg-white rounded-xl shadow-sm p-6 filters-sticky">
                {/* Поиск */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Поиск по названию..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="form-input w-full"
                  />
                </div>

                {/* Категория земель */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Категория земель
                  </label>
                  <select
                    value={filters.land_category}
                    onChange={(e) => handleFilterChange('land_category', e.target.value)}
                    className="form-input w-full"
                  >
                    <option value="">Все категории</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Статус */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Статус
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="form-input w-full"
                  >
                    <option value="">Любой статус</option>
                    {PLOT_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status === 'available' ? 'Доступен' : 
                         status === 'reserved' ? 'Забронирован' : 
                         'Продан'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Район */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Район
                  </label>
                  <select
                    value={filters.region}
                    onChange={(e) => handleFilterChange('region', e.target.value)}
                    className="form-input w-full"
                  >
                    <option value="">Все районы</option>
                    {regions.map((region) => (
                      <option key={region} value={region}>
                        {LOCATION_NAMES[region] || region}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Цена */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Цена, ₽
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="От"
                      value={filters.priceMin}
                      onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                      className="form-input w-1/2"
                    />
                    <input
                      type="number"
                      placeholder="До"
                      value={filters.priceMax}
                      onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                      className="form-input w-1/2"
                    />
                  </div>
                </div>

                {/* Площадь */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Площадь, м²
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="От"
                      value={filters.areaMin}
                      onChange={(e) => handleFilterChange('areaMin', e.target.value)}
                      className="form-input w-1/2"
                    />
                    <input
                      type="number"
                      placeholder="До"
                      value={filters.areaMax}
                      onChange={(e) => handleFilterChange('areaMax', e.target.value)}
                      className="form-input w-1/2"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Список участков */}
            <div className="flex-1">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array(6).fill(null).map((_, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                      <div className="aspect-[16/9] bg-gray-200" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                        <div className="h-6 bg-gray-200 rounded w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : viewMode === 'map' ? (
                <div className="bg-white rounded-lg shadow-sm p-6 min-h-[500px] flex items-center justify-center">
                  <p className="text-gray-500">Карта будет добавлена позже</p>
                </div>
              ) : plots.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                  <div className="max-w-md mx-auto">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Участки не найдены
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Попробуйте изменить параметры поиска или сбросить фильтры
                    </p>
                    <button
                      onClick={clearFilters}
                      className="btn-primary"
                    >
                      Сбросить фильтры
                    </button>
                  </div>
                </div>
              ) : (
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2' 
                    : 'grid-cols-1'
                }`}>
                  {sortPlots(plots, sortOption).map((plot) => (
                    <LandPlotCard
                      key={plot.id}
                      plot={plot}
                      viewMode={viewMode}
                      onQuickView={() => handleQuickView(plot)}
                    />
                  ))}
                </div>
              )}

              {/* Пагинация */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="inline-flex items-center gap-2 bg-white rounded-lg shadow-sm p-1">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                      <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-10 h-10 rounded-md ${
                          p === page
                            ? 'bg-primary text-white'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Модальное окно быстрого просмотра */}
      <PlotModal
        plot={selectedPlot}
        isOpen={!!selectedPlot}
        onClose={() => setSelectedPlot(null)}
      />
    </>
  )
} 