import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';  

const LogDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/logs'); 
        setLogs(res.data);
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => filter === 'all' || log.level === filter);

  return (
    <div className="container">
      <h1>Log Dashboard</h1>
      <div className="filter-buttons">
        <button 
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'active' : ''}
        >All</button>
        <button 
          onClick={() => setFilter('info')}
          className={filter === 'info' ? 'active' : ''}
        >Info</button>
        <button 
          onClick={() => setFilter('warn')}
          className={filter === 'warn' ? 'active' : ''}
        >Warn</button>
        <button 
          onClick={() => setFilter('error')}
          className={filter === 'error' ? 'active' : ''}
        >Error</button>
        <button 
          onClick={() => setFilter('success')}
          className={filter === 'success' ? 'active' : ''}
        >Success</button>
      </div>
      <ul>
        {filteredLogs.map((log, index) => (
          <li key={index} className={log.level}>
            <div>{`${log.message}`}</div>
            <div className="timestamp">{`${log.timestamp}`}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LogDashboard;
