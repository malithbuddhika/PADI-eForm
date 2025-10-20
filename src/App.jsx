





import { useState } from 'react';
import Login from './Login.jsx';
import Dashboard from './Dashboard.jsx';

function App() {
  const [userId, setUserId] = useState(null);
  return userId ? <Dashboard userId={userId} /> : <Login onSuccess={(id) => setUserId(id)} />;
}

export default App;
