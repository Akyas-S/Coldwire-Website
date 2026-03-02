import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import ProductFormPage from './pages/ProductFormPage'
import HelpPage from './pages/HelpPage'
import ContactUsPage from './pages/ContactUsPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/product-form" element={<ProductFormPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/contact-us" element={<ContactUsPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}
