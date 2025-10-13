'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminAwardForm from '@/components/AdminAwardForm'

export default function AdminPage() {
  const [adminCode, setAdminCode] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if admin code is stored in localStorage
    const storedCode = localStorage.getItem('adminCode')
    if (storedCode) {
      setAdminCode(storedCode)
      setIsAuthenticated(true)
    }
  }, [])

  const handleAdminCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (adminCode.trim()) {
      localStorage.setItem('adminCode', adminCode.trim())
      setIsAuthenticated(true)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminCode')
    setAdminCode('')
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full border border-gray-700">
          <div className="flex justify-center items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Admin-Zugang</h1>
          </div>
          <form onSubmit={handleAdminCodeSubmit} className="space-y-4">
            <div>
              <label htmlFor="adminCode" className="block text-sm font-medium text-gray-300 mb-2">
                Admin-Code
              </label>
              <input
                type="password"
                id="adminCode"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                placeholder="Admin-Code eingeben"
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              Anmelden
            </button>
          </form>
          <div className="mt-4 text-center">
            <Link 
              href="/" 
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              ← Zurück zur Hauptseite
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Admin-Bereich</h1>
          <div className="flex gap-4">
            <Link 
              href="/"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Hauptseite
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              Abmelden
            </button>
          </div>
        </div>

        <AdminAwardForm />
      </div>
    </div>
  )
}
