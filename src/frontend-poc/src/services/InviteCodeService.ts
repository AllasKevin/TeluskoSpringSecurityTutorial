import apiClient from './api-client';

const ENDPOINTS = {
  MY_INVITE_CODES: '/myinvitecodes',
  AVAILABLE_INVITE_CODE: '/availableinvitecode',
} as const;

const InviteCodeService = {
  getMyInviteCodes: () => apiClient.get(ENDPOINTS.MY_INVITE_CODES),
  getAvailableInviteCode: () => apiClient.get(ENDPOINTS.AVAILABLE_INVITE_CODE),
};

export default InviteCodeService;
