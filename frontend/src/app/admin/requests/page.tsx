'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { toast } from 'react-hot-toast'
import { formatPhoneNumber } from '@/utils/formatters'

interface Request {
  id: number
  type: 'quiz' | 'contact_form' | 'callback'
  name: string
  phone: string
  email?: string
  message?: string
  answers?: Record<string, string>
  promo_code?: string
  status: string
  created_at: string
  updated_at: string
  notes?: string
}

const REQUEST_TYPES = {
  quiz: 'Квиз',
  contact_form: 'Контактная форма',
  callback: 'Обратный звонок'
}

const REQUEST_STATUSES = {
  new: 'Новая',
  processing: 'В обработке',
  completed: 'Завершена',
  rejected: 'Отклонена'
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  useEffect(() => {
    fetchRequests()
  }, [statusFilter, typeFilter])

  const fetchRequests = async () => {
    try {
      let url = 'http://localhost:8000/admin/requests'
      const params = new URLSearchParams()
      
      if (statusFilter) params.append('status', statusFilter)
      if (typeFilter) params.append('type', typeFilter)
      
      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setRequests(data)
      }
    } catch (error) {
      console.error('Error fetching requests:', error)
      toast.error('Ошибка при загрузке заявок')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (requestId: number, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:8000/admin/requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus,
          notes: selectedRequest?.notes
        })
      })

      if (response.ok) {
        toast.success('Статус заявки обновлен')
        fetchRequests()
        setSelectedRequest(null)
      }
    } catch (error) {
      console.error('Error updating request:', error)
      toast.error('Ошибка при обновлении заявки')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <AdminLayout title="Заявки">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Заявки">
      {/* Фильтры */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тип заявки
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="form-input"
            >
              <option value="">Все типы</option>
              {Object.entries(REQUEST_TYPES).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Статус
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-input"
            >
              <option value="">Все статусы</option>
              {Object.entries(REQUEST_STATUSES).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Список заявок */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Тип
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Имя
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Контакты
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(request.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {REQUEST_TYPES[request.type]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <a href={`tel:${request.phone}`} className="text-primary hover:text-primary-dark">
                        {formatPhoneNumber(request.phone)}
                      </a>
                    </div>
                    {request.email && (
                      <div>
                        <a href={`mailto:${request.email}`} className="text-primary hover:text-primary-dark">
                          {request.email}
                        </a>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      request.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : request.status === 'processing'
                        ? 'bg-blue-100 text-blue-800'
                        : request.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {REQUEST_STATUSES[request.status as keyof typeof REQUEST_STATUSES]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="text-primary hover:text-primary-dark"
                    >
                      Подробнее
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Модальное окно с деталями заявки */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">
                  Заявка #{selectedRequest.id}
                </h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Закрыть</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500">Тип заявки</div>
                    <div className="mt-1">{REQUEST_TYPES[selectedRequest.type]}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Дата создания</div>
                    <div className="mt-1">{formatDate(selectedRequest.created_at)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Имя</div>
                    <div className="mt-1">{selectedRequest.name}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">Телефон</div>
                    <div className="mt-1">
                      <a href={`tel:${selectedRequest.phone}`} className="text-primary hover:text-primary-dark">
                        {formatPhoneNumber(selectedRequest.phone)}
                      </a>
                    </div>
                  </div>
                  {selectedRequest.email && (
                    <div className="col-span-2">
                      <div className="text-sm font-medium text-gray-500">Email</div>
                      <div className="mt-1">
                        <a href={`mailto:${selectedRequest.email}`} className="text-primary hover:text-primary-dark">
                          {selectedRequest.email}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {selectedRequest.message && (
                  <div>
                    <div className="text-sm font-medium text-gray-500">Сообщение</div>
                    <div className="mt-1 whitespace-pre-wrap">{selectedRequest.message}</div>
                  </div>
                )}

                {selectedRequest.answers && (
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-2">Ответы на вопросы</div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      {Object.entries(selectedRequest.answers).map(([question, answer]) => (
                        <div key={question} className="mb-2 last:mb-0">
                          <div className="font-medium">{question}</div>
                          <div className="text-gray-600">{answer}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedRequest.promo_code && (
                  <div>
                    <div className="text-sm font-medium text-gray-500">Промокод</div>
                    <div className="mt-1 font-mono bg-gray-50 px-2 py-1 rounded">
                      {selectedRequest.promo_code}
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-sm font-medium text-gray-500 mb-2">Заметки</div>
                  <textarea
                    value={selectedRequest.notes || ''}
                    onChange={(e) => setSelectedRequest({
                      ...selectedRequest,
                      notes: e.target.value
                    })}
                    className="form-input h-24"
                    placeholder="Добавьте заметки к заявке..."
                  />
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-500 mb-2">Статус</div>
                  <select
                    value={selectedRequest.status}
                    onChange={(e) => handleStatusChange(selectedRequest.id, e.target.value)}
                    className="form-input"
                  >
                    {Object.entries(REQUEST_STATUSES).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="btn-secondary"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
} 