import React, { useState, useEffect, useRef } from 'react';
import { 
  createTheme, ThemeProvider, CssBaseline, AppBar, Toolbar, Typography, 
  Box, Switch, Paper, Container, Grid, Dialog, 
  DialogTitle, DialogContent, DialogActions, Button, Slider, Chip, 
  Alert, Divider, Badge, Card, CardContent, Tabs, Tab,
  List, ListItem, ListItemText, ListItemAvatar, Avatar,
  Step, Stepper, StepLabel, StepContent, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField,
  ToggleButton, ToggleButtonGroup
} from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import proj4 from 'proj4';

const rawInventoryData = [
    { id: 1, vulgar: "Cupiuba", piquete: 1, arvNum: 1, latUtm: "9616166,102", longUtm: "187938,2867", class: "Fut" },
    { id: 2, vulgar: "Sapucaia", piquete: 1, arvNum: 2, latUtm: "9616153,081", longUtm: "187913,7486", class: "Fut" },
    { id: 3, vulgar: "Cedrinho", piquete: 1, arvNum: 3, latUtm: "9616162,82", longUtm: "187913,7197", class: "Cor" },
    { id: 4, vulgar: "Uxi liso", piquete: 1, arvNum: 4, latUtm: "9616162,82", longUtm: "187913,7197", class: "Fut" },
    { id: 5, vulgar: "Mata-Mata", piquete: 1, arvNum: 5, latUtm: "9616162,82", longUtm: "187913,7197", class: "Fut" },
    { id: 6, vulgar: "Tanibuca", piquete: 1, arvNum: 6, latUtm: "9616144,797", longUtm: "187881,7456", class: "Cor" },
    { id: 7, vulgar: "Guariuba", piquete: 1, arvNum: 7, latUtm: "9616176,482", longUtm: "187917,5288", class: "Fut" },
    { id: 8, vulgar: "Mata-Mata", piquete: 1, arvNum: 8, latUtm: "9616170,593", longUtm: "187890,3169", class: "Fut" },
    { id: 9, vulgar: "Melancieira", piquete: 1, arvNum: 9, latUtm: "9616152,267", longUtm: "187865,8198", class: "Fut" },
    { id: 10, vulgar: "Cedrinho", piquete: 1, arvNum: 10, latUtm: "9616145,681", longUtm: "187843,9366", class: "Fut" },
    { id: 11, vulgar: "Cedrinho", piquete: 1, arvNum: 11, latUtm: "9616149,45", longUtm: "187839,5019", class: "Rem" },
    { id: 12, vulgar: "Mata-Mata", piquete: 1, arvNum: 12, latUtm: "9616131,499", longUtm: "187875,7799", class: "Fut" },
    { id: 13, vulgar: "Cupiuba", piquete: 1, arvNum: 13, latUtm: "9616161,066", longUtm: "187890,2862", class: "Fut" },
    { id: 14, vulgar: "Camuri", piquete: 1, arvNum: 14, latUtm: "9616158,682", longUtm: "187904,1419", class: "Rem" },
    { id: 15, vulgar: "Arura", piquete: 2, arvNum: 15, latUtm: "9616103,712", longUtm: "187873,3409", class: "Fut" },
    { id: 16, vulgar: "Mata-Mata", piquete: 2, arvNum: 16, latUtm: "9616097,898", longUtm: "187890,5952", class: "Rem" },
    { id: 17, vulgar: "Cedrinho", piquete: 2, arvNum: 17, latUtm: "9616108,123", longUtm: "187885,4321", class: "Fut" },
    { id: 18, vulgar: "Ucuuba", piquete: 2, arvNum: 18, latUtm: "9616110,456", longUtm: "187880,1234", class: "Cor" },
    { id: 19, vulgar: "Mata-Mata", piquete: 2, arvNum: 19, latUtm: "9616115,789", longUtm: "187878,9876", class: "Fut" },
    { id: 20, vulgar: "Jarana", piquete: 2, arvNum: 20, latUtm: "9616120,317", longUtm: "187874,4786", class: "Fut" },
    { id: 21, vulgar: "Mata-Mata", piquete: 2, arvNum: 21, latUtm: "9616119,99", longUtm: "187876,1477", class: "Rem" },
    { id: 22, vulgar: "Tinteiro", piquete: 2, arvNum: 22, latUtm: "9616116,796", longUtm: "187881,1615", class: "Fut" },
    { id: 23, vulgar: "Ucuuba", piquete: 2, arvNum: 23, latUtm: "9616113,042", longUtm: "187884,064", class: "Fut" },
    { id: 24, vulgar: "Mata-Mata", piquete: 2, arvNum: 24, latUtm: "9616109,555", longUtm: "187888,222", class: "Rem" },
    { id: 25, vulgar: "Cupiuba", piquete: 3, arvNum: 25, latUtm: "9616135,111", longUtm: "187930,333", class: "Fut" },
    { id: 26, vulgar: "Angelim", piquete: 3, arvNum: 26, latUtm: "9616138,222", longUtm: "187935,444", class: "Cor" },
    { id: 27, vulgar: "Mata-Mata", piquete: 3, arvNum: 27, latUtm: "9616140,333", longUtm: "187938,555", class: "Fut" },
    { id: 28, vulgar: "Cedrinho", piquete: 3, arvNum: 28, latUtm: "9616142,444", longUtm: "187940,666", class: "Fut" },
    { id: 29, vulgar: "Louro Amarelo", piquete: 3, arvNum: 29, latUtm: "9616141,661", longUtm: "187943,6972", class: "Rem" },
    { id: 30, vulgar: "Mata-Mata", piquete: 4, arvNum: 30, latUtm: "9616080,555", longUtm: "187895,777", class: "Fut" },
    { id: 31, vulgar: "Cumaru", piquete: 4, arvNum: 31, latUtm: "9616075,666", longUtm: "187892,888", class: "Fut" },
    { id: 32, vulgar: "Uxi", piquete: 4, arvNum: 32, latUtm: "9616072,777", longUtm: "187890,999", class: "Cor" },
    { id: 33, vulgar: "Andiroba", piquete: 4, arvNum: 33, latUtm: "9616070,888", longUtm: "187888,000", class: "Rem" },
    { id: 34, vulgar: "Cumaru", piquete: 4, arvNum: 34, latUtm: "9616067,185", longUtm: "187886,1312", class: "Fut" },
    { id: 35, vulgar: "Ucuuba", piquete: 4, arvNum: 35, latUtm: "9616066,932", longUtm: "187875,2337", class: "Cor" },
    { id: 36, vulgar: "Mata-Mata", piquete: 4, arvNum: 36, latUtm: "9616064,123", longUtm: "187872,456", class: "Fut" },
    { id: 37, vulgar: "Cedrinho", piquete: 4, arvNum: 37, latUtm: "9616062,789", longUtm: "187870,123", class: "Fut" },
    { id: 38, vulgar: "Castanheira", piquete: 4, arvNum: 38, latUtm: "9616060,456", longUtm: "187868,789", class: "Rem" }
];

