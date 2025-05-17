'use client';

import Image from 'next/image';

export default function Dashboard() {
  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-600">Total Students</h2>
              <p className="text-3xl font-bold text-gray-800">1,234</p>
            </div>
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <i className="fas fa-user-graduate text-xl"></i>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-500 text-sm font-medium">
              <i className="fas fa-arrow-up"></i> 12% 
            </span>
            <span className="text-gray-500 text-sm"> since last month</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-600">Total Teachers</h2>
              <p className="text-3xl font-bold text-gray-800">87</p>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <i className="fas fa-chalkboard-teacher text-xl"></i>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-500 text-sm font-medium">
              <i className="fas fa-arrow-up"></i> 4% 
            </span>
            <span className="text-gray-500 text-sm"> since last month</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-600">Classes</h2>
              <p className="text-3xl font-bold text-gray-800">24</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <i className="fas fa-chalkboard text-xl"></i>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-yellow-500 text-sm font-medium">
              <i className="fas fa-equals"></i> 0% 
            </span>
            <span className="text-gray-500 text-sm"> since last month</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-600">Attendance Rate</h2>
              <p className="text-3xl font-bold text-gray-800">92%</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <i className="fas fa-calendar-check text-xl"></i>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-red-500 text-sm font-medium">
              <i className="fas fa-arrow-down"></i> 3% 
            </span>
            <span className="text-gray-500 text-sm"> since last month</span>
          </div>
        </div>
      </div>
      
      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                        <i className="fas fa-user-plus"></i>
                      </div>
                      <span>New student registered</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">Admin</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5 min ago</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-green-100 text-green-600 mr-3">
                        <i className="fas fa-edit"></i>
                      </div>
                      <span>Updated class schedule</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">John Doe</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2 hours ago</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-yellow-100 text-yellow-600 mr-3">
                        <i className="fas fa-calendar-check"></i>
                      </div>
                      <span>Marked attendance</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">Sarah Williams</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Yesterday</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-red-100 text-red-600 mr-3">
                        <i className="fas fa-trash-alt"></i>
                      </div>
                      <span>Deleted old records</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">Admin</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2 days ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Calendar/Events */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-indigo-500 bg-indigo-50 p-3 rounded">
              <p className="text-sm font-medium text-indigo-800">Today</p>
              <p className="text-sm text-gray-700">Parent-Teacher Meeting</p>
              <p className="text-xs text-gray-500">2:00 PM - 4:00 PM</p>
            </div>
            <div className="border-l-4 border-green-500 bg-green-50 p-3 rounded">
              <p className="text-sm font-medium text-green-800">Tomorrow</p>
              <p className="text-sm text-gray-700">Science Exhibition</p>
              <p className="text-xs text-gray-500">10:00 AM - 1:00 PM</p>
            </div>
            <div className="border-l-4 border-yellow-500 bg-yellow-50 p-3 rounded">
              <p className="text-sm font-medium text-yellow-800">May 15, 2025</p>
              <p className="text-sm text-gray-700">Annual Sports Day</p>
              <p className="text-xs text-gray-500">All day event</p>
            </div>
            <div className="border-l-4 border-red-500 bg-red-50 p-3 rounded">
              <p className="text-sm font-medium text-red-800">May 20, 2025</p>
              <p className="text-sm text-gray-700">Final Exams Begin</p>
              <p className="text-xs text-gray-500">Multiple days</p>
            </div>
          </div>
          <button className="mt-4 text-sm text-indigo-600 hover:text-indigo-900 font-medium focus:outline-none">
            View All Events <i className="fas fa-arrow-right ml-1"></i>
          </button>
        </div>
      </div>
      
      {/* Performance Overview */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Class Performance Overview</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Class 10A</span>
              <span className="text-sm font-medium text-gray-700">85%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-indigo-600 h-2.5 rounded-full" style={{width: '85%'}}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Class 9B</span>
              <span className="text-sm font-medium text-gray-700">78%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-indigo-600 h-2.5 rounded-full" style={{width: '78%'}}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Class 8C</span>
              <span className="text-sm font-medium text-gray-700">92%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-indigo-600 h-2.5 rounded-full" style={{width: '92%'}}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Class 7A</span>
              <span className="text-sm font-medium text-gray-700">65%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-indigo-600 h-2.5 rounded-full" style={{width: '65%'}}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Class 6B</span>
              <span className="text-sm font-medium text-gray-700">81%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-indigo-600 h-2.5 rounded-full" style={{width: '81%'}}></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
