'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import apiService from '@/services/api';
import SubjectForm from '@/components/forms/SubjectForm';
import Modal from '@/components/ui/Modal';

interface Teacher {
  _id: string;
  name: string;
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
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [stats, setStats] = useState({
    totalSubjects: 0,
    theorySubjects: 0,
    practicalSubjects: 0,
    avgStudentsPerSubject: 0
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch subjects
        const subjectsResponse = await apiService.subjects.getAll();
        if (subjectsResponse.success && subjectsResponse.data) {
          setSubjects(subjectsResponse.data);
          
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
        
        // Fetch classes for the class dropdown
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
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error refreshing subjects:', err);
    }
  };
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Subject Management</h1>
        <button 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
          onClick={() => setIsModalOpen(true)}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject Type</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">All Types</option>
              <option value="theory">Theory</option>
              <option value="practical">Practical</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">All Classes</option>
              <option value="10">Class 10</option>
              <option value="9">Class 9</option>
              <option value="8">Class 8</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px] self-end">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg w-full">
              Apply Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Add Subject Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add New Subject"
      >
        <SubjectForm 
          classes={classes} 
          onSuccess={handleFormSuccess} 
          onCancel={() => setIsModalOpen(false)} 
        />
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
                {subjects.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      No subjects found
                    </td>
                  </tr>
                ) : (
                  subjects.map((subject) => (
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
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{subjects.length < 5 ? subjects.length : 5}</span> of <span className="font-medium">{subjects.length}</span> results
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
