import type { School, HeiInstitution } from "./school";

/** Unified marker data for the map screen */
export interface MapPin {
  id: string;
  nameEn: string;
  nameTc: string;
  addressEn: string;
  addressTc: string;
  financeType: string;
  latitude: number;
  longitude: number;
  type: "school" | "institution";
}

export function schoolToMapPin(school: School): MapPin {
  return {
    id: school.school_no,
    nameEn: school.name_en,
    nameTc: school.name_tc,
    addressEn: school.address_en,
    addressTc: school.address_tc,
    financeType: school.finance_type_en,
    latitude: school.latitude,
    longitude: school.longitude,
    type: "school",
  };
}

export function institutionToMapPin(institution: HeiInstitution): MapPin {
  return {
    id: String(institution.objectid),
    nameEn: institution.facility_name_en,
    nameTc: institution.facility_name_tc,
    addressEn: institution.address_en,
    addressTc: institution.address_tc,
    financeType: "UGC-FUNDED",
    latitude: institution.latitude,
    longitude: institution.longitude,
    type: "institution",
  };
}
