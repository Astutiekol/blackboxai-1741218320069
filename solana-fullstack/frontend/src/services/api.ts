import axios from 'axios';
import { CreateRecordDto, UpdateRecordDto, Record, ApiResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const solanaApi = {
  createRecord: async (data: CreateRecordDto): Promise<ApiResponse<void>> => {
    try {
      const response = await api.post<ApiResponse<void>>('/solana/record', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Failed to create record');
      }
      throw error;
    }
  },

  updateRecord: async (data: UpdateRecordDto): Promise<ApiResponse<void>> => {
    try {
      const response = await api.put<ApiResponse<void>>('/solana/record', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Failed to update record');
      }
      throw error;
    }
  },

  getRecords: async (walletAddress: string): Promise<ApiResponse<Record[]>> => {
    try {
      const response = await api.get<ApiResponse<Record[]>>(`/solana/records/${walletAddress}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || 'Failed to fetch records');
      }
      throw error;
    }
  },
};

export default api;
