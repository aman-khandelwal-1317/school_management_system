'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import apiService from '@/services/api';
import SubjectForm from '@/components/forms/SubjectForm';
import EditSubjectForm from '@/components/forms/EditSubjectForm';
import Modal from '@/components/ui/Modal';

interface Teacher {
  _id: string;
  name: string;
  teacherId: string;
  department: string;
}

interface Class {
  _id: string;
  classId: string;
  name: string;
}

interface Subject {
  _id: string;
  subjectCode: string;
  name: string;
  department: string;
  type: 'Practical' | 'Theory';
  class: Class;
  teacher: Teacher;
  status: 'active' | 'inactive';
  createdAt: string;
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [uniqueDepartments, setUniqueDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    department: 'All Departments',
    type: 'All Types',
    class: 'All Classes',
    status: 'All Statuses'
  });
  const [stats, setStats] = useState({
    totalSubjects: 0,
    theorySubjects: 0,
    practicalSubjects: 0,
    avgStudentsPerSubject: 0
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
  
  // Apply filters when filters or subjects change
  const applyFilters = useCallback(() => {
    let result = [...subjects];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(subject => 
        subject.name.toLowerCase().includes(searchLower) ||
        subject.subjectCode.toLowerCase().includes(searchLower) ||
        subject.department?.toLowerCase().includes(searchLower) ||
        subject.class?.name.toLowerCase().includes(searchLower) ||
        subject.teacher?.name.toLowerCase().includes(searchLower)
      );
    }

    // Apply department filter
    if (filters.department && filters.department !== 'All Departments') {
      result = result.filter(subject => subject.department === filters.department);
    }

    // Apply type filter
    if (filters.type && filters.type !== 'All Types') {
      result = result.filter(subject => subject.type.toLowerCase() === filters.type.toLowerCase());
    }

    // Apply class filter
    if (filters.class && filters.class !== 'All Classes') {
      result = result.filter(subject => subject.class?._id === filters.class);
    }

    // Apply status filter
    if (filters.status && filters.status !== 'All Statuses') {
      result = result.filter(subject => subject.status === filters.status.toLowerCase());
    }

    setFilteredSubjects(result);
  }, [filters, subjects]);

  // Handle search input change
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
      searchInputRef.current.focus();
    }
  };

  // Apply filters when debounced search or subjects change
  useEffect(() => {
    applyFilters();
  }, [applyFilters, debouncedSearch]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch subjects
        const [subjectsResponse, classesResponse, teachersResponse] = await Promise.all([
          apiService.subjects.getAll(),
          apiService.classes.getAll(),
          apiService.teachers.getAll()
        ]);
        
        if (subjectsResponse.success && subjectsResponse.data) {
          setSubjects(subjectsResponse.data);
          setFilteredSubjects(subjectsResponse.data);
          
          // Extract unique departments
          const departments = ['All Departments', ...new Set(
            subjectsResponse.data
              .map((subject: Subject) => subject.department)
              .filter(Boolean)
          )] as string[];
          setUniqueDepartments(departments);
          
          // Calculate stats
          const theorySubjects = subjectsResponse.data.filter((subject: Subject) => subject.type === 'Theory').length;
          const practicalSubjects = subjectsResponse.data.filter((subject: Subject) => subject.type === 'Practical').length;
          
          // For average students per subject, we would need additional data
          // This is a placeholder calculation
          const avgStudentsPerSubject = 42; // This would normally be calculated from actual data
          
          setStats({
            totalSubjects: subjectsResponse.data.length,
            theorySubjects,
            practicalSubjects,
            avgStudentsPerSubject
          });
        } else {
          setError(subjectsResponse.error || subjectsResponse.message || 'Failed to fetch subjects');
        }
        
        // Set classes if response is successful
        if (classesResponse.success && classesResponse.data) {
          setClasses(classesResponse.data);
        }
        
        // Set teachers if response is successful
        if (teachersResponse.success && teachersResponse.data) {
          setTeachers(teachersResponse.data);
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
  
  const handleSuccess = async () => {
    // Refresh subjects list after successful form submission
    try {
      const response = await apiService.subjects.getAll();
      if (response.success && response.data) {
        setSubjects(response.data);
        
        // Recalculate stats
        const theorySubjects = response.data.filter((subject: Subject) => subject.type === 'Theory').length;
        const practicalSubjects = response.data.filter((subject: Subject) => subject.type === 'Practical').length;
        
        setStats({
          totalSubjects: response.data.length,
          theorySubjects,
          practicalSubjects,
          avgStudentsPerSubject: stats.avgStudentsPerSubject // Keep the existing value
        });
      }
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      setSelectedSubject(null);
    } catch (err) {
      console.error('Error refreshing subjects:', err);
    }
  };

  const handleCancel = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedSubject(null);
  };

  const handleEditSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Subject Management</h1>
        <button 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
          onClick={() => setIsAddModalOpen(true)}
        >
          <i className="fas fa-plus mr-2"></i> Add New Subject
        </button>
      </div>
      
      {/* Subject Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-600">Total Subjects</h2>
              <p className="text-3xl font-bold text-gray-800">{loading ? '...' : stats.totalSubjects}</p>
            </div>
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <i className="fas fa-book text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-600">Theory Subjects</h2>
              <p className="text-3xl font-bold text-gray-800">{loading ? '...' : stats.theorySubjects}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <i className="fas fa-book-open text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-600">Practical Subjects</h2>
              <p className="text-3xl font-bold text-gray-800">{loading ? '...' : stats.practicalSubjects}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <i className="fas fa-flask text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-600">Avg. Students Per Subject</h2>
              <p className="text-3xl font-bold text-gray-800">{loading ? '...' : stats.avgStudentsPerSubject}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <i className="fas fa-user-graduate text-xl"></i>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="fas fa-search text-gray-400"></i>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Search subjects by name, code, or teacher..."
            value={filters.search}
            onChange={handleSearchChange}
            ref={searchInputRef}
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
        
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              id="department"
              name="department"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={filters.department}
              onChange={handleFilterChange}
            >
              {uniqueDepartments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Subject Type</label>
            <select
              id="type"
              name="type"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="All Types">All Types</option>
              <option value="Theory">Theory</option>
              <option value="Practical">Practical</option>
            </select>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select
              id="class"
              name="class"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={filters.class}
              onChange={handleFilterChange}
            >
              <option value="All Classes">All Classes</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="status"
              name="status"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="All Statuses">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Add Subject Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={handleCancel} 
        title="Add New Subject"
      >
        <SubjectForm 
          classes={classes} 
          onSuccess={handleSuccess} 
          onCancel={handleCancel} 
        />
      </Modal>

      {/* Edit Subject Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={handleCancel} 
        title="Edit Subject"
      >
        {selectedSubject && (
          <EditSubjectForm 
            subject={{
              ...selectedSubject,
              teachers: teachers
            }}
            classes={classes}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        )}
      </Modal>
      
      {/* Subjects Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mb-2"></div>
            <p className="text-gray-600">Loading subjects...</p>
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
                    Subject Code
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teacher
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
                {filteredSubjects.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      No subjects found
                    </td>
                  </tr>
                ) : (
                  filteredSubjects.map((subject) => (
                    <tr key={subject._id} className="table-row-hover">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{subject.subjectCode}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{subject.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{subject.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${subject.type === 'Theory' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                          {subject.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{subject.class?.name || 'Not Assigned'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 flex-shrink-0">
                            <Image 
                              className="h-8 w-8 rounded-full object-cover border-2 border-white" 
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(subject.teacher?.name || 'Not Assigned')}&background=4f46e5&color=fff`} 
                              alt={subject.teacher?.name || 'Not Assigned'} 
                              width={32} 
                              height={32} 
                            />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm text-gray-900">{subject.teacher?.name || 'Not Assigned'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${subject.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {subject.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link 
                            href={`/dashboard/subjects/${subject._id}`}
                            className="action-btn view-btn" 
                            data-tooltip="View Details"
                            title="View Details"
                          >
                            <i className="fas fa-eye"></i>
                          </Link>
                          <button 
                            className="text-blue-600 hover:text-blue-900 mr-3"
                            title="Edit"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditSubject(subject);
                            }}
                          >
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
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{Math.min(filteredSubjects.length, 5)}</span> of <span className="font-medium">{filteredSubjects.length}</span> {filteredSubjects.length === 1 ? 'result' : 'results'}
                  {filters.search || filters.department !== 'All Departments' || filters.type !== 'All Types' || filters.class !== 'All Classes' || filters.status !== 'All Statuses' ? ' (filtered)' : ''}
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <a href="#" className="pagination-btn rounded-l-md">
                    <span className="sr-only">Previous</span>
                    <i className="fas fa-chevron-left text-xs"></i>
                  </a>
                  <a href="#" className="pagination-btn active">1</a>
                  <a href="#" className="pagination-btn">2</a>
                  <a href="#" className="pagination-btn">3</a>
                  <a href="#" className="pagination-btn">4</a>
                  <a href="#" className="pagination-btn">5</a>
                  <a href="#" className="pagination-btn rounded-r-md">
                    <span className="sr-only">Next</span>
                    <i className="fas fa-chevron-right text-xs"></i>
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
