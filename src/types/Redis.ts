export interface RedisResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface RedisData<T> {
  data: T;
  timestamp: number;
}
