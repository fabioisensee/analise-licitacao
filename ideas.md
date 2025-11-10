# Design Ideas - Sistema de Análise de Tendências de Compras

## Ideia Escolhida: Swiss Design (International Typographic Style)

### Design Movement
Swiss Design / International Typographic Style - caracterizado por clareza, legibilidade e objetividade, perfeito para um sistema de análise de dados governamentais.

### Core Principles
1. **Hierarquia Visual Clara**: Uso de grid system rigoroso para organizar informações complexas
2. **Tipografia como Elemento Principal**: Texto limpo e legível como foco principal, sem ornamentação
3. **Cores Funcionais**: Paleta reduzida com cores que comunicam função (sucesso, alerta, dados)
4. **Espaço Negativo Intencional**: Breathing room generoso para facilitar digestão de dados

### Color Philosophy
- **Base Neutra**: Cinzas frios (#F8F9FA, #E9ECEF, #212529) para criar ambiente profissional
- **Azul Institucional**: #0066CC (azul confiável) para elementos primários e dados principais
- **Verde Analítico**: #00A86B para indicadores positivos e crescimento
- **Laranja Destaque**: #FF6B35 para alertas e pontos de atenção
- **Propósito**: Cores servem função comunicativa, não decorativa

### Layout Paradigm
**Grid Assimétrico com Sidebar Fixa**
- Sidebar de navegação à esquerda (240px) com fundo escuro (#2C3E50)
- Área principal dividida em grid de 12 colunas
- Cards de métricas em layout assimétrico (não centralizado)
- Gráficos ocupam 2/3 da largura, tabelas 1/3
- Filtros fixos no topo da área de conteúdo

### Signature Elements
1. **Linhas Divisórias Finas**: 1px solid borders para separar seções (#DEE2E6)
2. **Cards com Sombra Sutil**: box-shadow: 0 1px 3px rgba(0,0,0,0.08)
3. **Números Grandes**: Métricas principais em 48px, bold, para escaneabilidade rápida

### Interaction Philosophy
- **Hover States Mínimos**: Apenas mudança de cor de fundo (#F8F9FA → #E9ECEF)
- **Transições Rápidas**: 150ms ease-in-out para não atrasar usuário
- **Feedback Direto**: Loading states com skeleton screens, não spinners
- **Foco no Conteúdo**: Interações não devem distrair da análise de dados

### Animation
- **Sem Animações Decorativas**: Apenas transições funcionais
- **Fade-in Suave**: Novos dados aparecem com opacity 0 → 1 em 200ms
- **Gráficos Estáticos**: Dados carregam instantaneamente, sem animação de desenho
- **Scroll Suave**: smooth scroll para navegação entre seções

### Typography System
- **Fonte Principal**: Inter (Google Fonts) - desenhada para interfaces digitais
- **Hierarquia**:
  - H1: 32px, 700 weight, letter-spacing -0.02em
  - H2: 24px, 600 weight
  - H3: 18px, 600 weight
  - Body: 16px, 400 weight, line-height 1.6
  - Small: 14px, 400 weight
- **Números**: Tabular figures (font-variant-numeric: tabular-nums) para alinhamento em tabelas
- **Contraste**: Sempre garantir WCAG AA (4.5:1 mínimo)

---

## Implementação Específica para o Sistema

### Página de Upload
- Card centralizado (max-width: 600px) com drag-and-drop
- Ícone de upload minimalista (outline, não filled)
- Progresso com barra horizontal simples
- Feedback de sucesso com checkmark verde

### Dashboard de Análises
- **Header Fixo**: Filtros (Natureza + Período) sempre visíveis
- **Grid de KPIs**: 4 cards no topo (Total Gasto, Itens Únicos, Fornecedores, Período)
- **Seção de Gráficos**: 
  - Gráfico de barras para Top Itens (horizontal)
  - Gráfico de linhas para Variação de Preço
  - Gráfico de barras para Previsão de Demanda
  - Gráfico de pizza para Gastos por Natureza
- **Tabelas**: Fornecedores mais frequentes em tabela com ordenação

### Paleta de Cores Específica
```css
--primary: #0066CC;
--success: #00A86B;
--warning: #FF6B35;
--background: #F8F9FA;
--surface: #FFFFFF;
--text-primary: #212529;
--text-secondary: #6C757D;
--border: #DEE2E6;
--sidebar-bg: #2C3E50;
--sidebar-text: #ECF0F1;
```
