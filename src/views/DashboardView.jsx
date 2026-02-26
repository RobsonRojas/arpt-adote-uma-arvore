import React, { useState } from 'react';
import { Container, Typography, Paper, Tabs, Tab, Grid, Card, CardContent, Stepper, Step, StepLabel, StepContent, Alert, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Box } from '@mui/material';
import { getClassColor, getMonitoringData, getProductForecast } from '../utils/treeUtils';

const DashboardView = ({ adoptedTrees }) => {
    const [tabIndex, setTabIndex] = useState(0);
    const productTrees = adoptedTrees.filter(t => t.mode === 'partner' && t.quotas >= 200);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">Painel do Adotante</Typography>
            <Paper sx={{ width: '100%', mb: 2 }} className="no-print">
                <Tabs value={tabIndex} onChange={(e, v) => setTabIndex(v)} indicatorColor="primary" textColor="primary" centered>
                    <Tab label="Monitoramento" icon={<span className="material-icons">visibility</span>} iconPosition="start" />
                    <Tab label="Relatórios" icon={<span className="material-icons">assessment</span>} iconPosition="start" />
                    <Tab label="Meus Produtos" icon={<span className="material-icons">inventory_2</span>} iconPosition="start" />
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

export default DashboardView;
