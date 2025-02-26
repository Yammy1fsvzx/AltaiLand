'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import LandPlotCard from '@/components/LandPlotCard'
import PlotModal from '@/components/PlotModal'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollAnimation from '@/components/ScrollAnimation'
import InlineQuiz from '@/components/InlineQuiz'
import { LandPlot } from '@/types/land-plot'
import { 
  MapPinIcon, 
  DocumentCheckIcon,
  BoltIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  ArrowRightIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'

export default function Home() {
  const [selectedPlot, setSelectedPlot] = useState<LandPlot | null>(null)
  const [latestPlots, setLatestPlots] = useState<LandPlot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLatestPlots = async () => {
      try {
        const response = await fetch('http://localhost:8000/plots?limit=3')
        if (response.ok) {
          const data = await response.json()
          // Форматируем данные перед использованием
          const formattedPlots = data.map((plot: any) => ({
            ...plot,
            id: String(plot.id), // Преобразуем в строку, так как в интерфейсе id: string
            features: Array.isArray(plot.features) ? plot.features : JSON.parse(plot.features || '[]'),
            communications: Array.isArray(plot.communications) ? plot.communications : JSON.parse(plot.communications || '[]'),
            terrain: typeof plot.terrain === 'object' ? plot.terrain : JSON.parse(plot.terrain || '{}'),
            price: Number(plot.price),
            price_per_sotka: Number(plot.price_per_sotka),
            pricePerSotka: Number(plot.price_per_sotka), // Добавляем дублирующее поле
            area: Number(plot.area),
            specified_area: Number(plot.specified_area),
            imageUrl: plot.images?.[0]?.path ? `http://localhost:8000${plot.images[0].path}` : '/images/plot-placeholder.jpg',
            coordinates: plot.coordinates ? JSON.parse(plot.coordinates) : { lat: 0, lng: 0 },
            images: (plot.images || []).map((img: any) => ({
              ...img,
              path: `http://localhost:8000${img.path}`
            }))
          }))
          setLatestPlots(formattedPlots)
        }
      } catch (error) {
        console.error('Error fetching latest plots:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLatestPlots()
  }, [])

  return (
    <>
      <Header />
        <main>
          {/* Hero Section */}
          <section className="relative min-h-[90vh] hero-background overflow-hidden">
            <div className="absolute bg-green-800 inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/20"></div>
            
            {/* Декоративные элементы */}
            <div className="absolute inset-0 bg-repeat opacity-10 "></div>
            
            <div className="relative h-full flex flex-col justify-center my-40">
              <div className="max-w-7xl mx-auto px-4 py-20">
                <ScrollAnimation>
                  <div className="max-w-4xl mx-auto text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                      Найдите свой уникальный участок в&nbsp;живописном Алтае
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 mb-8">
                      Более 50 участков для строительства коттеджных поселков, апарт-отелей, туристических баз и жилых комплексов.
                    </p>
                  </div>
                </ScrollAnimation>

                <ScrollAnimation>
                  <div className="max-w-3xl mx-auto">
                    {/* Кнопки действий */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                      <Link
                        href="/catalog"
                        className="btn-primary group text-lg py-4 px-8 flex-1 max-w-xs mx-auto sm:mx-0 justify-center items-center"
                      >
                        <span>Смотреть каталог</span>
                        <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform ml-2" />
                      </Link>
                      <Link
                        href="/contacts"
                        className="btn-secondary group text-lg py-4 px-8 flex-1 max-w-xs mx-auto sm:mx-0 border-white/20 text-white bg-white/10 hover:bg-white/20 transition-colors justify-center items-center"
                      >
                        <PhoneIcon className="w-5 h-5 mr-2" />
                        <span>Получить консультацию</span>
                      </Link>
                    </div>
                  </div>
                </ScrollAnimation>

                {/* Статистика */}
                <ScrollAnimation>
                  <div className="max-w-4xl mx-auto mt-16">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-1">10+</div>
                        <div className="text-gray-300 text-sm">Лет опыта</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-1">150+</div>
                        <div className="text-gray-300 text-sm">Проданных участков</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-1">50+</div>
                        <div className="text-gray-300 text-sm">Активных предложений</div>
                      </div>
                      
                    </div>
                  </div>
                </ScrollAnimation>
              </div>
            </div>

            {/* Декоративная волна внизу */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden">
              <svg
                className="relative block w-full h-[100px]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
              >
                <path
                  d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
                  fill="#ffffff"
                ></path>
              </svg>
            </div>
          </section>

          {/* Квиз */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <ScrollAnimation>
                <InlineQuiz />
              </ScrollAnimation>
            </div>
          </section>

          {/* Популярные предложения */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <ScrollAnimation>
                <div className="flex justify-between items-center mb-12">
                  <div>
                    <h2 className="section-title !mb-4 !text-left">Лучшие предложения</h2>
                    <p className="text-xl text-gray-600">Самые популярные участки этого месяца</p>
                  </div>
                  <Link 
                    href="/catalog"
                    className="btn-primary hidden md:inline-flex items-center gap-2 group"
                  >
                    Все участки
                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </ScrollAnimation>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                  // Скелетон загрузки
                  Array(3).fill(null).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="bg-gray-200 rounded-lg aspect-[4/3] mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))
                ) : (
                  latestPlots.map((plot) => (
                    <ScrollAnimation key={plot.id}>
                      <LandPlotCard
                        key={plot.id}
                        plot={plot}
                        onQuickView={setSelectedPlot}
                      />
                    </ScrollAnimation>
                  ))
                )}
              </div>

              <div className="text-center mt-12 md:hidden">
                <Link 
                  href="/catalog"
                  className="btn-primary inline-flex items-center gap-2 group"
                >
                  Все участки
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </section>
        </main>
      <Footer />

      {/* Modal */}
      <PlotModal
        plot={selectedPlot}
        isOpen={!!selectedPlot}
        onClose={() => setSelectedPlot(null)}
      />
    </>
  )
}
