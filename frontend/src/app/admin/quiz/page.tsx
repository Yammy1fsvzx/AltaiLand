'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function QuizQuestionsPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null)
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: [''],
    order: 0,
    is_active: true
  })

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://localhost:8000/quiz/questions')
      if (response.ok) {
        const data = await response.json()
        setQuestions(data)
      }
    } catch (error) {
      console.error('Error fetching questions:', error)
      toast.error('Ошибка при загрузке вопросов')
    } finally {
      setLoading(false)
    }
  }

  const handleAddOption = () => {
    if (editingQuestion) {
      setEditingQuestion({
        ...editingQuestion,
        options: [...editingQuestion.options, '']
      })
    } else {
      setNewQuestion({
        ...newQuestion,
        options: [...newQuestion.options, '']
      })
    }
  }

  const handleRemoveOption = (index: number) => {
    if (editingQuestion) {
      const newOptions = editingQuestion.options.filter((_, i) => i !== index)
      setEditingQuestion({
        ...editingQuestion,
        options: newOptions
      })
    } else {
      const newOptions = newQuestion.options.filter((_, i) => i !== index)
      setNewQuestion({
        ...newQuestion,
        options: newOptions
      })
    }
  }

  const handleOptionChange = (index: number, value: string) => {
    if (editingQuestion) {
      const newOptions = [...editingQuestion.options]
      newOptions[index] = value
      setEditingQuestion({
        ...editingQuestion,
        options: newOptions
      })
    } else {
      const newOptions = [...newQuestion.options]
      newOptions[index] = value
      setNewQuestion({
        ...newQuestion,
        options: newOptions
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingQuestion 
        ? `http://localhost:8000/quiz/questions/${editingQuestion.id}`
        : 'http://localhost:8000/quiz/questions'
      
      const method = editingQuestion ? 'PUT' : 'POST'
      const data = editingQuestion || newQuestion

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        toast.success(editingQuestion ? 'Вопрос обновлен' : 'Вопрос добавлен')
        setEditingQuestion(null)
        setNewQuestion({
          question: '',
          options: [''],
          order: 0,
          is_active: true
        })
        fetchQuestions()
      }
    } catch (error) {
      console.error('Error saving question:', error)
      toast.error('Ошибка при сохранении вопроса')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот вопрос?')) return

    try {
      const response = await fetch(`http://localhost:8000/quiz/questions/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Вопрос удален')
        fetchQuestions()
      }
    } catch (error) {
      console.error('Error deleting question:', error)
      toast.error('Ошибка при удалении вопроса')
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Управление квизом">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Управление квизом">
      {/* Форма добавления/редактирования вопроса */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingQuestion ? 'Редактировать вопрос' : 'Добавить новый вопрос'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Вопрос
            </label>
            <input
              type="text"
              value={editingQuestion?.question || newQuestion.question}
              onChange={(e) => editingQuestion 
                ? setEditingQuestion({...editingQuestion, question: e.target.value})
                : setNewQuestion({...newQuestion, question: e.target.value})
              }
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Варианты ответов
            </label>
            <div className="space-y-2">
              {(editingQuestion?.options || newQuestion.options).map((option, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="form-input flex-1"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="p-2 text-red-600 hover:text-red-700"
                    disabled={(editingQuestion?.options || newQuestion.options).length <= 1}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddOption}
              className="mt-2 text-sm text-primary hover:text-primary-dark"
            >
              + Добавить вариант ответа
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Порядок
              </label>
              <input
                type="number"
                value={editingQuestion?.order || newQuestion.order}
                onChange={(e) => editingQuestion
                  ? setEditingQuestion({...editingQuestion, order: parseInt(e.target.value)})
                  : setNewQuestion({...newQuestion, order: parseInt(e.target.value)})
                }
                className="form-input w-24"
                min="0"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={editingQuestion?.is_active || newQuestion.is_active}
                onChange={(e) => editingQuestion
                  ? setEditingQuestion({...editingQuestion, is_active: e.target.checked})
                  : setNewQuestion({...newQuestion, is_active: e.target.checked})
                }
                className="mr-2"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                Активен
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="btn-primary">
              {editingQuestion ? 'Сохранить изменения' : 'Добавить вопрос'}
            </button>
            {editingQuestion && (
              <button
                type="button"
                onClick={() => setEditingQuestion(null)}
                className="btn-secondary"
              >
                Отмена
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Список вопросов */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Порядок
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Вопрос
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Варианты ответов
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
              {questions.map((question) => (
                <tr key={question.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {question.order}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {question.question}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <ul className="list-disc list-inside">
                      {question.options.map((option, index) => (
                        <li key={index}>{option}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      question.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {question.is_active ? 'Активен' : 'Неактивен'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingQuestion(question)}
                        className="text-primary hover:text-primary-dark"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(question.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
} 