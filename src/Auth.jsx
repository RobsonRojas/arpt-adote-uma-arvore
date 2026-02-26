import React, { useState } from 'react';
import { auth } from './firebase/config';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider
} from 'firebase/auth';
import {
    Dialog, DialogTitle, DialogContent, TextField, Button,
    Typography, Box, Alert, Divider, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GoogleIcon from '@mui/icons-material/Google';

export default function Auth({ open, onClose, onLoginSuccess }) {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState(null);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                if (onLoginSuccess && userCredential.user) onLoginSuccess(userCredential.user);
                onClose();
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                alert('Conta criada com sucesso!');
                if (onLoginSuccess && userCredential.user) onLoginSuccess(userCredential.user);
                onClose();
            }
        } catch (err) {
            let message = 'Erro de autenticação';
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                message = 'E-mail ou senha inválidos';
            } else if (err.code === 'auth/email-already-in-use') {
                message = 'Este e-mail já está em uso';
            } else if (err.code === 'auth/weak-password') {
                message = 'A senha deve ter pelo menos 6 caracteres';
            }
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            if (onLoginSuccess && result.user) onLoginSuccess(result.user);
            onClose();
        } catch (err) {
            setError(err.message || 'Erro ao logar com Google');
        } finally {
            setLoading(true);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {isLogin ? 'Entrar' : 'Cadastrar'}
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleAuth} sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                    <TextField
                        label="E-mail"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        fullWidth
                        size="small"
                    />
                    <TextField
                        label="Senha"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        fullWidth
                        size="small"
                    />

                    <Button
                        variant="contained"
                        type="submit"
                        disabled={loading}
                        fullWidth
                    >
                        {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
                    </Button>

                    <Box sx={{ mt: 1, textAlign: 'center' }}>
                        <Button
                            variant="text"
                            onClick={() => setIsLogin(!isLogin)}
                            size="small"
                        >
                            {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
                        </Button>
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }}>OU</Divider>

                <Button
                    variant="outlined"
                    startIcon={<GoogleIcon />}
                    onClick={handleGoogleLogin}
                    fullWidth
                    disabled={loading}
                >
                    {isLogin ? 'Entrar com Google' : 'Cadastrar com Google'}
                </Button>
            </DialogContent>
        </Dialog>
    );
}
