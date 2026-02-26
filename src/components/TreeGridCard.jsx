import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Chip, Button, CardActions, Tooltip } from '@mui/material';
import { getClassColor, getTreeEncyclopedia } from '../utils/treeUtils';

const ASSETS = {
    GIF: "/arvore_trocas_gasosas_novo.gif"
};

const TreeGridCard = ({ tree, onSelect, userMode }) => {
    const color = getClassColor(tree.class);
    const info = getTreeEncyclopedia(tree.vulgar);
    const isTarget = (userMode === 'guardian' && (tree.class === 'Rem' || tree.class === 'Fut')) ||
        (userMode === 'partner' && (tree.class === 'Cor' || info.harvest));
    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', opacity: isTarget ? 1 : 0.7, borderRadius: 3 }}>
            <Box sx={{ position: 'relative', height: 140, bgcolor: '#e8f5e9' }}>
                <CardMedia component="img" height="140" image={ASSETS.GIF} sx={{ zIndex: 0 }} />
                <Chip label={tree.class} size="small" sx={{ position: 'absolute', top: 8, right: 8, bgcolor: color, color: '#fff', zIndex: 2 }} />
            </Box>
            <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{tree.vulgar}</Typography>
                <Box sx={{ display: 'flex', gap: 0.5, my: 1 }}>
                    <Tooltip title="Oxigénio"><Chip label="O2" size="small" variant="outlined" color="primary" sx={{ height: 20, fontSize: 10 }} /></Tooltip>
                    <Tooltip title="Vapor de Água"><Chip label="H2O" size="small" variant="outlined" color="info" sx={{ height: 20, fontSize: 10 }} /></Tooltip>
                    <Tooltip title="Absorção CO2"><Chip label="CO2" size="small" variant="outlined" color="success" sx={{ height: 20, fontSize: 10 }} /></Tooltip>
                </Box>
                <Typography variant="caption" color="text.secondary" display="block">{info.char.substring(0, 50)}...</Typography>
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2 }}>
                <Button variant="contained" size="small" fullWidth color={userMode === 'guardian' ? 'primary' : 'secondary'} onClick={() => onSelect(tree)}>Explorar</Button>
            </CardActions>
        </Card>
    );
};

export default TreeGridCard;
