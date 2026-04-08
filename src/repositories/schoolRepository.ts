import type { SQLiteDatabase } from "expo-sqlite";
import type { School } from "@/types/school";
import type { K12FilterState } from "@/types/filter";

function buildWhereClause(filters: K12FilterState): {
  where: string;
  params: (string | number)[];
} {
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  const levelMap: Record<string, string> = {
    KG: "KINDERGARTEN",
    PRIMARY: "PRIMARY",
    SECONDARY: "SECONDARY",
  };
  const level = levelMap[filters.educationLevel];
  if (level) {
    conditions.push("school_level_en = ?");
    params.push(level);
  }

  if (filters.searchQuery.trim()) {
    conditions.push(
      "(name_en LIKE ? OR name_tc LIKE ? OR address_en LIKE ?)"
    );
    const q = `%${filters.searchQuery.trim()}%`;
    params.push(q, q, q);
  }

  if (filters.districts.length > 0) {
    const placeholders = filters.districts.map(() => "?").join(",");
    conditions.push(`district_en IN (${placeholders})`);
    params.push(...filters.districts);
  }

  if (filters.financeTypes.length > 0) {
    const placeholders = filters.financeTypes.map(() => "?").join(",");
    conditions.push(`finance_type_en IN (${placeholders})`);
    params.push(...filters.financeTypes);
  }

  if (filters.religions.length > 0) {
    const placeholders = filters.religions.map(() => "?").join(",");
    conditions.push(`religion_en IN (${placeholders})`);
    params.push(...filters.religions);
  }

  if (filters.sessions.length > 0) {
    const placeholders = filters.sessions.map(() => "?").join(",");
    conditions.push(`session_en IN (${placeholders})`);
    params.push(...filters.sessions);
  }

  if (filters.genders.length > 0) {
    const placeholders = filters.genders.map(() => "?").join(",");
    conditions.push(`students_gender_en IN (${placeholders})`);
    params.push(...filters.genders);
  }

  const where =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  return { where, params };
}

export async function getSchools(
  db: SQLiteDatabase,
  filters: K12FilterState,
  limit = 50,
  offset = 0
): Promise<School[]> {
  const { where, params } = buildWhereClause(filters);
  return db.getAllAsync<School>(
    `SELECT * FROM schools ${where} ORDER BY name_en LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );
}

export async function getSchoolById(
  db: SQLiteDatabase,
  schoolNo: string
): Promise<School | null> {
  return db.getFirstAsync<School>(
    "SELECT * FROM schools WHERE school_no = ?",
    schoolNo
  );
}

export async function getSchoolCount(
  db: SQLiteDatabase,
  filters: K12FilterState
): Promise<number> {
  const { where, params } = buildWhereClause(filters);
  const row = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM schools ${where}`,
    params
  );
  return row?.count ?? 0;
}

export async function getSchoolsForMap(
  db: SQLiteDatabase,
  filters: K12FilterState
): Promise<School[]> {
  const { where, params } = buildWhereClause(filters);
  const coordFilter = "latitude != 0 AND longitude != 0";
  const fullWhere = where
    ? `${where} AND ${coordFilter}`
    : `WHERE ${coordFilter}`;
  return db.getAllAsync<School>(
    `SELECT * FROM schools ${fullWhere}`,
    params
  );
}
