import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from './api-client';

vi.mock('./api-client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  },
}));

const mockApiClient = vi.mocked(apiClient);

import create from './HttpService';

describe('HttpService', () => {
  const service = create('/test');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('get', () => {
    it('sends GET request with id appended to endpoint', () => {
      mockApiClient.get.mockResolvedValue({ data: [] });
      const { request } = service.get(42);

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/test/42',
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      );
    });

    it('sends GET request to base endpoint when no id is provided', () => {
      mockApiClient.get.mockResolvedValue({ data: [] });
      service.get();

      expect(mockApiClient.get).toHaveBeenCalledWith(
        '/test',
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      );
    });

    it('returns a cancel function that aborts the request', () => {
      mockApiClient.get.mockResolvedValue({ data: [] });
      const { cancel } = service.get(1);
      expect(typeof cancel).toBe('function');
    });
  });

  describe('post', () => {
    it('sends POST request with entity', async () => {
      const entity = { name: 'test' };
      mockApiClient.post.mockResolvedValue({ data: entity });

      await service.post(entity);
      expect(mockApiClient.post).toHaveBeenCalledWith('/test', entity);
    });
  });

  describe('delete', () => {
    it('sends DELETE request with id', async () => {
      mockApiClient.delete.mockResolvedValue({ data: {} });

      await service.delete(42);
      expect(mockApiClient.delete).toHaveBeenCalledWith('/test/42');
    });
  });

  describe('patch', () => {
    it('sends PATCH request with entity id and body', async () => {
      const entity = { id: 42, name: 'updated' };
      mockApiClient.patch.mockResolvedValue({ data: entity });

      await service.patch(entity);
      expect(mockApiClient.patch).toHaveBeenCalledWith('/test/42', entity);
    });
  });
});
