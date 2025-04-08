import apiClient from "./api-client";

interface Entity {
  id: number;
}

class HttpService {
  endpoint: string;

  constructor(endpoint: string){
    this.endpoint = endpoint;
  }

  get<T>(id?: number){
    const controller = new AbortController();

    const request = apiClient
      .get<T[]>(this.endpoint + "/" + id, {
        signal: controller.signal,
      });

      return {request, cancel: () => controller.abort()};
  }

  delete(id: number){
    const request = apiClient.delete(this.endpoint + "/" + id);

    return request;
  }

  post<T>(entity: T){
        const request = apiClient.post(this.endpoint , entity);
        return request;
  }

  patch<T extends Entity>(updatedEntity: T){
    return apiClient.patch(this.endpoint + "/" + updatedEntity.id, updatedEntity);
  }
}

const create = (endpoint : string) => new HttpService(endpoint);

export default create;