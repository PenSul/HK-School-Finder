import { schoolToMapPin, institutionToMapPin } from "./map";
import type { School } from "./school";
import type { HeiInstitution } from "./school";

const MOCK_SCHOOL: School = {
  school_no: "123456",
  name_en: "Test Primary School",
  name_tc: "測試小學",
  category_en: "Primary",
  category_tc: "小學",
  address_en: "1 School Road, Wan Chai",
  address_tc: "灣仔學校道1號",
  school_level_en: "PRIMARY",
  school_level_tc: "小學",
  district_en: "WAN CHAI",
  district_tc: "灣仔",
  finance_type_en: "AIDED",
  finance_type_tc: "資助",
  religion_en: "CATHOLIC",
  religion_tc: "天主教",
  session_en: "WHOLE DAY",
  session_tc: "全日",
  students_gender_en: "CO-ED",
  students_gender_tc: "男女",
  telephone: "21234567",
  fax: "21234568",
  website: "http://test.edu.hk",
  latitude: 22.278,
  longitude: 114.171,
};

const MOCK_INSTITUTION: HeiInstitution = {
  objectid: 42,
  facility_name_en: "Test University",
  facility_name_tc: "測試大學",
  address_en: "10 University Ave, Sha Tin",
  address_tc: "沙田大學道10號",
  telephone: "26001000",
  fax: "26001001",
  email: "info@test.edu.hk",
  website: "http://test.edu.hk",
  latitude: 22.421,
  longitude: 114.210,
};

describe("schoolToMapPin", () => {
  it("maps school_no to id", () => {
    expect(schoolToMapPin(MOCK_SCHOOL).id).toBe("123456");
  });

  it("maps name fields", () => {
    const pin = schoolToMapPin(MOCK_SCHOOL);
    expect(pin.nameEn).toBe("Test Primary School");
    expect(pin.nameTc).toBe("測試小學");
  });

  it("maps address fields", () => {
    const pin = schoolToMapPin(MOCK_SCHOOL);
    expect(pin.addressEn).toBe("1 School Road, Wan Chai");
    expect(pin.addressTc).toBe("灣仔學校道1號");
  });

  it("maps finance_type_en to financeType", () => {
    expect(schoolToMapPin(MOCK_SCHOOL).financeType).toBe("AIDED");
  });

  it("maps coordinates", () => {
    const pin = schoolToMapPin(MOCK_SCHOOL);
    expect(pin.latitude).toBe(22.278);
    expect(pin.longitude).toBe(114.171);
  });

  it("sets type to school", () => {
    expect(schoolToMapPin(MOCK_SCHOOL).type).toBe("school");
  });
});

describe("institutionToMapPin", () => {
  it("maps objectid to string id", () => {
    expect(institutionToMapPin(MOCK_INSTITUTION).id).toBe("42");
  });

  it("maps facility_name to name fields", () => {
    const pin = institutionToMapPin(MOCK_INSTITUTION);
    expect(pin.nameEn).toBe("Test University");
    expect(pin.nameTc).toBe("測試大學");
  });

  it("maps address fields", () => {
    const pin = institutionToMapPin(MOCK_INSTITUTION);
    expect(pin.addressEn).toBe("10 University Ave, Sha Tin");
    expect(pin.addressTc).toBe("沙田大學道10號");
  });

  it("sets financeType to UGC-FUNDED", () => {
    expect(institutionToMapPin(MOCK_INSTITUTION).financeType).toBe("UGC-FUNDED");
  });

  it("maps coordinates", () => {
    const pin = institutionToMapPin(MOCK_INSTITUTION);
    expect(pin.latitude).toBe(22.421);
    expect(pin.longitude).toBe(114.210);
  });

  it("sets type to institution", () => {
    expect(institutionToMapPin(MOCK_INSTITUTION).type).toBe("institution");
  });
});
