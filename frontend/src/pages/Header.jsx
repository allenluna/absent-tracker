import React from 'react';
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";
import { AiOutlineExclamationCircle } from "react-icons/ai";


function Header() {
  const userGuide = '/USER_GUIDE.pdf'
  const faqs = '/VXI_TLO_ACKNOWLEDGEMENT_FAQ.pdf'
  return (
    <header className="bg-gray-800 text-white py-4 w-full">
      <div className="p-0 flex justify-between items-center pl-4 pr-4">
        <div className="text-xl font-semibold">AGENT ABSENT TRACKER</div>
        <nav>
          <ul className="flex items-center space-x-4">
            <li><a href={faqs} target="_blank" className="hover:text-gray-300 text-xl"><HiOutlineQuestionMarkCircle /></a></li>
            <li><a href={userGuide} target='_blank' className="hover:text-gray-300 text-xl"><AiOutlineExclamationCircle /></a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
