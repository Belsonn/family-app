import { FamilyUser } from './family.models';
export interface AuthResponse {
  status: string,
  token: string,
  expiresIn: Date,
  data: {
    familyUser: FamilyUser
  }
}
