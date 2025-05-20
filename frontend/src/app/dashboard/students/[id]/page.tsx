'use client';

import { useCallback, useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import apiService from '@/services/api';

// Types
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
  phone: string;
  status: 'active' | 'inactive';
  fatherName?: string;
  motherName?: string;
  address?: string;
  createdAt: string;
  gender?: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  admissionDate?: string;
}

interface AttendanceRecord {
  date: string;
  day: string;
  status: 'present' | 'late' | 'absent';
  checkIn: string | null;
  checkOut: string | null;
}

// Reusable Components
const StatusBadge = ({ status }: { status: 'active' | 'inactive' }) => (
  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
    status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }`}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

const InfoCard = ({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
    <div className="px-5 py-4 border-b border-gray-100">
      <h3 className="flex items-center text-sm font-medium text-gray-900">
        <i className={`fas fa-${icon} mr-2 text-indigo-600`}></i>
        {title}
      </h3>
    </div>
    <div className="p-5">
      {children}
    </div>
  </div>
);

interface InfoItemProps {
  icon: string;
  label: string;
  value: React.ReactNode;
  iconClass?: string;
  className?: string;
  valueClass?: string;
}

const InfoItem = ({ 
  icon, 
  label, 
  value, 
  iconClass = 'text-gray-400', 
  className = '',
  valueClass = 'text-gray-900'
}: InfoItemProps) => {
  return (
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
};

const AttendanceCalendar = ({ records }: { records: AttendanceRecord[] }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'absent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-7 gap-1">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day} className="text-xs text-center font-medium text-gray-500 py-2">
          {day[0]}
        </div>
      ))}
      
      {records.map((record, idx) => (
        <div 
          key={idx}
          className={`text-xs text-center py-1.5 rounded ${getStatusColor(record.status)}`}
          title={`${record.day}, ${record.date}`}
        >
          {new Date(record.date).getDate()}
        </div>
      ))}
    </div>
  );
};

export default function StudentDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // ✅ unwraps the Promise
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  // Generate mock attendance data
  const generateAttendanceData = useCallback((): AttendanceRecord[] => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    return Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(currentYear, currentMonth, i + 1);
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) return null;
      
      const status = Math.random() > 0.2 
        ? (Math.random() > 0.3 ? 'present' : 'late') 
        : 'absent';
      
      return {
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        status,
        checkIn: status !== 'absent' ? `${8 + Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} AM` : null,
        checkOut: status !== 'absent' ? `${2 + Math.floor(Math.random() * 3)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} PM` : null
      };
    }).filter(Boolean) as AttendanceRecord[];
  }, []);

  const [attendanceData] = useState<AttendanceRecord[]>(generateAttendanceData);
  const presentCount = attendanceData.filter(a => a.status === 'present' || a.status === 'late').length;
  const absentCount = attendanceData.length - presentCount;
  const attendancePercentage = Math.round((presentCount / Math.max(1, attendanceData.length)) * 100);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const response = await apiService.students.getById(id);
        
        if (response.success && response.data) {
          setStudent(response.data);
          setError(null);
        } else {
          setError(response.error || 'Failed to load student data');
          console.error('Failed to fetch student:', response.error);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        setError(message);
        console.error('Error fetching student:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !student) {
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
              {error || 'Student not found'}
            </p>
            <button
              onClick={() => router.back()}
              className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              ← Back to students
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
          <span>Back to Students</span>
        </button>

        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          {/* Banner with Gradient Background */}
          <div className="relative h-36 bg-gradient-to-r from-indigo-600 to-blue-600 overflow-hidden">
            {/* Subtle Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
            
            {/* Content Container */}
            <div className="relative h-full container mx-auto px-6 flex items-center">
              {/* Profile Avatar */}
              <div className="relative h-24 w-24 rounded-full bg-white/10 backdrop-blur-sm border-4 border-white/20 flex-shrink-0 overflow-hidden shadow-lg">
                <div className="h-full w-full flex items-center justify-center text-white text-3xl font-bold bg-gradient-to-br from-indigo-500 to-blue-600">
                  {getInitials(student.name)}
                </div>
              </div>

              {/* Student Info */}
              <div className="ml-6 text-white">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-sm">{student.name}</h1>
                  <div className="flex items-center space-x-3">
                    <StatusBadge status={student.status} />
                    <span className="text-sm bg-white/20 px-3 py-1 rounded-full font-medium">
                      ID: {student.studentId}
                    </span>
                  </div>
                </div>
                
                {/* Contact Info */}
                <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-indigo-100">
                  <div className="flex items-center">
                    <i className="fas fa-envelope mr-2 w-4 text-center"></i>
                    <span className="truncate max-w-xs">{student.email}</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-phone-alt mr-2 w-4 text-center"></i>
                    <span>{student.phone || 'N/A'}</span>
                  </div>
                  {student.class && (
                    <div className="flex items-center">
                      <i className="fas fa-graduation-cap mr-2 w-4 text-center"></i>
                      <span>{student.class.name}</span>
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
                  <i className="fas fa-venus-mars mr-1.5 text-indigo-500"></i>
                  {student.gender || 'Gender not specified'}
                </span>
                <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-800">
                  <i className="fas fa-tint mr-1.5 text-purple-500"></i>
                  {student.bloodGroup || 'Blood group not specified'}
                </span>
                {student.dateOfBirth && (
                  <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                    <i className="fas fa-birthday-cake mr-1.5 text-blue-500"></i>
                    DOB: {new Date(student.dateOfBirth).toLocaleDateString()}
                  </span>
                )}
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
                  Message
                </button>
                <button 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <i className="fas fa-edit mr-2"></i>
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="p-6">
            {/* Rest of your content will go here */}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information Card */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <i className="fas fa-user-circle mr-2 text-indigo-600"></i>
                  Personal Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoItem 
                    icon="venus-mars"
                    label="Gender"
                    value={student.gender}
                    iconClass={student.gender?.toLowerCase() === 'male' ? 'text-blue-500' : 'text-pink-500'}
                  />
                  <InfoItem 
                    icon="calendar-alt"
                    label="Member Since"
                    value={formatDate(student.createdAt)}
                    iconClass="text-indigo-500"
                  />
                  {student.fatherName && (
                    <InfoItem 
                      icon="user-tie"
                      label="Father's Name"
                      value={student.fatherName}
                      iconClass="text-gray-600"
                    />
                  )}
                  {student.motherName && (
                    <InfoItem 
                      icon="female"
                      label="Mother's Name"
                      value={student.motherName}
                      iconClass="text-pink-400"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Academic Information Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <i className="fas fa-graduation-cap mr-2 text-indigo-600"></i>
                  Academic Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoItem 
                    icon="chalkboard"
                    label="Class"
                    value={`${student.class?.name || 'Not Assigned'}${student.class?.classId ? ` (${student.class.classId})` : ''}`}
                    iconClass="text-amber-500"
                  />
                  <InfoItem 
                    icon="user-graduate"
                    label="Status"
                    value={student.status === 'active' ? 'Active' : 'Inactive'}
                    valueClass={student.status === 'active' ? 'text-green-600' : 'text-red-600'}
                    iconClass={student.status === 'active' ? 'text-green-500' : 'text-red-500'}
                  />
                </div>
              </div>
            </div>

            {/* Address Card */}
            {student.address && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <i className="fas fa-map-marker-alt mr-2 text-indigo-600"></i>
                    Address
                  </h2>
                </div>
                <div className="p-6">
                  <div className="flex">
                    <i className="fas fa-home mt-1 mr-3 text-lg text-gray-500"></i>
                    <p className="text-gray-700 whitespace-pre-line">{student.address}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-4">
                <button className="w-full flex items-center justify-between px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors duration-200">
                  <span className="font-medium">Send Message</span>
                  <i className="fas fa-paper-plane"></i>
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 mt-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors duration-200">
                  <span className="font-medium">View Attendance</span>
                  <i className="fas fa-calendar-check"></i>
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 mt-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors duration-200">
                  <span className="font-medium">View Results</span>
                  <i className="fas fa-chart-line"></i>
                </button>
              </div>
            </div>

            {/* Attendance Summary Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <i className="fas fa-calendar-check mr-2 text-indigo-600"></i>
                  Attendance Summary
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{presentCount}</div>
                    <div className="text-sm text-gray-600">Present</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600">{absentCount}</div>
                    <div className="text-sm text-gray-600">Absent</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{attendancePercentage}%</div>
                    <div className="text-sm text-gray-600">Attendance</div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">This Month's Record</h3>
                  <div className="space-y-3">
                    {attendanceData.slice(0, 5).map((record, index) => (
                      <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
                            record.status === 'present' ? 'bg-green-100 text-green-600' :
                            record.status === 'late' ? 'bg-amber-100 text-amber-600' :
                            'bg-red-100 text-red-600'
                          }`}>
                            <i className={`fas ${
                              record.status === 'present' ? 'fa-check' :
                              record.status === 'late' ? 'fa-clock' : 'fa-times'
                            } text-xs`}></i>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{record.day}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          {record.checkIn ? (
                            <span className="text-green-600">{record.checkIn}</span>
                          ) : (
                            <span className="text-red-500">Absent</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {attendanceData.length > 5 && (
                    <button className="mt-4 w-full text-center text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                      View Full Attendance Record <i className="fas fa-arrow-right ml-1"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Class information will be shown in the Academics tab */}
          </div>
        </div>
      </div>
    </div>
  );
}
