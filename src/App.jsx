import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  createTheme, ThemeProvider, CssBaseline, AppBar, Toolbar, Typography, 
  Box, Switch, Paper, Container, Grid, Dialog, 
  DialogTitle, DialogContent, DialogActions, Button, Slider, Chip, 
  Alert, Divider, Badge, Card, CardContent, Tabs, Tab,
  List, ListItem, ListItemText, ListItemAvatar, Avatar,
  Step, Stepper, StepLabel, StepContent, TextField,
  ToggleButton, ToggleButtonGroup, FormControlLabel, Checkbox, CardMedia, CardActions, Tooltip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import proj4 from 'proj4';

// --- CONFIGURAÇÕES DE ASSETS ---
const ASSETS = {
    GIF: "/arvore_trocas_gasosas_novo.gif",
    IMAGE: "/image_cb7202.png"
};

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

// --- UTILITÁRIOS ---
const utmDef = "+proj=utm +zone=19 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
const wgs84Def = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";

const croquiPointsUTM = [
    { id: "P001", easting: 187920.8893, northing: 9616195.242 },
    { id: "P002", easting: 187967.5242, northing: 9616105.642 },
    { id: "P003", easting: 187875.9477, northing: 9616057.615 },
    { id: "P004", easting: 187834.0971, northing: 9616150.868 }
];

const convertUtmToLatLng = (easting, northing) => {
    const coords = proj4(utmDef, wgs84Def, [easting, northing]);
    return [coords[1], coords[0]];
};

