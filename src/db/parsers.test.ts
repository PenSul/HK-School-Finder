import { parseSchool, parseHeiInstitution, parseUgcProgramme } from "./parsers";
import type { RawSchool, RawHeiFeature, RawUgcFeature } from "@/types/school";

describe("parseSchool", () => {
  const raw: RawSchool = {
    "SCHOOL NO.": 610224000123,
    "ENGLISH NAME": "TEST SCHOOL",
    "\u4e2d\u6587\u540d\u7a31": "\u6e2c\u8a66\u5b78\u6821",
    "ENGLISH CATEGORY": "Aided Primary Schools",
    "\u4e2d\u6587\u985e\u5225": "\u8cc7\u52a9\u5c0f\u5b78",
    "ENGLISH ADDRESS": "123 TEST STREET",
    "\u4e2d\u6587\u5730\u5740": "\u6e2c\u8a66\u8857123\u865f",
    "SCHOOL LEVEL": "PRIMARY",
    "\u5b78\u6821\u985e\u578b": "\u5c0f\u5b78",
    DISTRICT: "TAI PO",
    "\u5206\u5340": "\u5927\u57d4\u5340",
    "FINANCE TYPE": "AIDED",
    "\u8cc7\u52a9\u7a2e\u985e": "\u8cc7\u52a9",
    RELIGION: "PROTESTANTISM / CHRISTIANITY",
    "\u5b97\u6559": "\u57fa\u7763\u6559",
    SESSION: "WHOLE DAY",
    "\u5b78\u6821\u6388\u8ab2\u6642\u9593": "\u5168\u65e5",
    "STUDENTS GENDER": "CO-ED",
    "\u5c31\u8b80\u5b78\u751f\u6027\u5225": "\u7537\u5973",
    TELEPHONE: "26686112",
    "\u806f\u7d61\u96fb\u8a71": "26686112",
    "FAX NUMBER": "26686512",
    "\u50b3\u771f\u865f\u78bc": "26686512",
    WEBSITE: "http://test.edu.hk",
    "\u7db2\u9801": "http://test.edu.hk",
    LONGITUDE: 114.17140462,
    LATITUDE: 22.45533611,
  };

  it("converts numeric SCHOOL NO. to string school_no", () => {
    expect(parseSchool(raw).school_no).toBe("610224000123");
  });

  it("maps English and Chinese name fields", () => {
    const result = parseSchool(raw);
    expect(result.name_en).toBe("TEST SCHOOL");
    expect(result.name_tc).toBe("\u6e2c\u8a66\u5b78\u6821");
  });

  it("maps all filter-indexed fields", () => {
    const result = parseSchool(raw);
    expect(result.school_level_en).toBe("PRIMARY");
    expect(result.district_en).toBe("TAI PO");
    expect(result.finance_type_en).toBe("AIDED");
    expect(result.religion_en).toBe("PROTESTANTISM / CHRISTIANITY");
    expect(result.session_en).toBe("WHOLE DAY");
    expect(result.students_gender_en).toBe("CO-ED");
  });

  it("maps coordinates as numbers", () => {
    const result = parseSchool(raw);
    expect(result.latitude).toBe(22.45533611);
    expect(result.longitude).toBe(114.17140462);
  });

  it("normalizes N.A. values to empty string", () => {
    const withNA: RawSchool = {
      ...raw,
      TELEPHONE: "N.A.",
      "FAX NUMBER": "N.A.",
      WEBSITE: "N.A.",
    };
    const result = parseSchool(withNA);
    expect(result.telephone).toBe("");
    expect(result.fax).toBe("");
    expect(result.website).toBe("");
  });
});

describe("parseHeiInstitution", () => {
  const raw: RawHeiFeature = {
    type: "Feature",
    geometry: { type: "Point", coordinates: [114.13776262, 22.28401175] },
    properties: {
      OBJECTID: 5,
      Facility_Name: "The University of Hong Kong",
      "\u8a2d\u65bd\u540d\u7a31": "\u9999\u6e2f\u5927\u5b78",
      Address: "Pokfulam",
      "\u5730\u5740": "\u8584\u6276\u6797",
      Telephone: null,
      "\u806f\u7d61\u96fb\u8a71": null,
      Fax_Number: null,
      "\u50b3\u771f\u865f\u78bc": null,
      Email_Address: null,
      "\u96fb\u90f5\u5730\u5740": null,
      Website: null,
      "\u7db2\u9801": null,
      "Latitude___\u7def\u5ea6": 22.28401145,
      "Longitude___\u7d93\u5ea6": 114.13776262,
    },
  };

  it("maps OBJECTID", () => {
    expect(parseHeiInstitution(raw).objectid).toBe(5);
  });

  it("maps bilingual names", () => {
    const result = parseHeiInstitution(raw);
    expect(result.facility_name_en).toBe("The University of Hong Kong");
    expect(result.facility_name_tc).toBe("\u9999\u6e2f\u5927\u5b78");
  });

  it("normalizes null contact fields to empty string", () => {
    const result = parseHeiInstitution(raw);
    expect(result.telephone).toBe("");
    expect(result.fax).toBe("");
    expect(result.email).toBe("");
    expect(result.website).toBe("");
  });

  it("normalizes N.A. string contact fields to empty string", () => {
    const withNA: RawHeiFeature = {
      ...raw,
      properties: { ...raw.properties, Telephone: "N.A.", Website: "N.A." },
    };
    const result = parseHeiInstitution(withNA);
    expect(result.telephone).toBe("");
    expect(result.website).toBe("");
  });

  it("maps coordinates from Latitude___/Longitude___ properties", () => {
    const result = parseHeiInstitution(raw);
    expect(result.latitude).toBe(22.28401145);
    expect(result.longitude).toBe(114.13776262);
  });
});

describe("parseUgcProgramme", () => {
  const raw: RawUgcFeature = {
    type: "Feature",
    geometry: { type: "Point", coordinates: [114.17332800, 22.33608600] },
    properties: {
      OBJECTID: 1,
      University_EN: "City University of Hong Kong",
      University_TC: "\u9999\u6e2f\u57ce\u5e02\u5927\u5b78",
      Programme_Name_EN: "Bachelor of Arts and Science in New Media",
      Programme_Name_TC: "\u6587\u7406\u5b78\u58eb\uff08\u65b0\u5a92\u9ad4\uff09",
      Level_of_Study_EN: "Undergraduate",
      Level_of_Study_TC: "\u5b78\u58eb\u5b78\u4f4d\u8ab2\u7a0b",
      Mode_of_Study_EN: "Full-time",
      Mode_of_Study_TC: "\u5168\u65e5\u5236",
      Latitude: 22.33608587,
      Longitude: 114.17332840,
    },
  };

  it("maps programme identification fields", () => {
    const result = parseUgcProgramme(raw);
    expect(result.objectid).toBe(1);
    expect(result.university_en).toBe("City University of Hong Kong");
    expect(result.programme_name_en).toBe("Bachelor of Arts and Science in New Media");
  });

  it("maps study classification fields", () => {
    const result = parseUgcProgramme(raw);
    expect(result.level_of_study_en).toBe("Undergraduate");
    expect(result.mode_of_study_en).toBe("Full-time");
  });

  it("maps coordinates from properties (not geometry)", () => {
    const result = parseUgcProgramme(raw);
    expect(result.latitude).toBe(22.33608587);
    expect(result.longitude).toBe(114.17332840);
  });
});
