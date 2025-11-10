# Sistema de Análise de Tendências de Compras para Licitação

Sistema web completo para análise de dados brutos de compras, permitindo filtragem por natureza de despesas e período de tempo, gerando insights sobre tendências (previsão de demanda, itens mais comprados, variação de preço) para subsidiar processos licitatórios.

## 🎯 Funcionalidades Principais

### 1. Importação de Dados
- Upload de arquivos Excel (.xlsx, .xls) com dados de compras
- Processamento automático de até 50MB
- Validação e inserção em lote para alta performance
- Suporte a milhares de registros (testado com 16k+ linhas)

### 2. Filtros Dinâmicos
- **Natureza de Despesas**: Seleção múltipla de categorias
- **Período**: Filtro por data inicial e final
- Aplicação em tempo real em todas as análises

### 3. Análises de Tendências

#### Itens Mais Comprados
- Top 20 itens por valor total gasto
- Visualização em gráfico de barras horizontal
- Métricas: quantidade total, valor total, preço médio, número de ocorrências

#### Variação de Preço
- Evolução do preço médio ao longo do tempo
- Gráfico de linhas com preço médio, mínimo e máximo
- Análise mensal dos principais itens

#### Previsão de Demanda
- Projeção para os próximos 12 meses
- Baseada em média histórica mensal
- Gráfico de barras para visualização clara

#### Gastos por Natureza
- Distribuição percentual por categoria
- Gráfico de pizza com top 5 naturezas
- Contagem de itens únicos por natureza

#### Fornecedores Mais Frequentes
- Top 10 fornecedores por valor total
- Tabela com valor total, número de compras e valor médio
- Ordenação por valor total decrescente

### 4. Dashboard de KPIs
- **Total Gasto**: Soma de todos os valores no período filtrado
- **Itens Únicos**: Quantidade de itens diferentes
- **Fornecedores**: Número de fornecedores únicos
- **Período Analisado**: Duração em dias dos dados disponíveis

## 🎨 Design

O sistema utiliza **Swiss Design (International Typographic Style)**, caracterizado por:

