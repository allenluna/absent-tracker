import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="flex">
        <Sidebar />
        <div className="flex-1">
        <Header />
        <Outlet />
        </div>
    </div>
  )
}

export default MainLayout