const utmDef = "+proj=utm +zone=19 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
const wgs84Def = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";

const processTreeData = (data) => {
    return data.map(tree => {
        const northing = parseFloat(tree.latUtm.replace(',', '.'));
        const easting = parseFloat(tree.longUtm.replace(',', '.'));
        const coords = proj4(utmDef, wgs84Def, [easting, northing]);
        return { ...tree, lat: coords[1], lng: coords[0] };
    });
};

const processedTrees = processTreeData(rawInventoryData);

const getClassColor = (classificacao) => {
    switch (classificacao) {
        case 'Rem': return '#2E7D32'; 
        case 'Cor': return '#D84315'; 
        default: return '#FBC02D';    
    }
};

const getClassLabel = (classificacao) => {
    switch (classificacao) {
        case 'Rem': return 'Remanescente (Proteção)';
        case 'Cor': return 'Corte (Manejo)';
        default: return 'Futuro (Crescimento)';
    }
};

const getTreeEncyclopedia = (species) => {
    const spec = species.toLowerCase();
    const data = {
        char: "Espécie nativa da Amazônia.",
        imp: "Importante para o ecossistema.",
        prod: { name: "Peça de Artesanato", icon: "handyman", desc: "Objeto exclusivo produzido pela comunidade." },
        harvest: null 
    };

    if (spec.includes("sapucaia")) {
        data.char = "Árvore majestosa, muda de cor (rosa/lilás). Frutos em forma de urna (pixídios).";
        data.imp = "Produz castanhas comestíveis muito valorizadas e madeira nobre.";
        data.prod = { name: "Castanha de Sapucaia", icon: "park", desc: "Castanhas raras e saborosas." };
        data.harvest = { type: "Castanha", season: "Set-Nov", annualYield: 40, unit: "kg", unitPrice: 45.00 }; 
    }
    else if (spec.includes("uxi")) {
        data.char = "Árvore de tronco reto e madeira duríssima. Fruto drupáceo.";
        data.imp = "Fruto muito consumido na Amazônia (polpa). Madeira indestrutível.";
        data.prod = { name: "Polpa/Fruto de Uxi", icon: "nutrition", desc: "Fruto energético e nutritivo." };
        data.harvest = { type: "Fruto in Natura", season: "Fev-Abr", annualYield: 60, unit: "kg", unitPrice: 15.00 };
    }
    else if (spec.includes("cumaru")) {
        data.char = "A 'Teca Brasileira'. Sementes contêm cumarina (aroma de baunilha).";
        data.imp = "Sementes (Fava Tonka) usadas em perfumaria mundial e gastronomia.";
        data.prod = { name: "Fava Tonka (Cumaru)", icon: "spa", desc: "A especiaria amazônica." };
        data.harvest = { type: "Sementes Secas", season: "Ago-Out", annualYield: 15, unit: "kg", unitPrice: 120.00 };
    }
    else if (spec.includes("ucuuba")) {
        data.char = "Árvore de várzea. Sementes ricas em gordura vegetal avermelhada.";
        data.imp = "Manteiga de Ucuuba é valiosa para cosméticos e saboaria.";
        data.prod = { name: "Manteiga de Ucuuba", icon: "water_drop", desc: "Hidratante natural potente." };
        data.harvest = { type: "Manteiga", season: "Jan-Jun", annualYield: 10, unit: "kg (processado)", unitPrice: 80.00 };
    }
    else if (spec.includes("andiroba")) {
        data.char = "Árvore medicinal. Sementes produzem óleo amargo e terapêutico.";
        data.imp = "O óleo é o 'remédio de tudo' da floresta: anti-inflamatório e repelente.";
        data.prod = { name: "Óleo de Andiroba", icon: "sanitizer", desc: "Óleo medicinal puro." };
        data.harvest = { type: "Óleo", season: "Fev-Mai", annualYield: 5, unit: "litros", unitPrice: 90.00 };
    }
    else if (spec.includes("castanheira") || spec.includes("castanha")) {
        data.char = "A Rainha da Floresta. Pode viver 500+ anos.";
        data.imp = "Base da economia extrativista. Castanha rica em selênio.";
        data.prod = { name: "Castanha-do-Pará", icon: "shopping_basket", desc: "Castanhas frescas da safra." };
        data.harvest = { type: "Castanha c/ Casca", season: "Dez-Mar", annualYield: 50, unit: "kg", unitPrice: 25.00 };
    }
    // MADEIREIRAS (Apenas produto final de manejo)
    else if (spec.includes("cedrinho")) {
        data.char = "Madeira leve e avermelhada.";
        data.prod = { name: "Tábua de Corte (Cedrinho)", icon: "kitchen", desc: "Acabamento fino." };
    }
    else if (spec.includes("tanibuca")) {
        data.char = "Madeira pesada e dura.";
        data.prod = { name: "Deck Modular (Tanibuca)", icon: "deck", desc: "Resistência externa." };
    }
    else if (spec.includes("angelim")) {
        data.char = "Madeira nobre resistente.";
        data.prod = { name: "Bandeja (Angelim)", icon: "coffee", desc: "Peça sofisticada." };
    }
    else if (spec.includes("cupiuba")) {
        data.char = "Madeira pesada de tom avermelhado.";
        data.imp = "Resistente a fungos, excelente para construção civil e estruturas pesadas.";
        data.prod = { name: "Peças Estruturais (Cupiúba)", icon: "foundation", desc: "Vigas robustas para construção." };
    }
    else if (spec.includes("mata")) {
        data.char = "Casca grossa e fibrosa, tronco reto.";
        data.imp = "Espécie chave para sucessão florestal. Madeira usada para estacas.";
        data.prod = { name: "Objetos Rústicos (Mata-Matá)", icon: "carpenter", desc: "Peças decorativas com textura." };
    }
    
    return data;
};

