import axios, { AxiosInstance, AxiosResponse } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

class ApiService {
  public api: AxiosInstance;
  private getToken: (() => string | null) | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // 请求拦截器
    this.api.interceptors.request.use(
      (config) => {
        // 优先使用从authStore获取的token，如果没有则回退到localStorage
        const token = this.getToken
          ? this.getToken()
          : localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        console.error(
          "API Error:",
          error.response?.status,
          error.response?.data
        );

        if (error.response?.status === 401) {
          // 清除本地存储但不直接重定向，让 React Router 处理
          localStorage.removeItem("auth-storage");
          localStorage.removeItem("token");
          // 使用 useAuthStore 的 logout 方法更安全，但这里需要全局处理
          // 可以抛出特定错误让组件处理
          return Promise.reject({ ...error, isAuthError: true });
        }
        return Promise.reject(error);
      }
    );
  }

  // 设置token获取器，用于从authStore获取token
  setTokenGetter(getter: () => string | null) {
    this.getToken = getter;
  }

  // 认证相关
  async login(username: string, password: string) {
    const response = await this.api.post("/auth/login", { username, password });
    return response.data;
  }

  async register(userData: any) {
    const response = await this.api.post("/auth/register", userData);
    return response.data;
  }

  async logout() {
    const response = await this.api.post("/auth/logout");
    return response.data;
  }

  // 文章相关
  async getArticles(params?: any) {
    const response = await this.api.get("/articles", { params });
    return response.data;
  }

  async getArticle(id: number) {
    const response = await this.api.get(`/articles/${id}`);
    return response.data;
  }

  async createArticle(data: any) {
    const response = await this.api.post("/articles", data);
    return response.data;
  }

  async updateArticle(id: number, data: any) {
    const response = await this.api.patch(`/articles/${id}`, data);
    return response.data;
  }

  async deleteArticle(id: number) {
    const response = await this.api.delete(`/articles/${id}`);
    return response.data;
  }

  // 标签相关
  async getTags() {
    const response = await this.api.get("/tags");
    return response.data;
  }

  async getTag(id: number) {
    const response = await this.api.get(`/tags/${id}`);
    return response.data;
  }

  async createTag(data: any) {
    const response = await this.api.post("/tags", data);
    return response.data;
  }

  async updateTag(id: number, data: any) {
    const response = await this.api.patch(`/tags/${id}`, data);
    return response.data;
  }

  async deleteTag(id: number) {
    const response = await this.api.delete(`/tags/${id}`);
    return response.data;
  }

  // 评论相关
  async getComments(params?: any) {
    const response = await this.api.get("/comments", { params });
    return response.data;
  }

  async getComment(id: number) {
    const response = await this.api.get(`/comments/${id}`);
    return response.data;
  }

  async updateComment(id: number, data: any) {
    const response = await this.api.patch(`/comments/${id}`, data);
    return response.data;
  }

  async approveComment(id: number) {
    const response = await this.api.patch(`/comments/${id}/approve`);
    return response.data;
  }

  async rejectComment(id: number) {
    const response = await this.api.patch(`/comments/${id}/reject`);
    return response.data;
  }

  async deleteComment(id: number) {
    const response = await this.api.delete(`/comments/${id}`);
    return response.data;
  }

  async getPendingComments() {
    const response = await this.api.get("/comments/pending");
    return response.data;
  }

  async getCommentStats() {
    const response = await this.api.get("/comments/stats");
    return response.data;
  }

  // 项目相关
  async getProjects(params?: any) {
    const response = await this.api.get("/projects", { params });
    return response.data;
  }

  async getProject(id: number) {
    const response = await this.api.get(`/projects/${id}`);
    return response.data;
  }

  async createProject(data: any) {
    const response = await this.api.post("/projects", data);
    return response.data;
  }

  async updateProject(id: number, data: any) {
    const response = await this.api.patch(`/projects/${id}`, data);
    return response.data;
  }

  async deleteProject(id: number) {
    const response = await this.api.delete(`/projects/${id}`);
    return response.data;
  }

  async getProjectStats() {
    const response = await this.api.get("/projects/stats");
    return response.data;
  }

  // 个人信息相关
  async getProfile() {
    const response = await this.api.get("/profile");
    return response.data;
  }

  async updateProfile(data: any) {
    const response = await this.api.patch("/profile", data);
    return response.data;
  }

  // 统计相关
  async getStatsOverview() {
    const response = await this.api.get("/stats/overview");
    return response.data;
  }

  async getArticleStats() {
    const response = await this.api.get("/stats/articles");
    return response.data;
  }

  async getMonthlyStats(year?: number) {
    const params = year ? { year } : {};
    const response = await this.api.get("/stats/monthly", { params });
    return response.data;
  }

  async getTagStats() {
    const response = await this.api.get("/stats/tags");
    return response.data;
  }

  async getRecentActivity() {
    const response = await this.api.get("/stats/recent-activity");
    return response.data;
  }
}

export const apiService = new ApiService();
