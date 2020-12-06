export interface FamilyUser {
    _id: string,
    name: string,
    family: string,
    gender: string,
    role: string,
    user: string,
}

export interface Family {
    users: [FamilyUser],
    _id: string,
    name: string,
    createdBy: string,
    createdAt: Date,
    inviteToken: string
}

export interface FamilyResponse {
    status: string,
    data: {
        family: Family
    }
}
export interface MeAndFamilyResponse {
    status: string,
    data: {
        familyUser: FamilyUser,
        family: Family
    }
}
export interface existsResponse {
    status: string;
    data: {
      exists: boolean;
      familyId: string;
    };
  }
  export interface createFamilyResponse {
    status: string;
    data: {
      family: Family
      user: string
    };
  }

  export interface FamilyUserResponse {
      status: string,
      data: {
          familyUser: FamilyUser
      }
  }