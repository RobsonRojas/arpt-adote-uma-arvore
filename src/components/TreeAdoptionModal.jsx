import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Tabs, Tab, Box, Typography, Slider, Alert, Divider, Paper } from '@mui/material';
import { getClassColor, getTreeEncyclopedia } from '../utils/treeUtils';

const TreeAdoptionModal = ({ tree, open, onClose, userMode, onConfirmAdoption }) => {
    const [quotas, setQuotas] = useState(10);
    const [tabValue, setTabValue] = useState(0);
    const PRICE_PER_QUOTA = 9.99;
    if (!tree) return null;
    const info = getTreeEncyclopedia(tree.vulgar);
    const isGuardian = userMode === 'guardian';
    let canAdopt = true;
    let warning = "";
    if (isGuardian && tree.class === 'Cor') { canAdopt = false; warning = "Esta árvore destina-se ao manejo sustentável."; }
    else if (!isGuardian && tree.class === 'Rem') { canAdopt = false; warning = "Esta é uma árvore matriz protegida."; }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: getClassColor(tree.class), color: '#fff' }}>
                <span className="material-icons">park</span> {tree.vulgar} (#{tree.arvNum})
            </DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
                <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} variant="fullWidth" sx={{ mb: 2 }}>
                    <Tab label="Adoção" /><Tab label="Info Técnica" />
                </Tabs>
                {tabValue === 0 && (
                    <Box sx={{ mt: 1 }}>
                        {!canAdopt ? <Alert severity="warning">{warning}</Alert> : (
                            <Box>
                                <Typography gutterBottom sx={{ fontWeight: 'bold' }}>Quantas cotas?</Typography>
                                <Slider value={quotas} onChange={(e, v) => setQuotas(v)} min={1} max={1000} step={10} valueLabelDisplay="auto" color={isGuardian ? "primary" : "secondary"} />
                                <Paper sx={{ p: 2, mt: 2, textAlign: 'center', bgcolor: '#f5f5f5' }}>
                                    <Typography variant="h4" color={isGuardian ? "primary" : "secondary"} fontWeight="bold">R$ {(quotas * PRICE_PER_QUOTA).toFixed(2)}</Typography>
                                    <Typography variant="caption">Total do Investimento</Typography>
                                </Paper>
                            </Box>
                        )}
                    </Box>
                )}
                {tabValue === 1 && (
                    <Box sx={{ mt: 1 }}>
                        <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom>{info.sciName}</Typography>
                        <Typography variant="body2" sx={{ textAlign: 'justify', lineHeight: 1.6 }}>{info.techInfo}</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="caption" color="text.secondary">📍 Coordenadas: {tree.lat.toFixed(6)}, {tree.lng.toFixed(6)}</Typography>
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose}>Fechar</Button>
                <Button variant="contained" disabled={!canAdopt || tabValue === 1} color={isGuardian ? "primary" : "secondary"} onClick={() => onConfirmAdoption(tree, quotas, quotas * PRICE_PER_QUOTA)}>Confirmar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default TreeAdoptionModal;
