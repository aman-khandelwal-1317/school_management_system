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
interface Subject {
  _id: string;
  subjectCode: string;
  name: string;
  type: string;
  status: string;
  class?: {
    _id: string;
    name: string;
    classId: string;
  };
}

interface TeacherDetails {
  _id: string;
  teacherId: string;
  name: string;
  email: string;
  contact?: string;
  department?: string;
  status: string;
  createdAt: string;
  subjects: Subject[];
}

export default function TeacherDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // ✅ unwraps the Promise
  const [teacher, setTeacher] = useState<TeacherDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTeacherDetails = async () => {
      try {
        setLoading(true);
        const response = await apiService.teachers.getById(id);
        
        if (response.success && response.data) {
          setTeacher(response.data);
        } else {
          setError(response.error || 'Failed to fetch teacher details');
        }
      } catch (err) {
        console.error('Error fetching teacher details:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherDetails();
  }, [id]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !teacher) {
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
              {error || 'Teacher not found'}
            </p>
            <button
              onClick={() => router.back()}
              className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              ← Back to teachers
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="group inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-200 font-medium"
        >
          <i className="fas fa-arrow-left mr-2 transition-transform duration-200 group-hover:-translate-x-1"></i>
          <span>Back to Teachers</span>
        </button>

        {/* Teacher Header */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          {/* Banner with Gradient Background */}
          <div className="relative h-36 bg-gradient-to-r from-indigo-600 to-blue-600 overflow-hidden">
            {/* Subtle Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
            
            {/* Content Container */}
            <div className="relative h-full container mx-auto px-6 flex items-center">
              {/* Teacher Avatar */}
              <div className="relative h-24 w-24 rounded-full bg-white/10 backdrop-blur-sm border-4 border-white/20 flex-shrink-0 overflow-hidden shadow-lg flex items-center justify-center">
                <div className="h-full w-full flex items-center justify-center text-white text-2xl font-bold">
                  {getInitials(teacher.name)}
                </div>
              </div>

              {/* Teacher Info */}
              <div className="ml-6 text-white">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-sm">{teacher.name}</h1>
                  <div className="flex items-center space-x-3">
                    <StatusBadge status={teacher.status} />
                    <span className="text-sm bg-white/20 px-3 py-1 rounded-full font-medium">
                      ID: {teacher.teacherId}
                    </span>
                  </div>
                </div>
                
                {/* Additional Info */}
                <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-indigo-100">
                  <div className="flex items-center">
                    <i className="fas fa-envelope mr-2 w-4 text-center"></i>
                    <span>{teacher.email}</span>
                  </div>
                  {teacher.contact && (
                    <div className="flex items-center">
                      <i className="fas fa-phone-alt mr-2 w-4 text-center"></i>
                      <span>{teacher.contact}</span>
                    </div>
                  )}
                  {teacher.department && (
                    <div className="flex items-center">
                      <i className="fas fa-building mr-2 w-4 text-center"></i>
                      <span>{teacher.department} Department</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-800">
                  <i className="fas fa-book mr-1.5 text-indigo-500"></i>
                  {teacher.subjects?.length || 0} Subjects
                </span>
                <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-800">
                  <i className="fas fa-chalkboard-teacher mr-1.5 text-purple-500"></i>
                  Class Teacher
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
                  Send Message
                </button>
                <button 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <i className="fas fa-edit mr-2"></i>
                  Edit Teacher
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Card */}
            <InfoCard title="Personal Information" icon="user-tie">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem 
                  icon="id-card"
                  label="Teacher ID"
                  value={teacher.teacherId}
                  iconClass="text-indigo-500"
                />
                <InfoItem 
                  icon="envelope"
                  label="Email Address"
                  value={
                    <a href={`mailto:${teacher.email}`} className="text-indigo-600 hover:underline">
                      {teacher.email}
                    </a>
                  }
                  iconClass="text-blue-500"
                />
                {teacher.contact && (
                  <InfoItem 
                    icon="phone-alt"
                    label="Contact Number"
                    value={
                      <a href={`tel:${teacher.contact}`} className="text-gray-900">
                        {teacher.contact}
                      </a>
                    }
                    iconClass="text-green-500"
                  />
                )}
                {teacher.department && (
                  <InfoItem 
                    icon="building"
                    label="Department"
                    value={teacher.department}
                    iconClass="text-purple-500"
                  />
                )}
                <InfoItem 
                  icon="calendar-alt"
                  label="Member Since"
                  value={formatDate(teacher.createdAt)}
                  iconClass="text-amber-500"
                />
                <InfoItem 
                  icon="info-circle"
                  label="Status"
                  value={
                    <span className="inline-flex items-center">
                      <StatusBadge status={teacher.status} />
                    </span>
                  }
                  iconClass="text-gray-500"
                />
              </div>
            </InfoCard>

            {/* Subjects Taught Card */}
            <InfoCard title="Subjects Taught" icon="book">
              <div className="flow-root">
                {teacher.subjects && teacher.subjects.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {teacher.subjects.map((subject) => (
                      <li key={subject._id} className="py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{subject.name}</h4>
                            <p className="text-sm text-gray-500">{subject.subjectCode} • {subject.type}</p>
                            {subject.class && (
                              <div className="mt-1 flex items-center text-sm text-gray-500">
                                <i className="fas fa-chalkboard mr-1.5 text-gray-400"></i>
                                {subject.class.name} ({subject.class.classId})
                              </div>
                            )}
                          </div>
                          <StatusBadge status={subject.status} />
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    No subjects assigned to this teacher.
                  </div>
                )}
              </div>
            </InfoCard>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Class Teacher Card - Only show if they are a class teacher */}
            <InfoCard title="Class Teacher" icon="chalkboard-teacher">
              <div className="text-center py-8 text-gray-500">
                <i className="fas fa-user-tie text-4xl text-gray-300 mb-3"></i>
                <p>Not assigned as a class teacher</p>
                <button className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                  Assign to Class <i className="fas fa-arrow-right ml-1"></i>
                </button>
              </div>
            </InfoCard>

            {/* Quick Actions Card */}
            <InfoCard title="Quick Actions" icon="bolt">
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                      <i className="fas fa-calendar-alt"></i>
                    </div>
                    <span className="text-sm font-medium">View Schedule</span>
                  </div>
                  <i className="fas fa-chevron-right text-gray-400"></i>
                </button>
                
                <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                      <i className="fas fa-tasks"></i>
                    </div>
                    <span className="text-sm font-medium">View Assignments</span>
                  </div>
                  <i className="fas fa-chevron-right text-gray-400"></i>
                </button>
                
                <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-purple-100 text-purple-600 mr-3">
                      <i className="fas fa-chart-line"></i>
                    </div>
                    <span className="text-sm font-medium">Performance Reports</span>
                  </div>
                  <i className="fas fa-chevron-right text-gray-400"></i>
                </button>
              </div>
            </InfoCard>
          </div>
        </div>
      </div>
    </div>
  );
}
