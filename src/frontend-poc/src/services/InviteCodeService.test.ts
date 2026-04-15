import { describe, it, expect, vi, beforeEach } from 'vitest';
import InviteCodeService from './InviteCodeService';
import apiClient from './api-client';

vi.mock('./api-client', () => ({
  default: {
    get: vi.fn(),
  },
}));

const mockApiClient = vi.mocked(apiClient);

describe('InviteCodeService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getMyInviteCodes', () => {
    it('fetches user invite codes from correct endpoint', async () => {
      mockApiClient.get.mockResolvedValue({ data: [{ inviteCode: 'abc-123', available: true }] });
      const result = await InviteCodeService.getMyInviteCodes();

      expect(mockApiClient.get).toHaveBeenCalledWith('/myinvitecodes');
      expect(result.data).toHaveLength(1);
    });
  });

  describe('getAvailableInviteCode', () => {
    it('fetches available invite code from correct endpoint', async () => {
      mockApiClient.get.mockResolvedValue({ data: 'new-code-uuid' });
      const result = await InviteCodeService.getAvailableInviteCode();

      expect(mockApiClient.get).toHaveBeenCalledWith('/availableinvitecode');
      expect(result.data).toBe('new-code-uuid');
    });
  });
});
