import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const logIn = async () => {
    try {
      await signInWithEmailAndPassword(getAuth(), email, password);
      // Navigation route
      navigate('/articles');
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <>
      <h1>Login</h1>
      {error && <p className="error">{error}</p> }
      <input placeholder="Email address"
             value={email}
             onChange={e => setEmail(e.target.value)}
      />
      <input type="password"
             placeholder="Password"
             value={password}
             onChange={e => setPassword(e.target.value)}
      />
      <button onClick={logIn}>Log in</button>
      <br />
      <Link to="/create-account">Create account</Link>
    </>
  );
}

export default LoginPage;
