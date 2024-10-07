import React, { useEffect, useState } from 'react';
import { FaRegCalendarAlt, FaSignOutAlt } from 'react-icons/fa';
import { MdPersonAddAlt } from "react-icons/md";
import { Link } from 'react-router-dom';
import FooterImage from "../assets/VXIFooter.png"
import { TbReportSearch } from "react-icons/tb";
import api from '../api';


function Sidebar() {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdmin, setIsAdmin] = useState("")

  useEffect(() => {
    admin();
}, [isAdmin]);

const admin = async () => {
  try {
      const response = await api.get("/api/users/current/");
      setIsAdmin(response.data.userStatus);
  } catch (error) {
      console.error("Error fetching current user data:", error.message);
  }
};

  return (
    <>
      <div
        className={`relative h-screen bg-white text-orange-500 shadow-md flex flex-col justify-between transition-width duration-300 ${
          isHovered ? 'w-64' : 'w-20'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div>
          <div className="p-4 text-xl font-bold flex justify-center">AAT</div>
          <nav className="flex-1 px-2">
            <ul className="space-y-4">
              <li className={`hover:bg-orange-500 hover:text-white p-2 rounded-md flex items-center justify-start pl-5`}>
                <Link to="/" className="flex items-center">
                  <div className="text-xl mr-6" style={{ width: '24px', height: '24px', display: 'inline-flex', alignItems: 'center' }}>
                    <FaRegCalendarAlt />
                  </div>
                  <span className={`${isHovered ? '' : 'hidden'} ml-5 transition-opacity duration-300`} style={{width: '80px'}}>Calendar</span>
                </Link>
              </li>
              {isAdmin == "admin" && (
                <>
                
                  <hr className="border-gray-200"/>
                  <li className={`hover:bg-orange-500 hover:text-white p-2 rounded-md flex items-center justify-start pl-5`}>
                    <Link to="/adduser" className="flex items-center">
                      <div className="text-xl mr-5" style={{ width: '24px', height: '24px', display: 'inline-flex', alignItems: 'center' }}>
                        <MdPersonAddAlt />
                      </div>
                      <span className={`${isHovered ? '' : 'hidden'} ml-5 transition-opacity duration-300`} style={{width: '80px'}}>Add User</span>
                    </Link>
                  </li>
                  <hr className="border-gray-200"/>
                  <li className={`hover:bg-orange-500 hover:text-white p-2 rounded-md flex items-center justify-start pl-5`}>
                    <Link to="/reports" className="flex items-center">
                      <div className="text-xl mr-5" style={{ width: '24px', height: '24px', display: 'inline-flex', alignItems: 'center' }}>
                        <TbReportSearch />
                      </div>
                      <span className={`${isHovered ? '' : 'hidden'} ml-5 transition-opacity duration-300`} style={{width: '80px'}}>Reports</span>
                    </Link>
                  </li>
                  
                </>
             )}
            {isAdmin == "report" && (
                <>
                  <hr className="border-gray-200"/>
                  <li className={`hover:bg-orange-500 hover:text-white p-2 rounded-md flex items-center justify-start pl-5`}>
                    <Link to="/reports" className="flex items-center">
                      <div className="text-xl mr-5" style={{ width: '24px', height: '24px', display: 'inline-flex', alignItems: 'center' }}>
                        <TbReportSearch />
                      </div>
                      <span className={`${isHovered ? '' : 'hidden'} ml-5 transition-opacity duration-300`} style={{width: '80px'}}>Reports</span>
                    </Link>
                  </li>
                </>
             )}
             <hr className="border-gray-200"/>
              <li className={`hover:bg-orange-500 hover:text-white p-2 rounded-md flex items-center justify-start pl-5`}>
                <Link to="/logout" className="flex items-center">
                  <div className="text-xl mr-5" style={{ width: '24px', height: '24px', display: 'inline-flex', alignItems: 'center' }}>
                    <FaSignOutAlt />
                  </div>
                  <span className={`${isHovered ? '' : 'hidden'} ml-5 transition-opacity duration-300`} style={{width: '80px'}}>Logout</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex text-center justify-center items-center flex-col ml-3 mr-3 mb-3 ">
          <img src={FooterImage} alt="Footer Image" className="mb-3" />
          <p className={`${isHovered ? 'text-xm' : 'text-sm'} text-gray-600 leading-3 mb-3` } style={{ fontSize: '10px'}} >Version 2.0 - 5/18/2024</p>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
