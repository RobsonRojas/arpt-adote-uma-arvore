import React, { useMemo, useState } from 'react';
import {
    Container, Grid, Typography, Box, Paper, Divider,
    FormControlLabel, Checkbox, ToggleButtonGroup, ToggleButton,
    Card, CardContent
} from '@mui/material';
import FeaturedTreeCard from '../components/FeaturedTreeCard';
import TreeGridCard from '../components/TreeGridCard';
import MapComponent from '../components/MapComponent';
import { getTreeDetails } from '../utils/treeUtils';

const ExploreView = ({ processedTrees, userMode, setUserMode, setSelectedTree, showCroqui, setShowCroqui, viewMode, setViewMode }) => {

    const featuredTrees = useMemo(() => processedTrees
        .filter(t => !!getTreeDetails(t.vulgar).harvest)
        .sort((a, b) => {
            const infoA = getTreeDetails(a.vulgar);
            const infoB = getTreeDetails(b.vulgar);
            return (infoB.harvest.annualYield * infoB.harvest.unitPrice) - (infoA.harvest.annualYield * infoA.harvest.unitPrice);
        })
        .slice(0, 3), [processedTrees]);

    return (
        <Container maxWidth="xl" sx={{ mt: 3, mb: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Seção Superior - Destaques */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                    <span className="material-icons" style={{ color: '#FFC107' }}>diamond</span>
                    <Typography variant="h5" fontWeight="bold">Ativos de Bioeconomia</Typography>
                </Box>
                <Grid container spacing={2}>
                    {featuredTrees.map(tree => (
                        <Grid item xs={12} sm={4} key={tree.id}>
                            <FeaturedTreeCard tree={tree} onSelect={setSelectedTree} />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Grid container spacing={3}>
                {/* Sidebar - Filtros e Valor */}
                <Grid item xs={12} md={3}>
                    <Paper elevation={0} variant="outlined" sx={{ p: 3, borderRadius: 4, height: '100%', bgcolor: 'background.paper' }}>
                        <Typography variant="h6" color={userMode === 'guardian' ? 'primary' : 'secondary'} fontWeight="bold">
                            {userMode === 'guardian' ? 'Impacto Solidário' : 'Portfólio Verde'}
                        </Typography>
                        <Divider sx={{ my: 2 }} />

                        <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.6 }}>
                            {userMode === 'guardian'
                                ? 'Ao adotar como Guardião, você financia a proteção de matrizes raras e o sequestro de carbono ativo.'
                                : 'Como Sócio, seu investimento impulsiona cadeias de bioativos amazônicos e o manejo sustentável certificado.'}
                        </Typography>

                        <Box sx={{ mb: 4 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <span className="material-icons" style={{ fontSize: 18 }}>verified</span>
                                Garantia Legislativa
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Todas as árvores são monitoradas e registradas em áreas de manejo com licença ambiental ou em auditoria.
                            </Typography>
                        </Box>

                        {viewMode === 'map' && (
                            <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Mapa de Ativos</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}><Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#2E7D32', mr: 1 }} /><Typography variant="caption">Preservação Permanente</Typography></Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}><Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#D84315', mr: 1 }} /><Typography variant="caption">Manejo Sustentável</Typography></Box>
                                <Divider sx={{ my: 2 }} />
                                <FormControlLabel
                                    control={<Checkbox checked={showCroqui} onChange={(e) => setShowCroqui(e.target.checked)} color="primary" size="small" />}
                                    label={<Typography variant="caption" fontWeight="bold">Exibir Talhão de Manejo</Typography>}
                                />
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Área Principal - Grid ou Mapa */}
                <Grid item xs={12} md={9}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" fontWeight="bold">Árvores Disponíveis</Typography>
                        <ToggleButtonGroup value={viewMode} exclusive size="small" color="primary" onChange={(e, v) => v && setViewMode(v)} sx={{ bgcolor: '#fff' }}>
                            <ToggleButton value="grid" sx={{ px: 2 }}><span className="material-icons" style={{ marginRight: 4 }}>grid_view</span> Grade</ToggleButton>
                            <ToggleButton value="map" sx={{ px: 2 }}><span className="material-icons" style={{ marginRight: 4 }}>map</span> Mapa</ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    {viewMode === 'grid' ? (
                        <Grid container spacing={2} sx={{ maxHeight: '70vh', overflowY: 'auto', pr: 1, pb: 4 }}>
                            {processedTrees.map(tree => (
                                <Grid item xs={12} sm={6} md={4} key={tree.id}>
                                    <TreeGridCard tree={tree} userMode={userMode} onSelect={setSelectedTree} />
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Paper elevation={3} sx={{ height: '70vh', overflow: 'hidden', borderRadius: 4, border: '1px solid #e0e0e0' }}>
                            <MapComponent trees={processedTrees} onSelectTree={setSelectedTree} userMode={userMode} showCroqui={showCroqui} />
                        </Paper>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default ExploreView;