const croquiPolygon = croquiPointsUTM.map(p => convertUtmToLatLng(p.easting, p.northing));

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
        sciName: "Espécie Nativa Amazónica",
        char: "Resiliência e força da flora amazónica.",
        imp: "Vital para o ecossistema local.",
        prod: { name: "Artesanato Sustentável", icon: "handyman", desc: "Produção local certificada." },
        harvest: null,
        techInfo: "Esta espécie nativa da região amazónica desempenha um papel fundamental no equilíbrio ecológico local. As suas raízes profundas garantem a estabilização do solo contra a erosão pluvial, enquanto a sua copa densa atua como um regulador térmico vital para as espécies de sub-bosque. Cientificamente, as espécies deste bioma são adaptadas a ciclos de cheia e vazante, possuindo metabolismos otimizados para o sequestro de carbono atmosférico. O seu potencial de uso abrange desde o extrativismo não madeireiro (óleos e sementes) até ao manejo sustentável de madeira de alta densidade, valorizada pela sua resistência natural a fungos e insetos. Economicamente, o apadrinhamento deste indivíduo permite o financiamento de brigadas de vigilância comunitária e projetos de ciência cidadã. Além da produção física, a árvore gera 'créditos de biodiversidade' através do suporte a polinizadores essenciais para a agricultura regenerativa regional. A preservação contínua garante a integridade dos corredores biológicos necessários para a fauna silvestre."
    };

    if (spec.includes("castanheira")) {
        data.sciName = "Bertholletia excelsa";
        data.techInfo = "A Castanheira-do-Brasil (Bertholletia excelsa) é uma das árvores mais emblemáticas e imponentes da floresta amazónica, atingindo alturas de até 50 metros e podendo viver por mais de 500 anos. Cientificamente, pertence à família Lecythidaceae. A sua importância ecológica é vital, pois depende exclusivamente de abelhas robustas para a polinização e da cutia para a dispersão das sementes, mantendo a teia de vida. Em termos de potencial de uso, os seus frutos, conhecidos como ouriços, abrigam as castanhas que são ricas em selénio, gorduras insaturadas e proteínas, sendo base da dieta e economia regional. A madeira é protegida por lei devido ao seu valor ecológico. Além das amêndoas consumidas in natura, o óleo extraído é altamente valorizado na cosmética internacional. Árvores isoladas raramente frutificam devido à ausência de polinizadores específicos que habitam apenas a mata fechada, tornando a preservação da floresta ao seu redor um requisito biológico. Adotar uma castanheira é investir na rainha da floresta, garantindo que este gigante continue a realizar o seu ciclo hídrico massivo e a alimentar gerações de extrativistas tradicionais.";
        data.harvest = { type: "Castanha", season: "Jan-Abr", annualYield: 60, unit: "kg", unitPrice: 28.00 };
        data.prod = { name: "Castanha-do-Pará", icon: "shopping_basket" };
    }
    else if (spec.includes("cumaru")) {
        data.sciName = "Dipteryx odorata";
        data.techInfo = "O Cumaru (Dipteryx odorata), da família Fabaceae, é reconhecido mundialmente como a 'Baunilha da Amazónia'. Ecologicamente, é uma árvore emergente que desempenha um papel crucial no sequestro de carbono devido à densidade extrema da sua madeira. O potencial de uso é duplo: a madeira é altamente valorizada pela sua dureza, sendo utilizada em construções navais e luxo sustentável. Contudo, o seu maior valor reside na semente, a fava tonka. Esta semente contém cumarina, substância aromática intensamente utilizada na alta perfumaria francesa e na gastronomia de vanguarda para aromatizar doces e bebidas finas. A colheita das favas é uma atividade 100% sustentável. Curiosamente, o Cumaru é ideal para sistemas agroflorestais, pois proporciona sombra e retorno financeiro recorrente através das sementes. O investimento neste ativo garante a preservação de uma espécie que é símbolo de resiliência e fragrância. A biologia do Cumaru permite-lhe suportar longos períodos de seca, tornando-o um pilar de estabilidade climática. Ao financiar esta árvore, o sócio participa diretamente num mercado global de especiarias de luxo.";
        data.harvest = { type: "Sementes", season: "Ago-Out", annualYield: 12, unit: "kg", unitPrice: 135.00 };
        data.prod = { name: "Fava Tonka", icon: "spa" };
    }
    else if (spec.includes("andiroba")) {
        data.sciName = "Carapa guianensis";
        data.techInfo = "A Andiroba (Carapa guianensis) é frequentemente chamada de 'farmácia da floresta'. Esta árvore de várzea é fundamental na regulação hídrica. Cientificamente, é parente do mogno, possuindo madeira de excelente qualidade e resistente a insetos. O seu potencial de uso deriva principalmente das sementes. Através da prensagem, obtém-se o óleo de andiroba, rico em limonóides com propriedades medicinais: é anti-inflamatório, cicatrizante e repelente natural. Na indústria cosmética, é ingrediente base para produtos capilares e sabonetes premium. A produção de sementes é influenciada pelo regime das marés, tornando a Andiroba um indicador biológico da saúde dos rios. A sua madeira oriunda de manejo é muito procurada para marcenaria fina. Investir numa Andiroba é apoiar a medicina tradicional e a economia ribeirinha. Além do óleo, a árvore oferece abrigo a diversas espécies de peixes durante as cheias. O seu tronco reto e imponente é um símbolo da arquitetura natural da floresta. O monitoramento contínuo deste indivíduo assegura que as propriedades terapêuticas da Amazónia permaneçam acessíveis de forma ética e controlada.";
        data.harvest = { type: "Óleo", season: "Mar-Mai", annualYield: 8, unit: "litros", unitPrice: 85.00 };
        data.prod = { name: "Óleo de Andiroba", icon: "sanitizer" };
    }
    else if (spec.includes("cedrinho")) {
        data.sciName = "Erisma uncinatum";
        data.techInfo = "O Cedrinho (Erisma uncinatum) é uma das espécies mais importantes para o manejo florestal sustentável. Ecologicamente, contribui para a estrutura do dossel superior e oferece locais de nidificação para aves tropicais. A sua madeira possui um tom rosado apreciado pela leveza e resistência mecânica. O potencial de uso abrange desde a construção civil leve até mobiliário e painéis decorativos. No manejo, o Cedrinho é uma espécie chave devido à sua excelente capacidade de regeneração natural em clareiras. Embora não produza frutos para consumo humano, a sua floração atrai polinizadores que beneficiam todo o ecossistema. Para o investidor, o Cedrinho representa um ativo de crescimento previsível. Adotar um espécime no modo Sócio financia uma cadeia produtiva que substitui materiais sintéticos por recursos renováveis. O manejo controlado garante que a árvore só seja removida quando atingir a maturidade ideal, permitindo que novos indivíduos ocupem o seu lugar, mantendo a floresta funcional. É o exemplo perfeito de economia circular aplicada à conservação florestal moderna.";
        data.prod = { name: "Tábua de Corte", icon: "kitchen" };
    }
    else if (spec.includes("sapucaia")) {
        data.sciName = "Lecythis pisonis";
        data.techInfo = "A Sapucaia (Lecythis pisonis) é famosa pela sua mudança cromática anual, onde as folhas novas surgem em tons de lilás. Ecologicamente, sustenta polinizadores especializados e dispersores como macacos. O seu fruto é um pixídio lenhoso que possui uma 'tampa' que se solta ao amadurecer. O potencial de uso é vasto: as sementes (castanhas de sapucaia) são consideradas superiores em sabor à castanha-do-pará, sendo ricas em óleos essenciais. Contudo, a dificuldade de colheita as torna um produto de luxo. A madeira é extremamente durável, usada em construções pesadas. Curiosamente, as urnas vazias são usadas tradicionalmente como recipientes rústicos. É uma espécie que combina alto valor estético e botânico. Adotar uma Sapucaia é valorizar a raridade amazónica. A sua floração intensa é um evento biológico que marca as estações na floresta densa. O seu monitoramento ajuda a mapear os ciclos reprodutivos da região de Rio Preto da Eva. É um ativo que representa a complexidade e a beleza da bioeconomia de nicho.";
        data.harvest = { type: "Castanha", season: "Set-Nov", annualYield: 45, unit: "kg", unitPrice: 42.00 };
        data.prod = { name: "Castanha de Sapucaia", icon: "park" };
    }
    return data;
};

