import api from "../../api/axios"

const chatApiCalls = {
    getGroup: async (groupId) => {
        return api.get(`/chat/group/?group=${groupId}`)
    },
    createChatGroup: async (formData) => {
        return await api.post('/chat/group/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },
    updateChatGroup: async (formData) => {
        return await api.patch('/chat/group/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
    },
    deleteGroup: async (groupId) => {
        return await api.delete(`/chat/group?=${groupId}`)
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
    removeMemberFromGroup: async (groupId, memberId) => {
        return await api.delete(`chat/members/?group=${groupId}&member=${memberId}`)
    },
    updateMemberRole: async (groupId, memberId, newRole) => {
        return await api.patch('chat/members/', { groupId, memberId, newRole })
    },
    deleteMessage: async (messageId) => {
        return await api.delete(`chat/message/delete/${messageId}/`)
    },
    getJoinRequests: async(groupId) => {
        return await api.get(`chat/join-requests/?group=${groupId}`)
    },
    sendJoinRequest: async(groupId) => {
        return await api.post('chat/join-requests/', {groupId})
    },
    deleteJoinRequests: async(requestId=null, deleteAll=false, groupId=null) => {
        return await api.delete(`chat/join-requests/?requestId=${requestId}&deleteAll=${deleteAll}&groupId=${groupId}`)
    },
    fileUpload: async (formData) => {
        return await api.post('/chat/file-upload/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },
    clearAllMessages: async (groupId) => {
        return await api.delete(`/chat/clear-all-messages/?group=${groupId}`)
    }
}

export default chatApiCalls;
