import { createSlice } from "@reduxjs/toolkit";
import { createChatGroup, getChatList, getChatMessages, addMemberToGroup, getMembersList} from "./chatServices";

const initialState = {
  chatGroups: [],
  chatMessages: {},
  loading: false,
  error: null,
  membersList: {},
  addGroup: false,
  newGroup: {
    name: '',
    members: [],
    type: 'private'
  }
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
        name: '',
        members: [],
        type: 'private'
      };
    },
    toggleAddGroup: (state) => {
      state.addGroup = !state.addGroup;
    },
    setNewGroupName: (state, action) => {
      state.newGroup.name = action.payload;
    },
    setNewGroupType: (state, action) => {
      state.newGroup.type = action.payload;
    },
    addMemberToNewGroup: (state, action) => {
      state.newGroup.members.push(action.payload);
    },
    removeMemberFromNewGroup: (state, action) => {
      state.newGroup.members = state.newGroup.members.filter(member => member.id !== action.payload.id);
    },
    clearNewGroup: (state) => {
      state.newGroup = {
        profile: null,
        name: '',
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
        state.chatGroups.push(action.payload);
      })
      .addCase(createChatGroup.rejected, (state, action) => {
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
        const { groupId, memberId } = action.payload;
        if (state.chatGroups[groupId]) {
          state.chatGroups[groupId].members.push(memberId);
        }
      })
      .addCase(addMemberToGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default chatSlice.reducer;
export const { clearChatState, toggleAddGroup, setNewGroupName, addMemberToNewGroup, clearNewGroup, removeMemberFromNewGroup, setNewGroupType } = chatSlice.actions;
