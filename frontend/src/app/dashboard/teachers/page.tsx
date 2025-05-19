'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  subjects: Subject[];
  contact: string;
  status: 'active' | 'inactive';
  email: string;
  createdAt: string;
}

// Custom hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // Extract unique departments from teachers data
  const [departments, setDepartments] = useState<string[]>(['All Departments']);
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    status: '',
    employmentType: ''
  });
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [stats, setStats] = useState({
    totalTeachers: 0,
    activeTeachers: 0,
    inactiveTeachers: 0,
    newTeachers: 0
  });
  
  // Debounce the search input
  const debouncedSearch = useDebounce(filters.search, 300);
  
  // Update departments when teachers data is loaded
  useEffect(() => {
    if (teachers.length > 0) {
      const uniqueDepartments = ['All Departments', ...new Set(teachers.map(teacher => teacher.department).filter(Boolean))];
      setDepartments(uniqueDepartments);
    }
  }, [teachers]);
  
  // Apply filters when filters change
  useEffect(() => {
    applyFilters();
  }, [debouncedSearch, filters.department, filters.status, filters.employmentType]);
  
  // Handle search input change with debouncing
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      search: e.target.value
    }));
  };
  
  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Clear search input
  const clearSearch = () => {
    setFilters(prev => ({
      ...prev,
      search: ''
    }));
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
  };
  
  // Apply all filters
  const applyFilters = () => {
    let result = [...teachers];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        teacher => 
          teacher.name.toLowerCase().includes(searchLower) ||
          teacher.teacherId.toLowerCase().includes(searchLower) ||
          teacher.email.toLowerCase().includes(searchLower) ||
          teacher.department.toLowerCase().includes(searchLower) ||
          teacher.subjects.some(subject => 
            subject.name.toLowerCase().includes(searchLower) ||
            subject.subjectCode.toLowerCase().includes(searchLower)
          )
      );
    }


    // Apply department filter
    if (filters.department && filters.department !== 'All Departments') {
      result = result.filter(teacher => teacher.department.toLowerCase() === filters.department.toLowerCase());
    }

    // Apply status filter
    if (filters.status) {
      result = result.filter(teacher => teacher.status === filters.status);
    }

    // Apply employment type filter (note: this is a placeholder as the Teacher interface doesn't have employmentType yet)
    // if (filters.employmentType) {
    //   result = result.filter(teacher => teacher.employmentType === filters.employmentType);
    // }


    setFilteredTeachers(result);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch teachers
        const teachersResponse = await apiService.teachers.getAll();
        if (teachersResponse.success && teachersResponse.data) {
          setTeachers(teachersResponse.data);
          setFilteredTeachers(teachersResponse.data);
          
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
        setFilteredTeachers(response.data);
        
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
        
        // Reapply filters with the new data
        applyFilters();
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
      
      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <input
                type="text"
                id="search"
                ref={searchInputRef}
                placeholder="Search by name, ID, email, or department..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={handleSearchChange}
                value={filters.search}
              />
              {filters.search && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="department-filter" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select 
              id="department-filter"
              name="department"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={handleFilterChange}
              value={filters.department}
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              id="status-filter"
              name="status"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={handleFilterChange}
              value={filters.status}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          {/* Commenting out employment type as it's not in the Teacher interface yet
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="employment-type-filter" className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
            <select 
              id="employment-type-filter"
              name="employmentType"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={handleFilterChange}
              value={filters.employmentType}
            >
              <option value="">All Types</option>
              <option value="fulltime">Full-time</option>
              <option value="parttime">Part-time</option>
            </select>
          </div>
          */}
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
                    Subjects
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
                {filteredTeachers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      {Object.values(filters).some(Boolean) ? (
                        <></>
                      ) : 'No teachers found'}
                    </td>
                  </tr>
                ) : (
                  filteredTeachers.map((teacher) => (
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
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {teacher.subjects?.length > 0 ? (
                            teacher.subjects.map((subject, index) => (
                              <span key={subject._id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                {subject.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">No subjects assigned</span>
                          )}
                        </div>
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
                          <Link 
                            href={`/dashboard/teachers/${teacher._id}`}
                            className="action-btn view-btn" 
                            data-tooltip="View Details"
                            title="View Details"
                          >
                            <i className="fas fa-eye"></i>
                          </Link>
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
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{Math.min(filteredTeachers.length, 5)}</span> of <span className="font-medium">{filteredTeachers.length}</span> results
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
