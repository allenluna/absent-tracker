import React, { useState, useEffect } from 'react';
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import api from '../api';
import {Toaster, toast} from 'react-hot-toast';
import { RiAddLine } from 'react-icons/ri';

const Reports = () => {
  const [userData, setUserData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isUserDomain, setIsUserDomain] = useState("");
  const [dateFilter, setDateFilter] = useState({from: "", to: "", filter_type: "all", file_type: ""})
  const [toFile, setToFile] = useState({csv: "", excel: ""})
  const rowsPerPage = 10;

  useEffect(() => {
    getUserData();
    userDomain();
  }, []);

  ////////////////////////////Get User data/////////////////////////
  const getUserData = async () => {
    try {
      const userData = await api.get("/api/absent-request/data/");
      setUserData(userData.data);
    } catch (error) {
      toast.error("Error fetching data");
    }
  };


  ////////////////////////////// Get the user domain /////////////////
  // example VXIPHP
  const userDomain = async () => {
    try {
      const response = await api.get("/api/userdomain/");
      setIsUserDomain(response.data.userdomain);
    } catch (error) {
      console.error("Error fetching user domain:", error);
    }
  };

  ///////////////////// Pagination //////////////////////
  const totalPages = Math.ceil(userData.length / rowsPerPage);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const filteredData = userData.filter(row =>
    row.name.toUpperCase().includes(search.toUpperCase())
  );

  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  /////////////////////// convert formdate ///////////////////////////
  const formatDate = (dateString) => {
    // Parse the date string
    const shiftDate = new Date(dateString);
  
    // Format the date in UTC to ensure consistency with backend
    const formattedDate = `${(shiftDate.getUTCMonth() + 1).toString().padStart(2, '0')}/${shiftDate.getUTCDate().toString().padStart(2, '0')}/${shiftDate.getUTCFullYear()} ${shiftDate.getUTCHours() % 12 || 12}${shiftDate.getUTCHours() >= 12 ? 'PM' : 'AM'}`;
  
    return formattedDate;
  };

  ///////////////////// filter table from datetime /////////////////////
  const dateHandleChange = (e) => {
    const {name, value} = e.target;
    setDateFilter((prev) => ({
      ...prev, [name]: value
  }));
  };

  /////////////////////// handle function for download ///////////////////////////
  const filterAndDownload = async (data) => {
    try {
      const response = await api.post("/api/filter-date/", data, { responseType: 'blob' });
  
      // Check if the response is a file (blob) or JSON
      if (response.headers['content-type'].includes('application/json')) {
        const responseData = await response.data.text();
        const parsedData = JSON.parse(responseData);
  
        if (parsedData.data === "No Date Request.") {
          toast.error(parsedData.data);
        } else {
          setUserData(parsedData.data);
          if (data.file_type) {
            downloadFileFunc(data.file_type);
          }
        }
      } else {
        // Handle file download
        let mimeType = 'text/csv';
        let fileExtension = 'csv';
  
        // Adjust MIME type and file extension for Excel files
        if (data.file_type === 'excel') {
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          fileExtension = 'xlsx';
        }
  
        // Create a blob from the response data
        const blob = new Blob([response.data], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `VXI_ABSENT_REQUEST.${fileExtension}`);
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error filtering data:", error);
      toast.error("Error filtering data.");
    }
  };


  const handleDownload = (fileType, e = null, filterBtn = null) => {
    if (e) e.preventDefault();
  
    if (filterBtn === "filter") {
      if (dateFilter.from === "" || dateFilter.to === "") {
        toast.error("Empty Date.");
      } else {
        const updatedDateFilter = { ...dateFilter, file_type: fileType || "" };
        filterAndDownload(updatedDateFilter);
      }
    } else {
      if (dateFilter.from === "" || dateFilter.to === "") {
        downloadFileFunc(fileType);
      }else{
        const updatedDateFilter = { ...dateFilter, file_type: fileType || "" };
        filterAndDownload(updatedDateFilter);
      }
    }
  };
  


  //////////////////// fcuntion for download file
  const downloadFileFunc = async (fileType) => {
    const fileStr = JSON.stringify({ file_type: fileType });

        try {
          const response = await api.post("/api/absent-request/data/", fileStr, { responseType: 'blob' });
          console.log(response.data)
          // Determine MIME type and file extension
          let mimeType = 'text/csv';
          let fileExtension = 'csv';
    
          // check if excel button is clicked
          if (fileType === 'excel') {
            mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            fileExtension = 'xlsx';
          }
      
          // Create a blob from the response data
          const blob = new Blob([response.data], { type: mimeType });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `VXI_ABSENT_REQUEST.${fileExtension}`);
          document.body.appendChild(link);
          link.click();
      
          link.parentNode.removeChild(link);
          window.URL.revokeObjectURL(url);
      
        } catch (error) {
          toast.error("Error downloading file.");
        }
      
  }

  return (
    <div className="flex flex-col p-4">
      <Toaster position="top-center" reverseOrder={false} />
      <form onSubmit={(e) => handleDownload(null, e, "filter")}>
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="mb-4 col-span-1">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="start_shift">From</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="start_shift"
              type="date"
              name="from"
              value={dateFilter.from}
              onChange={dateHandleChange}
            />
          </div>
          <div className="mb-4 col-span-1">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="end_shift">To</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="end_shift"
              type="date"
              name="to"
              value={dateFilter.to}
              onChange={dateHandleChange}
            />
          </div>
          <div className="mb-4 col-span-1">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="filter_type">
                Type
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="filter_type"
                name="filter_type"
                value={dateFilter.filter_type}
                onChange={dateHandleChange}
              >
                <option value="all">All</option>
                <option value="my bucket">My Bucket</option>
              </select>
          </div>
          <div className="mb-4 col-span-1 flex items-end">
            <button
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Filter
            </button>
          </div>
        </div>
      </form>

      <div className="mb-4 col-span-1 flex justify-between items-center">
      <div className="flex items-center">
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
          onClick={() => handleDownload('csv')}
        >
          <RiAddLine className="text-lg mr-1" /> CSV
        </button> 
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold ml-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center"
          onClick={() => handleDownload('excel')}
        >
          <RiAddLine className="text-lg mr-1" /> EXCEL
        </button>
      </div>
        <div className="flex items-center">
          <label className="block text-gray-700 text-sm font-bold mr-2" htmlFor="search">
            Search
          </label>
          <input
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Name'
            autoComplete='off'
          />
        </div>
      </div>



      <div className="overflow-x-auto">
        <div className="py-2 inline-block min-w-full">
          <div className="overflow-hidden">
            <table className="min-w-full text-center text-sm font-light">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4">Image</th>
                  <th scope="col" className="px-6 py-4">HRID</th>
                  <th scope="col" className="px-6 py-4">Name</th>
                  <th scope="col" className="px-6 py-4">Contact Number</th>
                  <th scope="col" className="px-6 py-4">Category</th>
                  <th scope="col" className="px-6 py-4">Reason</th>
                  <th scope="col" className="px-6 py-4">Team</th>
                  <th scope="col" className="px-6 py-4">Start Shift</th>
                  <th scope="col" className="px-6 py-4">End Shift</th>
                  <th scope="col" className="px-6 py-4">Remarks</th>
                  <th scope="col" className="px-6 py-4">Absent Date</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((row, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-6 py-4 flex justify-center">
                      <img src={`${import.meta.env.VITE_IMAGE_URL}${row.author}`} alt={row.name} className="w-10 h-10 rounded-full" />
                    </td>
                    <td className="px-6 py-4 text-center">{row.author}</td>
                    <td className="px-6 py-4 text-center">{row.name}</td>
                    <td className="px-6 py-4 text-center">{row.number}</td>
                    <td className="px-6 py-4 text-center">{row.category}</td>
                    <td className="px-6 py-4 text-center">{row.reason}</td>
                    <td className="px-6 py-4 text-center">{row.team}</td>
                    <td className="px-6 py-4 text-center">{formatDate(row.start_shift)}</td>
                    <td className="px-6 py-4 text-center">{formatDate(row.end_shift)}</td>
                    <td className="px-6 py-4 text-center">{row.remarks}</td>
                    <td className="px-6 py-4 text-center">{row.date_request}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end mt-4">
              <nav>
                <ul className="inline-flex items-center -space-x-px">
                  <li>
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700"
                    >
                      <GrFormPreviousLink className="w-5 h-5" />
                    </button>
                  </li>
                  <li className='bg-orange-500'>
                    <span
                      className="px-4 py-2 leading-tight border cursor-pointer bg-orange-500 text-gray-500 bg-white border-gray-300"
                      onClick={() => paginate(currentPage)}
                    >
                      {currentPage}
                    </span>
                  </li>
                  <li>
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700"
                    >
                      <GrFormNextLink className="w-5 h-5" />
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
