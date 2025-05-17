'use client';

export default function ReportsPage() {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Reports Dashboard</h1>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg flex items-center">
          <i className="fas fa-file-export mr-2"></i> Export Reports
        </button>
      </div>
      
      {/* Report Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-600">Attendance Reports</h2>
              <p className="text-3xl font-bold text-gray-800">24</p>
            </div>
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <i className="fas fa-calendar-check text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-600">Performance Reports</h2>
              <p className="text-3xl font-bold text-gray-800">36</p>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <i className="fas fa-chart-line text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-600">Teacher Reports</h2>
              <p className="text-3xl font-bold text-gray-800">18</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <i className="fas fa-chalkboard-teacher text-xl"></i>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-gray-600">Financial Reports</h2>
              <p className="text-3xl font-bold text-gray-800">12</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <i className="fas fa-money-bill-wave text-xl"></i>
            </div>
          </div>
        </div>
      </div>
      
      {/* Report Generation Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Generate Custom Report</h2>
        <form>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select Report Type</option>
                <option value="attendance">Attendance Report</option>
                <option value="performance">Performance Report</option>
                <option value="teacher">Teacher Report</option>
                <option value="financial">Financial Report</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <div className="flex space-x-2">
                <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" defaultValue="2025-05-01" />
                <div className="flex items-center">
                  <span className="text-gray-500">to</span>
                </div>
                <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" defaultValue="2025-05-10" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class (Optional)</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">All Classes</option>
                <option value="10A">Class 10A</option>
                <option value="10B">Class 10B</option>
                <option value="9A">Class 9A</option>
                <option value="9B">Class 9B</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button type="button" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg">
              Generate Report
            </button>
          </div>
        </form>
      </div>
      
      {/* Recent Reports */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Recent Reports</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Generated
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Generated By
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
              {/* Report 1 */}
              <tr className="table-row-hover">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">RPT001</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-indigo-100 text-indigo-600 mr-2">
                      <i className="fas fa-calendar-check"></i>
                    </div>
                    <div className="text-sm text-gray-900">Attendance Report</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">May 10, 2025</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Admin User</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Completed
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="action-btn view-btn" data-tooltip="View Report">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="action-btn edit-btn" data-tooltip="Download PDF">
                      <i className="fas fa-file-pdf"></i>
                    </button>
                    <button className="action-btn delete-btn" data-tooltip="Delete">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </td>
              </tr>

              {/* Report 2 */}
              <tr className="table-row-hover">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">RPT002</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-green-100 text-green-600 mr-2">
                      <i className="fas fa-chart-line"></i>
                    </div>
                    <div className="text-sm text-gray-900">Performance Report</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">May 9, 2025</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Sarah Wilson</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Completed
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="action-btn view-btn" data-tooltip="View Report">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="action-btn edit-btn" data-tooltip="Download PDF">
                      <i className="fas fa-file-pdf"></i>
                    </button>
                    <button className="action-btn delete-btn" data-tooltip="Delete">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </td>
              </tr>

              {/* Report 3 */}
              <tr className="table-row-hover">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">RPT003</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-2">
                      <i className="fas fa-chalkboard-teacher"></i>
                    </div>
                    <div className="text-sm text-gray-900">Teacher Report</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">May 8, 2025</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Admin User</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Completed
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="action-btn view-btn" data-tooltip="View Report">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="action-btn edit-btn" data-tooltip="Download PDF">
                      <i className="fas fa-file-pdf"></i>
                    </button>
                    <button className="action-btn delete-btn" data-tooltip="Delete">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </td>
              </tr>

              {/* Report 4 */}
              <tr className="table-row-hover">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">RPT004</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-yellow-100 text-yellow-600 mr-2">
                      <i className="fas fa-money-bill-wave"></i>
                    </div>
                    <div className="text-sm text-gray-900">Financial Report</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">May 7, 2025</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">David Miller</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Processing
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="action-btn view-btn" data-tooltip="View Report">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="action-btn edit-btn opacity-50 cursor-not-allowed" data-tooltip="Download PDF">
                      <i className="fas fa-file-pdf"></i>
                    </button>
                    <button className="action-btn delete-btn" data-tooltip="Delete">
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </td>
              </tr>

              {/* Report 5 */}
              <tr className="table-row-hover">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">RPT005</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-indigo-100 text-indigo-600 mr-2">
                      <i className="fas fa-calendar-check"></i>
                    </div>
                    <div className="text-sm text-gray-900">Attendance Report</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">May 6, 2025</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Lisa Parker</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Failed
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="action-btn view-btn opacity-50 cursor-not-allowed" data-tooltip="View Report">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="action-btn edit-btn opacity-50 cursor-not-allowed" data-tooltip="Download PDF">
                      <i className="fas fa-file-pdf"></i>
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
                  Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">90</span> results
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
      
      {/* Performance Summary Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Class Performance Summary</h2>
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
              <span className="text-sm font-medium text-gray-700">Class 10B</span>
              <span className="text-sm font-medium text-gray-700">78%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-indigo-600 h-2.5 rounded-full" style={{width: '78%'}}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Class 9A</span>
              <span className="text-sm font-medium text-gray-700">92%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-indigo-600 h-2.5 rounded-full" style={{width: '92%'}}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Class 9B</span>
              <span className="text-sm font-medium text-gray-700">65%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-indigo-600 h-2.5 rounded-full" style={{width: '65%'}}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Class 8A</span>
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
