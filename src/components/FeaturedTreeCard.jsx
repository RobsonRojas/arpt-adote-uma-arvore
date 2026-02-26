import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Chip, Button, CardActions } from '@mui/material';
import { getTreeEncyclopedia } from '../utils/treeUtils';

const ASSETS = {
    GIF: "/arvore_trocas_gasosas_novo.gif"
};

const FeaturedTreeCard = ({ tree, onSelect }) => {
    const info = getTreeEncyclopedia(tree.vulgar);
    const potentialValue = info.harvest ? (info.harvest.annualYield * info.harvest.unitPrice).toFixed(2) : "99.00";
    return (
        <Card sx={{
            height: '100%', border: '2px solid #FFC107', borderRadius: 4,
            position: 'relative', overflow: 'hidden',
            background: 'linear-gradient(135deg, #fff 0%, #fffde7 100%)',
            transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }
        }}>
            <Box sx={{ position: 'relative', height: 140 }}>
                <CardMedia component="img" height="140" image={ASSETS.GIF} sx={{ zIndex: 0 }} />
                <Chip label="ALTO RENDIMENTO" color="warning" size="small" sx={{ position: 'absolute', top: 10, left: 10, fontWeight: 'bold', zIndex: 2 }} />
            </Box>
            <CardContent sx={{ pt: 2, pb: 1 }}>
                <Typography variant="h6" fontWeight="bold" color="secondary.main" noWrap>{tree.vulgar}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                    <span className="material-icons" style={{ fontSize: 20, color: '#4caf50', marginRight: 8 }}>payments</span>
                    <Typography variant="h5" color="success.main" fontWeight="bold">R$ {potentialValue}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">Potencial Estimado / Ano</Typography>
            </CardContent>
            <CardActions sx={{ p: 2 }}>
                <Button variant="contained" color="secondary" size="small" fullWidth onClick={() => onSelect(tree)}>Ver Detalhes</Button>
            </CardActions>
        </Card>
    );
};

export default FeaturedTreeCard;
