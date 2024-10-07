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
              {/* <img src={Logo} className='w-20 h-20   mx-auto' alt="VXI LOGO" /> */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="1.34947 0.177365 42.99 43.01">
               <path d="M 5.348 20.105 c 0.6428 -0.8603 1.4908 -1.3903 2.3389 -1.9202 a 1 1 -32 0 1 14.4168 -9.0086 l 5.2992 8.4805 l 2.5441 -1.5898 l -5.2992 -8.4805 a 1 1 -32 0 0 -19.5051 12.1881 z m 4.0349 -2.98 l 2.5441 -1.5898 a 1 1 -32 0 1 5.9363 -3.7094 l 2.6496 4.2402 l 2.5441 -1.5898 l -2.6496 -4.2402 a 1 1 -32 0 0 -11.0246 6.889 m 4.2402 -2.6496 l 2.5442 -1.5897 a 1 1 -32 0 0 -2.5442 1.5897 m 18.0199 0.5317 l 0 0 a 1 1 -32 0 0 -1.5898 -2.5441 z m -2.6496 -4.2402 l 0 0 a 1 1 -32 0 1 3.7094 5.9363 l -12.7207 7.9488 l 1.5898 2.5441 l 12.7207 -7.9488 a 1 1 -32 0 0 -6.889 -11.0246 z m -4.5995 -6.5511 c 0.89 0.6148 1.4199 1.4628 1.9499 2.3109 l 0 0 a 1 1 -32 0 1 9.0086 14.4168 l -8.4805 5.2992 l 1.5898 2.5441 l 8.4805 -5.2992 a 1 1 -32 0 0 -12.1881 -19.5051 z m 5.1276 26.2671 a 1 1 -32 0 0 2.5441 -1.5898 l -1.6961 1.0598 z m 4.2402 -2.6496 l 0 0 a 1 1 -32 0 1 -5.9363 3.7094 l -2.6496 -4.2402 l -2.5441 1.5898 l 2.6496 4.2402 a 1 1 -32 0 0 11.0246 -6.889 z m 6.6035 -4.5308 c -0.6671 0.8213 -1.5152 1.3512 -2.3632 1.8812 l 0 0 a 1 1 -32 0 1 -14.4168 9.0086 l -5.2992 -8.4805 l -2.5441 1.5898 l 5.2992 8.4805 a 1 1 -32 0 0 19.5051 -12.1881 z m -25.2596 6.755 l -1.0598 -1.6961 a 1 1 -32 0 0 1.5898 2.5441 z m 3.1795 5.0883 l -1.5898 -2.5441 a 1 1 -32 0 1 -3.7094 -5.9363 l 12.7207 -7.9488 l -1.5898 -2.5441 l -12.7207 7.9488 a 1 1 -32 0 0 6.889 11.0246 z m 3.0715 3.9813 c -0.9518 -0.5891 -1.4817 -1.4372 -2.0117 -2.2852 l 0 0 a 1 1 -32 0 1 -9.0086 -14.4168 l 8.4805 -5.2992 l -1.5898 -2.5441 l -8.4805 5.2992 a 1 1 -32 0 0 12.1881 19.5051 z m -17.9101 -18.2927 m 19.3328 19.7184 c -6.7596 4.8489 -16.3082 2.7888 -20.2264 -5.2705 c -2.4435 -5.7522 -0.7541 -10.7121 1.4182 -13.6555 c -2.4858 -3.4818 -3.7436 -8.7462 -1.1048 -14.1001 c 3.4204 -6.6488 12.4594 -10.0672 20.0431 -4.7111 c 3.8981 -2.9971 13.0286 -4.9255 19.1289 3.335 c 4.3255 6.7977 1.5839 13.125 -0.3251 15.5973 c 4.7518 6.7873 2.7437 15.485 -4.2333 19.6785 c -4.0285 2.3298 -9.894 2.639 -14.6584 -0.8398 z" fill="#000000"/>
              </svg>
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
              {/* <img src={Logo} className='w-20 h-20   mx-auto' alt="VXI LOGO" /> */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="1.34947 0.177365 42.99 43.01">
               <path d="M 5.348 20.105 c 0.6428 -0.8603 1.4908 -1.3903 2.3389 -1.9202 a 1 1 -32 0 1 14.4168 -9.0086 l 5.2992 8.4805 l 2.5441 -1.5898 l -5.2992 -8.4805 a 1 1 -32 0 0 -19.5051 12.1881 z m 4.0349 -2.98 l 2.5441 -1.5898 a 1 1 -32 0 1 5.9363 -3.7094 l 2.6496 4.2402 l 2.5441 -1.5898 l -2.6496 -4.2402 a 1 1 -32 0 0 -11.0246 6.889 m 4.2402 -2.6496 l 2.5442 -1.5897 a 1 1 -32 0 0 -2.5442 1.5897 m 18.0199 0.5317 l 0 0 a 1 1 -32 0 0 -1.5898 -2.5441 z m -2.6496 -4.2402 l 0 0 a 1 1 -32 0 1 3.7094 5.9363 l -12.7207 7.9488 l 1.5898 2.5441 l 12.7207 -7.9488 a 1 1 -32 0 0 -6.889 -11.0246 z m -4.5995 -6.5511 c 0.89 0.6148 1.4199 1.4628 1.9499 2.3109 l 0 0 a 1 1 -32 0 1 9.0086 14.4168 l -8.4805 5.2992 l 1.5898 2.5441 l 8.4805 -5.2992 a 1 1 -32 0 0 -12.1881 -19.5051 z m 5.1276 26.2671 a 1 1 -32 0 0 2.5441 -1.5898 l -1.6961 1.0598 z m 4.2402 -2.6496 l 0 0 a 1 1 -32 0 1 -5.9363 3.7094 l -2.6496 -4.2402 l -2.5441 1.5898 l 2.6496 4.2402 a 1 1 -32 0 0 11.0246 -6.889 z m 6.6035 -4.5308 c -0.6671 0.8213 -1.5152 1.3512 -2.3632 1.8812 l 0 0 a 1 1 -32 0 1 -14.4168 9.0086 l -5.2992 -8.4805 l -2.5441 1.5898 l 5.2992 8.4805 a 1 1 -32 0 0 19.5051 -12.1881 z m -25.2596 6.755 l -1.0598 -1.6961 a 1 1 -32 0 0 1.5898 2.5441 z m 3.1795 5.0883 l -1.5898 -2.5441 a 1 1 -32 0 1 -3.7094 -5.9363 l 12.7207 -7.9488 l -1.5898 -2.5441 l -12.7207 7.9488 a 1 1 -32 0 0 6.889 11.0246 z m 3.0715 3.9813 c -0.9518 -0.5891 -1.4817 -1.4372 -2.0117 -2.2852 l 0 0 a 1 1 -32 0 1 -9.0086 -14.4168 l 8.4805 -5.2992 l -1.5898 -2.5441 l -8.4805 5.2992 a 1 1 -32 0 0 12.1881 19.5051 z m -17.9101 -18.2927 m 19.3328 19.7184 c -6.7596 4.8489 -16.3082 2.7888 -20.2264 -5.2705 c -2.4435 -5.7522 -0.7541 -10.7121 1.4182 -13.6555 c -2.4858 -3.4818 -3.7436 -8.7462 -1.1048 -14.1001 c 3.4204 -6.6488 12.4594 -10.0672 20.0431 -4.7111 c 3.8981 -2.9971 13.0286 -4.9255 19.1289 3.335 c 4.3255 6.7977 1.5839 13.125 -0.3251 15.5973 c 4.7518 6.7873 2.7437 15.485 -4.2333 19.6785 c -4.0285 2.3298 -9.894 2.639 -14.6584 -0.8398 z" fill="#000000"/>
              </svg>
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
