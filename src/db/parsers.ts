import type {
  School,
  HeiInstitution,
  UgcProgramme,
  RawSchool,
  RawHeiFeature,
  RawUgcFeature,
} from "@/types/school";

/** Normalize "N.A.", "N/A", null, undefined to empty string */
function normalize(value: string | null | undefined): string {
  if (value == null) return "";
  const trimmed = value.trim();
  if (trimmed === "N.A." || trimmed === "N/A") return "";
  return trimmed;
}

export function parseSchool(raw: RawSchool): School {
  return {
    school_no: String(raw["SCHOOL NO."]),
    name_en: normalize(raw["ENGLISH NAME"]),
    name_tc: normalize(raw["\u4e2d\u6587\u540d\u7a31"]),
    category_en: normalize(raw["ENGLISH CATEGORY"]),
    category_tc: normalize(raw["\u4e2d\u6587\u985e\u5225"]),
    address_en: normalize(raw["ENGLISH ADDRESS"]),
    address_tc: normalize(raw["\u4e2d\u6587\u5730\u5740"]),
    school_level_en: normalize(raw["SCHOOL LEVEL"]),
    school_level_tc: normalize(raw["\u5b78\u6821\u985e\u578b"]),
    district_en: normalize(raw["DISTRICT"]),
    district_tc: normalize(raw["\u5206\u5340"]),
    finance_type_en: normalize(raw["FINANCE TYPE"]),
    finance_type_tc: normalize(raw["\u8cc7\u52a9\u7a2e\u985e"]),
    religion_en: normalize(raw["RELIGION"]),
    religion_tc: normalize(raw["\u5b97\u6559"]),
    session_en: normalize(raw["SESSION"]),
    session_tc: normalize(raw["\u5b78\u6821\u6388\u8ab2\u6642\u9593"]),
    students_gender_en: normalize(raw["STUDENTS GENDER"]),
    students_gender_tc: normalize(raw["\u5c31\u8b80\u5b78\u751f\u6027\u5225"]),
    telephone: normalize(raw["TELEPHONE"]),
    fax: normalize(raw["FAX NUMBER"]),
    website: normalize(raw["WEBSITE"]),
    latitude: raw["LATITUDE"] ?? 0,
    longitude: raw["LONGITUDE"] ?? 0,
  };
}

export function parseHeiInstitution(raw: RawHeiFeature): HeiInstitution {
  const p = raw.properties;
  return {
    objectid: p.OBJECTID,
    facility_name_en: normalize(p.Facility_Name),
    facility_name_tc: normalize(p["\u8a2d\u65bd\u540d\u7a31"]),
    address_en: normalize(p.Address),
    address_tc: normalize(p["\u5730\u5740"]),
    telephone: normalize(p.Telephone),
    fax: normalize(p.Fax_Number),
    email: normalize(p.Email_Address),
    website: normalize(p.Website),
    latitude: p["Latitude___\u7def\u5ea6"] ?? 0,
    longitude: p["Longitude___\u7d93\u5ea6"] ?? 0,
  };
}

export function parseUgcProgramme(raw: RawUgcFeature): UgcProgramme {
  const p = raw.properties;
  return {
    objectid: p.OBJECTID,
    university_en: normalize(p.University_EN),
    university_tc: normalize(p.University_TC),
    programme_name_en: normalize(p.Programme_Name_EN),
    programme_name_tc: normalize(p.Programme_Name_TC),
    level_of_study_en: normalize(p.Level_of_Study_EN),
    level_of_study_tc: normalize(p.Level_of_Study_TC),
    mode_of_study_en: normalize(p.Mode_of_Study_EN),
    mode_of_study_tc: normalize(p.Mode_of_Study_TC),
    latitude: p.Latitude ?? 0,
    longitude: p.Longitude ?? 0,
  };
}
