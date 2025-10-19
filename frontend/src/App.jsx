import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import About from './pages/About'
import Contact from './pages/Contact'
import PublicMap from './pages/PublicMap'
import LoginPage from './components/auth/Login'
import UserRegister from './components/auth/UserRegister'
import OfficialRegister from './components/auth/OfficialRegister'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path='/map' element={<PublicMap />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register/user" element={<UserRegister />} />
      <Route path="/register/official" element={<OfficialRegister />} />
    </Routes>
  )
}

export default App