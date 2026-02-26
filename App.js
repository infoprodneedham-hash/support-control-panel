import React from 'react';
import SocialShare from './components/SocialShare'; // Adjust path if needed
import './App.css'; 

function App() {
  return (
    <div className="support-hub-container">
      {/* The Social Bar stays pinned to the left */}
      <SocialShare siteTitle="Support Hub - Compliance & Resume Tools" />

      <header>
        <h1>Support Hub Control Panel</h1>
      </header>

      <main>
        <section className="dashboard-grid">
          {/* Your existing Hub modules go here */}
          <div className="card">Resume Builder</div>
          <div className="card">Compliance Tracker</div>
          <div className="card">Shift Manager</div>
        </section>
      </main>

      <footer>
        <p>&copy; 2026 Support Hub - Geelong</p>
      </footer>
    </div>
  );
}

export default App;
