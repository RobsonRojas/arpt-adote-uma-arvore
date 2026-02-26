import React, { useMemo, useState } from 'react';
import { Container, Grid, Typography, Box, Paper, Divider, FormControlLabel, Checkbox, ToggleButtonGroup, ToggleButton } from '@mui/material';
import FeaturedTreeCard from '../components/FeaturedTreeCard';
import TreeGridCard from '../components/TreeGridCard';
import MapComponent from '../components/MapComponent';
import { getTreeEncyclopedia } from '../utils/treeUtils';

const ExploreView = ({ processedTrees, userMode, setUserMode, setSelectedTree, showCroqui, setShowCroqui, viewMode, setViewMode }) => {

    const featuredTrees = useMemo(() => processedTrees
        .filter(t => !!getTreeEncyclopedia(t.vulgar).harvest)
        .sort((a, b) => {
            const infoA = getTreeEncyclopedia(a.vulgar);
            const infoB = getTreeEncyclopedia(b.vulgar);
            return (infoB.harvest.annualYield * infoB.harvest.unitPrice) - (infoA.harvest.annualYield * infoA.harvest.unitPrice);
        })
        .slice(0, 3), [processedTrees]);

    return (
        <Container maxWidth="xl" sx={{ mt: 3, mb: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" color="text.primary" sx={{ mb: 2, display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                    <span className="material-icons" style={{ marginRight: 8, color: '#FFC107' }}>diamond</span>
                    Oportunidades de Alto Rendimento
                </Typography>
                <Grid container spacing={2}>
                    {featuredTrees.map(tree => (
                        <Grid item xs={12} sm={4} key={tree.id}>
                            <FeaturedTreeCard tree={tree} onSelect={setSelectedTree} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 4, height: '100%' }}>
                        <Typography variant="h5" color={userMode === 'guardian' ? 'primary' : 'secondary'} fontWeight="bold">Perfil Ativo</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body2" color="text.secondary">
                            {userMode === 'guardian' ? 'Proteja matrizes permanentes e receba certificados digitais.' : 'Financie o manejo sustentável e rentabilize ativos reais.'}
                        </Typography>
                        {viewMode === 'map' && (
                            <Box sx={{ mt: 4 }}>
                                <Typography variant="subtitle2" gutterBottom>Legenda:</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}><Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#2E7D32', mr: 1 }} /><Typography variant="caption">Preservação</Typography></Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}><Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#D84315', mr: 1 }} /><Typography variant="caption">Produção</Typography></Box>
                                <Divider sx={{ my: 2 }} />
                                <FormControlLabel control={<Checkbox checked={showCroqui} onChange={(e) => setShowCroqui(e.target.checked)} color="primary" size="small" />} label={<Typography variant="caption" fontWeight="bold">Exibir Área do Inventário</Typography>} />
                            </Box>
                        )}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={9}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <ToggleButtonGroup value={viewMode} exclusive size="small" color="primary" onChange={(e, v) => v && setViewMode(v)} sx={{ bgcolor: '#fff' }}>
                            <ToggleButton value="grid"><span className="material-icons">grid_view</span>&nbsp;Grade</ToggleButton>
                            <ToggleButton value="map"><span className="material-icons">map</span>&nbsp;Mapa</ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                    {viewMode === 'grid' ? (
                        <Grid container spacing={2} sx={{ maxHeight: '60vh', overflowY: 'auto', pr: 1 }}>
                            {processedTrees.map(tree => (
                                <Grid item xs={12} sm={6} md={4} key={tree.id}>
                                    <TreeGridCard tree={tree} userMode={userMode} onSelect={setSelectedTree} />
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Paper elevation={3} sx={{ height: '60vh', overflow: 'hidden', borderRadius: 4 }}>
                            <MapComponent trees={processedTrees} onSelectTree={setSelectedTree} userMode={userMode} showCroqui={showCroqui} />
                        </Paper>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default ExploreView;
