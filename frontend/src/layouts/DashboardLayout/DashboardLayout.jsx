import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/sidebar/Sidebar'
import './DashboardLayout.css'
export default function DashboardLayout() {
  return (
    <div className='DashboardLayout'>
      <Sidebar />
      <Outlet />
    </div>
  )
}
