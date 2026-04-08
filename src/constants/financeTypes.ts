export interface FinanceTypeConfig {
  labelEn: string;
  labelTc: string;
  color: string;
}

export const FINANCE_TYPES: Record<string, FinanceTypeConfig> = {
  GOVERNMENT: { labelEn: "Government", labelTc: "官立", color: "#1E3A5F" },
  AIDED: { labelEn: "Aided", labelTc: "資助", color: "#0D9488" },
  DSS: { labelEn: "DSS", labelTc: "直資", color: "#7C3AED" },
  ESF: { labelEn: "ESF", labelTc: "英基", color: "#0284C7" },
  PRIVATE: { labelEn: "Private", labelTc: "私立", color: "#64748B" },
  CAPUT: { labelEn: "Caput", labelTc: "按位津貼", color: "#EA580C" },
  "UGC-FUNDED": { labelEn: "UGC-funded", labelTc: "教資會資助", color: "#D97706" },
};
