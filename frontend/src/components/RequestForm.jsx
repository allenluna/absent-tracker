import { useState, useEffect } from "react";
import api from "../api";
import { Toaster, toast } from 'react-hot-toast';
import {InputReason} from "./Reason";

const Modal = ({ isOpen, onClose, onCreateRequest }) => {
  const [formData, setFormData] = useState({
    date_request: "",
    category: "",
    reason: "",
    start_shift: "",
    end_shift: "",
    number: "",
    remarks: "",
  });
  const [isUserDomain, setIsUserDomain] = useState("");

  const listOfReasons = InputReason(isUserDomain);

  useEffect(() => {
    userDomain()
  }, [])

    ////////////////////////////// userdomain /////////////////////////
    const userDomain = async () => {
      try {
        const response = await api.get("/api/userdomain/");
        setIsUserDomain(response.data.userdomain);
      } catch (error) {
        toast.error("Error fetching user domain:", error);
      }
    };

    

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.date_request === "" || formData.category === "" || formData.start_shift === "" || formData.end_shift === "" || formData.number === ""  ) {
      toast.error('Please fill out all the red outlined fields.');
      return;
    }
  
    
    api.post("/api/absent-request/", formData).then((res) => {
      if (res.status === 201) console.log(res.data)
      else console.log("Failed")
    })

    console.log(formData.start_shift)

    onCreateRequest(formData);
    onClose();
  };
  
  // console.log(formData)

  if (!isOpen) return null;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <Toaster position="top-center" reverseOrder={false} />
        <div className="bg-white p-8 rounded shadow-xl z-10 w-full max-w-lg">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <div className="mb-4 col-span-1">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date_request">
                  Date Request
                </label>
                <input
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    formData.date_request === "" ? "border-red-500" : ""
                  }`}
                  id="date_request"
                  type="date"
                  name="date_request"
                  value={formData.date_request}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="mb-4 col-span-1">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                    Category
                  </label>
                  <select
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      formData.category === "" ? "border-red-500" : ""
                    }`}
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="" disabled>Select Category</option>
                    <option value="Vacation">Vacation</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>

                <div className="mb-4 col-span-1">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reason">
                    Reason
                  </label>
                  <select
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      formData.reason === "" ? "border-red-500" : ""
                    }`}
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                  >
                    <option value="" disabled>Select Reason</option>
                    {listOfReasons.map((reasonData, index) => (
                      <option key={index} value={reasonData}>{reasonData}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="mb-4 col-span-1">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="start_shift">
                    Start Shift
                  </label>
                  <input
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      formData.start_shift === "" ? "border-red-500" : ""
                    }`}
                    id="start_shift"
                    type="datetime-local"
                    name="start_shift"
                    value={formData.start_shift}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-4 col-span-1">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="end_shift">
                    End Shift
                  </label>
                  <input
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      formData.end_shift === "" ? "border-red-500" : ""
                    }`}
                    id="end_shift"
                    type="datetime-local"
                    name="end_shift"
                    value={formData.end_shift}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-4 col-span-1">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contact_number">
                  Contact Number
                </label>
                <input
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    formData.number === "" ? "border-red-500" : ""
                  }`}
                  id="contact_number"
                  type="text"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4 col-span-1">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="remarks">
                  Remarks
                </label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                type="submit"
              >
                Create
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;