const getMonitoringData = (tree) => {
    if (tree.class === 'Rem' || tree.class === 'Fut') {
        return [
            { label: 'Georreferenciamento', date: '10/01/2025', status: 'completed', desc: 'Localização confirmada via GPS.' },
            { label: 'Vistoria de Florada', date: '15/09/2025', status: 'active', desc: 'Início do ciclo reprodutivo observado.' },
            { label: 'Estimativa de Safra', date: 'Em breve', status: 'pending', desc: 'Contagem de frutos imaturos.' }
        ];
    } else {
        return [
            { label: 'Autorização de Corte', date: '05/01/2025', status: 'completed', desc: 'Aprovado no Plano de Manejo.' },
            { label: 'Corte Direcional', date: '12/02/2025', status: 'active', desc: 'Corte realizado.' },
            { label: 'Serraria', date: 'Estimado 04/2025', status: 'pending', desc: 'Processamento.' }
        ];
    }
};

const getProductForecast = (tree, quotas) => {
    const info = getTreeEncyclopedia(tree.vulgar);
    const today = new Date();
    const year = today.getFullYear();
    
    let items = [];
    let forecastText = "";
    let estimatedDelivery = "";

    if (info.harvest) {
        const userShare = (quotas / 1000) * info.harvest.annualYield;
        const shareFormatted = userShare < 1 ? (userShare * 1000).toFixed(0) + "g" : userShare.toFixed(1) + " " + info.harvest.unit;
        
        items.push({
            name: `Quota de Safra: ${info.prod.name}`,
            quantity: shareFormatted,
            icon: info.prod.icon,
            detail: `~${(userShare * info.harvest.unitPrice).toFixed(2)} reais em valor`
        });
        
        estimatedDelivery = `${info.harvest.season} ${year + 1}`;
        forecastText = `Ciclo anual de colheita. Próxima safra estimada para ${info.harvest.season}.`;
    } 
    else {
        const mainQty = Math.floor(quotas / 200); 
        items.push({ name: info.prod.name, quantity: mainQty || 1, icon: info.prod.icon });
        const deliveryDate = new Date(today.setMonth(today.getMonth() + 8));
        estimatedDelivery = deliveryDate.toLocaleDateString('pt-BR');
        forecastText = info.prod.desc;
    }

    return {
        items: items,
        steps: [
            { label: 'Monitoramento', completed: true },
            { label: 'Florada/Corte', completed: false, active: true },
            { label: 'Coleta/Manufatura', completed: false },
            { label: 'Beneficiamento', completed: false },
            { label: 'Envio', completed: false }
        ],
        estimatedDelivery: estimatedDelivery,
        desc: forecastText
    };
};

