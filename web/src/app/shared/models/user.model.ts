/**
 * User model
 */
export class UserModel {
  uid: string = '';
  name: string;
  username: string;
  avatarUrl: string = '';
  url: string = '';
  following?: string[] = [];
  lastSignedIn: Date;
  creationTime: Date;
}
