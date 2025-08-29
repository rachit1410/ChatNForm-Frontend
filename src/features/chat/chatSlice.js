import { createSlice } from "@reduxjs/toolkit";
import {
  createChatGroup,
  getChatList,
  getChatMessages,
  addMemberToGroup,
  getMembersList,
  getGroup,
  deleteMessage,
  getJoinRequests,
  sendJoinRequest,
  deleteJoinRequest,
  deleteMember,
  uploadFile,
  clearAllMessages
} from "./chatServices";

const initialState = {
  chatGroups: [],
  chatMessages: {},
  loading: false,
  error: null,
  membersList: {},
  addGroup: false,
  newGroup: {
    name: "",
    members: [],
    type: "private",
    description: "",
  },
  updatedGroup: null,
  selectedChat: null,
  isGroupSettingOpen: false,
  chatGroup: null,
  joinRequests: null,
  fileUrl: null
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearChatState: (state) => {
      state.chatGroups = [];
      state.chatMessages = {};
      state.loading = false;
      state.error = null;
      state.membersList = {};
      state.addGroup = false;
      state.newGroup = {
        name: "",
        members: [],
        type: "private",
        description: "",
      };
      state.selectedChat = null;
      state.isGroupSettingOpen = false;
      state.updatedGroup = null;
      state.chatGroup = null;
      state.joinRequests = null;
      state.fileUrl = null;
    },
    setUpdatedGroup: (state, action) => {
      state.updatedGroup = action.payload;
    },
    clearUpdatedGroup: (state) => {
      state.updatedGroup = null;
    },
    toggleIsGroupSettingOpen: (state) => {
      state.isGroupSettingOpen = !state.isGroupSettingOpen;
    },
    toggleAddGroup: (state) => {
      state.addGroup = !state.addGroup;
    },
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    setNewGroupName: (state, action) => {
      state.newGroup.name = action.payload;
    },
    setNewGroupDescription: (state, action) => {
      state.newGroup.description = action.payload;
    },
    setNewGroupType: (state, action) => {
      state.newGroup.type = action.payload;
    },
    addMemberToNewGroup: (state, action) => {
      state.newGroup.members.push(action.payload);
    },
    removeMemberFromNewGroup: (state, action) => {
      state.newGroup.members = state.newGroup.members.filter(
        (member) => member.id !== action.payload.id
      );
    },
    clearNewGroup: (state) => {
      state.newGroup = {
        profile: null,
        name: "",
        members: [],
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createChatGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChatGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.chatGroups.push(action.payload.data);
      })
      .addCase(createChatGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.chatGroup = action.payload.data;
      })
      .addCase(getGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getChatList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChatList.fulfilled, (state, action) => {
        state.loading = false;
        state.chatGroups = action.payload.data;
      })
      .addCase(getChatList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getChatMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChatMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.chatMessages[action.meta.arg] = action.payload;
      })
      .addCase(getChatMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMembersList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMembersList.fulfilled, (state, action) => {
        state.loading = false;
        state.membersList = action.payload;
      })
      .addCase(getMembersList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addMemberToGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMemberToGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.membersList.members.push(action.payload.data);
      })
      .addCase(addMemberToGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getJoinRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.joinRequests = null;
      })
      .addCase(getJoinRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.joinRequests = action.payload.data
      })
      .addCase(getJoinRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendJoinRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendJoinRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(sendJoinRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteJoinRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJoinRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.joinRequests = (state.joinRequests.filter((req) => req.uid !== action.payload.data.requestId))
      })
      .addCase(deleteJoinRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMember.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.membersList.members = (state.membersList.members.filter((member) => member.uid !== action.payload.data.memberId))
      })
      .addCase(deleteMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.fileUrl = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.fileUrl = action.payload.data.file_url;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(clearAllMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearAllMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.chatMessages = [];
      })
      .addCase(clearAllMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default chatSlice.reducer;
export const {
  clearChatState,
  toggleAddGroup,
  setNewGroupName,
  addMemberToNewGroup,
  clearNewGroup,
  removeMemberFromNewGroup,
  setNewGroupType,
  setSelectedChat,
  setNewGroupDescription,
  toggleIsGroupSettingOpen,
} = chatSlice.actions;
