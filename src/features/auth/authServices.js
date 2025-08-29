import api from "../../api/axios";

const authService = {
  async getCsrfToken() {
    return await api.get("/get-csrf-token");
  },
  async sendOtp(email) {
    return await api.post("/auth/send-otp/", { email });
  },
  async verifyOtp(email, otp) {
    return await api.post("/auth/verify-email/", { email, otp });
  },
  async register({ email, name, password }) {
    return await api.post("/auth/register/", { email, name, password });
  },
  async login({ email, password }) {
    return await api.post("/auth/jwt/", { email, password });
  },
  async refreshToken() {
    return await api.get("/auth/jwt");
  },
  async logout() {
    return await api.delete("/auth/jwt/");
  },
  async fetchUser() {
    return await api.get("/auth/me/");
  },
  async updateAccount(formData) {
    return await api.patch(
      "auth/me/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
  async forgotPassword(email) {
    return await api.post("/auth/forgot-password/", { email });
  },
  async verifyOtpCp(email, otp) {
    return await api.post("/auth/verify-email/", { email, otp });
  },
  async changePassword({ email, new_password }) {
    return await api.post("/auth/change-password/", { email, new_password });
  }
};

export default authService;
