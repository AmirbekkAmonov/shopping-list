import API from "@/services/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { message, Modal } from "antd";

// Guruhlarni qidirish (searchGroup) funksiyasi
const searchGroup = async (searchText) => {
  if (!searchText || searchText.length < 2) return []; 
  const { data } = await API.get(`/groups/search?q=${searchText}`); 
  return data; 
}

// A'zolarni qidirish (searchMember) funksiyasi
const searchMember = async (searchText) => {
  if (!searchText || searchText.length < 2) return [];
  const { data } = await API.get(`/users/search?q=${searchText}`);
  return data;
}

// Guruhga qo'shilish (joinGroup) funksiyasi
const joinGroup = async ({ groupId, password }) => {
  if (!groupId || !password) throw new Error("Group ID and password are required");
  const { data } = await API.post(`/groups/${groupId}/join`, { password });
  return data;
};

// Mening guruhlarimni olish (fetchMyGroups) funksiyasi
const fetchMyGroups = async () => {
  const { data } = await API.get("/groups"); 
  return data;
};

// Guruhni o'chirish (deleteGroup) funksiyasi
const deleteGroup = async (groupId) => {
  if (!groupId) throw new Error("Group ID is required");
  const { data } = await API.delete(`/groups/${groupId}`);
  return data;
};

// **useGroups** - Guruhlarni qidirish uchun 
const useGroups = (searchText) => {
  const {
    data: groups = [], 
    isLoading: isLoadingGroups,
    isError: isErrorGroups,
  } = useQuery({
    queryFn: () => searchGroup(searchText), 
    queryKey: searchText.length > 1 ? ["searchGroup", searchText] : ["searchGroup"], 
    enabled: searchText.length > 1, 
  });
  return { groups, isLoadingGroups, isErrorGroups };
}

// **useMember** - A'zolarni qidirish uchun 
const useMember = (searchText) =>{
    const {
        data: members = [], 
        isLoading: isLoadingMember,
        isError: isErrorMember,
      } = useQuery({
        queryFn: () => searchMember(searchText), 
        queryKey: searchText.length > 1 ? ["searchMember", searchText] : ["searchMember"], 
        enabled: searchText.length > 1, 
      });
      return { members, isLoadingMember, isErrorMember };
}

// **useJoinGroup** - Guruhga qo'shilish uchun 
const useJoinGroup = () => {
  return useMutation({
    mutationFn: joinGroup, 
  });
};

// **useMyGroups** - Mening guruhlarimni olish uchun 
const useMyGroups = () => {
  const {
    data: myGroups = [],
    isLoading: isLoadingMyGroups,
    refetch
  } = useQuery({
    queryFn: fetchMyGroups,
    queryKey: ["myGroups"],
  });

  return { myGroups, isLoadingMyGroups, refetch };
};

// **useDeleteGroup** - Guruhni o'chirish uchun 
const useDeleteGroup = () => {
  return useMutation({
    mutationFn: deleteGroup,
  });
};

// **useConfirmDeleteGroup** - Guruhni o'chirishni tasdiqlash uchun 
const useConfirmDeleteGroup = () => {
  const { refetch } = useMyGroups();
  const navigate = useNavigate();
  const { mutate } = useDeleteGroup();

  const confirmDeleteGroup = (groupId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this group?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        mutate(groupId, {
          onSuccess: () => {
            message.success("Group deleted successfully");
            refetch();
            navigate("/");
          },
          onError: (error) => {
            message.error(`Error deleting group: ${error.message}`);
          },
        });
      },
    });
  };
  return confirmDeleteGroup;
};

export { 
  useGroups, 
  useMember, 
  useJoinGroup, 
  useMyGroups, 
  useDeleteGroup, 
  useConfirmDeleteGroup 
};