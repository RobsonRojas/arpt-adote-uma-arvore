import React, { useState } from 'react';
import { supabase } from './supabaseClient';
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
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                if (onLoginSuccess && data.user) onLoginSuccess(data.user);
                onClose();
            } else {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                // Supabase sends a confirmation email by default unless disabled
                alert('Verifique seu e-mail para o link de confirmação!');
            }
        } catch (err) {
            setError(err.message || 'Erro de autenticação');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                // options: { redirectTo: window.location.origin } // Opcional
            });
            if (error) throw error;
        } catch (err) {
            setError(err.message || 'Erro ao logar com Google');
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
