import api from "../../api/axios"

const chatApiCalls = {
    createChatGroup: async (formData) => {
        return await api.post('/chat/create-group/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },
    getChatList: async () => {
        return await api.get('/chat/list-groups/')
    },
    getChatMessages: async (groupId) => {
        return await api.get(`/chat/messages/?group=${groupId}`)
    },
    getMembersList: async (groupId) => {
        return await api.get(`/chat/members/?group=${groupId}`)
    },
    addMemberToGroup: async (groupId, memberId) => {
        return await api.post(`/chat/members/`, { groupId, memberId })
    },
}

export default chatApiCalls;