// --- COMPONENTES ---

const MapComponent = ({ trees, onSelectTree, userMode }) => {
    const mapRef = useRef(null);
    useEffect(() => {
        if (!mapRef.current) {
            const centerLat = trees.reduce((acc, t) => acc + t.lat, 0) / trees.length;
            const centerLng = trees.reduce((acc, t) => acc + t.lng, 0) / trees.length;
            const map = L.map('map-container').setView([centerLat, centerLng], 17);
            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: 'Tiles &copy; Esri' }).addTo(map);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', { subdomains: 'abcd', maxZoom: 20 }).addTo(map);
            mapRef.current = map;
        }
        mapRef.current.eachLayer((layer) => { if (layer instanceof L.CircleMarker) mapRef.current.removeLayer(layer); });
        trees.forEach(tree => {
            const color = getClassColor(tree.class);
            const info = getTreeEncyclopedia(tree.vulgar);
            const isProductive = !!info.harvest;
            
            let isTarget = false;
            if (userMode === 'guardian' && (tree.class === 'Rem' || tree.class === 'Fut')) isTarget = true;
            if (userMode === 'partner' && (tree.class === 'Cor' || isProductive)) isTarget = true;

            const marker = L.circleMarker([tree.lat, tree.lng], { color, fillColor: color, fillOpacity: isTarget ? 0.9 : 0.3, radius: isTarget ? 10 : 5, weight: 2 }).addTo(mapRef.current);
            marker.bindPopup(`
                <div style="font-family: Roboto; text-align: center;">
                    <strong style="color: ${color};">${tree.vulgar}</strong><br/>
                    <span style="font-size: 0.8em;">${getClassLabel(tree.class)}</span><br/>
                    ${isProductive ? '<span style="font-size:0.7em; color:#D84315;">🍒 Produtiva</span><br/>' : ''}
                    <button id="btn-${tree.id}" style="margin-top:5px; background:${color}; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">Ver Detalhes</button>
                </div>
            `);
            marker.on('popupopen', () => {
                const btn = document.getElementById(`btn-${tree.id}`);
                if (btn) btn.onclick = () => onSelectTree(tree);
            });
        });
    }, [trees, userMode, onSelectTree]);
    return <div id="map-container" style={{ height: '100%', width: '100%', borderRadius: '8px' }}></div>;
};

