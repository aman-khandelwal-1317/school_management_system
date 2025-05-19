'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import apiService from '@/services/api';
import StudentForm from '@/components/forms/StudentForm';
import Modal from '@/components/ui/Modal';

interface Class {
  _id: string;
  classId: string;
  name: string;
}

interface Student {
  _id: string;
  studentId: string;
  name: string;
  email: string;
  class: Class;
  gender: string;
  phone: string;
  status: string;
  createdAt: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    search: '',
    class: '',
    status: '',
    gender: ''
  });
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Custom debounce hook
  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
  
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
  
      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);
  
    return debouncedValue;
  };

  const debouncedSearch = useDebounce(filters.search, 300);

  // Apply filters whenever filters or students change
  useEffect(() => {
    const applyFilters = () => {
      let result = [...students];

      // Apply search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        result = result.filter(
          student => 
            student.name.toLowerCase().includes(searchLower) ||
            student.studentId.toLowerCase().includes(searchLower) ||
            student.email.toLowerCase().includes(searchLower)
        );
      }

      // Apply class filter
      if (filters.class) {
        result = result.filter(student => student.class?._id === filters.class);
      }

      // Apply status filter
      if (filters.status) {
        result = result.filter(student => student.status === filters.status);
      }

      // Apply gender filter
      if (filters.gender) {
        result = result.filter(student => student.gender.toLowerCase() === filters.gender.toLowerCase());
      }

      setFilteredStudents(result);
    };

    applyFilters();
  }, [filters, students]);

  // Handle search input change with debouncing
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      search: e.target.value
    }));
  };

  // Handle filter change
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

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch students
        const studentsResponse = await apiService.students.getAll();
        if (studentsResponse.success && studentsResponse.data) {
          setStudents(studentsResponse.data);
          setFilteredStudents(studentsResponse.data);
        } else {
          setError(studentsResponse.error || studentsResponse.message || 'Failed to fetch students');
        }
        
        // Fetch classes for the form dropdown
        const classesResponse = await apiService.classes.getAll();
        if (classesResponse.success && classesResponse.data) {
          setClasses(classesResponse.data);
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
    // Refresh students list after successful form submission
    try {
      const response = await apiService.students.getAll();
      if (response.success && response.data) {
        setStudents(response.data);
        setFilteredStudents(response.data);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error refreshing students:', err);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Student Management</h1>
        <button 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
          onClick={() => setIsModalOpen(true)}
        >
          <i className="fas fa-plus mr-2"></i> Add New Student
        </button>
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
                placeholder="Search by name, ID, or email..."
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
            <label htmlFor="class-filter" className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select 
              id="class-filter"
              name="class"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={handleFilterChange}
              value={filters.class}
            >
              <option value="">All Classes</option>
              {classes.map(cls => (
                <option key={cls._id} value={cls._id}>
                  {cls.name} ({cls.classId})
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
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="gender-filter" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select 
              id="gender-filter"
              name="gender"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={handleFilterChange}
              value={filters.gender}
            >
              <option value="">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Add Student Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add New Student"
      >
        <StudentForm 
          classes={classes} 
          onSuccess={handleFormSuccess} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gender
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
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
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mb-2"></div>
                    <p className="text-gray-600">Loading students...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-red-500">
                    <i className="fas fa-exclamation-circle text-xl mb-2"></i>
                    <p>{error}</p>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    {Object.values(filters).some(Boolean) ? (
                      <>
                        No students match the selected filters. Try adjusting your filters.
                      </>
                    ) : 'No students found'}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student._id} className="table-row-hover">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.studentId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <Image 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=4f46e5&color=fff`} 
                            alt={student.name} 
                            width={40} 
                            height={40} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.class?.name || 'Not Assigned'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.gender}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {student.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link 
                          href={`/dashboard/students/${student._id}`}
                          className="action-btn view-btn"
                          data-tooltip="View Details"
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
                  Showing <span className="font-medium">1</span> to <span className="font-medium">
                    {filteredStudents.length < 10 ? filteredStudents.length : 10}
                  </span> of <span className="font-medium">{filteredStudents.length}</span> results
                  {Object.values(filters).some(Boolean) && (
                    <span className="ml-2 text-xs text-gray-500">
                      (filtered from {students.length} total)
                    </span>
                  )}
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
