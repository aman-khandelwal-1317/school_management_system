'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import apiService from '@/services/api';
import TeacherForm from '@/components/forms/TeacherForm';
import Modal from '@/components/ui/Modal';

interface Subject {
  _id: string;
  subjectCode: string;
  name: string;
}

interface Teacher {
  _id: string;
  teacherId: string;
  name: string;
  department: string;
  subject: Subject;
  contact: string;
  status: 'active' | 'inactive';
  email: string;
  createdAt: string;
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [stats, setStats] = useState({
    totalTeachers: 0,
    activeTeachers: 0,
    inactiveTeachers: 0,
    newTeachers: 0
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch teachers
        const teachersResponse = await apiService.teachers.getAll();
        if (teachersResponse.success && teachersResponse.data) {
          setTeachers(teachersResponse.data);
          
          // Calculate stats
          const activeTeachers = teachersResponse.data.filter((teacher: Teacher) => teacher.status === 'active').length;
          const inactiveTeachers = teachersResponse.data.filter((teacher: Teacher) => teacher.status === 'inactive').length;
          
          // For new teachers, we'll consider those created in the last 30 days
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          const newTeachers = teachersResponse.data.filter((teacher: Teacher) => {
            const createdAt = new Date(teacher.createdAt);
            return createdAt >= thirtyDaysAgo;
          }).length;
          
          setStats({
            totalTeachers: teachersResponse.data.length,
            activeTeachers,
            inactiveTeachers,
            newTeachers
          });
        } else {
          setError(teachersResponse.error || teachersResponse.message || 'Failed to fetch teachers');
        }
        
        // Fetch subjects for the subject dropdown
        const subjectsResponse = await apiService.subjects.getAll();
        if (subjectsResponse.success && subjectsResponse.data) {
          setSubjects(subjectsResponse.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleFormSuccess = async () => {
    // Refresh teachers list after successful form submission
    try {
      const response = await apiService.teachers.getAll();
      if (response.success && response.data) {
        setTeachers(response.data);
        
        // Recalculate stats
        const activeTeachers = response.data.filter((teacher: Teacher) => teacher.status === 'active').length;
        const inactiveTeachers = response.data.filter((teacher: Teacher) => teacher.status === 'inactive').length;
        
        // For new teachers, we'll consider those created in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newTeachers = response.data.filter((teacher: Teacher) => {
          const createdAt = new Date(teacher.createdAt);
          return createdAt >= thirtyDaysAgo;
        }).length;
        
        setStats({
          totalTeachers: response.data.length,
          activeTeachers,
          inactiveTeachers,
          newTeachers
        });
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error refreshing teachers:', err);
    }
  };
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Teacher Management</h1>
        <button 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
          onClick={() => setIsModalOpen(true)}
        >
          <i className="fas fa-plus mr-2"></i> Add New Teacher
        </button>
      </div>
      
      {/* Teacher Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-600">Total Teachers</h2>
              <p className="text-3xl font-bold text-gray-800">{loading ? '...' : stats.totalTeachers}</p>
            </div>
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <i className="fas fa-chalkboard-teacher text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-600">Active</h2>
              <p className="text-3xl font-bold text-gray-800">{loading ? '...' : stats.activeTeachers}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <i className="fas fa-user-clock text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-600">Inactive</h2>
              <p className="text-3xl font-bold text-gray-800">{loading ? '...' : stats.inactiveTeachers}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <i className="fas fa-user-clock text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-600">New Hires</h2>
              <p className="text-3xl font-bold text-gray-800">{loading ? '...' : stats.newTeachers}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <i className="fas fa-user-plus text-xl"></i>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">All Departments</option>
              <option value="science">Science</option>
              <option value="math">Mathematics</option>
              <option value="english">English</option>
              <option value="social">Social Studies</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">On Leave</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">All Types</option>
              <option value="fulltime">Full-time</option>
              <option value="parttime">Part-time</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px] self-end">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg w-full">
              Apply Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Add Teacher Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add New Teacher"
      >
        <TeacherForm 
          subjects={subjects} 
          onSuccess={handleFormSuccess} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
      
      {/* Teachers Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mb-2"></div>
            <p className="text-gray-600">Loading teachers...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            <i className="fas fa-exclamation-circle text-xl mb-2"></i>
            <p>{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teachers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No teachers found
                    </td>
                  </tr>
                ) : (
                  teachers.map((teacher) => (
                    <tr key={teacher._id} className="table-row-hover">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{teacher.teacherId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <Image 
                              className="h-10 w-10 rounded-full object-cover" 
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&background=4f46e5&color=fff`} 
                              alt={teacher.name} 
                              width={40} 
                              height={40} 
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                            <div className="text-sm text-gray-500">{teacher.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{teacher.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{teacher.subject?.name || 'Not Assigned'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{teacher.contact}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${teacher.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {teacher.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="action-btn view-btn" data-tooltip="View Details">
                            <i className="fas fa-eye"></i>
                          </button>
                          <button className="action-btn edit-btn" data-tooltip="Edit">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="action-btn delete-btn" data-tooltip="Delete">
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <a href="#" className="pagination-btn">Previous</a>
              <a href="#" className="pagination-btn">Next</a>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{teachers.length < 5 ? teachers.length : 5}</span> of <span className="font-medium">{teachers.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <a href="#" className="pagination-btn rounded-l-md">
                    <span className="sr-only">Previous</span>
                    <i className="fas fa-chevron-left"></i>
                  </a>
                  <a href="#" className="pagination-btn active">1</a>
                  <a href="#" className="pagination-btn">2</a>
                  <a href="#" className="pagination-btn">3</a>
                  <a href="#" className="pagination-btn">4</a>
                  <a href="#" className="pagination-btn">5</a>
                  <a href="#" className="pagination-btn rounded-r-md">
                    <span className="sr-only">Next</span>
                    <i className="fas fa-chevron-right"></i>
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
