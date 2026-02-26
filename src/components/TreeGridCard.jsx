import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Chip, Button, CardActions, Tooltip } from '@mui/material';
import { getClassColor, getImpactStats, getStatusLabel } from '../utils/treeUtils';

const ASSETS = {
    GIF: "/arvore_trocas_gasosas_novo.gif"
};

const TreeGridCard = ({ tree, onSelect, userMode }) => {
    const color = getClassColor(tree.class);
    const impact = getImpactStats(tree);
    const status = getStatusLabel(tree.status);

    // Filtro simplificado de visualização baseado no modo
    const isTarget = true; // Por enquanto mostramos todas para valorização

    return (
        <Card sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            opacity: isTarget ? 1 : 0.7,
            borderRadius: 3,
            position: 'relative',
            overflow: 'visible',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
        }}>
            {/* Badge de Status Legal */}
            <Chip
                icon={<span className="material-icons" style={{ fontSize: 14 }}>{status.icon}</span>}
                label={status.label}
                size="small"
                sx={{
                    position: 'absolute',
                    top: -10,
                    left: 12,
                    zIndex: 10,
                    bgcolor: status.color,
                    color: '#fff',
                    fontWeight: 'bold',
                    boxShadow: 2
                }}
            />

            <Box sx={{ position: 'relative', height: 120, bgcolor: '#e8f5e9', borderTopLeftRadius: 12, borderTopRightRadius: 12, overflow: 'hidden' }}>
                <CardMedia component="img" height="120" image={ASSETS.GIF} sx={{ zIndex: 0, opacity: 0.8 }} />
                <Chip label={tree.class} size="small" sx={{ position: 'absolute', top: 8, right: 8, bgcolor: color, color: '#fff', zIndex: 2 }} />
            </Box>

            <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold', lineHeight: 1.2, mb: 1 }}>
                    {tree.vulgar}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                            <span className="material-icons" style={{ fontSize: 16, marginRight: 4 }}>eco</span>
                            {impact.co2}kg CO₂
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                            <span className="material-icons" style={{ fontSize: 16, marginRight: 4 }}>water_drop</span>
                            {impact.water < 1000 ? `${impact.water}L` : `${(impact.water / 1000).toFixed(1)}kL`} Água
                        </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        <span className="material-icons" style={{ fontSize: 14, marginRight: 4 }}>straighten</span>
                        DAP: {tree.dap}cm | Altura: {tree.altura}m
                    </Typography>
                </Box>
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                <Button
                    variant="contained"
                    size="small"
                    fullWidth
                    color={userMode === 'guardian' ? 'primary' : 'secondary'}
                    onClick={() => onSelect(tree)}
                    sx={{ borderRadius: 2 }}
                >
                    {userMode === 'guardian' ? 'Proteger' : 'Investir'}
                </Button>
            </CardActions>
        </Card>
    );
};

export default TreeGridCard;