const getMonitoringData = (tree) => {
    if (tree.class === 'Rem' || tree.class === 'Fut') {
        return [
            { label: 'Georreferenciamento', date: '10/01/2025', status: 'completed', desc: 'Localização confirmada via GPS de precisão.' },
            { label: 'Censo Florestal', date: '15/01/2025', status: 'completed', desc: 'Registo no sistema Manejar.' },
            { label: 'Vistoria de Florada', date: '20/09/2025', status: 'active', desc: 'Ciclo reprodutivo observado em campo.' },
            { label: 'Auditoria Externa', date: 'Em breve', status: 'pending', desc: 'Verificação anual.' }
        ];
    } else {
        return [
            { label: 'Autorização de Corte', date: '05/01/2025', status: 'completed', desc: 'Aprovado pelo plano de manejo sustentável.' },
            { label: 'Corte Direcional', date: '12/02/2025', status: 'completed', desc: 'Executado com técnicas de baixo impacto.' },
            { label: 'Serraria e Manufatura', date: '25/03/2025', status: 'active', desc: 'Processamento artesanal da peça.' },
            { label: 'Logística de Envio', date: 'Estimado 05/2025', status: 'pending', desc: 'Saída para entrega.' }
        ];
    }
};

const getProductForecast = (tree, quotas) => {
    const info = getTreeEncyclopedia(tree.vulgar);
    const today = new Date();
    const year = today.getFullYear();
    let items = [];
    let estimatedDelivery = "";

    if (info.harvest) {
        const userShare = (quotas / 1000) * info.harvest.annualYield;
        const shareFormatted = userShare < 1 ? (userShare * 1000).toFixed(0) + "g" : userShare.toFixed(1) + " " + info.harvest.unit;
        items.push({ name: `Quota: ${info.prod.name}`, quantity: shareFormatted, icon: "eco" });
        estimatedDelivery = `${info.harvest.season} ${year + 1}`;
    } else {
        const mainQty = Math.floor(quotas / 200); 
        items.push({ name: info.prod.name, quantity: mainQty || 1, icon: info.prod.icon });
        estimatedDelivery = "Maio 2025";
    }

    return {
        items: items,
        steps: [{ label: 'Monitoramento', completed: true }, { label: 'Manufatura', completed: false, active: true }, { label: 'Certificação', completed: false }, { label: 'Logística', completed: false }],
        estimatedDelivery: estimatedDelivery
    };
};

