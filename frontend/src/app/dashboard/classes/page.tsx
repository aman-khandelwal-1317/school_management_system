'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import apiService from '@/services/api';
import ClassForm from '@/components/forms/ClassForm';
import EditClassForm from '@/components/forms/EditClassForm';
import Modal from '@/components/ui/Modal';

interface Teacher {
  _id: string;
  teacherId: string;
  name: string;
  department?: string;
  subject?: string;
  contact?: string;
  status?: string;
  email?: string;
}

interface Class {
  _id: string;
  classId: string;
  name: string;
  classTeacher: Teacher;
  students: string[];
  subjects: string[];
  roomNo: string;
  status: string;
  createdAt: string;
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [stats, setStats] = useState({
    totalClasses: 0,
    avgStudents: 0,
    activeClassrooms: 0
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch classes
        const classesResponse = await apiService.classes.getAll();
        if (classesResponse.success && classesResponse.data) {
          setClasses(classesResponse.data);
          
          // Calculate stats
          const activeClasses = classesResponse.data.filter((cls: Class) => cls.status === 'active').length;
          const totalStudents = classesResponse.data.reduce((sum: number, cls: Class) => sum + cls.students.length, 0);
          const avgStudents = classesResponse.data.length > 0 ? Math.round(totalStudents / classesResponse.data.length) : 0;
          
          setStats({
            totalClasses: classesResponse.data.length,
            avgStudents,
            activeClassrooms: activeClasses
          });
        } else {
          setError(classesResponse.error || classesResponse.message || 'Failed to fetch classes');
        }
        
        // Fetch teachers for the class teacher dropdown
        const teachersResponse = await apiService.teachers.getAll();
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
    // Refresh classes list after successful form submission
    try {
      const response = await apiService.classes.getAll();
      if (response.success && response.data) {
        setClasses(response.data);
        
        // Recalculate stats
        const activeClasses = response.data.filter((cls: Class) => cls.status === 'active').length;
        const totalStudents = response.data.reduce((sum: number, cls: Class) => sum + cls.students.length, 0);
        const avgStudents = response.data.length > 0 ? Math.round(totalStudents / response.data.length) : 0;
        
        setStats({
          totalClasses: response.data.length,
          avgStudents,
          activeClassrooms: activeClasses
        });
      }
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      setSelectedClass(null);
    } catch (err) {
      console.error('Error refreshing classes:', err);
    }
  };

  const handleCancel = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedClass(null);
  };

  const handleEditClass = (classItem: Class) => {
    setSelectedClass(classItem);
    setIsEditModalOpen(true);
  };
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Class Management</h1>
        <button 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg flex items-center"
          onClick={() => setIsAddModalOpen(true)}
        >
          <i className="fas fa-plus mr-2"></i> Add New Class
        </button>
      </div>
      
      {/* Class Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-600">Total Classes</h2>
              <p className="text-3xl font-bold text-gray-800">{loading ? '...' : stats.totalClasses}</p>
            </div>
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <i className="fas fa-chalkboard text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-600">Avg. Students Per Class</h2>
              <p className="text-3xl font-bold text-gray-800">{loading ? '...' : stats.avgStudents}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <i className="fas fa-user-graduate text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-600">Active Classrooms</h2>
              <p className="text-3xl font-bold text-gray-800">{loading ? '...' : stats.activeClassrooms}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <i className="fas fa-door-open text-xl"></i>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Class Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={handleCancel} 
        title="Add New Class"
      >
        <ClassForm 
          teachers={teachers} 
          onSuccess={handleSuccess} 
          onCancel={handleCancel} 
        />
      </Modal>

      {/* Edit Class Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={handleCancel} 
        title="Edit Class"
      >
        {selectedClass && (
          <EditClassForm 
            classData={selectedClass}
            teachers={teachers}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        )}
      </Modal>
      
      {/* Classes Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mb-2"></div>
            <p className="text-gray-600">Loading classes...</p>
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
                    Class ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class Teacher
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Students
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subjects
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room No.
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
                {classes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No classes found
                    </td>
                  </tr>
                ) : (
                  classes.map((classItem) => (
                    <tr key={classItem._id} className="table-row-hover">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{classItem.classId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{classItem.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 flex-shrink-0">
                            <Image 
                              className="h-8 w-8 rounded-full object-cover" 
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(classItem.classTeacher?.name || 'Not Assigned')}&background=4f46e5&color=fff`} 
                              alt={classItem.classTeacher?.name || 'Not Assigned'} 
                              width={32} 
                              height={32} 
                            />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm text-gray-900">{classItem.classTeacher?.name || 'Not Assigned'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{classItem.students?.length || 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{classItem.subjects?.length || 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{classItem.roomNo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${classItem.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {classItem.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link 
                            href={`/dashboard/classes/${classItem._id}`}
                            className="action-btn view-btn" 
                            data-tooltip="View Details"
                          >
                            <i className="fas fa-eye"></i>
                          </Link>
                          <button 
                            className="text-blue-600 hover:text-blue-900 mr-3"
                            title="Edit"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClass(classItem);
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
            <div className="flex-1 flex justify-between sm:hidden">
              <a href="#" className="pagination-btn">Previous</a>
              <a href="#" className="pagination-btn">Next</a>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{classes.length < 5 ? classes.length : 5}</span> of <span className="font-medium">{classes.length}</span> results
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
