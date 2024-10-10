import { Toaster, toast } from 'react-hot-toast';
import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import styles from "../styles/Form.module.css";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import Logo  from "../assets/VXI_Logo 1.png"

function Form({ route, method }) {
  const [addUserData, setAddUserData] = useState({
    hrid: '',
    nt_account: '',
    dateHired: '',
    firstName: '',
    middleName: '',
    lastName: '',
    position: '',
    team: '',
    employeeStatus: '',
    country: '',
    userStatus: 'admin',
  });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddUserData((prev) => ({
      ...prev, [name]: name === 'team' || name === 'position' ? value.toUpperCase() : value
      
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const title = method === "AGENT ABSENT TRACKER" ? "AGENT ABSENT TRACKER" : "Register";
  const btn = method === "AGENT ABSENT TRACKER" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);


    try {
      if (method === "AGENT ABSENT TRACKER"){
        if (!domain){
          toast.error("Domain is required.");
          setLoading(false);
        }else if (!username){
          toast.error("Username is required.");
          setLoading(false);
        }
        else if (!password){
          toast.error("Password is required.");
          setLoading(false);
        }else{
          const response = await api.post(route, { username, password, domain });
          // console.log(response.data)
          if(response.data.message ===  "User Exists."){
            const res  = await api.post("/api/token/", { username, password });
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
            navigate("/");
          }else if(response.data.message == "User registered successfully"){
            const res  = await api.post("/api/token/", { username, password });
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
            navigate("/");
          }else{
            navigate("/login");
          }
        }
      }
    } catch (error) {
      if (error.response.status == 500){
        toast.error('Check Domain and NTAccount.');

      }else if (error.response) {
        toast.error(error.response.data.message || (method === "AGENT ABSENT TRACKER" ? "Invalid Domain or NTAccount or Date Hired." : "Registration failed. User Already Exists."));
      } else if (error.request) {
        toast.error('No response received from server.');
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-lg">
        <Toaster position="top-center" reverseOrder={false} />
        {method === "register" ? (
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
            <div className=' text-center'>
              <img src={Logo} className='w-20 h-20   mx-auto' alt="VXI LOGO" />
            </div>
            <h3 className="text-center text-2xl mb-4">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(addUserData).map((key) => (
                key !== 'userStatus' ? (
                  <div className="mb-4" key={key}>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={key}>
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id={key}
                      type={key === 'hrid' ? 'number' : 'text'}
                      name={key}
                      placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                      value={addUserData[key]}
                      onChange={handleChange}
                      required
                      autoComplete='off'
                    />
                  </div>
                ) : (
                  <div className="mb-4" key={key}>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={key}>User Status</label>
                    <select
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id={key}
                      name={key}
                      value={addUserData[key]}
                      onChange={handleChange}
                      required
                      autoComplete='off'
                    >
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                )
              ))}
            </div>
            <div className="flex items-center justify-between">
              <button
                className={`${styles.btn} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                type="submit"
                disabled={loading}
              >
                {loading ? "Loading..." : btn}
              </button>
            </div>
          </form>
        ) : (
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
            <div className=' text-center'>
              <img src={Logo} className='w-20 h-20   mx-auto' alt="VXI LOGO" />
            </div>
            <h3 className="text-center text-2xl py-5">{title}</h3>
            <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="domain">
                    Domain
                  </label>
                  <select
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                    id="domain"
                    name="domain"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                  >
                    <option value="" disabled>Select Domain</option>
                    <option value="VXIPHP">VXIPHP</option>
                    <option value="MCM">MCM</option>
                    <option value="VXIINDIA">VXIINDIA</option>
                  </select>
                </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                NTAccount
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder="NTAccount"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete='off'
                // required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Date Hired
              </label>
              <div className="relative">
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline pr-10"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="MMDDYYYY"
                  onChange={(e) => setPassword(e.target.value)}
                  // required
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 pb-3 flex items-center cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button
                className={`${styles.btn} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                type="submit"
                disabled={loading}
              >
                {loading ? "Loading..." : btn}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Form;