const processedTrees = rawInventoryData.map(tree => {
    const northing = parseFloat(tree.latUtm.replace(',', '.'));
    const easting = parseFloat(tree.longUtm.replace(',', '.'));
    const [lat, lng] = convertUtmToLatLng(easting, northing);
    return { ...tree, lat, lng };
});

// --- COMPONENTES ---

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
                    <Tooltip title="Oxigénio"><Chip label="O2" size="small" variant="outlined" color="primary" sx={{height:20, fontSize:10}} /></Tooltip>
                    <Tooltip title="Vapor de Água"><Chip label="H2O" size="small" variant="outlined" color="info" sx={{height:20, fontSize:10}} /></Tooltip>
                    <Tooltip title="Absorção CO2"><Chip label="CO2" size="small" variant="outlined" color="success" sx={{height:20, fontSize:10}} /></Tooltip>
                </Box>
                <Typography variant="caption" color="text.secondary" display="block">{info.char.substring(0, 50)}...</Typography>
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2 }}>
                <Button variant="contained" size="small" fullWidth color={userMode === 'guardian' ? 'primary' : 'secondary'} onClick={() => onSelect(tree)}>Explorar</Button>
            </CardActions>
        </Card>
    );
};

const MapComponent = ({ trees, onSelectTree, userMode, showCroqui }) => {
    const mapRef = useRef(null);
    const croquiLayer = useRef(null);
    useEffect(() => {
        if (!mapRef.current) {
            const center = trees[0] ? [trees[0].lat, trees[0].lng] : [0,0];
            const map = L.map('map-container').setView(center, 17);
            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}').addTo(map);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png').addTo(map);
            mapRef.current = map;
        }
        if (showCroqui) {
            if (!croquiLayer.current) {
                croquiLayer.current = L.polygon(croquiPolygon, { color: '#FFEB3B', weight: 2, fillOpacity: 0.1, dashArray: '5, 5' }).addTo(mapRef.current);
                mapRef.current.fitBounds(croquiLayer.current.getBounds(), { padding: [50, 50] });
            }
        } else if (croquiLayer.current) {
            mapRef.current.removeLayer(croquiLayer.current);
            croquiLayer.current = null;
        }
        mapRef.current.eachLayer((layer) => { if (layer instanceof L.CircleMarker) mapRef.current.removeLayer(layer); });
        trees.forEach(tree => {
            const marker = L.circleMarker([tree.lat, tree.lng], { color: getClassColor(tree.class), radius: 8, fillOpacity: 0.8 }).addTo(mapRef.current);
            marker.on('click', () => onSelectTree(tree));
        });
    }, [trees, userMode, showCroqui]);
    return <div id="map-container" style={{ height: '100%', width: '100%' }}></div>;
};

