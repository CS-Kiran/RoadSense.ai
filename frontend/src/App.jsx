import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import About from './pages/About'
import Contact from './pages/Contact'
import PublicMap from './pages/PublicMap'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path='/map' element={<PublicMap />} />
    </Routes>
  )
}

export default App