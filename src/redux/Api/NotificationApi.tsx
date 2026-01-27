// groupApi.ts

import axiosInstance from "./axiosInstance";
import { Group, PaginatedResponse } from "../../types/api.types";

interface GroupInvitation extends Group {
  invited_at?: string;
  invited_by?: string;
}


export const getPendingGroupInvites = async (token: string) => {
  try {
    const response = await axiosInstance.get('/group/pending-invitations', {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    console.log('✅ Pending Invites:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching pending invites:', error);
    throw error;
  }
};


export const respondToGroupInvitation = async (
  token: string,
  groupId: string,
  accepted: boolean
): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await axiosInstance.put(
      'group/accept-invitation',
      {
        group_id: groupId,
        invitation_accepted: accepted ? 'yes' : 'no',
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    console.log(response , 'respondToGroupInvitation___________')
    return response.data;
  } catch (error: unknown) {
    console.error('Error responding to group invite:', error);
    throw error;
  }
};

// import { getPendingGroupInvites } from '@redux/Api/groupApi';
// import { useSelector } from 'react-redux';
// import { RootState } from '@redux/store';

// const token = useSelector((state: RootState) => state.auth.token);
// const [pendingInvites, setPendingInvites] = useState([]);

// useEffect(() => {
//   const fetchInvites = async () => {
//     try {
//       const data = await getPendingGroupInvites(token);
//       setPendingInvites(data.results); // or entire `data` if pagination needed
//     } catch (error) {
//       console.log('Error loading invites', error);
//     }
//   };

//   if (token) {
//     fetchInvites();
//   }
// }, [token]);
