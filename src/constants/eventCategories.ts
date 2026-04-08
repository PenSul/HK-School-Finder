import type { EventCategory } from "@/types/calendar";

export interface EventCategoryConfig {
  labelEn: string;
  labelTc: string;
  color: string;
}

export const EVENT_CATEGORIES: Record<EventCategory, EventCategoryConfig> = {
  poa: { labelEn: "POA", labelTc: "統一派位", color: "#1E3A5F" },
  kg: { labelEn: "KG", labelTc: "幼稚園", color: "#0D9488" },
  open_day: { labelEn: "Open Day", labelTc: "開放日", color: "#F59E0B" },
  sspa: { labelEn: "SSPA", labelTc: "中學學位分配", color: "#EF4444" },
  custom: { labelEn: "Custom", labelTc: "自訂", color: "#64748B" },
};
