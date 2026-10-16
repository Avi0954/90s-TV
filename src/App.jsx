import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { NostalgiaProvider, useNostalgia } from './context/NostalgiaContext';
import Layout from './components/Layout';

import IntroPage from './components/IntroPage';
import Dashboard from './components/Dashboard';
import CartoonList from './components/CartoonList';
import CartoonPlayer from './components/CartoonPlayer';
import FranchisePage from './components/FranchisePage';

// Code-split heavier / secondary routes
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const About = lazy(() => import('./components/About'));
const Disclaimer = lazy(() => import('./components/Disclaimer'));
const Contact = lazy(() => import('./components/Contact'));

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const PageFallback = () => (
  <div style={{
    minHeight: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text-secondary, #888)',
    fontFamily: '"Press Start 2P", monospace',
    fontSize: '0.8rem'
  }}>
    TUNING SIGNAL...
  </div>
);

const AppRoutes = () => {
  const { skipIntroPreference, sessionIntroPassed } = useNostalgia();

  const shouldShowIntro = !skipIntroPreference && !sessionIntroPassed;

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route
          path="/intro"
          element={shouldShowIntro ? <IntroPage /> : <Navigate to="/" replace />}
        />

        <Route
          path="/*"
          element={
            !shouldShowIntro ? (
              <Layout>
                <Suspense fallback={<PageFallback />}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Navigate to="/" replace />} />
                    <Route path="/channel/:id" element={<CartoonList />} />
                    <Route path="/franchise/:name" element={<FranchisePage />} />
                    <Route path="/player/:id" element={<CartoonPlayer />} />
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/disclaimer" element={<Disclaimer />} />
                    <Route path="/contact" element={<Contact />} />
                  </Routes>
                </Suspense>
              </Layout>
            ) : (
              <Navigate to="/intro" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <NostalgiaProvider>
      <AppRoutes />
    </NostalgiaProvider>
  );
}

export default App;
