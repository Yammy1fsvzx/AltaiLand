'use client'

import Header from '@/components/Header'
import ScrollAnimation from '@/components/ScrollAnimation'
import Image from 'next/image'
import Footer from '@/components/Footer'

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="min-h-[60vh] bg-gradient-to-b from-primary/5 via-primary/5 to-white flex items-center">
          <div className="max-w-7xl mx-auto px-4 py-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <ScrollAnimation>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                    Мы создаем возможности для вашего будущего
                  </h1>
                  <p className="text-xl text-gray-600 mb-8">
                    С 2014 года мы помогаем нашим клиентам найти идеальные земельные участки в живописных районах Алтая для строительства домов их мечты
                  </p>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-primary/5 text-center group hover:shadow-lg transition-all">
                      <div className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">10+</div>
                      <div className="text-gray-600">Лет опыта</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-primary/5 text-center group hover:shadow-lg transition-all">
                      <div className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">150+</div>
                      <div className="text-gray-600">Проданных участков</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-primary/5 text-center group hover:shadow-lg transition-all">
                      <div className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">98%</div>
                      <div className="text-gray-600">Довольных клиентов</div>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
              <ScrollAnimation>
                <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src="https://picsum.photos/seed/about1/800/1000"
                    alt="О компании"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* Миссия и ценности */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <ScrollAnimation>
              <div className="max-w-3xl mx-auto text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Наша миссия и ценности
                </h2>
                <div className="w-20 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
                <p className="text-xl text-gray-600">
                  Мы стремимся сделать процесс выбора и покупки земельного участка максимально простым и прозрачным, 
                  предоставляя нашим клиентам только проверенные варианты и полное юридическое сопровождение
                </p>
              </div>
            </ScrollAnimation>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ScrollAnimation>
                <div className="bg-white p-8 rounded-xl shadow-sm border border-primary/5 group hover:shadow-lg transition-all">
                  <div className="w-14 h-14 bg-primary/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Надежность</h3>
                  <p className="text-gray-600">
                    Все наши участки проходят тщательную юридическую проверку. 
                    Мы гарантируем чистоту сделки и берем на себя все риски.
                  </p>
                </div>
              </ScrollAnimation>

              <ScrollAnimation>
                <div className="bg-white p-8 rounded-xl shadow-sm border border-primary/5 group hover:shadow-lg transition-all">
                  <div className="w-14 h-14 bg-primary/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Индивидуальный подход</h3>
                  <p className="text-gray-600">
                    Мы внимательно изучаем потребности каждого клиента и предлагаем только те варианты, 
                    которые полностью соответствуют его требованиям.
                  </p>
                </div>
              </ScrollAnimation>

              <ScrollAnimation>
                <div className="bg-white p-8 rounded-xl shadow-sm border border-primary/5 group hover:shadow-lg transition-all">
                  <div className="w-14 h-14 bg-primary/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Эффективность</h3>
                  <p className="text-gray-600">
                    Благодаря отлаженным процессам и профессиональной команде, 
                    мы проводим сделки в максимально короткие сроки.
                  </p>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* Наша команда */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <ScrollAnimation>
              <div className="max-w-3xl mx-auto text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Познакомьтесь с нашей командой
                </h2>
                <div className="w-20 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
                <p className="text-xl text-gray-600">
                  Наши специалисты имеют многолетний опыт работы на рынке недвижимости 
                  и готовы помочь вам с выбором идеального участка
                </p>
              </div>
            </ScrollAnimation>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  name: 'Александр Петров',
                  position: 'Генеральный директор',
                  experience: '15 лет в сфере недвижимости'
                },
                {
                  name: 'Елена Иванова',
                  position: 'Главный юрист',
                  experience: '12 лет юридической практики'
                },
                {
                  name: 'Дмитрий Сидоров',
                  position: 'Ведущий специалист',
                  experience: '8 лет работы с земельными участками'
                },
                {
                  name: 'Мария Козлова',
                  position: 'Менеджер по работе с клиентами',
                  experience: '6 лет в продажах недвижимости'
                }
              ].map((member, index) => (
                <ScrollAnimation key={index}>
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm group hover:shadow-lg transition-all">
                    <div className="relative h-64">
                      <Image
                        src={`https://picsum.photos/seed/team${index + 1}/400/400`}
                        alt={member.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-xl mb-1 text-gray-900">{member.name}</h3>
                      <p className="text-primary font-medium mb-2">{member.position}</p>
                      <p className="text-sm text-gray-600">{member.experience}</p>
                    </div>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>

        {/* Отзывы */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <ScrollAnimation>
              <div className="max-w-3xl mx-auto text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Что говорят наши клиенты
                </h2>
                <div className="w-20 h-1 bg-primary mx-auto mb-6 rounded-full"></div>
                <p className="text-xl text-gray-600">
                  Мы гордимся тем, что помогли сотням семей найти их идеальный участок
                </p>
              </div>
            </ScrollAnimation>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Петр Николаев',
                  date: '2 месяца назад',
                  text: 'Очень доволен работой компании. Быстро нашли подходящий участок, помогли с оформлением документов. Все прошло гладко и профессионально.'
                },
                {
                  name: 'Анна Соколова',
                  date: '1 месяц назад',
                  text: 'Спасибо команде за помощь в выборе участка! Особенно порадовало внимательное отношение к нашим пожеланиям и оперативность в решении всех вопросов.'
                },
                {
                  name: 'Игорь Медведев',
                  date: '3 месяца назад',
                  text: 'Рекомендую эту компанию всем, кто ищет участок в Алтае. Профессиональный подход, честные цены и отличный сервис.'
                }
              ].map((review, index) => (
                <ScrollAnimation key={index}>
                  <div className="bg-white p-8 rounded-xl shadow-sm border border-primary/5 group hover:shadow-lg transition-all">
                    <div className="flex items-center mb-6">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                        <Image
                          src={`https://picsum.photos/seed/review${index + 1}/100/100`}
                          alt={review.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{review.name}</h4>
                        <p className="text-gray-500 text-sm">{review.date}</p>
                      </div>
                    </div>
                    <div className="relative">
                      <svg className="absolute -top-2 -left-2 w-8 h-8 text-primary/10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                      <p className="text-gray-600 relative z-10">
                        {review.text}
                      </p>
                    </div>
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
} 