- **Hierarquia Visual Clara**: Grid system rigoroso para organizar informações complexas
- **Tipografia Funcional**: Fonte Inter para máxima legibilidade
- **Cores Funcionais**: Azul institucional (#0066CC), verde analítico (#00A86B), laranja destaque (#FF6B35)
- **Minimalismo**: Sem ornamentação desnecessária, foco no conteúdo
- **Espaço Negativo**: Breathing room generoso para facilitar digestão de dados

## 📊 Estrutura de Dados

### Formato do Arquivo Excel

O arquivo deve conter as seguintes colunas:

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| NUMEROMOV | Texto | Número do movimento |
| DATAEMISSAO | Data | Data de emissão da compra |
| CODTMV | Texto | Código do tipo de movimento |
| RUBRICA | Texto | Rubrica orçamentária |
| FORNECEDOR | Texto | Nome do fornecedor |
| PROJETO | Texto | Nome do projeto |
| INSTRUMENTO | Texto | Instrumento de contratação |
| ORIGEMRECURSO | Texto | Origem do recurso |
| COORDENADOR | Texto | Nome do coordenador |
| QUANTIDADE | Número | Quantidade adquirida |
| VALOR_UNITARIO | Número | Valor unitário em reais |
| VALOR_ORCADO | Número | Valor orçado total |
| ITEM | Texto | Descrição do item |
| CODNATUREZA | Texto | Código da natureza de despesa |
| NATUREZA | Texto | Descrição da natureza de despesa |
| DESCRICAO | Texto | Descrição detalhada |

**Observações:**
- Primeira linha deve conter os cabeçalhos
- Datas no formato padrão do Excel
- Valores numéricos sem formatação especial (sem R$, %, etc.)

## 🚀 Como Usar

### 1. Acesso Inicial
- Acesse a página inicial
- Faça login com sua conta Manus

### 2. Importar Dados
- Clique em "Importar Dados"
- Arraste o arquivo Excel ou clique para selecionar
- Aguarde o processamento (barra de progresso indica o status)
- Será redirecionado automaticamente para o dashboard

### 3. Analisar Dados
- Use os filtros no topo para refinar a análise:
  - Selecione uma ou mais naturezas de despesa
  - Defina o período desejado (data inicial e final)
- Visualize os KPIs principais no topo
- Explore os gráficos e tabelas abaixo

### 4. Interpretar Resultados

#### Para Processos Licitatórios:
1. **Itens Mais Comprados**: Identifique quais itens devem ser priorizados na licitação
2. **Variação de Preço**: Analise tendências de preço para estimar valores de referência
3. **Previsão de Demanda**: Planeje quantidades a licitar com base em projeções
4. **Gastos por Natureza**: Distribua orçamento por categoria
5. **Fornecedores**: Identifique fornecedores recorrentes para análise de mercado

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js 22** + **Express 4**: Servidor web
- **tRPC 11**: API type-safe
- **Drizzle ORM**: Gerenciamento de banco de dados
- **MySQL/TiDB**: Banco de dados relacional
- **XLSX**: Processamento de arquivos Excel
- **Multer**: Upload de arquivos

### Frontend
- **React 19**: Framework UI
- **Tailwind CSS 4**: Estilização
- **Recharts**: Visualização de dados
- **Wouter**: Roteamento
- **date-fns**: Manipulação de datas
- **Sonner**: Notificações toast

### Infraestrutura
- **Manus OAuth**: Autenticação
- **Vite**: Build tool e dev server

## 📈 Performance

- **Processamento em Lote**: Inserção de até 500 registros por vez
- **Índices Otimizados**: Queries rápidas em dataEmissao, natureza, item e fornecedor
- **Valores em Centavos**: Armazenamento eficiente de valores monetários como inteiros
- **Lazy Loading**: Componentes carregam sob demanda

## 🔒 Segurança

- Autenticação via Manus OAuth
- Validação de tipo de arquivo no upload
- Limite de 50MB por arquivo
- Queries parametrizadas (proteção contra SQL injection)
- Sessões seguras com cookies HTTP-only

## 📝 Estrutura do Projeto

```
analise_licitacao/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas (Home, Upload, Dashboard)
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── lib/           # Utilitários e configurações
│   │   └── index.css      # Estilos globais (Swiss Design)
│   └── public/            # Assets estáticos
├── server/                # Backend Node.js
│   ├── routers.ts         # Rotas tRPC
│   ├── db.ts              # Helpers de banco de dados
│   ├── purchaseService.ts # Serviço de processamento de compras
│   ├── analyticsService.ts# Serviço de análises
│   └── uploadRouter.ts    # Router de upload
├── drizzle/               # Schema e migrações do banco
│   └── schema.ts          # Definição de tabelas
├── ideas.md               # Documentação de design
└── todo.md                # Checklist de funcionalidades
```

## 🎓 Casos de Uso

### Planejamento de Licitação Anual
1. Importe dados de compras do ano anterior
2. Filtre por natureza de despesa específica (ex: "Material de Consumo")
3. Analise os itens mais comprados para definir lote principal
4. Use previsão de demanda para estimar quantidades
5. Verifique variação de preço para definir valores de referência

### Análise de Fornecedores
1. Importe dados de múltiplos períodos
2. Não aplique filtros de natureza (análise geral)
3. Consulte tabela de fornecedores mais frequentes
4. Identifique padrões de compra por fornecedor
5. Use informações para pesquisa de mercado

### Otimização de Orçamento
1. Importe dados do exercício atual
2. Analise gastos por natureza de despesa
3. Compare com orçamento planejado
4. Identifique categorias com maior consumo
5. Ajuste planejamento para próximo período

## 📞 Suporte

Para dúvidas ou problemas, entre em contato através do sistema Manus.

---

**Sistema de Análise de Tendências de Compras para Licitação** - Desenvolvido com foco em usabilidade e precisão de dados.
