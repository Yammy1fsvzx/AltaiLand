import { ReactNode } from 'react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: {
    value: number
    label: string
    isPositive: boolean
  }
}

export default function StatsCard({ title, value, icon, trend }: StatsCardProps) {
  return (
    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50">
            {icon}
          </div>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="truncate text-sm font-medium text-gray-500">{title}</dt>
            <dd className="mt-1">
              <div className="text-lg font-semibold text-gray-900">{value}</div>
              {trend && (
                <div className="mt-1 flex items-baseline text-sm">
                  <span
                    className={`${
                      trend.isPositive ? 'text-green-600' : 'text-red-600'
                    } font-semibold`}
                  >
                    {trend.isPositive ? '+' : '-'}{trend.value}%
                  </span>
                  <span className="ml-2 text-gray-500">{trend.label}</span>
                </div>
              )}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  )
}