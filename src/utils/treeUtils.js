import proj4 from 'proj4';

export const utmDef = "+proj=utm +zone=19 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
export const wgs84Def = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";

export const convertUtmToLatLng = (easting, northing) => {
    const coords = proj4(utmDef, wgs84Def, [easting, northing]);
    return [coords[1], coords[0]];
};

export const getClassColor = (classificacao) => {
    switch (classificacao) {
        case 'Rem': return '#2E7D32';
        case 'Cor': return '#D84315';
        default: return '#FBC02D';
    }
};

export const getClassLabel = (classificacao) => {
    switch (classificacao) {
        case 'Rem': return 'Remanescente (Proteção)';
        case 'Cor': return 'Corte (Manejo)';
        default: return 'Futuro (Crescimento)';
    }
};

export const getTreeEncyclopedia = (species) => {
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

export const getMonitoringData = (tree) => {
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

export const getProductForecast = (tree, quotas) => {
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
