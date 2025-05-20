'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import apiService from '@/services/api';

// Reusable Components
const StatusBadge = ({ status }: { status: string }) => (
  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
    status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }`}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

const InfoCard = ({ title, icon, children, className = '' }: { 
  title: string; 
  icon: string; 
  children: React.ReactNode; 
  className?: string 
}) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
    <div className="px-6 py-4 border-b border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 flex items-center">
        <i className={`fas fa-${icon} mr-2 text-indigo-600`}></i>
        {title}
      </h2>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const InfoItem = ({ 
  icon, 
  label, 
  value, 
  iconClass = 'text-gray-400', 
  className = '',
  valueClass = 'text-gray-900'
}: { 
  icon: string; 
  label: string; 
  value: React.ReactNode; 
  iconClass?: string; 
  className?: string;
  valueClass?: string;
}) => (
  <div className={`flex items-start ${className}`}>
    <div className={`flex-shrink-0 h-5 w-5 ${iconClass} mt-0.5`}>
      <i className={`fas fa-${icon}`}></i>
    </div>
    <div className="ml-3">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <div className={`text-sm ${valueClass}`}>
        {value}
      </div>
    </div>
  </div>
);

// Types
interface Teacher {
  _id: string;
  teacherId: string;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  status: string;
}

interface Student {
  _id: string;
  studentId: string;
  name: string;
  email: string;
  status: string;
}

interface Subject {
  _id: string;
  subjectCode: string;
  name: string;
  type: string;
  status: string;
}

interface ClassDetails {
  _id: string;
  classId: string;
  name: string;
  roomNo: string;
  academicYear: string;
  status: string;
  createdAt: string;
  classTeacher?: Teacher | null;
  students?: Student[];
  subjects?: Subject[];
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export default function ClassDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // ✅ unwraps the Promise
  const [classDetails, setClassDetails] = useState<ClassDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        setLoading(true);
        // @ts-ignore - We'll handle the response structure
        const response: ApiResponse<ClassDetails> = await apiService.classes.getById(id);
        
        if (response.success && response.data) {
          // Ensure arrays are always defined
          const classData = {
            ...response.data,
            students: response.data.students || [],
            subjects: response.data.subjects || []
          };
          setClassDetails(classData);
        } else {
          setError(response.error || response.message || 'Failed to fetch class details');
        }
      } catch (err) {
        console.error('Error fetching class details:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchClassDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !classDetails) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              {error || 'Class not found'}
            </p>
            <button
              onClick={() => router.back()}
              className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              ← Back to classes
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="group inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-200 font-medium"
        >
          <i className="fas fa-arrow-left mr-2 transition-transform duration-200 group-hover:-translate-x-1"></i>
          <span>Back to Classes</span>
        </button>

        {/* Class Header */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          {/* Banner with Gradient Background */}
          <div className="relative h-36 bg-gradient-to-r from-indigo-600 to-blue-600 overflow-hidden">
            {/* Subtle Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
            
            {/* Content Container */}
            <div className="relative h-full container mx-auto px-6 flex items-center">
              {/* Class Icon */}
              <div className="relative h-24 w-24 rounded-full bg-white/10 backdrop-blur-sm border-4 border-white/20 flex-shrink-0 overflow-hidden shadow-lg flex items-center justify-center">
                <i className="fas fa-chalkboard-teacher text-3xl text-white"></i>
              </div>

              {/* Class Info */}
              <div className="ml-6 text-white">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-sm">{classDetails.name}</h1>
                  <div className="flex items-center space-x-3">
                    <StatusBadge status={classDetails.status} />
                    <span className="text-sm bg-white/20 px-3 py-1 rounded-full font-medium">
                      ID: {classDetails.classId}
                    </span>
                  </div>
                </div>
                
                {/* Additional Info */}
                <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-indigo-100">
                  <div className="flex items-center">
                    <i className="fas fa-door-open mr-2 w-4 text-center"></i>
                    <span>Room: {classDetails.roomNo || 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-calendar-alt mr-2 w-4 text-center"></i>
                    <span>Academic Year: {classDetails.academicYear || 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-user-tie mr-2 w-4 text-center"></i>
                    <span>Class Teacher: {classDetails.classTeacher?.name || 'Not Assigned'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-800">
                  <i className="fas fa-users mr-1.5 text-indigo-500"></i>
                  {classDetails.students?.length || 0} Students
                </span>
                <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-800">
                  <i className="fas fa-book mr-1.5 text-purple-500"></i>
                  {classDetails.subjects?.length || 0} Subjects
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button 
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <i className="fas fa-print mr-2 text-gray-500"></i>
                  Print
                </button>
                <button 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <i className="fas fa-envelope mr-2"></i>
                  Message Class
                </button>
                <button 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <i className="fas fa-edit mr-2"></i>
                  Edit Class
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Class Information Card */}
            <InfoCard title="Class Information" icon="info-circle">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem 
                  icon="chalkboard"
                  label="Class Name"
                  value={classDetails.name}
                  iconClass="text-indigo-500"
                />
                <InfoItem 
                  icon="hashtag"
                  label="Class ID"
                  value={classDetails.classId}
                  iconClass="text-gray-500"
                />
                <InfoItem 
                  icon="door-open"
                  label="Room Number"
                  value={classDetails.roomNo || 'N/A'}
                  iconClass="text-blue-500"
                />
                <InfoItem 
                  icon="calendar-alt"
                  label="Academic Year"
                  value={classDetails.academicYear || 'N/A'}
                  iconClass="text-green-500"
                />
                <InfoItem 
                  icon="user-tie"
                  label="Class Teacher"
                  value={
                    <div className="flex items-center">
                      <span className="mr-2">{classDetails.classTeacher?.name || 'Not Assigned'}</span>
                      {classDetails.classTeacher && (
                        <span className="text-xs text-gray-500">
                          ({classDetails.classTeacher.teacherId})
                        </span>
                      )}
                    </div>
                  }
                  iconClass="text-purple-500"
                />
                <InfoItem 
                  icon="calendar-plus"
                  label="Created On"
                  value={formatDate(classDetails.createdAt)}
                  iconClass="text-amber-500"
                />
              </div>
            </InfoCard>

            {/* Students Card */}
            <InfoCard title="Students" icon="user-graduate">
              <div className="flow-root">
                <ul className="divide-y divide-gray-200">
                  {classDetails.students && classDetails.students.length > 0 ? (
                    <>
                      {classDetails.students.map((student) => (
                        <li key={student._id} className="py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                                {getInitials(student.name)}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {student.name}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {student.studentId}
                              </p>
                            </div>
                            <div>
                              <StatusBadge status={student.status} />
                            </div>
                            <div>
                              <Link 
                                href={`/dashboard/students/${student._id}`}
                                className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                              >
                                View
                              </Link>
                            </div>
                          </div>
                        </li>
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      No students found in this class.
                    </div>
                  )}
                </ul>
              </div>
              <div className="mt-4">
                <button className="w-full text-center text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                  View All Students <i className="fas fa-arrow-right ml-1"></i>
                </button>
              </div>
            </InfoCard>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Class Teacher Card */}
            <InfoCard title="Class Teacher" icon="chalkboard-teacher">
              {classDetails.classTeacher ? (
                <div className="text-center">
                  <div className="mx-auto h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold mb-4">
                    {getInitials(classDetails.classTeacher.name)}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{classDetails.classTeacher.name}</h3>
                  <p className="text-sm text-gray-500">Teacher ID: {classDetails.classTeacher.teacherId}</p>
                  
                  <div className="mt-4 space-y-2 text-left">
                    <InfoItem 
                      icon="envelope" 
                      label="Email" 
                      value={
                        <a href={`mailto:${classDetails.classTeacher.email}`} className="text-indigo-600 hover:text-indigo-800">
                          {classDetails.classTeacher.email}
                        </a>
                      }
                      iconClass="text-gray-400"
                      className="justify-center"
                    />
                    {classDetails.classTeacher.phone && (
                      <InfoItem 
                        icon="phone" 
                        label="Phone" 
                        value={
                          <a href={`tel:${classDetails.classTeacher.phone}`} className="text-gray-900">
                            {classDetails.classTeacher.phone}
                          </a>
                        }
                        iconClass="text-gray-400"
                        className="justify-center"
                      />
                    )}
                    {classDetails.classTeacher.department && (
                      <InfoItem 
                        icon="building" 
                        label="Department" 
                        value={classDetails.classTeacher.department}
                        iconClass="text-gray-400"
                        className="justify-center"
                      />
                    )}
                  </div>
                  
                  <div className="mt-6">
                    <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <i className="fas fa-envelope mr-1.5"></i>
                      Send Message
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No class teacher assigned.
                </div>
              )}
            </InfoCard>

            {/* Subjects Card */}
            <InfoCard title="Subjects" icon="book">
              <div className="space-y-4">
                {classDetails.subjects && classDetails.subjects.length > 0 ? (
                  <ul className="space-y-3">
                    {classDetails.subjects.map((subject) => (
                      <li key={subject._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{subject.name}</h4>
                          <p className="text-xs text-gray-500">{subject.subjectCode}</p>
                        </div>
                        <StatusBadge status={subject.status} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No subjects assigned to this class.
                  </div>
                )}
                <button className="w-full mt-2 text-center text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                  View All Subjects <i className="fas fa-arrow-right ml-1"></i>
                </button>
              </div>
            </InfoCard>
          </div>
        </div>
      </div>
    </div>
  );
}
