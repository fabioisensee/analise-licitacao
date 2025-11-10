import { getDb } from './db';
import { purchases } from '../drizzle/schema';
import { sql, and, gte, lte, eq, desc, asc, inArray, type SQL } from 'drizzle-orm';

export interface AnalyticsFilters {
  startDate?: string | Date;
  endDate?: string | Date;
  naturezas?: string[];
  fornecedores?: string[];
  itens?: string[];
}

export interface TopItem {
  item: string;
  totalQuantity: number;
  totalValue: number;
  avgPrice: number;
  occurrences: number;
}

export interface PriceVariation {
  item: string;
  month: string;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  quantity: number;
}

export interface DemandForecast {
  item: string;
  month: string;
  predictedQuantity: number;
  historicalAvg: number;
}

export function buildWhereConditions(filters: AnalyticsFilters): SQL[] {
  const conditions: SQL[] = [];

  if (filters.startDate) {
    const startDate =
      filters.startDate instanceof Date
        ? filters.startDate
        : new Date(filters.startDate);
    conditions.push(gte(purchases.dataEmissao, startDate));
  }

  if (filters.endDate) {
    const endDate =
      filters.endDate instanceof Date ? filters.endDate : new Date(filters.endDate);
    conditions.push(lte(purchases.dataEmissao, endDate));
  }

  if (filters.naturezas && filters.naturezas.length > 0) {
    conditions.push(inArray(purchases.natureza, filters.naturezas));
  }

  if (filters.fornecedores && filters.fornecedores.length > 0) {
    conditions.push(inArray(purchases.fornecedor, filters.fornecedores));
  }

  if (filters.itens && filters.itens.length > 0) {
    conditions.push(inArray(purchases.item, filters.itens));
  }

  return conditions;
}

export async function getTopItems(
  filters: AnalyticsFilters,
  topN: number = 10
): Promise<TopItem[]> {
  const db = await getDb();
  if (!db) {
    return [];
  }

  const conditions = buildWhereConditions(filters);

  let query = db
    .select({
      item: purchases.item,
      totalQuantity: sql<number>`SUM(${purchases.quantidade})`,
      totalValue: sql<number>`SUM(${purchases.quantidade} * ${purchases.valorUnitario})`,
      avgPrice: sql<number>`AVG(${purchases.valorUnitario})`,
      occurrences: sql<number>`COUNT(*)`,
    })
    .from(purchases);

  if (conditions.length > 0) {
    query = query.where(
      conditions.length > 1 ? and(...conditions) : conditions[0]
    );
  }

  const rows = await query
    .groupBy(purchases.item)
    .orderBy(desc(sql<number>`SUM(${purchases.quantidade})`))
    .limit(topN);

  return rows.map((row) => ({
    item: row.item ?? 'Não especificado',
    totalQuantity: Number(row.totalQuantity) || 0,
    totalValue: Number(row.totalValue) || 0,
    avgPrice: Number(row.avgPrice) || 0,
    occurrences: Number(row.occurrences) || 0,
  }));
}

export async function getPriceVariation(
  filters: AnalyticsFilters,
  topN: number = 10
): Promise<PriceVariation[]> {
  const db = await getDb();
  if (!db) {
    return [];
  }

  const conditions = buildWhereConditions(filters);

  // Primeiro, obter os top N itens
  const topItems = await getTopItems(filters, topN);
  const topItemNames = topItems
    .map((i) => i.item)
    .filter((name): name is string => Boolean(name));

  if (topItemNames.length === 0) {
    return [];
  }

  const whereConditions = [...conditions, inArray(purchases.item, topItemNames)];

  const result = await db
    .select({
      item: purchases.item,
      month: sql<string>`DATE_FORMAT(${purchases.dataEmissao}, '%Y-%m')`,
      avgPrice: sql<number>`AVG(${purchases.valorUnitario})`,
      minPrice: sql<number>`MIN(${purchases.valorUnitario})`,
      maxPrice: sql<number>`MAX(${purchases.valorUnitario})`,
      quantity: sql<number>`SUM(${purchases.quantidade})`,
    })
    .from(purchases)
    .where(
      whereConditions.length > 1
        ? and(...whereConditions)
        : whereConditions[0]
    )
    .groupBy(
      purchases.item,
      sql`DATE_FORMAT(${purchases.dataEmissao}, '%Y-%m')`
    )
    .orderBy(asc(sql`DATE_FORMAT(${purchases.dataEmissao}, '%Y-%m')`));

  return result.map((r) => ({
    item: r.item || 'Não especificado',
    month: r.month || '',
    avgPrice: Number(r.avgPrice) || 0,
    minPrice: Number(r.minPrice) || 0,
    maxPrice: Number(r.maxPrice) || 0,
    quantity: Number(r.quantity) || 0,
  }));
}

export async function getDemandForecast(
  filters: AnalyticsFilters,
  topN: number = 10
): Promise<DemandForecast[]> {
  const db = await getDb();
  if (!db) {
    return [];
  }

  const topItems = await getTopItems(filters, topN);
  const forecasts: DemandForecast[] = [];

  for (const item of topItems) {
    const conditions = [...buildWhereConditions(filters), eq(purchases.item, item.item)];

    // Total mensal histórico por item (sem SQL raw)
    const monthlyTotals = await db
      .select({
        month: sql<string>`DATE_FORMAT(${purchases.dataEmissao}, '%Y-%m')`,
        totalQuantity: sql<number>`SUM(${purchases.quantidade})`,
      })
      .from(purchases)
      .where(
        conditions.length > 1 ? and(...conditions) : conditions[0]
      )
      .groupBy(sql`DATE_FORMAT(${purchases.dataEmissao}, '%Y-%m')`);

    const quantities = monthlyTotals.map((row) => Number(row.totalQuantity) || 0);
    const historicalAvg =
      quantities.length > 0
        ? quantities.reduce((sum, q) => sum + q, 0) / quantities.length
        : 0;

    // Gerar previsão para os próximos 12 meses
    const currentDate = new Date();
    for (let i = 1; i <= 12; i++) {
      const forecastDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + i,
        1
      );
      const month = `${forecastDate.getFullYear()}-${String(
        forecastDate.getMonth() + 1
      ).padStart(2, '0')}`;

      forecasts.push({
        item: item.item,
        month,
        predictedQuantity: Math.round(historicalAvg),
        historicalAvg,
      });
    }
  }

  return forecasts;
}
