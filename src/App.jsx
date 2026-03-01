import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import {
    createTheme, ThemeProvider, CssBaseline, AppBar, Toolbar, Typography,
    Box, Switch, Paper, Badge, Button
} from '@mui/material';
import { supabase } from './supabaseClient';
import { auth } from './firebase/config';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import Auth from './Auth';
import ExploreView from './views/ExploreView';
import DashboardView from './views/DashboardView';
import TreeAdoptionModal from './components/TreeAdoptionModal';
import { rawInventoryData } from './data/inventoryData';
import { convertUtmToLatLng } from './utils/treeUtils';

const processedTrees = rawInventoryData.map(tree => {
    const northing = parseFloat(tree.latUtm.replace(',', '.'));
    const easting = parseFloat(tree.longUtm.replace(',', '.'));
    const [lat, lng] = convertUtmToLatLng(easting, northing);
    return { ...tree, lat, lng };
});

const Navigation = ({ user, adoptedTreesCount, userMode, setUserMode, setAuthOpen }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await firebaseSignOut(auth);
        navigate('/');
    };

    return (
        <AppBar position="static" color={userMode === 'guardian' ? 'primary' : 'secondary'} elevation={0} className="no-print">
            <Toolbar>
                <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none', flexGrow: 1 }}>
                    <span className="material-icons" style={{ marginRight: 10 }}>park</span>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>ARPT | Adote</Typography>
                </Box>
                <Box sx={{ mr: 2 }}>
                    <Button color="inherit" component={Link} to="/" sx={{ fontWeight: location.pathname === '/' ? 'bold' : 'normal' }}>Explorar</Button>
                    <Button color="inherit" component={Link} to="/dashboard" sx={{ fontWeight: location.pathname === '/dashboard' ? 'bold' : 'normal' }}>
                        <Badge badgeContent={adoptedTreesCount} color="error">Meu Painel&nbsp;</Badge>
                    </Button>
                </Box>
                <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                    {user ? (
                        <>
                            <Typography variant="body2" sx={{ mr: 2 }}>{user.email.split('@')[0]}</Typography>
                            <Button color="inherit" onClick={handleLogout} size="small" variant="outlined">Sair</Button>
                        </>
                    ) : (
                        <Button color="inherit" onClick={() => setAuthOpen(true)} variant="outlined">Entrar</Button>
                    )}
                </Box>
                <Paper sx={{ px: 2, py: 0.5, borderRadius: 5, display: 'flex', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ mr: 1, fontWeight: 'bold' }}>{userMode === 'guardian' ? "GUARDIÃO" : "SÓCIO"}</Typography>
                    <Switch checked={userMode === 'partner'} onChange={(e) => setUserMode(e.target.checked ? 'partner' : 'guardian')} color="secondary" />
                </Paper>
            </Toolbar>
        </AppBar>
    );
};

const AppContent = () => {
    const [viewMode, setViewMode] = useState('grid');
    const [userMode, setUserMode] = useState('guardian');
    const [selectedTree, setSelectedTree] = useState(null);
    const [showCroqui, setShowCroqui] = useState(false);
    const [adoptedTrees, setAdoptedTrees] = useState([]);
    const [user, setUser] = useState(null);
    const [authOpen, setAuthOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                fetchAdoptedTrees(firebaseUser.uid);
            } else {
                setAdoptedTrees([]);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchAdoptedTrees = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('adocoes')
                .select('*')
                .eq('user_id', userId);

            if (error) throw error;
            if (data) {
                setAdoptedTrees(data.map(d => d.tree_data));
            }
        } catch (error) {
            console.error('Erro ao buscar adoções:', error);
        }
    };

    const handleConfirmAdoption = async (tree, quotas, invested) => {
        if (!user) {
            setAuthOpen(true);
            return false;
        }

        const newAdoption = { ...tree, quotas, invested, mode: userMode, date: new Date().toLocaleDateString('pt-PT') };

        try {
            const { error } = await supabase.from('adocoes').insert({
                user_id: user.uid,
                tree_id: tree.id,
                quotas,
                invested,
                mode: userMode,
                date: newAdoption.date,
                tree_data: newAdoption
            });

            if (error) throw error;

            setAdoptedTrees([...adoptedTrees, newAdoption]);
            // setSelectedTree(null); // Don't close immediately, let the modal show success
            return true;
        } catch (error) {
            console.error('Erro ao registrar adoção:', error);
            alert("Erro ao registrar adoção.");
            return false;
        }
    };

    const theme = createTheme({
        palette: { primary: { main: '#2E7D32' }, secondary: { main: '#D84315' }, background: { default: '#F1F8E9' } }
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Navigation
                user={user}
                adoptedTreesCount={adoptedTrees.length}
                userMode={userMode}
                setUserMode={setUserMode}
                setAuthOpen={setAuthOpen}
            />

            <Routes>
                <Route path="/" element={
                    <ExploreView
                        processedTrees={processedTrees}
                        userMode={userMode}
                        setUserMode={setUserMode}
                        setSelectedTree={setSelectedTree}
                        showCroqui={showCroqui}
                        setShowCroqui={setShowCroqui}
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                    />
                } />
                <Route path="/dashboard" element={
                    <DashboardView adoptedTrees={adoptedTrees} />
                } />
            </Routes>

            <TreeAdoptionModal
                tree={selectedTree}
                open={!!selectedTree}
                onClose={() => setSelectedTree(null)}
                userMode={userMode}
                onConfirmAdoption={handleConfirmAdoption}
            />
            <Auth open={authOpen} onClose={() => setAuthOpen(false)} />
        </ThemeProvider>
    );
};

const App = () => (
    <BrowserRouter>
        <AppContent />
    </BrowserRouter>
);

export default App;
