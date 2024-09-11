import React, { useState, ReactNode } from 'react';

interface PasswordProtectionProps {
  password: string;
  children: ReactNode;
}

const PasswordProtection: React.FC<PasswordProtectionProps> = ({ password, children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [inputPassword, setInputPassword] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputPassword === password) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password. Please try again.');
      setInputPassword('');
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
    },
    form: {
      padding: '24px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '16px',
    },
    input: {
      width: '100%',
      padding: '8px',
      marginBottom: '16px',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
    },
    button: {
      width: '100%',
      padding: '8px',
      color: 'white',
      backgroundColor: '#3b82f6',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.form}>
        <h2 style={styles.title}>Password Protected</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={inputPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputPassword(e.target.value)}
            placeholder="Enter password"
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordProtection;