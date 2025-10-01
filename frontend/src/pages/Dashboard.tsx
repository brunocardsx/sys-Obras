// src/pages/Dashboard.tsx
import React, { useEffect, useState, useCallback } from 'react';
// Recharts removido - usando gráfico HTML/CSS que funciona!
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import '../dashboard/dashboard.css';
import { formatCurrency } from '../utils/format';

interface ChartData {
  readonly mes: string;
  readonly total_compras: number;
}

interface Project {
  readonly id: string;
  readonly name: string;
}

interface NavCard {
  readonly to: string;
  readonly label: string;
  readonly icon: React.ReactNode;
}

interface DashboardMetrics {
  readonly totalInvoices: number;
  readonly totalProjects: number;
  readonly totalSpent: number;
  readonly totalProducts: number;
}

interface RecentInvoice {
  readonly id: string;
  readonly number: string;
  readonly projectName: string;
  readonly totalAmount: number;
  readonly issueDate: string;
  readonly status: string;
}

interface ApiInvoiceResponse {
  readonly id: string;
  readonly number: string;
  readonly issueDate: string;
  readonly totalAmount: string | number;
  readonly status?: string;
  readonly project?: {
    readonly name: string;
  };
  readonly projectId: string;
}

interface TooltipProps {
  readonly active?: boolean;
  readonly payload?: Array<{
    readonly payload: {
      readonly mes: string;
      readonly total_compras: number;
    };
    readonly value: number;
    readonly color: string;
    readonly name: string;
    readonly formattedValue: string;
  }>;
}

interface LabelProps {
  readonly cx: number;
  readonly cy: number;
  readonly midAngle: number;
  readonly innerRadius: number;
  readonly outerRadius: number;
  readonly percent: number;
  readonly value: number;
}

const Dashboard: React.FC = () => {
  const [dadosGrafico, setDadosGrafico] = useState<ChartData[]>([]);
  const [mesSelecionado, setMesSelecionado] = useState<string>('todos');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentInvoices, setRecentInvoices] = useState<RecentInvoice[]>([]);
  const [metricsLoading, setMetricsLoading] = useState<boolean>(true);

  const fetchProjects = async (): Promise<void> => {
    try {
      setErrorMsg('');
      const { data } = await api.get('/api/projects');
      
      if (data.status) {
        setProjects(data.data || []);
      } else {
        setErrorMsg(`Erro ao buscar projetos: ${data.message || ''}`);
      }
    } catch (error) {
      console.error('Erro API Projetos:', error);
      setErrorMsg('Falha ao conectar com o servidor para buscar projetos.');
    }
  };

  const fetchDashboardMetrics = async (): Promise<void> => {
    try {
      setMetricsLoading(true);
      const { data } = await api.get('/api/dashboard/metrics');
      
      if (data.status && data.data) {
        setMetrics(data.data);
      }
    } catch (error) {
      console.error('Erro ao buscar métricas do dashboard:', error);
    } finally {
      setMetricsLoading(false);
    }
  };

  const fetchRecentInvoices = async (): Promise<void> => {
    try {
      const { data } = await api.get('/api/invoices');
      
      if (data.status && Array.isArray(data.data)) {
        // Pegar as 5 notas fiscais mais recentes
        const recent = data.data
          .sort((a: ApiInvoiceResponse, b: ApiInvoiceResponse) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
          .slice(0, 5)
          .map((invoice: ApiInvoiceResponse) => ({
            id: invoice.id,
            number: invoice.number,
            totalAmount: parseFloat(String(invoice.totalAmount) || '0'),
            issueDate: invoice.issueDate,
            projectName: invoice.project?.name || 'N/A',
            status: invoice.status || 'Pendente'
          }));
        
        setRecentInvoices(recent);
      }
    } catch (error) {
      console.error('Erro ao buscar notas fiscais recentes:', error);
    }
  };

  const fetchMonthlyInvoices = useCallback(async (): Promise<void> => {
    if (!selectedProject) return;
    
    setLoading(true);
    setErrorMsg('');

    try {
      // Buscar todas as notas fiscais
      const { data } = await api.get('/api/invoices');
      
      if (data.status && Array.isArray(data.data)) {
        // Filtrar notas fiscais da obra selecionada
        const invoicesProject = data.data.filter((invoice: ApiInvoiceResponse) => invoice.projectId === selectedProject);
        
        // Agrupar por mês e calcular totais
        const gastosPorMes: { [key: string]: number } = {};
        
        invoicesProject.forEach((invoice: ApiInvoiceResponse) => {
          const mes = new Date(invoice.issueDate).toLocaleDateString('pt-BR', { 
            year: 'numeric', 
            month: 'long' 
          });
          
          if (!gastosPorMes[mes]) {
            gastosPorMes[mes] = 0;
          }
          gastosPorMes[mes] += parseFloat(String(invoice.totalAmount)) || 0;
        });
        
        // Converter para array
        const dadosCorrigidos = Object.entries(gastosPorMes).map(([mes, total_compras]) => ({
          mes,
          total_compras: parseFloat(total_compras.toString()) || 0,
        }));
        
        setDadosGrafico(dadosCorrigidos);
        
        if (dadosCorrigidos.length === 0) {
          setErrorMsg('Nenhum dado de compra encontrado para este projeto.');
        }
      } else {
        console.warn('Dados não retornados ou formato inesperado:', data);
        setDadosGrafico([]);
        setErrorMsg(data.message || 'Nenhum dado retornado para o projeto selecionado.');
      }
    } catch (error: unknown) {
      console.error('Erro API Notas:', error);
      setDadosGrafico([]);
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Falha ao buscar dados de compras.';
      setErrorMsg(errorMessage || 'Falha ao buscar dados de compras.');
    } finally {
      setLoading(false);
    }
  }, [selectedProject]);

  useEffect(() => {
    fetchProjects();
    fetchDashboardMetrics();
    fetchRecentInvoices();
  }, []);


  useEffect(() => {
    if (selectedProject) {
      fetchMonthlyInvoices();
    } else {
      setDadosGrafico([]);
    }
  }, [selectedProject, fetchMonthlyInvoices]);

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedProject(e.target.value);
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

  // Preparar dados para o Recharts de forma simples
  const chartData = dadosFiltrados.map((item, index) => ({
    name: item.mes,
    value: item.total_compras,
    formattedValue: formatCurrency(item.total_compras)
  }));

  // Debug: verificar dados
  console.log('Dados do gráfico:', chartData);
  console.log('Total de gastos:', totalGastos);

  // Adicionar event listeners para tooltips
  useEffect(() => {
    const setupTooltips = () => {
      const tooltip = document.getElementById('chart-tooltip');
      const segments = document.querySelectorAll('.chart-segment-path');
      
      if (!tooltip || segments.length === 0) {
        // Se não encontrou os elementos, tenta novamente em 100ms
        setTimeout(setupTooltips, 100);
        return;
      }

      const showTooltip = (event: MouseEvent) => {
        const target = event.target as SVGPathElement;
        const month = target.getAttribute('data-month');
        const amount = target.getAttribute('data-amount');
        const percentage = target.getAttribute('data-percentage');
        
        if (month && amount && percentage) {
          const tooltipMonth = tooltip.querySelector('.tooltip-month');
          const tooltipAmount = tooltip.querySelector('.tooltip-amount');
          const tooltipPercentage = tooltip.querySelector('.tooltip-percentage');
          
          if (tooltipMonth) tooltipMonth.textContent = month;
          if (tooltipAmount) tooltipAmount.textContent = amount;
          if (tooltipPercentage) tooltipPercentage.textContent = `${percentage}% do total`;
          
          tooltip.style.opacity = '1';
          tooltip.style.visibility = 'visible';
          tooltip.style.left = `${event.pageX}px`;
          tooltip.style.top = `${event.pageY - 80}px`;
        }
      };

      const hideTooltip = () => {
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
      };

      segments.forEach(segment => {
        segment.addEventListener('mouseenter', showTooltip);
        segment.addEventListener('mouseleave', hideTooltip);
        segment.addEventListener('mousemove', (e: MouseEvent) => {
          tooltip.style.left = `${e.pageX}px`;
          tooltip.style.top = `${e.pageY - 80}px`;
        });
      });

      return () => {
        segments.forEach(segment => {
          segment.removeEventListener('mouseenter', showTooltip);
          segment.removeEventListener('mouseleave', hideTooltip);
        });
      };
    };

    setupTooltips();
  }, [chartData]);

  // Adicionar event listeners para tooltips das barras
  useEffect(() => {
    const setupBarTooltips = () => {
      const tooltip = document.getElementById('bar-chart-tooltip');
      const bars = document.querySelectorAll('.bar-element');
      const chartContainer = document.querySelector('.bar-chart-container');
      
      if (!tooltip || bars.length === 0 || !chartContainer) {
        // Se não encontrou os elementos, tenta novamente em 100ms
        setTimeout(setupBarTooltips, 100);
        return;
      }

      const showTooltip = (event: MouseEvent) => {
        const target = event.target as SVGRectElement;
        const month = target.getAttribute('data-month');
        const amount = target.getAttribute('data-amount');
        const percentage = target.getAttribute('data-percentage');
        
        if (month && amount && percentage) {
          const tooltipMonth = tooltip.querySelector('.bar-tooltip-month');
          const tooltipAmount = tooltip.querySelector('.bar-tooltip-amount');
          const tooltipPercentage = tooltip.querySelector('.bar-tooltip-percentage');
          
          if (tooltipMonth) tooltipMonth.textContent = month;
          if (tooltipAmount) tooltipAmount.textContent = amount;
          if (tooltipPercentage) tooltipPercentage.textContent = `${percentage}% do total`;
          
          tooltip.classList.add('show');
          
          // Usar coordenadas relativas ao container
          const rect = chartContainer.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          
          tooltip.style.left = `${x - 90}px`; // Centralizar o tooltip (180px/2)
          tooltip.style.top = `${y - 100}px`; // Posicionar acima do cursor
        }
      };

      const hideTooltip = () => {
        tooltip.classList.remove('show');
      };

      const updateTooltipPosition = (event: MouseEvent) => {
        if (tooltip.classList.contains('show')) {
          const rect = chartContainer.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          
          tooltip.style.left = `${x - 90}px`;
          tooltip.style.top = `${y - 100}px`;
        }
      };

      bars.forEach(bar => {
        bar.addEventListener('mouseenter', showTooltip);
        bar.addEventListener('mouseleave', hideTooltip);
        bar.addEventListener('mousemove', updateTooltipPosition);
      });

      return () => {
        bars.forEach(bar => {
          bar.removeEventListener('mouseenter', showTooltip);
          bar.removeEventListener('mouseleave', hideTooltip);
          bar.removeEventListener('mousemove', updateTooltipPosition);
        });
      };
    };

    setupBarTooltips();
  }, [chartData]);

  // Cores modernas e vibrantes para o gráfico
  const COLORS = [
    '#00D4AA', // Teal vibrante
    '#FF6B35', // Laranja vibrante
    '#9C27B0', // Roxo vibrante
    '#E91E63', // Rosa vibrante
    '#4CAF50', // Verde vibrante
    '#FF9800', // Âmbar vibrante
    '#2196F3', // Azul vibrante
    '#FF5722', // Vermelho vibrante
    '#8BC34A', // Verde claro
    '#FFC107', // Amarelo vibrante
    '#00BCD4', // Ciano vibrante
    '#795548'  // Marrom vibrante
  ];

  // Componente customizado para tooltip
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.total_compras / totalGastos) * 100).toFixed(1);
      
      return (
        <div className="chart-tooltip">
          <div className="tooltip-header">
            <div className="tooltip-color" style={{ backgroundColor: payload[0].color }}></div>
            <span className="tooltip-label">{payload[0].name}</span>
          </div>
          <div className="tooltip-content">
            <p className="tooltip-value">{formatCurrency(data.total_compras)}</p>
            <p className="tooltip-percentage">{percentage}% do total</p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Componente customizado para label do gráfico
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value }: LabelProps) => {
    if (percent < 0.05) return null; // Não mostrar labels para fatias menores que 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="16"
        fontWeight="700"
        stroke="#000"
        strokeWidth="0.5"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const mesesDisponiveis = [...new Set(dadosGrafico.map(item => item.mes))];

  const navCards: NavCard[] = [
    { 
      to: "/select-action/venda", 
      label: "Cadastrar Gasto", 
      icon: <div className="nav-card-icon"><i className="fas fa-plus" /></div> 
    },
    { 
      to: "/projects", 
      label: "Projetos", 
      icon: <div className="nav-card-icon"><i className="fas fa-building-columns" /></div> 
    },
    { 
      to: "/invoices", 
      label: "Nota Fiscal", 
      icon: <div className="nav-card-icon"><i className="fas fa-file-invoice-dollar" /></div> 
    },
  ];

  return (
    <div className="dashboard-content-wrapper">
      <header className="dashboard-header">
        <h1 className="dashboard-title">GN EMPREENDIMENTOS</h1>
      </header>

      {/* Mobile Layout - Gastos no topo */}
      <div className="mobile-balance-section">
        <div className="widget-card balance-card">
          <div className="balance-header">
            <h3>Gastos</h3>
            <div className="balance-icon">
              <i className="fas fa-wallet"></i>
            </div>
          </div>
          <div className="balance-value">
            {metricsLoading ? (
              <div className="balance-loading">...</div>
            ) : selectedProject && dadosFiltrados.length > 0 ? (
              formatCurrency(totalGastos)
            ) : (
              formatCurrency(metrics?.totalSpent || 0)
            )}
          </div>
          <div className="balance-subtitle">
            {selectedProject && dadosFiltrados.length > 0 
              ? `Gastos do projeto selecionado` 
              : `Total de gastos registrados`
            }
          </div>
        </div>
      </div>

      <main className="dashboard-main-column">
        {/* Métricas Principais */}
        <section className="metrics-section">
          <h2 className="section-title">Visão Geral</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon">
                <i className="fas fa-file-invoice-dollar"></i>
              </div>
              <div className="metric-content">
                <h3>Total de Notas</h3>
                <p className="metric-value">
                  {metricsLoading ? '...' : metrics?.totalInvoices || 0}
                </p>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">
                <i className="fas fa-building-columns"></i>
              </div>
              <div className="metric-content">
                <h3>Projetos Ativos</h3>
                <p className="metric-value">
                  {metricsLoading ? '...' : metrics?.totalProjects || 0}
                </p>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <div className="metric-content">
                <h3>Total Gasto</h3>
                <p className="metric-value">
                  {metricsLoading ? '...' : formatCurrency(metrics?.totalSpent || 0)}
                </p>
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-icon">
                <i className="fas fa-box"></i>
              </div>
              <div className="metric-content">
                <h3>Produtos</h3>
                <p className="metric-value">
                  {metricsLoading ? '...' : metrics?.totalProducts || 0}
                </p>
              </div>
            </div>
          </div>
        </section>

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
          <div className="chart-section-header">
            <h2 className="section-title">Distribuição de Compras por Mês</h2>
            <div className="chart-controls">
              <div className="control-group">
                <label htmlFor="project-select" className="control-label">
                  <i className="fas fa-building-columns"></i>
                  Projeto
                </label>
                <select 
                  id="project-select" 
                  className="dashboard-select modern-select" 
                  value={selectedProject} 
                  onChange={handleProjectChange}
                >
                  <option value="">Selecione um projeto</option>
                  {projects && projects.length > 0 ? projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  )) : (
                    <option value="" disabled>Carregando projetos...</option>
                  )}
                </select>
              </div>
              
              <div className="control-group">
                <label htmlFor="mes-select" className="control-label">
                  <i className="fas fa-calendar-alt"></i>
                  Período
                </label>
                <select 
                  id="mes-select" 
                  className="dashboard-select modern-select" 
                  value={mesSelecionado} 
                  onChange={handleMesChange} 
                  disabled={!selectedProject || loading || mesesDisponiveis.length === 0}
                >
                  <option value="todos">Todos os meses</option>
                  {mesesDisponiveis.map(mes => (
                    <option key={mes} value={mes}>{mes}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {errorMsg && (
            <div className="error-state">
              <div className="error-icon">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <p className="error-message">{errorMsg}</p>
            </div>
          )}
          
          <div className="chart-wrapper-dashboard">
            {loading ? (
              <div className="chart-loading">
                <div className="loading-spinner"></div>
                <p className="loading-text">Carregando dados...</p>
              </div>
            ) : dadosGrafico.length > 0 && dadosFiltrados.length > 0 ? (
              <div className="modern-chart-container">
                <div className="chart-header">
                  <h3 className="chart-title">
                    {mesSelecionado === 'todos' ? 'Gastos por Mês' : `Gastos - ${mesSelecionado}`}
                  </h3>
                  <div className="chart-summary">
                    <span className="summary-label">Total:</span>
                    <span className="summary-value">{formatCurrency(totalGastos)}</span>
                  </div>
                </div>
                
                <div className="chart-container">
                  {chartData.length > 0 ? (
                    <div className="bar-chart-container">
                      <svg className="bar-chart-svg" width="100%" height="420" viewBox="0 0 600 420">
                        <defs>
                          <linearGradient id="gnGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#2a9d47" stopOpacity="0.9"/>
                            <stop offset="100%" stopColor="#1e7a35" stopOpacity="0.7"/>
                          </linearGradient>
                          <filter id="barShadow" x="-50%" y="-50%" width="200%" height="200%">
                            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(42, 157, 71, 0.3)"/>
                          </filter>
                        </defs>
                        
                        {/* Grid lines */}
                        {[0, 25, 50, 75, 100].map((value, index) => (
                          <g key={index}>
                            <line
                              x1="30"
                              y1={340 - (value * 300 / 100)}
                              x2="500"
                              y2={340 - (value * 300 / 100)}
                              stroke="rgba(169, 177, 194, 0.15)"
                              strokeWidth="1"
                              strokeDasharray="3,3"
                            />
                            <text
                              x="20"
                              y={345 - (value * 300 / 100)}
                              textAnchor="end"
                              dominantBaseline="middle"
                              fill="var(--db-text-secondary)"
                              fontSize="10"
                              fontWeight="500"
                            >
                              {value}%
                            </text>
                          </g>
                        ))}
                        
                        {/* Bars */}
                        {chartData.map((entry, index) => {
                          // Progressão lógica com escala ajustada
                          const values = chartData.map(d => d.value);
                          const maxValue = Math.max(...values);
                          const minValue = Math.min(...values);
                          
                          // Usar uma escala que garante que todas as barras sejam visíveis
                          // A menor barra terá pelo menos 20% da altura máxima
                          const minHeightPercentage = 20;
                          const adjustedValue = minValue + (entry.value - minValue) * 0.8;
                          const normalizedValue = ((adjustedValue - minValue) / (maxValue - minValue)) * (100 - minHeightPercentage) + minHeightPercentage;
                          
                          const percentage = ((entry.value / totalGastos) * 100); // Percentual do total
                          const maxHeight = 300; // Altura máxima aumentada
                          const barHeight = (normalizedValue / 100) * maxHeight;
                          const barWidth = 40; // Largura um pouco maior
                          const spacing = 12; // Espaçamento entre barras
                          const barX = 50 + (index * (barWidth + spacing));
                          const barY = 340 - barHeight;
                          
                          return (
                            <g key={entry.name}>
                              {/* Main bar */}
                              <rect
                                x={barX}
                                y={barY}
                                width={barWidth}
                                height={barHeight}
                                fill="url(#gnGradient)"
                                rx="6"
                                ry="6"
                                filter="url(#barShadow)"
                                className="bar-element"
                                data-month={entry.name}
                                data-amount={entry.formattedValue}
                                data-percentage={percentage.toFixed(1)}
                              />
                              
                              {/* Month label */}
                              <text
                                x={barX + (barWidth / 2)}
                                y="370"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="var(--db-text-secondary)"
                                fontSize="9"
                                fontWeight="500"
                              >
                                {entry.name.split(' ')[0]}
                              </text>
                              
                              {/* Year label for first occurrence */}
                              {index === 0 && (
                                <text
                                  x={barX + (barWidth / 2)}
                                  y="385"
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                  fill="var(--db-text-label)"
                                  fontSize="8"
                                  fontWeight="400"
                                >
                                  {entry.name.split(' ')[2]}
                                </text>
                              )}
                            </g>
                          );
                        })}
                      </svg>
                      
                      {/* Tooltip para barras */}
                      <div className="bar-chart-tooltip" id="bar-chart-tooltip">
                        <div className="bar-tooltip-month"></div>
                        <div className="bar-tooltip-amount"></div>
                        <div className="bar-tooltip-percentage"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="chart-no-data">
                      <div className="no-data-icon">
                        <i className="fas fa-chart-bar"></i>
                      </div>
                      <p className="no-data-text">Nenhum dado para exibir</p>
                    </div>
                  )}
                </div>
                
                
                {/* Estatísticas detalhadas */}
                <div className="chart-stats-detailed">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <i className="fas fa-chart-pie"></i>
                    </div>
                    <div className="stat-content">
                      <span className="stat-label">Períodos</span>
                      <span className="stat-value">{dadosFiltrados.length}</span>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon">
                      <i className="fas fa-calendar-check"></i>
                    </div>
                    <div className="stat-content">
                      <span className="stat-label">Média Mensal</span>
                      <span className="stat-value">
                        {formatCurrency(totalGastos / dadosFiltrados.length)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon">
                      <i className="fas fa-trending-up"></i>
                    </div>
                    <div className="stat-content">
                      <span className="stat-label">Maior Gasto</span>
                      <span className="stat-value">
                        {formatCurrency(Math.max(...dadosFiltrados.map(d => d.total_compras)))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : !loading && selectedProject && !errorMsg ? (
              <div className="no-data-state">
                <div className="no-data-icon">
                  <i className="fas fa-chart-pie"></i>
                </div>
                <p className="no-data-text">Nenhum dado para exibir</p>
                <p className="no-data-subtitle">Este projeto não possui gastos registrados.</p>
              </div>
            ) : (
              <div className="no-data-state">
                <div className="no-data-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <p className="no-data-text">Selecione um projeto</p>
                <p className="no-data-subtitle">Escolha um projeto para visualizar os gastos por mês.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <aside className="dashboard-right-sidebar">
        {/* Gastos */}
        <div className="widget-card balance-card">
          <div className="balance-header">
            <h3>Gastos</h3>
            <div className="balance-icon">
              <i className="fas fa-wallet"></i>
            </div>
          </div>
          <div className="balance-value">
            {metricsLoading ? (
              <div className="balance-loading">...</div>
            ) : selectedProject && dadosFiltrados.length > 0 ? (
              formatCurrency(totalGastos)
            ) : (
              formatCurrency(metrics?.totalSpent || 0)
            )}
          </div>
          <div className="balance-subtitle">
            {selectedProject && dadosFiltrados.length > 0 
              ? `Gastos do projeto selecionado` 
              : `Total de gastos registrados`
            }
          </div>
        </div>

        {/* Notas Fiscais Recentes */}
        <div className="widget-card">
          <div className="widget-header">
          <h3>Notas Fiscais Recentes</h3>
            <Link to="/invoices" className="view-all-link">
              Ver todas
            </Link>
          </div>
          <div className="recent-invoices-list">
            {recentInvoices.length > 0 ? (
              recentInvoices.slice(0, 5).map(invoice => (
                <div key={invoice.id} className="recent-invoice-item">
                  <div className="invoice-header">
                    <span className="invoice-number">#{invoice.number || 'N/A'}</span>
                  </div>
                  <div className="invoice-details">
                    <span className="invoice-project">{invoice.projectName || 'N/A'}</span>
                    <span className="invoice-amount">{formatCurrency(invoice.totalAmount || 0)}</span>
                  </div>
                  <div className="invoice-date">
                    {invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString('pt-BR') : 'N/A'}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data-state">
                <div className="no-data-icon">
                  <i className="fas fa-file-invoice"></i>
                </div>
              <p className="no-data-text">Nenhuma nota fiscal encontrada</p>
                <Link to="/invoices" className="no-data-action">
                  Cadastrar primeira nota
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Relatórios Rápidos */}
        <div className="widget-card">
          <h3>Relatórios Rápidos</h3>
          <ul className="quick-reports-list">
            <li>
              <Link to="/relatorios/vendas">
                <div className="report-icon">
                <i className="fas fa-chart-line" />
                </div>
                <span>Relatório de Compras</span>
              </Link>
            </li>
            <li>
              <Link to="/relatorios/financeiro">
                <div className="report-icon">
                <i className="fas fa-wallet" />
                </div>
                <span>Fluxo de Caixa</span>
              </Link>
            </li>
            <li>
              <Link to="/relatorios/projetos">
                <div className="report-icon">
                  <i className="fas fa-building-columns" />
                </div>
                <span>Análise de Projetos</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Dashboard;