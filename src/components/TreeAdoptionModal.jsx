import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    Tabs, Tab, Box, Typography, Slider, Alert, Divider, Paper, Chip,
    Grid, IconButton, Stack
} from '@mui/material';
import { WhatsApp, Twitter, LinkedIn, Share } from '@mui/icons-material';
import { getClassColor, getTreeDetails, getImpactStats, getStatusLabel } from '../utils/treeUtils';

const TreeAdoptionModal = ({ tree, open, onClose, userMode, onConfirmAdoption }) => {
    const [quotas, setQuotas] = useState(10);
    const [tabValue, setTabValue] = useState(0);
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const PRICE_PER_QUOTA = 9.99;

    if (!tree) return null;

    const details = getTreeDetails(tree.vulgar);
    const impact = getImpactStats(tree);
    const status = getStatusLabel(tree.status);
    const isGuardian = userMode === 'guardian';

    let canAdopt = true;
    let warning = "";
    if (isGuardian && tree.class === 'Cor') {
        canAdopt = false;
        warning = "Esta árvore destina-se ao manejo sustentável de baixo impacto.";
    } else if (!isGuardian && tree.class === 'Rem') {
        canAdopt = false;
        warning = "Esta é uma árvore matriz legalmente protegida contra corte.";
    }

    const handleConfirm = async () => {
        setLoading(true);
        const success = await onConfirmAdoption(tree, quotas, quotas * PRICE_PER_QUOTA);
        setLoading(false);
        if (success) {
            setIsSuccess(true);
        }
    };

    const handleClose = () => {
        setIsSuccess(false);
        setTabValue(0);
        onClose();
    };

    const shareText = `Acabei de adotar uma árvore ${tree.vulgar} na Amazônia! 🌳✨ Junte-se a mim nessa causa para proteger a nossa biodiversidade. #ARPT #AdoteUmaArvore #Amazonia`;
    const shareUrl = window.location.origin;

    const shareLinks = {
        whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth scroll="paper">
            {!isSuccess ? (
                <>
                    <DialogTitle sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        bgcolor: getClassColor(tree.class),
                        color: '#fff',
                        pb: 2
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <span className="material-icons">park</span>
                            <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
                                {tree.vulgar} (#{tree.arvNum})
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip
                                label={status.label}
                                size="small"
                                icon={<span className="material-icons" style={{ fontSize: 14, color: 'inherit' }}>{status.icon}</span>}
                                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}
                            />
                            <Chip
                                label={tree.area_manejo || 'Área de Manejo'}
                                size="small"
                                icon={<span className="material-icons" style={{ fontSize: 14, color: 'inherit' }}>location_on</span>}
                                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}
                            />
                        </Box>
                    </DialogTitle>

                    <DialogContent sx={{ pt: 2 }}>
                        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} variant="fullWidth" sx={{ mb: 2 }}>
                            <Tab label="Adoção" />
                            <Tab label="Impacto" />
                            <Tab label="Bioeconomia" />
                        </Tabs>

                        {tabValue === 0 && (
                            <Box sx={{ mt: 1 }}>
                                {!canAdopt ? <Alert severity="warning" variant="outlined">{warning}</Alert> : (
                                    <Box>
                                        <Typography gutterBottom sx={{ fontWeight: 'bold' }}>
                                            {isGuardian ? "Quantas cotas de proteção?" : "Quantas cotas de participação?"}
                                        </Typography>
                                        <Slider
                                            value={quotas}
                                            onChange={(e, v) => setQuotas(v)}
                                            min={1}
                                            max={100}
                                            step={1}
                                            valueLabelDisplay="auto"
                                            color={isGuardian ? "primary" : "secondary"}
                                        />
                                        <Paper sx={{ p: 3, mt: 2, textAlign: 'center', bgcolor: isGuardian ? '#f1f8e9' : '#fff3e0', borderRadius: 3 }}>
                                            <Typography variant="h3" color={isGuardian ? "primary" : "secondary"} fontWeight="bold">
                                                R$ {(quotas * PRICE_PER_QUOTA).toFixed(2)}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Valor Total para {quotas} {quotas === 1 ? 'cota' : 'cotas'}
                                            </Typography>
                                        </Paper>
                                        <Typography variant="caption" sx={{ mt: 2, display: 'block', fontStyle: 'italic', color: 'text.secondary' }}>
                                            * Este valor financia o monitoramento, a proteção da área e o desenvolvimento das comunidades locais.
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        )}

                        {tabValue === 1 && (
                            <Box sx={{ mt: 1 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#e3f2fd', border: '1px solid #bbdefb' }}>
                                            <span className="material-icons" style={{ fontSize: 40, color: '#0288d1' }}>water_drop</span>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight="bold">Rios Voadores (Produção de Água)</Typography>
                                                <Typography variant="h5" color="primary.main" fontWeight="bold">+{impact.water} Litros / Ano</Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Volume estimado de chuvas gerado pela árvore via evapotranspiração.
                                                </Typography>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                                            <Typography color="success.main" variant="h5" fontWeight="bold">{impact.co2}kg</Typography>
                                            <Typography variant="caption">CO₂ Retido / Ano</Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                                            <Typography color="primary" variant="h5" fontWeight="bold">+{impact.oxygen}kg</Typography>
                                            <Typography variant="caption">O₂ Gerado / Ano</Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <span className="material-icons" style={{ fontSize: 32, color: '#fbc02d' }}>auto_awesome</span>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight="bold">Valor de Biodiversidade</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Sustenta aprox. {impact.biodiversity} espécies de micro e macro fauna nesta região.
                                                </Typography>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {tabValue === 2 && (
                            <Box sx={{ mt: 1 }}>
                                <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom>
                                    {details.sciName}
                                </Typography>
                                <Typography variant="body2" sx={{ textAlign: 'justify', lineHeight: 1.6, color: 'text.primary' }}>
                                    {details.techInfo}
                                </Typography>

                                {details.harvest && (
                                    <Paper variant="outlined" sx={{ mt: 2, p: 2, bgcolor: '#fffde7' }}>
                                        <Typography variant="subtitle2" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <span className="material-icons" style={{ fontSize: 18 }}>shopping_basket</span>
                                            Potencial de Bioeconomia
                                        </Typography>
                                        <Typography variant="body2">
                                            Produção estimada de {details.harvest.annualYield}{details.harvest.unit} de {details.harvest.type} por safra ({details.harvest.season}).
                                        </Typography>
                                    </Paper>
                                )}
                            </Box>
                        )}
                    </DialogContent>

                    <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
                        <Button onClick={handleClose} variant="text">Fechar</Button>
                        <Button
                            variant="contained"
                            disabled={!canAdopt || tabValue === 1 || loading}
                            color={isGuardian ? "primary" : "secondary"}
                            onClick={handleConfirm}
                            sx={{ px: 4, borderRadius: 2 }}
                        >
                            {loading ? 'Aguarde...' : (isGuardian ? 'Confirmar Adoção' : 'Confirmar Investimento')}
                        </Button>
                    </DialogActions>
                </>
            ) : (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Box sx={{
                        width: 80, height: 80, borderRadius: '50%',
                        bgcolor: 'success.light', color: 'success.main',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        mx: 'auto', mb: 3
                    }}>
                        <span className="material-icons" style={{ fontSize: 48 }}>check_circle</span>
                    </Box>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Adoção Confirmada!
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        Parabéns! Você agora é um {isGuardian ? 'Guardião' : 'Sócio'} da árvore <strong>{tree.vulgar}</strong>.
                        Sua contribuição é fundamental para a preservação da floresta.
                    </Typography>

                    <Divider sx={{ my: 3 }}>
                        <Chip label="COMPARTILHE ESSA AÇÃO" size="small" />
                    </Divider>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Incentive outros a protegerem a Amazônia:
                    </Typography>

                    <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
                        <IconButton
                            component="a"
                            href={shareLinks.whatsapp}
                            target="_blank"
                            sx={{ bgcolor: '#25D366', color: '#fff', '&:hover': { bgcolor: '#128C7E' } }}
                        >
                            <WhatsApp />
                        </IconButton>
                        <IconButton
                            component="a"
                            href={shareLinks.twitter}
                            target="_blank"
                            sx={{ bgcolor: '#000', color: '#fff', '&:hover': { bgcolor: '#333' } }}
                        >
                            <Twitter />
                        </IconButton>
                        <IconButton
                            component="a"
                            href={shareLinks.linkedin}
                            target="_blank"
                            sx={{ bgcolor: '#0077b5', color: '#fff', '&:hover': { bgcolor: '#005582' } }}
                        >
                            <LinkedIn />
                        </IconButton>
                    </Stack>

                    <Button onClick={handleClose} variant="contained" fullWidth sx={{ borderRadius: 2, py: 1.5 }}>
                        Ir para o meu Painel
                    </Button>
                </Box>
            )}
        </Dialog>
    );
};

export default TreeAdoptionModal;