const UserDashboard = ({ adoptedTrees, onBack }) => {
    const [tabIndex, setTabIndex] = useState(0);
    const productTrees = adoptedTrees.filter(t => t.mode === 'partner' && t.quotas >= 200);
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Button startIcon={<span className="material-icons">arrow_back</span>} onClick={onBack} sx={{mb:2}} className="no-print">Voltar</Button>
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
                    {adoptedTrees.length === 0 ? <Grid item xs={12}><Alert severity="info">Ainda não realizou nenhuma adoção.</Alert></Grid> : 
                        adoptedTrees.map((tree, idx) => (
                            <Grid item xs={12} md={6} key={idx}>
                                <Card elevation={3} sx={{ borderRadius: 4 }}>
                                    <CardContent>
                                        <Typography variant="h6" color={getClassColor(tree.class)}>{tree.vulgar} (#{tree.arvNum})</Typography>
                                        <Stepper orientation="vertical" activeStep={1} sx={{ mt: 2 }}>
                                            {getMonitoringData(tree).map((step) => (
                                                <Step key={step.label} active={step.status === 'active'} completed={step.status === 'completed'}>
                                                    <StepLabel optional={<Typography variant="caption">{step.date}</Typography>}>{step.label}</StepLabel>
                                                    <StepContent><Typography variant="body2">{step.desc}</Typography></StepContent>
                                                </Step>
                                            ))}
                                        </Stepper>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    }
                </Grid>
            )}
            {tabIndex === 1 && (
                <Paper sx={{ p: 4, borderRadius: 4 }}>
                    <Typography variant="h5" gutterBottom>Extrato de Impacto</Typography>
                    <TableContainer>
                        <Table>
                            <TableHead><TableRow><TableCell>Árvore</TableCell><TableCell>ID</TableCell><TableCell>Cotas</TableCell><TableCell>Investimento</TableCell></TableRow></TableHead>
                            <TableBody>
                                {adoptedTrees.map((t, i) => (
                                    <TableRow key={i}><TableCell>{t.vulgar}</TableCell><TableCell>#{t.arvNum}</TableCell><TableCell>{t.quotas}</TableCell><TableCell>R$ {t.invested.toFixed(2)}</TableCell></TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}
            {tabIndex === 2 && (
                <Box>
                    {productTrees.length === 0 ? <Alert severity="info">Não existem produtos para as suas adoções atuais.</Alert> : 
                        productTrees.map((tree, idx) => (
                            <Card key={idx} sx={{ mb: 2, borderRadius: 4 }}>
                                <CardContent>
                                    <Typography variant="h6">{tree.vulgar}</Typography>
                                    <Typography variant="body2">Entrega estimada: {getProductForecast(tree, tree.quotas).estimatedDelivery}</Typography>
                                </CardContent>
                            </Card>
                        ))
                    }
                </Box>
            )}
        </Container>
    );
};

const App = () => {
    const [currentView, setCurrentView] = useState('explore'); 
    const [viewMode, setViewMode] = useState('grid'); 
    const [userMode, setUserMode] = useState('guardian');
    const [selectedTree, setSelectedTree] = useState(null);
    const [showCroqui, setShowCroqui] = useState(false);
    const [adoptedTrees, setAdoptedTrees] = useState([]);

    const featuredTrees = useMemo(() => processedTrees
        .filter(t => !!getTreeEncyclopedia(t.vulgar).harvest)
        .sort((a, b) => {
            const infoA = getTreeEncyclopedia(a.vulgar);
            const infoB = getTreeEncyclopedia(b.vulgar);
            return (infoB.harvest.annualYield * infoB.harvest.unitPrice) - (infoA.harvest.annualYield * infoA.harvest.unitPrice);
        })
        .slice(0, 3), []);

    const handleConfirmAdoption = (tree, quotas, invested) => {
        const newAdoption = { ...tree, quotas, invested, mode: userMode, date: new Date().toLocaleDateString('pt-PT') };
        setAdoptedTrees([...adoptedTrees, newAdoption]);
        setSelectedTree(null);
        alert("Sucesso! Adoção registada.");
    };

    const theme = createTheme({
        palette: { primary: { main: '#2E7D32' }, secondary: { main: '#D84315' }, background: { default: '#F1F8E9' } }
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="static" color={userMode === 'guardian' ? 'primary' : 'secondary'} elevation={0} className="no-print">
                <Toolbar>
                    <span className="material-icons" style={{ marginRight: 10 }}>park</span>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>ARPT | Adote</Typography>
                    <Box sx={{ mr: 2 }}>
                        <Button color="inherit" onClick={() => setCurrentView('explore')} sx={{ fontWeight: currentView==='explore'?'bold':'normal' }}>Explorar</Button>
                        <Button color="inherit" onClick={() => setCurrentView('dashboard')} sx={{ fontWeight: currentView==='dashboard'?'bold':'normal' }}>
                            <Badge badgeContent={adoptedTrees.length} color="error">Meu Painel&nbsp;</Badge>
                        </Button>
                    </Box>
                    <Paper sx={{ px: 2, py: 0.5, borderRadius: 5, display: 'flex', alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ mr: 1, fontWeight: 'bold' }}>{userMode === 'guardian' ? "GUARDIÃO" : "SÓCIO"}</Typography>
                        <Switch checked={userMode === 'partner'} onChange={(e) => setUserMode(e.target.checked ? 'partner' : 'guardian')} color="secondary" />
                    </Paper>
                </Toolbar>
            </AppBar>

            {currentView === 'explore' ? (
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
            ) : (
                <UserDashboard adoptedTrees={adoptedTrees} onBack={() => setCurrentView('explore')} />
            )}
            <TreeAdoptionModal tree={selectedTree} open={!!selectedTree} onClose={() => setSelectedTree(null)} userMode={userMode} onConfirmAdoption={handleConfirmAdoption} />
        </ThemeProvider>
    );
};

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
            <DialogTitle sx={{display:'flex', alignItems:'center', gap:1, bgcolor: getClassColor(tree.class), color:'#fff'}}>
                <span className="material-icons">park</span> {tree.vulgar} (#{tree.arvNum})
            </DialogTitle>
            <DialogContent sx={{pt: 2}}>
                <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} variant="fullWidth" sx={{mb:2}}>
                    <Tab label="Adoção" /><Tab label="Info Técnica" />
                </Tabs>
                {tabValue === 0 && (
                    <Box sx={{mt:1}}>
                        {!canAdopt ? <Alert severity="warning">{warning}</Alert> : (
                            <Box>
                                <Typography gutterBottom sx={{fontWeight:'bold'}}>Quantas cotas?</Typography>
                                <Slider value={quotas} onChange={(e,v) => setQuotas(v)} min={1} max={1000} step={10} valueLabelDisplay="auto" color={isGuardian ? "primary" : "secondary"} />
                                <Paper sx={{p:2, mt:2, textAlign:'center', bgcolor:'#f5f5f5'}}>
                                    <Typography variant="h4" color={isGuardian ? "primary" : "secondary"} fontWeight="bold">R$ {(quotas * PRICE_PER_QUOTA).toFixed(2)}</Typography>
                                    <Typography variant="caption">Total do Investimento</Typography>
                                </Paper>
                            </Box>
                        )}
                    </Box>
                )}
                {tabValue === 1 && (
                    <Box sx={{mt:1}}>
                        <Typography variant="subtitle2" color="primary" fontWeight="bold" gutterBottom>{info.sciName}</Typography>
                        <Typography variant="body2" sx={{ textAlign: 'justify', lineHeight: 1.6 }}>{info.techInfo}</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="caption" color="text.secondary">📍 Coordenadas: {tree.lat.toFixed(6)}, {tree.lng.toFixed(6)}</Typography>
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{p:3}}>
                <Button onClick={onClose}>Fechar</Button>
                <Button variant="contained" disabled={!canAdopt || tabValue === 1} color={isGuardian ? "primary" : "secondary"} onClick={() => onConfirmAdoption(tree, quotas, quotas * PRICE_PER_QUOTA)}>Confirmar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default App;
