import { firestore } from 'firebase-admin';

// Dashboard mappers/models
import { GitHubEventType } from './event.mapper';
import { GitHubOrganisationtInput, GitHubOrganisationMapper, GitHubOrganisationModel } from './organisation.mapper';
import { GitHubPayloadInput, GitHubPayloadMapper, GitHubPayloadModel } from './payload.mapper';
import { GitHubRepositoryInput, GitHubRepositoryMapper, GitHubRepositoryModel } from './repository.mapper';
import { GitHubUserInput, GitHubUserMapper, GitHubUserModel } from './user.mapper';

export type GitHubEventType = 'PullRequestEvent' | 'PullRequestReviewCommentEvent' | 'IssueCommentEvent' | 'CreateEvent' | 'ReleaseEvent' | 'WatchEvent' | 'PushEvent' | 'IssuesEvent';

export interface GitHubEventInput {
  id: string;
  type: GitHubEventType;
  public: boolean;
  actor: GitHubUserInput;
  repo: GitHubRepositoryInput;
  org: GitHubOrganisationtInput;
  payload: GitHubPayloadInput;
  created_at: string;
}

export interface GitHubEventModel {
  uid?: string;
  type: GitHubEventType;
  public: boolean;
  actor: GitHubUserModel;
  repository: GitHubRepositoryModel;
  organisation?: GitHubOrganisationModel;
  payload: GitHubPayloadModel;
  createdOn: firestore.Timestamp;
}

export class GitHubEventMapper {
  static import(input: GitHubEventInput): GitHubEventModel {
    const data: GitHubEventModel = {
      uid: input.id,
      type: input.type,
      public: input.public,
      actor: GitHubUserMapper.import(input.actor),
      repository: GitHubRepositoryMapper.import(input.repo, 'event'),
      payload: GitHubPayloadMapper.import(input.type, input.payload),
      createdOn: firestore.Timestamp.fromDate(new Date(input.created_at)),
    };

    if (input.org) {
      data.organisation = GitHubOrganisationMapper.import(input.org);
    }

    return data;
  }
}
