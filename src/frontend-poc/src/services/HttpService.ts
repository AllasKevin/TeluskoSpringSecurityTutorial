import apiClient from './api-client';

interface Entity {
  id: number;
}

class HttpService {
  constructor(private endpoint: string) {}

  get<T>(id?: number) {
    const controller = new AbortController();
    const url = id !== undefined ? `${this.endpoint}/${id}` : this.endpoint;
    const request = apiClient.get<T[]>(url, { signal: controller.signal });
    return { request, cancel: () => controller.abort() };
  }

  delete(id: number) {
    return apiClient.delete(`${this.endpoint}/${id}`);
  }

  post<T>(entity: T) {
    return apiClient.post(this.endpoint, entity);
  }

  patch<T extends Entity>(updatedEntity: T) {
    return apiClient.patch(`${this.endpoint}/${updatedEntity.id}`, updatedEntity);
  }
}

const create = (endpoint: string) => new HttpService(endpoint);

export default create;
