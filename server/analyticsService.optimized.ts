import { getDb } from './db';
import { purchases } from '../drizzle/schema';
import {
  sql,
  and,
  gte,
  lte,
  eq,
  desc,
  asc,
  inArray,
  type SQL,
} from 'drizzle-orm';

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
  rawItem?: string | null;
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

type DbClient = NonNullable<Awaited<ReturnType<typeof getDb>>>;

type ConditionList = SQL[];

const monthDateFormat = sql<string>`DATE_FORMAT(${purchases.dataEmissao}, '%Y-%m')`;
const quantitySum = sql<number>`SUM(${purchases.quantidade})`;
const totalValueSum = sql<number>`SUM(${purchases.quantidade} * ${purchases.valorUnitario})`;
const averagePrice = sql<number>`AVG(${purchases.valorUnitario})`;
const minUnitPrice = sql<number>`MIN(${purchases.valorUnitario})`;
const maxUnitPrice = sql<number>`MAX(${purchases.valorUnitario})`;
const occurrenceCount = sql<number>`COUNT(*)`;

export function buildWhereConditions(filters: AnalyticsFilters): ConditionList {
  const conditions: ConditionList = [];

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
    conditions.push(inArray(purchases.natureza, uniqueValues(filters.naturezas)));
  }

  if (filters.fornecedores && filters.fornecedores.length > 0) {
    conditions.push(inArray(purchases.fornecedor, uniqueValues(filters.fornecedores)));
  }

  if (filters.itens && filters.itens.length > 0) {
    conditions.push(inArray(purchases.item, uniqueValues(filters.itens)));
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

  return fetchTopItems(db, filters, topN);
}

export async function getPriceVariation(
  filters: AnalyticsFilters,
  topN: number = 10
): Promise<PriceVariation[]> {
  const db = await getDb();
  if (!db) {
    return [];
  }

  const topItems = await fetchTopItems(db, filters, topN);
  const topItemNames = uniqueValues(
    topItems.flatMap((item) => (item.rawItem ? [item.rawItem] : []))
  );

  if (topItemNames.length === 0) {
    return [];
  }

  const baseConditions = buildWhereConditions(filters);
  const whereClause = combineConditions([
    ...baseConditions,
    inArray(purchases.item, topItemNames),
  ]);

  if (!whereClause) {
    return [];
  }

  const result = await db
    .select({
      item: purchases.item,
      month: monthDateFormat,
      avgPrice: averagePrice,
      minPrice: minUnitPrice,
      maxPrice: maxUnitPrice,
      quantity: quantitySum,
    })
    .from(purchases)
    .where(whereClause)
    .groupBy(purchases.item, monthDateFormat)
    .orderBy(asc(monthDateFormat));

  return result.map((row) => ({
    item: row.item || 'Não especificado',
    month: row.month || '',
    avgPrice: toNumber(row.avgPrice),
    minPrice: toNumber(row.minPrice),
    maxPrice: toNumber(row.maxPrice),
    quantity: toNumber(row.quantity),
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

  const topItems = await fetchTopItems(db, filters, topN);
  if (topItems.length === 0) {
    return [];
  }

  const baseConditions = buildWhereConditions(filters);
  const forecastMonths = buildForecastMonths(12);
  const forecasts: DemandForecast[] = [];

  for (const item of topItems) {
    const itemName = item.rawItem ?? null;
    if (!itemName) {
      continue;
    }

    const whereClause = combineConditions([
      ...baseConditions,
      eq(purchases.item, itemName),
    ]);

    if (!whereClause) {
      continue;
    }

    const monthlyTotals = await db
      .select({
        month: monthDateFormat,
        totalQuantity: quantitySum,
      })
      .from(purchases)
      .where(whereClause)
      .groupBy(monthDateFormat)
      .orderBy(asc(monthDateFormat));

    const quantities = monthlyTotals.map((row) => toNumber(row.totalQuantity));
    const historicalAvg = average(quantities);
    const predictedQuantity = Math.max(0, Math.round(historicalAvg));

    for (const month of forecastMonths) {
      forecasts.push({
        item: item.item,
        month,
        predictedQuantity,
        historicalAvg,
      });
    }
  }

  return forecasts;
}

async function fetchTopItems(
  db: DbClient,
  filters: AnalyticsFilters,
  topN: number
): Promise<TopItem[]> {
  const conditions = buildWhereConditions(filters);

  let query = db
    .select({
      item: purchases.item,
      totalQuantity: quantitySum,
      totalValue: totalValueSum,
      avgPrice: averagePrice,
      occurrences: occurrenceCount,
    })
    .from(purchases);

  const whereClause = combineConditions(conditions);
  if (whereClause) {
    query = query.where(whereClause);
  }

  const rows = await query
    .groupBy(purchases.item)
    .orderBy(desc(quantitySum))
    .limit(topN);

  return rows.map((row) => ({
    item: row.item ?? 'Não especificado',
    totalQuantity: toNumber(row.totalQuantity),
    totalValue: toNumber(row.totalValue),
    avgPrice: toNumber(row.avgPrice),
    occurrences: toNumber(row.occurrences),
    rawItem: row.item ?? null,
  }));
}

function combineConditions(conditions: ConditionList): SQL | undefined {
  if (conditions.length === 0) {
    return undefined;
  }

  return conditions.length === 1 ? conditions[0] : and(...conditions);
}

function uniqueValues<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

function toNumber(value: unknown): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  const total = values.reduce((sum, current) => sum + current, 0);
  return total / values.length;
}

function buildForecastMonths(count: number, startDate = new Date()): string[] {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(startDate.getFullYear(), startDate.getMonth() + index + 1, 1);
    return formatYearMonth(date);
  });
}

function formatYearMonth(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${date.getFullYear()}-${month}`;
}
