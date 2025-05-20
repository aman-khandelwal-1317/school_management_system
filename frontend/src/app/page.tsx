'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

export default function Home() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <i className="fas fa-chalkboard-teacher text-indigo-600 text-2xl"></i>,
      title: 'Teacher Management',
      description: 'Easily manage teacher records, assign subjects, and track performance.'
    },
    {
      icon: <i className="fas fa-user-graduate text-indigo-600 text-2xl"></i>,
      title: 'Student Management',
      description: 'Comprehensive student records and enrollment tracking system.'
    },
    {
      icon: <i className="fas fa-chalkboard text-indigo-600 text-2xl"></i>,
      title: 'Class Management',
      description: 'Organize classes and manage student assignments efficiently.'
    },
    {
      icon: <i className="fas fa-book text-indigo-600 text-2xl"></i>,
      title: 'Subject Management',
      description: 'Create and manage subjects, assign them to classes and teachers.'
    },
    {
      icon: <i className="fas fa-clipboard-check text-indigo-600 text-2xl"></i>,
      title: 'Attendance System',
      description: 'Track and manage student attendance with detailed reports.'
    },
    {
      icon: <i className="fas fa-shield-alt text-indigo-600 text-2xl"></i>,
      title: 'Secure & Reliable',
      description: 'Built with JWT authentication and secure API endpoints.'
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                <i className="fas fa-school"></i>
              </div>
              <span className="text-xl font-bold text-gray-800">School Management</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-700 hover:text-indigo-600 transition-colors">Features</a>
              <a href="#screenshots" className="text-gray-700 hover:text-indigo-600 transition-colors">Screenshots</a>
              <a href="#tech-stack" className="text-gray-700 hover:text-indigo-600 transition-colors">Tech Stack</a>
              <a 
                href="https://github.com/aman-khandelwal-1317/school_management_system" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-gray-900 transition-colors text-xl flex items-center"
                title="View on GitHub"
              >
                <i className="fab fa-github"></i>
              </a>
              <Link href="/admin/login" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                <i className="fas fa-sign-in-alt mr-2"></i>Login
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button 
              className="md:hidden text-gray-700 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <i className="fas fa-times text-2xl"></i>
              ) : (
                <i className="fas fa-bars text-2xl"></i>
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-xl overflow-hidden z-50">
              <div className="p-4 space-y-3 border-t border-gray-100 text-center">
                <a 
                  href="#features" 
                  className="block px-4 py-3 text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors font-medium mx-auto max-w-xs"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </a>
                <a 
                  href="#screenshots" 
                  className="block px-4 py-3 text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors font-medium mx-auto max-w-xs"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Screenshots
                </a>
                <a 
                  href="#tech-stack" 
                  className="block px-4 py-3 text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors font-medium mx-auto max-w-xs"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Tech Stack
                </a>
                <div className="pt-2 mt-2 border-t border-gray-100 max-w-xs mx-auto w-full space-y-3">
                  <a 
                    href="https://github.com/aman-khandelwal-1317/school_management_system" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="fab fa-github mr-2"></i> View on GitHub
                  </a>
                  <Link 
                    href="/admin/login" 
                    className="flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <i className="fas fa-sign-in-alt mr-2"></i>Login
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Modern School Management<br />
            <span className="text-indigo-600">Simplified</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Streamline your school's operations with our comprehensive management system. 
            Designed for efficiency, simplicity, and better learning outcomes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/admin/login" 
              className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center"
            >
              Explore Dashboard <i className="fas fa-arrow-right ml-2"></i>
            </Link>
            <a 
              href="#features" 
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              View Features
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your school efficiently and effectively.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow text-center">
                <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 max-w-md mx-auto">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Advanced Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful tools to enhance your school administration experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* React Hook Form */}
            <div className="bg-white p-8 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-pink-50 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <i className="fas fa-edit text-2xl text-pink-500"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">React Hook Form</h3>
              <p className="text-gray-600">Efficient form handling with minimal re-renders and built-in validation for better performance.</p>
            </div>

            {/* Role-Based Access */}
            <div className="bg-white p-8 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <i className="fas fa-user-shield text-2xl text-purple-500"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Role-Based Access</h3>
              <p className="text-gray-600">Granular permission system to control access based on user roles and responsibilities.</p>
            </div>

            {/* Rate Limiting */}
            <div className="bg-white p-8 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <i className="fas fa-tachometer-alt text-2xl text-blue-500"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Rate Limiting</h3>
              <p className="text-gray-600">Protect your application from abuse with configurable API rate limits and monitoring.</p>
            </div>

            {/* Smart Search */}
            <div className="bg-white p-8 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <i className="fas fa-search text-2xl text-amber-500"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Search</h3>
              <p className="text-gray-600">Fast, client-side search with filtering and sorting across all data tables.</p>
            </div>

            {/* Full Screen Mode */}
            <div className="bg-white p-8 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <i className="fas fa-expand-arrows-alt text-2xl text-green-500"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Full Screen Mode</h3>
              <p className="text-gray-600">Focus on your work with distraction-free full-screen views for better productivity.</p>
            </div>

            {/* Mobile Responsive */}
            <div className="bg-white p-8 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <i className="fas fa-mobile-alt text-2xl text-indigo-500"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Fully Responsive</h3>
              <p className="text-gray-600">Pixel-perfect UI that works seamlessly across all devices, from mobile to desktop.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section id="screenshots" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Sneak Peek</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Take a look at our intuitive and user-friendly interface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dashboard Preview */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="p-1 bg-gray-100 flex">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="p-4">
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                  <Image
                    src="/images/screenshots/dashboard.png"
                    alt="Dashboard Preview"
                    width={800}
                    height={450}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                <h3 className="text-xl font-semibold mt-4 text-gray-900">Interactive Dashboard</h3>
                <p className="text-gray-600 mt-2">Get an overview of your school's performance at a glance.</p>
              </div>
            </div>

            {/* Student Management */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="p-1 bg-gray-100 flex">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="p-4">
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                  <Image
                    src="/images/screenshots/student.png"
                    alt="Student Management"
                    width={800}
                    height={450}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mt-4 text-gray-900">Student Management</h3>
                <p className="text-gray-600 mt-2">Comprehensive student records and enrollment tracking system.</p>
              </div>
            </div>

            {/* Class Detail Page */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="p-1 bg-gray-100 flex">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="p-4">
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                  <Image
                    src="/images/screenshots/class.png"
                    alt="Class Detail Page"
                    width={800}
                    height={450}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mt-4 text-gray-900">Class Management</h3>
                <p className="text-gray-600 mt-2">Detailed view of class information and student roster.</p>
              </div>
            </div>

            {/* Subject Page */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="p-1 bg-gray-100 flex">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="p-4">
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                  <Image
                    src="/images/screenshots/subject.png"
                    alt="Subject Management"
                    width={800}
                    height={450}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mt-4 text-gray-900">Subject Management</h3>
                <p className="text-gray-600 mt-2">Organize and manage all subjects in one place.</p>
              </div>
            </div>

            {/* Teacher Detail Page */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="p-1 bg-gray-100 flex">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="p-4">
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                  <Image
                    src="/images/screenshots/teacher.png"
                    alt="Teacher Detail Page"
                    width={800}
                    height={450}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mt-4 text-gray-900">Teacher Profiles</h3>
                <p className="text-gray-600 mt-2">Detailed teacher information and class assignments.</p>
              </div>
            </div>

            {/* Student Add Form */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="p-1 bg-gray-100 flex">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="p-4">
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                  <Image
                    src="/images/screenshots/student-add.png"
                    alt="Student Add Form"
                    width={800}
                    height={450}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mt-4 text-gray-900">Student Registration</h3>
                <p className="text-gray-600 mt-2">Simple and efficient form for adding new students.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech-stack" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Technology Stack</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built with modern technologies for optimal performance and developer experience
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {/* Next.js */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fab fa-react text-3xl text-indigo-600"></i>
              </div>
              <h4 className="font-semibold text-gray-900">Next.js</h4>
              <p className="text-sm text-gray-500 mt-1">v15.3.2</p>
            </div>

            {/* TypeScript */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fab fa-js text-3xl text-blue-600"></i>
              </div>
              <h4 className="font-semibold text-gray-900">TypeScript</h4>
              <p className="text-sm text-gray-500 mt-1">v5.x</p>
            </div>

            {/* Tailwind CSS */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 bg-cyan-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-wind text-3xl text-cyan-500"></i>
              </div>
              <h4 className="font-semibold text-gray-900">Tailwind CSS</h4>
              <p className="text-sm text-gray-500 mt-1">v4.x</p>
            </div>

            {/* Node.js */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fab fa-node-js text-3xl text-green-600"></i>
              </div>
              <h4 className="font-semibold text-gray-900">Node.js</h4>
              <p className="text-sm text-gray-500 mt-1">v20.x</p>
            </div>

            {/* MongoDB */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-database text-3xl text-green-500"></i>
              </div>
              <h4 className="font-semibold text-gray-900">MongoDB</h4>
              <p className="text-sm text-gray-500 mt-1">v8.14.2</p>
            </div>

            {/* Express */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-code text-3xl text-gray-700"></i>
              </div>
              <h4 className="font-semibold text-gray-900">Express.js</h4>
              <p className="text-sm text-gray-500 mt-1">v5.1.0</p>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {/* React Hook Form */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-edit text-3xl text-pink-500"></i>
              </div>
              <h4 className="font-semibold text-gray-900">React Hook Form</h4>
              <p className="text-sm text-gray-500 mt-1">v7.56.3</p>
            </div>

            {/* JWT */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-lock text-3xl text-purple-600"></i>
              </div>
              <h4 className="font-semibold text-gray-900">JWT Auth</h4>
              <p className="text-sm text-gray-500 mt-1">v9.0.2</p>
            </div>

            {/* Mongoose */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-layer-group text-3xl text-red-500"></i>
              </div>
              <h4 className="font-semibold text-gray-900">Mongoose</h4>
              <p className="text-sm text-gray-500 mt-1">v8</p>
            </div>

            {/* Axios */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-exchange-alt text-3xl text-blue-500"></i>
              </div>
              <h4 className="font-semibold text-gray-900">Axios</h4>
              <p className="text-sm text-gray-500 mt-1">v1.6</p>
            </div>

            {/* Font Awesome */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-icons text-3xl text-blue-400"></i>
              </div>
              <h4 className="font-semibold text-gray-900">Font Awesome</h4>
              <p className="text-sm text-gray-500 mt-1">v6</p>
            </div>

            {/* Vercel */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-cloud text-3xl text-white"></i>
              </div>
              <h4 className="font-semibold text-gray-900">Vercel</h4>
              <p className="text-sm text-gray-500 mt-1">Deployment</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Explore the Dashboard?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Experience the power of our school management system with a demo account or log in with your credentials.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/admin/login" 
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              Login to Dashboard <i className="fas fa-arrow-right ml-2"></i>
            </Link>
            <a 
              href="#features" 
              className="bg-indigo-700 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-indigo-800 transition-colors flex items-center justify-center"
            >
              View Features
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                  <i className="fas fa-school"></i>
                </div>
                <span className="text-xl font-bold text-white">School Management</span>
              </div>
              <p className="mt-2 text-sm">© {new Date().getFullYear()} All Rights Reserved</p>
            </div>
            <div className="flex items-center space-x-6">
              <a 
                href="https://github.com/aman-khandelwal-1317/school_management_system" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center"
                title="View on GitHub"
              >
                <i className="fab fa-github text-xl mr-2"></i> GitHub
              </a>
              <a href="#" className="hover:text-white transition-colors hidden md:block">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors hidden md:block">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors hidden md:block">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
      </div>
      
      {/* Load Font Awesome */}
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js" 
        strategy="afterInteractive"
      />
    </>
  );
}
