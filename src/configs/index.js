export const CERT_ADDRESS = "0x947c753Eb4B4818CE65936f8Aa236c77753C733C";

export const CERT_METHODS = {
  getOwnerRoles: "getOwnerRoles",
  addCensor: "addCensor",
  editCensor: "editCensor",
  deleteCensor: "deleteCensor",
  totalCensors: "totalCensors",
  censors: "censors",
  addSpecializedTraining: "addSpecializedTraining",
  getSpecializedTrainings: "getSpecializedTrainings",
  deleteSpecializedTraining: "deleteSpecializedTraining",
  addCertForm: "addCertForm",
  deleteCertForm: "deleteCertForm",
  getCertForms: "getCertForms",
  totalCertForm: "totalCertForm",
  certFormMinted: "certFormMinted",
  addCert: "addCert",
  getCertsPending: "getCertsPending",
  approveCert: "approveCert",
  balanceOf: "balanceOf",
  tokenOfOwnerByIndex: "tokenOfOwnerByIndex",
  tokenURI: "tokenURI",
  REFACTOR_NAME: "REFACTOR_NAME",
  rejectCert: "rejectCert",
  getCertsMinted: "getCertsMinted",
};

export const ROLES = {
  ADMIN: {
    name: "admin",
    value: 0,
  },
  CENSOR: {
    name: "censors",
    value: 1,
  },
  USER: {
    name: "users",
    value: 2,
  },
};

export const GRADUATE_GRADE = {
  D: "Trung bình khá",
  C: "Khá",
  B: "Giỏi",
  A: "Xuất sắc",
};

export const STUDY_MODES = {
  fullTime: "Chính quy",
  partTime: "Không chính quy",
  remoteFullTime: "Chính quy từ xa",
  remotePartTime: "Không chính quy từ xa",
};

export const GENDER = {
  MALE: "Nam",
  FEMALE: "Nữ",
};

export const CERT_STATUSES = {
  DEFAULT: 0,
  PENDING: 1,
  REPORTED: 2,
};
