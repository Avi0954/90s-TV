import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { NostalgiaProvider, useNostalgia } from './context/NostalgiaContext';
import Layout from './components/Layout';

import IntroPage from './components/IntroPage';
import Dashboard from './components/Dashboard';
import CartoonList from './components/CartoonList';
import CartoonPlayer from './components/CartoonPlayer';
import FranchisePage from './components/FranchisePage';
import AdminPanel from './components/AdminPanel';
import About from './components/About';
import Disclaimer from './components/Disclaimer';
import Contact from './components/Contact';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppRoutes = () => {
  const { skipIntroPreference, sessionIntroPassed } = useNostalgia();

  const shouldShowIntro = !skipIntroPreference && !sessionIntroPassed;

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route
          path="/intro"
          element={shouldShowIntro ? <IntroPage /> : <Navigate to="/" />}
        />

        <Route
          path="/*"
          element={
            !shouldShowIntro ? (
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Navigate to="/" />} />
                  <Route path="/channel/:id" element={<CartoonList />} />
                  <Route path="/franchise/:name" element={<FranchisePage />} />
                  <Route path="/player/:id" element={<CartoonPlayer />} />
                  <Route path="/admin" element={<AdminPanel />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/disclaimer" element={<Disclaimer />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/intro" />
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
