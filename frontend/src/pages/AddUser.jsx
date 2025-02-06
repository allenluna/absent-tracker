import React, { useState, useEffect, useCallback } from 'react';
import AddUserModal from '../components/AddUserModal';
import ShowAddedUser from '../components/ShowAddedUser';
import api from '../api';

const debounce = (func, delay) => {
  let debounceTimer;
  return function(...args) {
    const context = this;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
};

const AddUser = () => {
  const [search, setSearch] = useState("");
  const [userdomainData, setUserdomainData] = useState("");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUserData = async (query) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_ADD_USER_API}${query}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const text = await response.text();
      if (!text) {
        setError('Searching...');
        setUserData(null);
        setIsLoading(false);
        return;
      }
      
      const data = JSON.parse(text);
      // console.log(data)
      setUserData(data);
      setError(null); 
      setIsModalOpen(true);
    } catch (error) {
      setUserData(null);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // get userdomain
  const userDomain = async () => {
    try {
      const response = await api.get("/api/userdomain/");
      setUserdomainData(response.data.userdomain);
    } catch (error) {
      console.error("Error fetching user domain:", error);
    }
  };
  // this debounce is a timer for fetching data from api, you can change the 500 which is .5 sec
  const debouncedFetchUserData = useCallback(debounce(fetchUserData, 300), []);

  useEffect(() => {
    // api.get("/api/users/all-users/").then(res => console.log(res.data))
    if (search) {
      debouncedFetchUserData(search);
    }
      userDomain();
  }, [search, debouncedFetchUserData]);
  return (
    <div className='p-4'>
      <div className="mb-4 col-span-1">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hrid">
          Search
        </label>
        <input
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
          id="hrid"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='HRID'
          autoComplete='off'
        />
      </div>
      {search && (
        <div className="bg-white p-8 rounded shadow-md z-10 w-full">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            error ? (
              <div className="text-gray-500">{error}</div>
            ) : userData ? (
              <div onClick={() => setIsModalOpen(true)} className="cursor-pointer">
                <h2 className="text-lg font-bold">User Data</h2>
                <pre className="bg-gray-100 p-4 rounded">{userData.firstName} {userData.middleName} {userData.lastName}</pre>
              </div>
            ) : (
              <div className="text-gray-500">Not Found</div>
            )
          )}
        </div>
      )}
      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userData={userData}
        imageDataURL={search}
        userDomain={userdomainData}
      />


      {/* This is a user table you can see it inside the component folder named ShowAddedUser.jsx */}
      <ShowAddedUser />
    </div>
  );
};

export default AddUser;
