export interface existsResponse {
  status: string;
  data: {
    exists: boolean;
  };
}
export interface createFamilyResponse {
  status: string;
  data: {
    users: [string];
    _id: string;
    name: string;
    createdBy: string;
    createdAt: string;
    inviteToken: string;
  };
}
