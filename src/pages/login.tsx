import React, { useEffect, useState } from 'react';
import {onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { auth } from '../../firebase-config'; 
import styles from '../styles/login.module.css'; 

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string>('');
    const [isRegistering, setIsRegistering] = useState<boolean>(false);  // Toggle between Register and Login

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        setError('');

        try {
            if (isRegistering) {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                console.log('User registered:', userCredential.user);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (error: any) {
            setError(error.message);
            console.error('Authentication error:', error);
        }
    };

    const handleLogout = async (): Promise<void> => {
        try {
            await signOut(auth);
        } catch (error: any) {
            setError(error.message);
            console.error('Logout error:', error);
        }
    };

    if (user) {
        return (
            <div className={styles.loggedInContainer}>
                <div className={styles.loginForm}>
                    <p>{user.email} is logged in</p>
                    <button onClick={handleLogout} className={styles.button}>Logout</button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.loginContainer}>
            <form onSubmit={handleLogin} className={styles.loginForm}>
                <h1>{isRegistering ? 'Register' : 'Login'}</h1>
                {error && <p className={styles.errorMessage}>{error}</p>}
                <div className={styles.inputGroup}>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.currentTarget.value)}
                        className={styles.input}
                        required
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.currentTarget.value)}
                        className={styles.input}
                        required
                    />
                </div>
                <div className={styles.buttonContainer}>
                    <button type="submit" className={styles.button}>
                        {isRegistering ? 'Register' : 'Login'}
                    </button>
                </div>
                <button onClick={() => setIsRegistering(!isRegistering)} className={styles.toggleButton}>
                    {isRegistering ? 'Have an account? Login' : 'Need an account? Register'}
                </button>
            </form>
        </div>
    );
};

export default Login;