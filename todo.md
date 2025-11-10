# TODO - Sistema de Análise de Tendências de Compras para Licitação

## Fase 1: Estrutura do Banco de Dados
- [x] Criar tabela de compras (purchases) com todos os campos do Excel
- [x] Criar índices para otimizar consultas por data e natureza de despesas

## Fase 2: Backend - Upload e Processamento
- [x] Implementar endpoint para upload de arquivo Excel
- [x] Processar arquivo Excel e extrair dados
- [x] Validar e inserir dados no banco de dados
- [x] Implementar endpoint para listar naturezas de despesas únicas
- [x] Implementar endpoint para obter range de datas disponíveis

## Fase 3: Análises de Tendências
- [x] Implementar análise de itens mais comprados (top N itens por quantidade e valor)
- [x] Implementar análise de variação de preço por item ao longo do tempo
- [x] Implementar previsão de demanda para os próximos 12 meses
- [x] Implementar análise de gastos por natureza de despesa
- [x] Implementar análise de fornecedores mais frequentes

## Fase 4: Interface de Usuário
- [x] Criar página de upload de arquivo Excel
- [x] Criar dashboard principal com filtros (Natureza de Despesas e Período)
- [x] Implementar visualização de itens mais comprados (tabela + gráfico)
- [x] Implementar visualização de variação de preço (gráfico de linha)
- [x] Implementar visualização de previsão de demanda (gráfico de barras)
- [x] Implementar visualização de gastos por natureza (gráfico de pizza)
- [ ] Implementar exportação de relatórios em PDF/Excel

## Fase 5: Integração e Testes
- [x] Testar upload e processamento de arquivo completo
- [x] Testar todos os filtros e suas combinações
- [x] Testar todas as visualizações com dados reais
- [x] Verificar performance com grande volume de dados (16k+ registros)
- [x] Ajustar responsividade para diferentes tamanhos de tela

## Fase 6: Finalização
- [x] Revisar design e usabilidade
- [x] Documentar funcionalidades principais
- [x] Criar checkpoint final
- [x] Preparar entrega ao usuário

## Correções de Bugs
- [x] Corrigir erro de autenticação no endpoint de upload
- [x] Testar upload com arquivo real fornecido pelo usuário

## Novos Bugs Reportados
- [x] Corrigir erro "Invalid time value" no processamento de datas do Excel

## Melhorias de UX
- [x] Criar header de navegação com links para Home, Upload e Dashboard
- [x] Adicionar botão "Ir para Dashboard" após upload bem-sucedido
- [x] Garantir redirecionamento automático funcione corretamente

## Bugs de HTML
- [x] Corrigir tags <a> aninhadas no Header (Link do wouter já renderiza <a>)

## Bugs de SQL
- [x] Corrigir queries de análise com GROUP BY (erro de agregação)
- [ ] Corrigir query de variação de preço (getPriceVariation) com IN clause
