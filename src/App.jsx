import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import PropertiesPage from './pages/PropertiesPage'
import PropertyDetailPage from './pages/PropertyDetailPage'
import ChatPage from './pages/ChatPage'
import AboutPage from './pages/AboutPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/properties/:id" element={<PropertyDetailPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
