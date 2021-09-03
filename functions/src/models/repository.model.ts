// Third party modules
import { firestore } from "firebase-admin";

// Dashboard hub firebase functions models/mappers
import { DocumentData, DocumentReference, FirebaseAdmin, Query, QuerySnapshot, WriteResult } from "../client/firebase-admin";

export interface IWebhook {
  type: string;
  id: number;
  name: string;
  active: boolean;
  events: string[];
  config: {
    url: string;
    contentType?: 'form' | 'json';
    secret?: string;
    insecureSsl?: '0' | '1';
  };
  updatedAt: firestore.Timestamp;
  createdAt: firestore.Timestamp;
  url: string;
  testUrl: string;
  pingUrl: string;
  lastResponse: {
    code?: any;
    status: string;
    message?: any;
  };
}


export interface IRepository {
  id: number;
  fullName: string;
  uid?: string;
  webhook?: IWebhook;
  resetWebhook?: boolean;
}

export class RepositoryModel implements IRepository {
  id: number;
  fullName: string;
  uid?: string;
  webhook?: IWebhook;
  resetWebhook?: boolean;

  public static getRepositoryReference(uid: string): DocumentReference {
    return FirebaseAdmin.firestore().collection('repositories').doc(uid);
  }

  public static getRepositoryReferenceById(id: number): Query {
    return FirebaseAdmin.firestore().collection('repositories').where('id', '==', id).limit(1);
  }

  public static async getRepositoryById(id: number): Promise<DocumentData | null> {
    const repositoriesSnapshot: QuerySnapshot = await this.getRepositoryReferenceById(id).get();
    if (repositoriesSnapshot.empty) {
      return null;
    } else {
      return repositoriesSnapshot.docs.shift().data();
    }
  }

  public static async getRepositoryUidById(id: number): Promise<string | null> {
    const repositoriesSnapshot: QuerySnapshot = await this.getRepositoryReferenceById(id).get();
    if (repositoriesSnapshot.empty) {
      return null;
    } else {
      return repositoriesSnapshot.docs.shift().id;
    }
  }

  public static async saveRepository(repository: DocumentData): Promise<WriteResult> {
    return await FirebaseAdmin
      .firestore()
      .collection('repositories')
      .doc(repository.uid)
      .set(repository, { merge: true });
  }

}
