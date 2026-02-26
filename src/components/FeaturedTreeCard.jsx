import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Chip, Button, CardActions } from '@mui/material';
import { getTreeDetails, getStatusLabel } from '../utils/treeUtils';

const ASSETS = {
    GIF: "/arvore_trocas_gasosas_novo.gif"
};

const FeaturedTreeCard = ({ tree, onSelect }) => {
    const details = getTreeDetails(tree.vulgar);
    const status = getStatusLabel(tree.status);

    const potentialValue = details.harvest
        ? (details.harvest.annualYield * details.harvest.unitPrice).toFixed(2)
        : (tree.co2_estimado * 0.5).toFixed(2); // Valor simbólico de carbono se não houver colheita

    return (
        <Card sx={{
            height: '100%',
            border: '1px solid #FFC107',
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #ffffff 0%, #fffde7 100%)',
            transition: '0.3s',
            '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }
        }}>
            <Box sx={{ position: 'relative', height: 120 }}>
                <CardMedia component="img" height="120" image={ASSETS.GIF} sx={{ zIndex: 0, opacity: 0.9 }} />
                <Chip
                    label="ALTO RENDIMENTO"
                    color="warning"
                    size="small"
                    sx={{ position: 'absolute', top: 10, left: 10, fontWeight: 'bold', zIndex: 2, fontSize: 10 }}
                />
                <Chip
                    icon={<span className="material-icons" style={{ fontSize: 12 }}>{status.icon}</span>}
                    label={status.label}
                    size="small"
                    sx={{ position: 'absolute', bottom: 10, left: 10, zIndex: 2, bgcolor: 'rgba(255,255,255,0.8)', fontSize: 10 }}
                />
            </Box>

            <CardContent sx={{ pt: 2, pb: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold" color="secondary.main" noWrap>
                    {tree.vulgar}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 1 }}>
                    <Typography variant="h5" color="success.main" fontWeight="bold">R$ {potentialValue}</Typography>
                    <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>/ ano</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" display="block">
                    {details.harvest ? `Potencial de ${details.harvest.type}` : 'Valor de Impacto Ambiental'}
                </Typography>
            </CardContent>

            <CardActions sx={{ p: 2 }}>
                <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    fullWidth
                    onClick={() => onSelect(tree)}
                    sx={{ borderRadius: 2 }}
                >
                    Ver Ativo
                </Button>
            </CardActions>
        </Card>
    );
};

export default FeaturedTreeCard;
