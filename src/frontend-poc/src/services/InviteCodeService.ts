import http from "./api-client";

const myinvitecodesendpoint = "/myinvitecodes";
const availableinvitecodeendpoint = "/availableinvitecode";

const InviteCodeService = {
  getMyInviteCodes: () => http.get(myinvitecodesendpoint),
  getAvailableInviteCode: () => http.get(availableinvitecodeendpoint),
};

export default InviteCodeService;