import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { ScrollManager } from './components/layout/ScrollManager'
import HomePage from './pages/HomePage'

// Market Push is its own chunk — the landing page doesn't pay for it.
const MarketPushPage = lazy(() => import('./pages/MarketPushPage'))
const CommunityPage = lazy(() => import('./pages/CommunityPage'))
const CommunityDetailPage = lazy(() => import('./pages/CommunityDetailPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))

function App() {
  return (
    // reducedMotion="user": Motion drops transform animations when the OS asks it to
    <MotionConfig reducedMotion="user">
      <ScrollManager />
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-sun px-5 py-3 font-semibold text-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Suspense fallback={<div className="min-h-svh bg-ink" />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/market-push" element={<MarketPushPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/community/:slug" element={<CommunityDetailPage />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </MotionConfig>
  )
}

export default App
