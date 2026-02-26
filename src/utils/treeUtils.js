export const convertUtmToLatLng = (easting, northing, zone = 20, southHemi = true) => {
    const a = 6378137;
    const f = 1 / 298.257223563;
    const b = a * (1 - f);
    const e2 = (a ** 2 - b ** 2) / a ** 2;
    const e12 = (a ** 2 - b ** 2) / b ** 2;
    const k0 = 0.9996;
    const x = easting - 500000;
    const y = southHemi ? northing - 10000000 : northing;
    const m = y / k0;
    const n = (a - b) / (a + b);
    const g = a * (1 - n) * (1 - n ** 2) * (1 + (9 / 4) * n ** 2 + (225 / 64) * n ** 4) * (Math.PI / 180);
    const mu = m / g;
    const phi1Rad = mu + (3 / 2 * n - 27 / 32 * n ** 3) * Math.sin(2 * mu) + (21 / 16 * n ** 2 - 55 / 32 * n ** 4) * Math.sin(4 * mu) + (151 / 96 * n ** 3) * Math.sin(6 * mu);
    const c1 = e12 * Math.cos(phi1Rad) ** 2;
    const t1 = Math.tan(phi1Rad) ** 2;
    const r1 = a * (1 - e2) / (1 - e2 * Math.sin(phi1Rad) ** 2) ** 1.5;
    const d = x / (r1 * k0);
    const lat = phi1Rad - (r1 * Math.tan(phi1Rad) / r1) * (d ** 2 / 2 - (5 + 3 * t1 + 10 * c1 - 4 * c1 ** 2 - 9 * e12) * d ** 4 / 24 + (61 + 90 * t1 + 298 * c1 + 45 * t1 ** 2 - 252 * e12 - 3 * c1 ** 2) * d ** 6 / 720);
    const lonRad = (d - (1 + 2 * t1 + c1) * d ** 3 / 6 + (5 - 2 * c1 + 28 * t1 - 3 * c1 ** 2 + 8 * e12 + 24 * t1 ** 2) * d ** 5 / 120) / Math.cos(phi1Rad);
    const lon = lonRad * (180 / Math.PI) + ((zone * 6 - 186) * (Math.PI / 180)) * (180 / Math.PI);
    return [lat * (180 / Math.PI), lon];
};

export const getClassColor = (cls) => {
    switch (cls) {
        case 'Rem': return '#2E7D32'; // Remanescente (Matriz)
        case 'Fut': return '#4CAF50'; // Futura
        case 'Cor': return '#D84315'; // Corte (Manejo)
        default: return '#757575';
    }
};

export const getTreeDetails = (species) => {
    const spec = species.toLowerCase();
    let data = {
        sciName: "Espécie nativa",
        techInfo: "Informação técnica em processamento.",
        prod: { name: "Bioativo", icon: "eco" }
    };

    if (spec.includes("cupiuba")) {
        data.sciName = "Goupia glabra";
        data.techInfo = "A Cupiúba (Goupia glabra) é uma resistente árvore amazónica. No manejo sustentável, é valorizada pela durabilidade de sua madeira e papel ecológico no dossel.";
        data.prod = { name: "Móvel Sustentável", icon: "weekend" };
    }
    else if (spec.includes("castanheira")) {
        data.sciName = "Bertholletia excelsa";
        data.techInfo = "A Castanheira é protegida por lei e pilar da bioeconomia. Adotá-la é preservar um monumento vivo que sustenta centenas de espécies e comunidades.";
        data.harvest = { type: "Castanha", season: "Jan-Mar", annualYield: 150, unit: "kg", unitPrice: 15.00 };
        data.prod = { name: "Óleo de Castanha", icon: "opacity" };
    }
    else if (spec.includes("cumaru")) {
        data.sciName = "Dipteryx odorata";
        data.techInfo = "O Cumaru produz as famosas sementes aromáticas. É uma das madeiras mais nobres e resistentes, essencial para polinizadores noturnos como morcegos.";
        data.harvest = { type: "Sementes", season: "Ago-Out", annualYield: 20, unit: "kg", unitPrice: 85.00 };
        data.prod = { name: "Essência de Cumaru", icon: "auto_fix_high" };
    }
    else if (spec.includes("cedrinho")) {
        data.sciName = "Erisma uncinatum";
        data.techInfo = "Espécie chave para o manejo de baixo impacto. Sua regeneração natural em clareiras garante a funcionalidade contínua da floresta explorada.";
        data.prod = { name: "Tábua de Corte", icon: "kitchen" };
    }
    else if (spec.includes("sapucaia")) {
        data.sciName = "Lecythis pisonis";
        data.techInfo = "A Sapucaia combina beleza rara com castanhas de alto valor gastronômico. Sua floração é um marco biológico na região de Rio Preto da Eva.";
        data.harvest = { type: "Castanha", season: "Set-Nov", annualYield: 45, unit: "kg", unitPrice: 42.00 };
        data.prod = { name: "Castanha de Sapucaia", icon: "park" };
    }
    return data;
};

// Alias para compatibilidade com código antigo se houver
export const getTreeEncyclopedia = getTreeDetails;

export const getImpactStats = (tree) => {
    const co2 = tree.co2_estimado || (tree.dap * 2.5);
    const oxygen = (co2 * 0.72).toFixed(1);
    const biodiversity = Math.floor(tree.dap / 10) + 2;

    // Rios Voadores: 300L/m2/ano baseado na área da copa estimada
    // Heurística: Diâmetro da Copa (m) ≈ DAP (cm) * 0.15
    const canopyRadius = (tree.dap * 0.15) / 2;
    const canopyArea = Math.PI * (canopyRadius ** 2);
    const water = Math.round(canopyArea * 300);

    return {
        co2: co2.toFixed(1),
        oxygen,
        biodiversity,
        water,
        valuation: (co2 * 0.15).toFixed(2)
    };
};

export const getStatusLabel = (status) => {
    switch (status) {
        case 'licenciado': return { label: 'Área Licenciada', color: '#2E7D32', icon: 'gavel' };
        case 'processo': return { label: 'Em Licenciamento', color: '#F57C00', icon: 'pending' };
        case 'protegida': return { label: 'Espécie Protegida', color: '#D32F2F', icon: 'verified_user' };
        default: return { label: 'Manejo Sustentável', color: '#757575', icon: 'inventory' };
    }
};

export const getMonitoringData = (tree) => {
    // Retorna array para o Stepper no Dashboard
    return [
        { label: 'Inventário Florestal', date: '01/03/2023', desc: 'Identificação e medição técnica (DAP/Altura).', status: 'completed' },
        { label: 'Licenciamento Ambiental', date: '15/05/2023', desc: 'Aprovação pelo órgão ambiental competente.', status: 'completed' },
        { label: 'Monitoramento Ativo', date: 'Hoje', desc: 'Vigilância contra desmatamento e incêndios.', status: 'active' },
        { label: 'Cálculo de Créditos', date: 'Próximo Trimestre', desc: 'Verificação periódica do estoque de carbono.', status: 'pending' }
    ];
};

export const getProductForecast = (tree, quotas) => {
    const details = getTreeDetails(tree.vulgar);
    if (!details.harvest) return { estimatedDelivery: "N/A", quantity: 0 };

    return {
        estimatedDelivery: details.harvest.season + " de 2024",
        quantity: (details.harvest.annualYield * (quotas / 1000)).toFixed(2) + details.harvest.unit
    };
};
