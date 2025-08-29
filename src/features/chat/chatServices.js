import chatApiCalls from "./chatApiCalls";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Async actions for chat functionalities
export const createChatGroup = createAsyncThunk(
  "chat/createGroup",
  async ({ profile, name, members, type, description }, { rejectWithValue }) => {
    const memberIds = members.map(member => member.id);
    try {
      const formData = new FormData();
      formData.append('group_name', name);
      formData.append('group_description', description);
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

export const updateChatGroup = createAsyncThunk(
  "chat/updateGroup",
  async ({ uid, profile, description, type }, { rejectWithValue }) => {
   try {
     const formData = new FormData();
     formData.append('uid', uid);
     formData.append('group_description', description);
     if (profile) {
      formData.append('group_profile', profile);
     }
     formData.append('group_type', type);
     const response = await chatApiCalls.updateChatGroup(formData)
     if (response.data.status) {
       return response.data;
     } else {
       return rejectWithValue(response.data.message || "Failed to update chat group");
     }
   } catch (error) {
      console.error("Error creating chat group:", error);
      return rejectWithValue(error.response.data.message || "Failed to update chat group");
   }
  }
)

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

export const getGroup = createAsyncThunk(
  "chat/getGroup",
  async (groupId, { rejectWithValue }) => {
    
    try {
      const response = await chatApiCalls.getGroup(groupId);
      if (response.data.status) {
        return response.data;
      } else {
        return rejectWithValue(response.data.message || "Failed to fetch group.");
      }
    } catch (error) {
      console.error("an unexpected error occured while fetching group.")
      return rejectWithValue(error.response.data.message || "Failed to fetch group.")
    }
  }
);

export const deleteGroup = createAsyncThunk(
  "chat/deleteGroup",
  async (groupId, {rejectWithValue}) => {
    try {
      const response = await chatApiCalls.deleteGroup(groupId)
      if (response.data.status) {
        return response.data
      } else {
        return rejectWithValue(response.data.message || "Failed to delete group")
      }
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Failed to delete group")
    }
  }
)

export const updateMember = createAsyncThunk(
  "chat/updateMember",
  async ({groupId, memberId, newRole}, {rejectWithValue}) => {
    try {
      const response = await chatApiCalls.updateMemberRole(groupId, memberId, newRole)
      if (response.data.status) {
        return response.data
      } else {
        return rejectWithValue(response.data.message || "Failed to update member")
      }
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Failed to update member")
    }
  }
)


export const deleteMember = createAsyncThunk(
  "chat/deleteMember",
  async ({groupId, memberId}, {rejectWithValue}) => {
    try {
      const response = await chatApiCalls.removeMemberFromGroup(groupId, memberId)
      if (response.data.status) {
        return response.data
      } else {
        return rejectWithValue(response.data.message || "Failed to delete member")
      }
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Failed to delete member")
    }
  }
)

export const deleteMessage = createAsyncThunk(
  "chat/deleteMessage",
  async (messageId, {rejectWithValue}) => {
    try {
      const response = await chatApiCalls.deleteMessage(messageId)
      if (response.data.status) {
        return response.data
      } else {
        return rejectWithValue(response.data.message || "Failed to delete message.")
      }
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Failed to delete message.")
    }
  }
)


export const getJoinRequests = createAsyncThunk(
  "chat/getRequests",
  async (groupId, {rejectWithValue}) => {
    try {
      const response = await chatApiCalls.getJoinRequests(groupId)
      if (response.data.status) {
        return response.data
      } else {
        return rejectWithValue(response.data.message || "Failed to get join requests.")
      }
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Failed to get join requests.")
    }
  }
)

export const sendJoinRequest = createAsyncThunk(
  "chat/sendRequest",
  async (groupId, {rejectWithValue}) => {
    try {
      const response = await chatApiCalls.sendJoinRequest(groupId)
      if (response.data.status) {
        return response.data
      } else {
        return rejectWithValue(response.data.message || "Failed to send join request.")
      }
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Failed to send join request.")
    }
  }
)

export const deleteJoinRequest = createAsyncThunk(
  "chat/deleteRequest",
  async ({groupId, requestId, deleteAll}, {rejectWithValue}) => {
    try {
      const response = await chatApiCalls.deleteJoinRequests( requestId, deleteAll, groupId)
      if (response.data.status) {
        return response.data
      } else {
        return rejectWithValue(response.data.message || "Failed to delete join request.")
      }
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Failed to delete join request.")
    }
  }
);

export const uploadFile = createAsyncThunk(
  "chat/uploadFile",
  async (file, {rejectWithValue}) => {
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await chatApiCalls.fileUpload(formData)
      if (response.data.status) {
        return response.data;
      } else {
        return rejectWithValue(response.data.message || "Failed to upload file.")
      }
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Failed to upload file.")
    }
  }
)

export const clearAllMessages = createAsyncThunk(
  "chat/clearAllMessages",
  async (groupId, {rejectWithValue}) => {
    try {
      const response = await chatApiCalls.clearAllMessages(groupId)
      if (response.data.status) {
        return response.data
      } else {
        return rejectWithValue(response.data.message || "Failed to clear all messages.")
      }
    } catch (error) {
      return rejectWithValue(error.response.data.message || "Failed to clear all messages.")
    }
  }
)
