import React, { useState, useEffect } from 'react'
import axios from 'axios';

function App() {

  const [data, setData] = useState([]);

  useEffect(() => {
    axios('http://localhost:5000/api/courses')
      .then(response => console.log(response.data))
  });

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
