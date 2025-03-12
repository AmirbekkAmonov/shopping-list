import API from "@/services/api";
import { useQuery } from "@tanstack/react-query";

const searchGroup = async (searchText) => {
  if (!searchText || searchText.length < 2) return []; 
  const { data } = await API.get(`/groups/search?q=${searchText}`); 
  return data; 
}

const searchMember = async (searchText) => {
  if (!searchText || searchText.length < 2) return [];
  const { data } = await API.get(`/users/search?q=${searchText}`);
  return data;
}

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

export { useGroups, useMember };