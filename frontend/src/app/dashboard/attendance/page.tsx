'use client';

export default function AttendancePage() {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Attendance Management</h1>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg flex items-center">
          <i className="fas fa-plus mr-2"></i> Take Attendance
        </button>
      </div>
      
      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-600">Today's Attendance</h2>
              <p className="text-3xl font-bold text-gray-800">92%</p>
            </div>
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <i className="fas fa-calendar-day text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-600">Weekly Average</h2>
              <p className="text-3xl font-bold text-gray-800">89%</p>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <i className="fas fa-calendar-week text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-600">Monthly Average</h2>
              <p className="text-3xl font-bold text-gray-800">86%</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <i className="fas fa-calendar-alt text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-600">Students on Leave</h2>
              <p className="text-3xl font-bold text-gray-800">42</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <i className="fas fa-user-clock text-xl"></i>
            </div>
          </div>
        </div>
      </div>
      
      {/* Attendance Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Take Attendance</h2>
        <form>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select Class</option>
                <option value="10A">Class 10A</option>
                <option value="10B">Class 10B</option>
                <option value="9A">Class 9A</option>
                <option value="9B">Class 9B</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" defaultValue="2025-05-10" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select Subject</option>
                <option value="math">Mathematics</option>
                <option value="physics">Physics</option>
                <option value="chemistry">Chemistry</option>
                <option value="biology">Biology</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button type="button" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg">
              Load Students
            </button>
          </div>
        </form>
      </div>
      
      {/* Attendance Records */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Recent Attendance Records</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Students
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Present
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Absent
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Record 1 */}
              <tr className="table-row-hover">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">May 10, 2025</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Class 10A</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Mathematics</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">35</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">32</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">3</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    91.4%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="action-btn view-btn" data-tooltip="View Details">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="action-btn edit-btn" data-tooltip="Edit">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="action-btn delete-btn" data-tooltip="Delete">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </td>
              </tr>

              {/* Record 2 */}
              <tr className="table-row-hover">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">May 10, 2025</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Class 10B</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Physics</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">32</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">30</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">2</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    93.8%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="action-btn view-btn" data-tooltip="View Details">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="action-btn edit-btn" data-tooltip="Edit">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="action-btn delete-btn" data-tooltip="Delete">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </td>
              </tr>

              {/* Record 3 */}
              <tr className="table-row-hover">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">May 9, 2025</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Class 9A</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Chemistry</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">30</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">25</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">5</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    83.3%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="action-btn view-btn" data-tooltip="View Details">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="action-btn edit-btn" data-tooltip="Edit">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="action-btn delete-btn" data-tooltip="Delete">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </td>
              </tr>

              {/* Record 4 */}
              <tr className="table-row-hover">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">May 9, 2025</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Class 9B</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">English</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">33</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">31</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">2</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    93.9%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="action-btn view-btn" data-tooltip="View Details">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="action-btn edit-btn" data-tooltip="Edit">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="action-btn delete-btn" data-tooltip="Delete">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </td>
              </tr>

              {/* Record 5 */}
              <tr className="table-row-hover">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">May 8, 2025</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Class 10A</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Biology</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">35</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">33</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">2</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    94.3%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="action-btn view-btn" data-tooltip="View Details">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="action-btn edit-btn" data-tooltip="Edit">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="action-btn delete-btn" data-tooltip="Delete">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </td>
              </tr>
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
                  Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">28</span> results
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
