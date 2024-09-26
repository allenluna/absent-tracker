import React, { useState, useEffect } from 'react';
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import { FaUserEdit } from "react-icons/fa";
import { TiUserDelete } from "react-icons/ti";
import api from '../api';
import UpdateUserModal from './UpdateUserModal';
import { Toaster, toast } from 'react-hot-toast';

const ShowAddedUser = () => {
  const [userData, setUserData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserDomain, setIsUserDomain] = useState("");
  const [selectedUser, setSelectedUser] = useState({
    employeeStatus: "",
    firstName: "",
    hrid: "",
    lastName: "",
    middleName: "",
    nt_accountr: "",
    position: "",
    userStatus: ""
  })

  const rowsPerPage = 7;

  ////////////////////////////// userdomain /////////////////////////
  const userDomain = async () => {
    try {
      const response = await api.get("/api/userdomain/");
      setIsUserDomain(response.data.userdomain);
    } catch (error) {
      console.error("Error fetching user domain:", error);
    }
  };


  useEffect(() => {
    fetchData();
    userDomain()
  }, [userData]);

  const fetchData = async () => {
    try {
      const response = await api.get('/api/users/all-users/');
      setUserData(response.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(userData.length / rowsPerPage);

  // Get current rows
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = userData.slice(indexOfFirstRow, indexOfLastRow);


  // Change page
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // get data to update user
  const updateUser = async (id) => {
    try {
      const response = await api.get(`/api/update/user/${id}/`);
      setSelectedUser(response.data);
      
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
    setIsModalOpen(true);
  };


  const deleteUser = async (id) => {
    try{
      await api.delete(`/api/delete/user/${id}/`);
      toast.success("User Deleted Successfully");
    }catch (error){
      toast.error("Failed to Delete User");
    }
  }

  return (
    <div className="flex flex-col">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="overflow-x-auto">
        <div className="py-2 inline-block min-w-full">
          <div className="overflow-hidden">
            <table className="min-w-full text-center text-sm font-light">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4">Image</th>
                  <th scope="col" className="px-6 py-4">ID</th>
                  <th scope="col" className="px-6 py-4">Name</th>
                  <th scope="col" className="px-6 py-4">Position</th>
                  <th scope="col" className="px-6 py-4">Region</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className=''>
                {currentRows.map((row) => (
                  <tr key={row.hrid} className="border-b h-full">
                    <td className="px-6 py-4 flex justify-center h-full">
                      <img src={`${import.meta.env.VITE_IMAGE_URL}${row.hrid}`} alt={`${row.firstName} ${row.lastName}`} className="w-10 h-10 rounded-full" />
                    </td>
                    <td className="px-6 py-4 text-center">{row.hrid}</td>
                    <td className="px-6 py-4 text-center">{row.firstName} {row.lastName}</td>
                    <td className="px-6 py-4 text-center">{row.position}</td>
                    <td className="px-6 py-4 text-center">{row.country}</td>
                    <td className="px-6 py-4 text-center">{row.userStatus}</td>
                    <td className="px-6 py-4 text-center flex justify-center items-center text-white">
                    
                    <button 
                      className='mr-2 rounded rounded-full bg-yellow-500 hover:bg-yellow-700 w-10 h-10 flex justify-center items-center'
                      onClick={() => updateUser(row.hrid)}
                    >
                      <FaUserEdit />
                    </button>
                    <button 
                      className='rounded rounded-full bg-red-500 hover:bg-red-700 w-10 h-10 flex justify-center items-center'
                      onClick={() => deleteUser(row.hrid)}
                    >
                        
                      <TiUserDelete />
                    </button>
                    </td>
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
                      className={`px-4 py-2 leading-tight border cursor-pointer bg-orange-500${
                        'text-gray-500 bg-white'
                      } border-gray-300`}
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
            <UpdateUserModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            userData={selectedUser}
            imageDataURL={selectedUser.hrid}
            userDomain={isUserDomain}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowAddedUser;
