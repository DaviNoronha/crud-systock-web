/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "@/axios";

class BaseService {

  get(endpoint: string): Promise<any> {
    return axios.get(`${endpoint}`);
  }

  post(endpoint: string, data: any): Promise<any> {
    return axios.post(`${endpoint}`, data);
  }

  put(endpoint: string, data: any): Promise<any> {
    return axios.put(`${endpoint}`, data);
  }

  delete(endpoint: string): Promise<any> {
    return axios.delete(`${endpoint}`);
  }
}

export default new BaseService();