const TreeListComponent = ({ trees, onSelectTree, userMode }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterClass, setFilterClass] = useState("all");
    const filteredTrees = trees.filter(tree => {
        const matchesSearch = tree.vulgar.toLowerCase().includes(searchTerm.toLowerCase()) || tree.arvNum.toString().includes(searchTerm);
        const matchesClass = filterClass === "all" ? true : tree.class === filterClass;
        return matchesSearch && matchesClass;
    });
    return (
        <Paper elevation={3} sx={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
            <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', bgcolor: '#fff' }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={8}><TextField fullWidth size="small" placeholder="Pesquisar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField select fullWidth size="small" value={filterClass} onChange={(e) => setFilterClass(e.target.value)} SelectProps={{ native: true }}>
                            <option value="all">Todas</option><option value="Rem">Remanescente</option><option value="Cor">Corte</option><option value="Fut">Futuro</option>
                        </TextField>
                    </Grid>
                </Grid>
            </Box>
            <TableContainer sx={{ flexGrow: 1 }}>
                <Table stickyHeader size="small">
                    <TableHead><TableRow><TableCell>ID</TableCell><TableCell>Espécie</TableCell><TableCell>Status</TableCell><TableCell>Produtividade</TableCell><TableCell align="center">Ação</TableCell></TableRow></TableHead>
                    <TableBody>
                        {filteredTrees.map((tree) => {
                             const color = getClassColor(tree.class);
                             const info = getTreeEncyclopedia(tree.vulgar);
                             const isProductive = !!info.harvest;
                             let isTarget = false;
                             if (userMode === 'guardian' && (tree.class === 'Rem' || tree.class === 'Fut')) isTarget = true;
                             if (userMode === 'partner' && (tree.class === 'Cor' || isProductive)) isTarget = true;

                             return (
                                <TableRow key={tree.id} hover sx={{ bgcolor: isTarget ? 'rgba(46, 125, 50, 0.05)' : 'inherit' }}>
                                    <TableCell>#{tree.arvNum}</TableCell>
                                    <TableCell><strong>{tree.vulgar}</strong></TableCell>
                                    <TableCell><Chip label={getClassLabel(tree.class)} size="small" sx={{ bgcolor: color, color: '#fff', fontSize: '0.7rem' }} /></TableCell>
                                    <TableCell>
                                        {info.harvest ? (
                                            <Box sx={{display:'flex', alignItems:'center'}}>
                                                <span className="material-icons" style={{fontSize:14, color:'#D84315', marginRight:4}}>eco</span>
                                                <Typography variant="caption">{info.harvest.annualYield} {info.harvest.unit}/ano</Typography>
                                            </Box>
                                        ) : <Typography variant="caption" color="text.disabled">-</Typography>}
                                    </TableCell>
                                    <TableCell align="center"><Button size="small" variant="outlined" color={userMode === 'guardian'?'primary':'secondary'} onClick={() => onSelectTree(tree)}>Ver</Button></TableCell>
                                </TableRow>
                             );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ p: 1, borderTop: '1px solid #e0e0e0', textAlign: 'right', bgcolor: '#fafafa' }}><Typography variant="caption" color="text.secondary">Total: {filteredTrees.length}</Typography></Box>
        </Paper>
    );
};

const TreeAdoptionModal = ({ tree, open, onClose, userMode, onConfirmAdoption }) => {
    const [quotas, setQuotas] = useState(10);
    const [tabValue, setTabValue] = useState(0);
    const PRICE = 9.99;
    
    if (!tree) return null;
    const isGuardian = userMode === 'guardian';
    const info = getTreeEncyclopedia(tree.vulgar);
    
    let canAdopt = true;
    let warning = "";

    if (isGuardian) {
        if (tree.class === 'Cor') { canAdopt = false; warning = "Guardiões protegem, não cortam."; }
    } else { 
        if (tree.class !== 'Cor' && !info.harvest) {
            canAdopt = false; 
            warning = "Esta árvore não é de corte nem produtiva. Disponível apenas para Guardiões.";
        }
    }

    let shareText = "";
    let harvestInfo = null;
    if (!isGuardian && quotas >= 200 && info.harvest) {
        const share = (quotas / 1000) * info.harvest.annualYield;
        const formatted = share < 1 ? (share*1000).toFixed(0)+"g" : share.toFixed(1)+" "+info.harvest.unit;
        shareText = `Você receberá aprox. ${formatted} de ${info.harvest.type} por ano.`;
        harvestInfo = info.harvest;
    }

    const productPreview = !isGuardian && quotas >= 200 ? info.prod : null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{display:'flex', alignItems:'center', gap:1, bgcolor: getClassColor(tree.class), color: '#fff'}}>
                <span className="material-icons">forest</span>
                {tree.vulgar} (#{tree.arvNum})
            </DialogTitle>
            
            <DialogContent sx={{pt: 2}}>
                <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} variant="fullWidth" sx={{mb:2, borderBottom:1, borderColor:'divider'}}>
                    <Tab label="Adoção" />
                    <Tab label="Sobre a Espécie" />
                </Tabs>

                {tabValue === 0 && (
                    <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Classificação: <strong>{getClassLabel(tree.class)}</strong>
                        </Typography>
                        {!canAdopt ? <Alert severity="warning">{warning}</Alert> : (
                            <Box>
                                <Typography gutterBottom fontWeight="bold" sx={{mt:2}}>Quantas cotas?</Typography>
                                <Slider value={quotas} onChange={(e,v) => setQuotas(v)} min={1} max={1000} step={10} valueLabelDisplay="auto" sx={{color: isGuardian ? '#2E7D32' : '#D84315'}} />
                                
                                <Paper sx={{bgcolor:'#f5f5f5', p:2, mt:2, textAlign:'center'}}>
                                    <Typography variant="h4" color={isGuardian ? "primary" : "secondary"} fontWeight="bold">R$ {(quotas * PRICE).toFixed(2).replace('.', ',')}</Typography>
                                    
                                    {shareText && (
                                        <Box sx={{mt:2, textAlign:'left', bgcolor: '#fff', p:1.5, borderRadius:1, border: '1px solid #e0e0e0'}}>
                                            <Typography variant="subtitle2" color="secondary" sx={{display:'flex', alignItems:'center', mb:1}}>
                                                <span className="material-icons" style={{marginRight:5}}>eco</span>
                                                Potencial de Colheita
                                            </Typography>
                                            <Typography variant="h6" color="success.main" fontWeight="bold">{shareText}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Safra estimada: {harvestInfo.season}. Produção total da árvore: {harvestInfo.annualYield} {harvestInfo.unit}.
                                            </Typography>
                                        </Box>
                                    )}
                                    
                                    {!isGuardian && !info.harvest && quotas >= 200 && productPreview && (
                                        <Box sx={{mt:2, textAlign:'left', bgcolor: '#fff', p:1, borderRadius:1, border: '1px solid #e0e0e0'}}>
                                            <Typography variant="subtitle2" color="secondary" sx={{display:'flex', alignItems:'center'}}>
                                                <span className="material-icons" style={{marginRight:5}}>card_giftcard</span>
                                                Recompensa Inclusa:
                                            </Typography>
                                            <Typography variant="body2"><strong>{productPreview.name}</strong></Typography>
                                            <Typography variant="caption" color="text.secondary">{productPreview.desc}</Typography>
                                        </Box>
                                    )}
                                    
                                    {isGuardian && (
                                        <Typography variant="caption" display="block" align="center" sx={{mt:1, color: 'success.main'}}>
                                            <span className="material-icons" style={{fontSize: 12, verticalAlign: 'middle'}}>verified</span> Certificado Digital de Preservação.
                                        </Typography>
                                    )}
                                </Paper>
                            </Box>
                        )}
                    </Box>
                )}

                {tabValue === 1 && (
                    <Box sx={{pt:1}}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{color: getClassColor(tree.class)}}>Características</Typography>
                        <Typography variant="body2" paragraph>{info.char}</Typography>
                        <Divider sx={{my:2}}/>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{color: getClassColor(tree.class)}}>Importância</Typography>
                        <Typography variant="body2" paragraph>{info.imp}</Typography>
                        
                        {info.harvest && (
                            <Box sx={{mt:2, p:1.5, bgcolor:'#FFF3E0', borderRadius:1}}>
                                <Typography variant="subtitle2" color="secondary">💰 Potencial Produtivo</Typography>
                                <Typography variant="body2">Produz aprox. <strong>{info.harvest.annualYield} {info.harvest.unit}</strong> de {info.harvest.type} por ano.</Typography>
                            </Box>
                        )}
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button variant="contained" disabled={!canAdopt || tabValue === 1} color={isGuardian?"primary":"secondary"} onClick={() => onConfirmAdoption(tree, quotas, quotas * PRICE)}>
                    {tabValue === 0 ? "Confirmar" : "Voltar p/ Adoção"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const UserDashboard = ({ adoptedTrees, onBack }) => {
    const [tabIndex, setTabIndex] = useState(0);
    const productTrees = adoptedTrees.filter(t => t.mode === 'partner' && t.quotas >= 200);
    const handlePrintReport = () => { window.print(); };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Button startIcon={<span className="material-icons">arrow_back</span>} onClick={onBack} sx={{mb:2}} className="no-print">Voltar ao Mapa</Button>
            <Typography variant="h4" gutterBottom fontWeight="bold">Painel do Adotante</Typography>
            <Paper sx={{ width: '100%', mb: 2 }} className="no-print">
                <Tabs value={tabIndex} onChange={(e, v) => setTabIndex(v)} indicatorColor="primary" textColor="primary" centered>
                    <Tab label="Monitoramento" icon={<span className="material-icons">visibility</span>} iconPosition="start"/>
                    <Tab label="Relatórios" icon={<span className="material-icons">assessment</span>} iconPosition="start"/>
                    <Tab label="Meus Produtos" icon={<span className="material-icons">inventory_2</span>} iconPosition="start"/>
                </Tabs>
            </Paper>
            {tabIndex === 0 && (
                <Grid container spacing={3}>
                    {adoptedTrees.length === 0 ? <Grid item xs={12}><Alert severity="info">Você ainda não adotou nenhuma árvore.</Alert></Grid> : 
                        adoptedTrees.map((tree, idx) => {
                            const events = getMonitoringData(tree);
                            return (
                                <Grid item xs={12} md={6} key={idx}>
                                    <Card elevation={3}>
                                        <CardContent>
                                            <Box sx={{display:'flex', justifyContent:'space-between', mb:2}}>
                                                <Typography variant="h6" color={getClassColor(tree.class)}>{tree.vulgar} (#{tree.arvNum})</Typography>
                                                <Chip label={tree.mode === 'guardian' ? 'Guardião' : 'Sócio'} size="small" />
                                            </Box>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>Localização: {tree.lat.toFixed(5)}, {tree.lng.toFixed(5)}</Typography>
                                            <Stepper orientation="vertical" activeStep={events.findIndex(e => e.status === 'active') === -1 ? events.length : events.findIndex(e => e.status === 'active')}>
                                                {events.map((step) => (
                                                    <Step key={step.label} active={step.status === 'active'} completed={step.status === 'completed'}>
                                                        <StepLabel optional={<Typography variant="caption">{step.date}</Typography>}>{step.label}</StepLabel>
                                                        <StepContent><Typography variant="body2">{step.desc}</Typography></StepContent>
                                                    </Step>
                                                ))}
                                            </Stepper>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })
                    }
                </Grid>
            )}
            {(tabIndex === 1 || window.matchMedia('print').matches) && (
                <Box className="print-only">
                    <Paper sx={{p:4}}>
                        <Box sx={{display:'flex', justifyContent:'space-between', mb:4}}>
                            <Typography variant="h5">Relatório de Impacto e Ativos</Typography>
                            <Button variant="outlined" startIcon={<span className="material-icons">print</span>} onClick={handlePrintReport} className="no-print">Imprimir / PDF</Button>
                        </Box>
                        <Grid container spacing={3} sx={{mb:4}}>
                            <Grid item xs={4}><Paper variant="outlined" sx={{p:2, textAlign:'center'}}><Typography variant="h4" color="primary">{adoptedTrees.length}</Typography><Typography variant="caption">Árvores Adotadas</Typography></Paper></Grid>
                            <Grid item xs={4}><Paper variant="outlined" sx={{p:2, textAlign:'center'}}><Typography variant="h4" color="secondary">{(adoptedTrees.length * 0.15).toFixed(2)} t</Typography><Typography variant="caption">CO2 Compensado (Est.)</Typography></Paper></Grid>
                            <Grid item xs={4}><Paper variant="outlined" sx={{p:2, textAlign:'center'}}><Typography variant="h4" color="text.primary">R$ {adoptedTrees.reduce((acc, t) => acc + t.invested, 0).toFixed(2)}</Typography><Typography variant="caption">Investimento Total</Typography></Paper></Grid>
                        </Grid>
                        <TableContainer>
                            <Table size="small">
                                <TableHead><TableRow><TableCell>Árvore</TableCell><TableCell>Tipo</TableCell><TableCell>Cotas</TableCell><TableCell>Investimento</TableCell><TableCell>Status</TableCell></TableRow></TableHead>
                                <TableBody>{adoptedTrees.map((row, i) => (
                                    <TableRow key={i}><TableCell>{row.vulgar} (#{row.arvNum})</TableCell><TableCell>{row.mode === 'guardian' ? 'Preservação' : 'Produção'}</TableCell><TableCell>{row.quotas}</TableCell><TableCell>R$ {row.invested.toFixed(2)}</TableCell><TableCell>Ativo</TableCell></TableRow>
                                ))}</TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>
            )}
            {tabIndex === 2 && (
                <Box>
                    {productTrees.length === 0 ? <Paper sx={{p:4, textAlign:'center'}}><span className="material-icons" style={{fontSize:48, color:'#ccc'}}>inventory_2</span><Typography variant="h6" color="text.secondary">Nenhum produto disponível.</Typography></Paper> : 
                        productTrees.map((tree, idx) => {
                            const forecast = getProductForecast(tree, tree.quotas);
                            const activeStep = forecast.steps.findIndex(s => s.active);
                            return (
                                <Card key={idx} sx={{mb:3}}>
                                    <CardContent>
                                        <Box sx={{display:'flex', alignItems:'center', mb:1}}>
                                            <span className="material-icons" style={{color:'#D84315', marginRight:8}}>forest</span>
                                            <Typography variant="h6" color="secondary">Origem: {tree.vulgar} (#{tree.arvNum})</Typography>
                                        </Box>
                                        <Divider sx={{mb:2}}/>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <Typography variant="subtitle2" gutterBottom>Itens a Receber:</Typography>
                                                <List dense>
                                                    {forecast.items.map((item, i) => (
                                                        <ListItem key={i}>
                                                            <ListItemAvatar><Avatar sx={{bgcolor: 'secondary.light'}}><span className="material-icons">{item.icon}</span></Avatar></ListItemAvatar>
                                                            <ListItemText primary={item.name} secondary={`Quantidade: ${item.quantity}`} />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                                <Typography variant="caption" display="block" sx={{mb:1, fontStyle:'italic'}}>{forecast.desc}</Typography>
                                                <Alert severity="info">Previsão: <strong>{forecast.estimatedDelivery}</strong></Alert>
                                            </Grid>
                                            <Grid item xs={12} md={6}><Typography variant="subtitle2" gutterBottom>Ciclo:</Typography><Stepper activeStep={activeStep} orientation="vertical">{forecast.steps.map((step) => (<Step key={step.label}><StepLabel>{step.label}</StepLabel></Step>))}</Stepper></Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            );
                        })
                    }
                </Box>
            )}
        </Container>
    );
};

const App = () => {
    const [currentView, setCurrentView] = useState('map');
    const [visualizationMode, setVisualizationMode] = useState('map');
    const [userMode, setUserMode] = useState('guardian');
    const [selectedTree, setSelectedTree] = useState(null);
    const [adoptedTrees, setAdoptedTrees] = useState([]);

    const handleConfirmAdoption = (tree, quotas, invested) => {
        const newAdoption = { ...tree, quotas, invested, mode: userMode, date: new Date().toLocaleDateString('pt-BR') };
        setAdoptedTrees([...adoptedTrees, newAdoption]);
        setSelectedTree(null);
        alert("Parabéns! Adoção realizada com sucesso.\nVeja os detalhes no seu Painel.");
    };

    const theme = createTheme({
        palette: { primary: { main: '#2E7D32' }, secondary: { main: '#D84315' }, background: { default: '#F1F8E9' } }
    });

    const handleVisualizationChange = (event, newMode) => { if (newMode !== null) setVisualizationMode(newMode); };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="static" color={userMode === 'guardian' ? 'primary' : 'secondary'} className="no-print">
                <Toolbar>
                    <span className="material-icons" style={{marginRight: 10}}>park</span>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>ARPT | Adote</Typography>
                    <Box sx={{mr: 2}}>
                        <Button color="inherit" onClick={() => setCurrentView('map')} sx={{fontWeight: currentView==='map'?'bold':'normal', textDecoration: currentView==='map'?'underline':'none'}}>Mapa</Button>
                        <Button color="inherit" onClick={() => setCurrentView('dashboard')} sx={{fontWeight: currentView==='dashboard'?'bold':'normal', textDecoration: currentView==='dashboard'?'underline':'none'}}><Badge badgeContent={adoptedTrees.length} color="error">Meu Painel&nbsp;</Badge></Button>
                    </Box>
                    {currentView === 'map' && (
                        <Paper sx={{ px: 2, py: 0.5, borderRadius: 5, display: 'flex', alignItems: 'center' }}>
                            <Typography variant="caption" sx={{ mr: 1, fontWeight: 'bold' }}>{userMode === 'guardian' ? "GUARDIÃO" : "SÓCIO"}</Typography>
                            <Switch checked={userMode === 'partner'} onChange={(e) => setUserMode(e.target.checked ? 'partner' : 'guardian')} color="secondary"/>
                        </Paper>
                    )}
                </Toolbar>
            </AppBar>

            {currentView === 'map' ? (
                <Container maxWidth="xl" sx={{ mt: 3, mb: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Grid container spacing={3} sx={{ height: '100%' }}>
                        <Grid item xs={12} md={3}>
                            <Paper elevation={2} sx={{ p: 3, height: '100%', borderRadius: 3 }}>
                                <Typography variant="h5" gutterBottom color={userMode === 'guardian' ? 'primary.main' : 'secondary.main'}>{userMode === 'guardian' ? 'Perfil: Guardião' : 'Perfil: Sócio'}</Typography>
                                <Divider sx={{my: 2}} />
                                <Typography variant="body2" paragraph color="text.secondary">{userMode === 'guardian' ? "Proteja árvores matrizes (Verdes). Receba certificados digitais." : "Financie o manejo (Laranjas) ou Safra (Frutíferas). Receba produtos físicos comprando +200 cotas."}</Typography>
                                <Box sx={{ mt: 2, bgcolor: '#fafafa', p: 2, borderRadius: 2 }}>
                                    <Typography variant="subtitle2">Legenda:</Typography>
                                    <Box sx={{display:'flex', alignItems:'center', mt:1}}><Box sx={{width:12, height:12, borderRadius:'50%', bgcolor:'#2E7D32', mr:1}}/><Typography variant="caption">Preservação</Typography></Box>
                                    <Box sx={{display:'flex', alignItems:'center', mt:1}}><Box sx={{width:12, height:12, borderRadius:'50%', bgcolor:'#D84315', mr:1}}/><Typography variant="caption">Manejo</Typography></Box>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={9} sx={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ mb: 1, display: 'flex', justifyContent: 'flex-end' }}>
                                <ToggleButtonGroup value={visualizationMode} exclusive onChange={handleVisualizationChange} size="small" color="primary" sx={{ bgcolor: 'white' }}>
                                    <ToggleButton value="map" aria-label="mapa"><span className="material-icons">map</span>&nbsp;Mapa</ToggleButton>
                                    <ToggleButton value="list" aria-label="lista"><span className="material-icons">list</span>&nbsp;Lista</ToggleButton>
                                </ToggleButtonGroup>
                            </Box>
                            {visualizationMode === 'map' ? (
                                <Paper elevation={3} sx={{ flexGrow: 1, overflow: 'hidden', borderRadius: 3 }}>
                                    <MapComponent trees={processedTrees} onSelectTree={setSelectedTree} userMode={userMode} />
                                </Paper>
                            ) : (
                                <Box sx={{ height: '100%' }}>
                                    <TreeListComponent trees={processedTrees} onSelectTree={setSelectedTree} userMode={userMode} />
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </Container>
            ) : (
                <UserDashboard adoptedTrees={adoptedTrees} onBack={() => setCurrentView('map')} />
            )}

            <TreeAdoptionModal tree={selectedTree} open={!!selectedTree} onClose={() => setSelectedTree(null)} userMode={userMode} onConfirmAdoption={handleConfirmAdoption} />
        </ThemeProvider>
    );
};

export default App;
