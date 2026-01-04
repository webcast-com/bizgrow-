import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './components/Home'
import Blog from './components/Blog'
import Post from './components/Post'

export default function App() {
  const [theme, setTheme] = useState(() => {
    if (localStorage.getItem('theme') === 'dark') return 'dark'
    return 'light'
  })

  useEffect(() => {
    const html = document.documentElement
    if (theme === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header theme={theme} onThemeToggle={toggleTheme} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/post/:id" element={<Post />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
