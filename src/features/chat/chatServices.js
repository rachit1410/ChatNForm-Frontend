import chatApiCalls from "./chatApiCalls";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Async actions for chat functionalities
export const createChatGroup = createAsyncThunk(
  "chat/createGroup",
  async ({ profile, name, members, type }, { rejectWithValue }) => {
    const memberIds = members.map(member => member.id);
    console.log("props i am sending:", name, "and type:", type, "for members:", memberIds, "profile:", profile);
    try {
      const formData = new FormData();
      formData.append('group_name', name);
      formData.append('group_type', type || 'private'); // Default to 'private' if type is not provided
      formData.append('memberIds', JSON.stringify(memberIds)); // Send memberIds as a JSON string
      if (profile) {
          formData.append('group_profile', profile); // Append the file
      }

      const response = await chatApiCalls.createChatGroup(formData);
      if (response.data.status) {
        return response.data;
      } else {
        return rejectWithValue(response.data.message || "Failed to create chat group");
      }
    } catch (error) {
      console.error("Error creating chat group:", error);
      return rejectWithValue(error.response.data.message || "Failed to create chat group");
    }
  }
);

export const getChatList = createAsyncThunk(
  "chat/getChatList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatApiCalls.getChatList();
      if (response.data.status) {
        return response.data;
      } else {
        return rejectWithValue(response.data.message || "Failed to retrieve chat list");
      }
    } catch (error) {
      console.error("Error retrieving chat list:", error);
      return rejectWithValue(error.response.data.message || "Failed to retrieve chat list");
    }
  }
);

export const getChatMessages = createAsyncThunk(
  "chat/getChatMessages",
    async (groupId, { rejectWithValue }) => {
        try {
        const response = await chatApiCalls.getChatMessages(groupId);
        if (response.status) {
            return response.data;
        } else {
            return rejectWithValue(response.data.message || "Failed to retrieve chat messages");
        }
        } catch (error) {
        console.error("Error retrieving chat messages:", error);
        return rejectWithValue(error.response.data.message || "Failed to retrieve chat messages");
        }
    }
);

export const getMembersList = createAsyncThunk(
  "chat/getMembersList",
  async (groupId, { rejectWithValue }) => {
    try {
      const response = await chatApiCalls.getMembersList(groupId);
      if (response.data.status) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || "Failed to retrieve members list");
      }
    } catch (error) {
      console.error("Error retrieving members list:", error);
      return rejectWithValue(error.response.data.message || "Failed to retrieve members list");
    }
  }
);

export const addMemberToGroup = createAsyncThunk(
  "chat/addMemberToGroup",
  async ({ groupId, memberId }, { rejectWithValue }) => {
    try {
      const response = await chatApiCalls.addMemberToGroup(groupId, memberId);
      if (response.data.status) {
        return response.data;
      } else {
        return rejectWithValue(response.data.message || "Failed to add member to group");
      }
    } catch (error) {
      console.error("Error adding member to group:", error);
      return rejectWithValue(error.response.data.message || "Failed to add member to group");
    }
  }
);
