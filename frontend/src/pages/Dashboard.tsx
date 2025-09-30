// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './dashboard.css';
import { CHART_COLORS, CHART_CONFIG } from '@/types/constants';
import { formatCurrency } from '@/utils/format';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface ChartData {
  readonly mes: string;
  readonly total_compras: number;
}

interface Obra {
  readonly id: number;
  readonly nome: string;
}

interface NavCard {
  readonly to: string;
  readonly label: string;
  readonly icon: React.ReactNode;
}

const Dashboard: React.FC = () => {
  const [dadosGrafico, setDadosGrafico] = useState<ChartData[]>([]);
  const [mesSelecionado, setMesSelecionado] = useState<string>('todos');
  const [obras, setObras] = useState<Obra[]>([]);
  const [obraSelecionada, setObraSelecionada] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    fetchObras();
  }, []);

  useEffect(() => {
    if (obraSelecionada) {
      fetchMonthlyInvoices();
    } else {
      setDadosGrafico([]);
    }
  }, [obraSelecionada]);

  const fetchObras = async (): Promise<void> => {
    try {
      setErrorMsg('');
      const { data } = await api.get('/api/obras');
      
      if (data.status) {
        setObras(data.obras);
      } else {
        setErrorMsg(`Erro ao buscar obras: ${data.message || ''}`);
      }
    } catch (error) {
      console.error('Erro API Obras:', error);
      setErrorMsg('Falha ao conectar com o servidor para buscar obras.');
    }
  };

  const fetchMonthlyInvoices = async (): Promise<void> => {
    if (!obraSelecionada) return;
    
    setLoading(true);
    setErrorMsg('');

    try {
      const url = `/api/notas-fiscais/mensal/${obraSelecionada}`;
      const { data } = await api.get(url);

      if (data.status && Array.isArray(data.data)) {
        const dadosCorrigidos = data.data.map((item: any) => ({
          ...item,
          total_compras: parseFloat(item.total_compras) || 0,
        }));
        
        setDadosGrafico(dadosCorrigidos);
        
        if (dadosCorrigidos.length === 0) {
          setErrorMsg('Nenhum dado de compra encontrado para esta obra.');
        }
      } else {
        console.warn('Dados não retornados ou formato inesperado:', data);
        setDadosGrafico([]);
        setErrorMsg(data.message || 'Nenhum dado retornado para a obra selecionada.');
      }
    } catch (error: any) {
      console.error('Erro API Notas:', error);
      setDadosGrafico([]);
      setErrorMsg(error.response?.data?.message || 'Falha ao buscar dados de compras.');
    } finally {
      setLoading(false);
    }
  };

  const handleObraChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setObraSelecionada(e.target.value);
    setMesSelecionado('todos');
    setErrorMsg('');
  };

  const handleMesChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setMesSelecionado(e.target.value);
  };

  const dadosFiltrados = mesSelecionado === 'todos' 
    ? dadosGrafico 
    : dadosGrafico.filter(item => item.mes === mesSelecionado);
  
  const totalGastos = dadosFiltrados.reduce((acc, item) => acc + item.total_compras, 0);

  const dataGraficoPizza = {
    labels: dadosFiltrados.map(item => item.mes),
    datasets: [{
      data: dadosFiltrados.map(item => item.total_compras),
      backgroundColor: dadosFiltrados.map((_, index) => 
        Object.values(CHART_COLORS)[index % Object.values(CHART_COLORS).length]
      ),
      borderColor: '#2A2D35',
      borderWidth: CHART_CONFIG.BORDER_WIDTH,
      hoverOffset: CHART_CONFIG.HOVER_OFFSET,
    }],
  };

  const optionsGraficoPizza = {
    responsive: CHART_CONFIG.RESPONSIVE,
    maintainAspectRatio: CHART_CONFIG.MAINTAIN_ASPECT_RATIO,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#A9B1C2',
          font: {
            size: 13,
            family: "'Inter', sans-serif",
          },
          padding: 25,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        callbacks: {
          label: (c: any) => ` ${formatCurrency(c.parsed)}`,
        },
      },
      datalabels: {
        color: '#FFFFFF',
        font: { weight: 'bold' as const },
        formatter: (value: number) => formatCurrency(value),
        display: (c: any) => (c.dataset.data[c.dataIndex] / totalGastos) > 0.05,
      },
    },
  };

  const mesesDisponiveis = [...new Set(dadosGrafico.map(item => item.mes))];

  const navCards: NavCard[] = [
    { 
      to: "/select-action/venda", 
      label: "Cadastrar Gasto", 
      icon: <div className="icon-wrapper"><i className="fas fa-plus" /></div> 
    },
    { 
      to: "/obras", 
      label: "Obras", 
      icon: <div className="icon-wrapper"><i className="fas fa-building-columns" /></div> 
    },
    { 
      to: "/notaFiscal", 
      label: "Nota Fiscal", 
      icon: <div className="icon-wrapper"><i className="fas fa-file-invoice-dollar" /></div> 
    },
  ];

  return (
    <div className="dashboard-content-wrapper">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Sistema de Gestão</h1>
      </header>

      <main className="dashboard-main-column">
        <div className="dashboard-cards-grid">
          {navCards.map(card => (
            <Link to={card.to} className="dashboard-nav-card-link" key={card.label}>
              <div className="dashboard-nav-card">
                {card.icon}
                <span>{card.label}</span>
              </div>
            </Link>
          ))}
        </div>

        <section className="dashboard-chart-section">
          <h2 className="section-title">Distribuição de Compras por Mês</h2>
          <div className="filters-container">
            <div className="filter-group">
              <label htmlFor="obra-select">Obra:</label>
              <select 
                id="obra-select" 
                className="dashboard-select" 
                value={obraSelecionada} 
                onChange={handleObraChange}
              >
                <option value="">Selecione uma obra</option>
                {obras.map((obra) => (
                  <option key={obra.id} value={obra.id}>
                    {obra.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="mes-select">Mês:</label>
              <select 
                id="mes-select" 
                className="dashboard-select" 
                value={mesSelecionado} 
                onChange={handleMesChange} 
                disabled={!obraSelecionada || loading || mesesDisponiveis.length === 0}
              >
                <option value="todos">Todos os meses</option>
                {mesesDisponiveis.map(mes => (
                  <option key={mes} value={mes}>{mes}</option>
                ))}
              </select>
            </div>
          </div>
          
          {errorMsg && <p className="dashboard-error-message">{errorMsg}</p>}
          
          <div className="chart-wrapper-dashboard">
            {loading ? (
              <p className="loading-text">Carregando...</p>
            ) : dadosGrafico.length > 0 && dadosFiltrados.length > 0 ? (
              <Pie data={dataGraficoPizza} options={optionsGraficoPizza} />
            ) : !loading && obraSelecionada && !errorMsg ? (
              <p className="no-data-text">Nenhum dado para exibir.</p>
            ) : (
              <p className="no-data-text">Selecione uma obra para visualizar os gastos.</p>
            )}
          </div>
        </section>
      </main>

      <aside className="dashboard-right-sidebar">
        {obraSelecionada && dadosFiltrados.length > 0 && !loading && (
          <div className="widget-card">
            <h3>Total de Gastos (Filtro)</h3>
            <p className="total-gastos-value">
              {formatCurrency(totalGastos)}
            </p>
          </div>
        )}
        <div className="widget-card">
          <h3>Relatórios Rápidos</h3>
          <ul className="quick-reports-list">
            <li>
              <Link to="/relatorios/vendas">
                <i className="fas fa-chart-line" />
                <span>Relatório de Compras</span>
              </Link>
            </li>
            <li>
              <Link to="/relatorios/financeiro">
                <i className="fas fa-wallet" />
                <span>Fluxo de Caixa</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Dashboard;