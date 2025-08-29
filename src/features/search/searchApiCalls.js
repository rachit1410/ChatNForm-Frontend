import api from "../../api/axios";

export const searchApiCalls = {
  searchUser: async (query) => {
    try {
      const response = await api.get(`/search/user/?q=${query}`);
        return response.data;
    } catch (error) {
      console.error("Error searching for users:", error);
      throw error;
    }
  },
  searchGroup: async (query) => {
    try {
      const response = await api.get(`/search/group/?g=${query}`);
        return response.data;
    } catch (error) {
      console.error("Error searching for group:", error);
      throw error;
    }
  }
};


