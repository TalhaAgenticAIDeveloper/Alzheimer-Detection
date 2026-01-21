import React, { useState } from 'react'
import { Brain, LogOut, Plus, Users, Trash2, Search, Eye, EyeOff } from 'lucide-react'
import UserFormModal from './UserFormModal'

function AdminDashboard({ onLogout }) {
  const [showModal, setShowModal] = useState(false)
  const [usersList, setUsersList] = useState([
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@hospital.com',
      age: 35,
      gender: 'Male',
      degree: 'MD',
      experience: 10,
      hospital: 'Central Hospital'
    },
    {
      id: 2,
      firstName: 'Sarah',
      lastName: 'Smith',
      email: 'sarah.smith@hospital.com',
      age: 28,
      gender: 'Female',
      degree: 'MBBS',
      experience: 5,
      hospital: 'City Medical Center'
    },
    {
      id: 3,
      firstName: 'Michael',
      lastName: 'Johnson',
      email: 'michael.j@hospital.com',
      age: 42,
      gender: 'Male',
      degree: 'MD',
      experience: 15,
      hospital: 'General Hospital'
    }
  ])
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const filteredUsers = usersList.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddUser = (newUser) => {
    const user = {
      id: Math.max(...usersList.map(u => u.id), 0) + 1,
      ...newUser
    }
    setUsersList([...usersList, user])
    setShowModal(false)
  }

  const handleDeleteUser = (id) => {
    setUsersList(usersList.filter(user => user.id !== id))
    setDeleteConfirm(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl text-gray-900">NeuroCare AI</span>
                <p className="text-xs text-gray-500">Admin Dashboard</p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage healthcare professionals and administrators</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{usersList.length}</p>
              </div>
              <Users className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{usersList.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-blue-600">✓</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Verification</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-yellow-600">!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Users Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Section Header */}
          <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-2xl font-bold text-gray-900">Healthcare Professionals</h2>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition"
            >
              <Plus size={20} />
              Add New User
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-12 pr-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Hospital</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Experience</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {user.firstName[0]}{user.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                            <p className="text-xs text-gray-500">{user.age} years</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          {user.degree}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{user.hospital}</td>
                      <td className="px-6 py-4 text-gray-700 text-center">{user.experience} yrs</td>
                      <td className="px-6 py-4 text-center">
                        {deleteConfirm === user.id ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg font-medium transition"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-900 text-xs rounded-lg font-medium transition"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(user.id)}
                            className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm transition"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <p className="text-gray-500 text-lg">No users found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* User Form Modal */}
      {showModal && (
        <UserFormModal
          onClose={() => setShowModal(false)}
          onAddUser={handleAddUser}
        />
      )}
    </div>
  )
}

export default AdminDashboard
