import { DocumentData } from '../../../client/firebase-admin';

// Dashboard mappers/models
import { GitHubPullRequestModel } from '../pullRequest.mapper';
import { Logger } from './../../../client/logger';
import { PullRequest } from './pull-request';
import { isExistProperties, Repository, User } from './shared';

interface Comment {
  url: string;
  pull_request_review_id: string;
  id: string;
  node_id: number;
  diff_hunk: string;
  path: User;
  postition: string;
  original_position: string;
  commit_id: string;
  original_commit_id: string;
  user: User;
}

export type Action = 'created' | 'edited' | 'deleted';

export interface PullRequestReviewCommentEventInput {
  action: Action;
  comment: Comment;
  pull_request: PullRequest;
  repository: Repository;
  sender: User;
}

export class PullRequestReviewCommentEventModel implements PullRequestReviewCommentEventInput {
  action: Action;
  comment: Comment;
  pull_request: PullRequest;
  repository: Repository;
  sender: User;

  constructor(input: PullRequestReviewCommentEventInput) {
    Object.assign(this, input);
  }

  public static isCurrentModel(input: any): boolean {
    const requireKeys: string[] = ['action', 'comment', 'pull_request', 'repository', 'sender'];
    return isExistProperties(input, requireKeys);
  }

  updateData(repository: DocumentData): void {
    if (!Array.isArray(repository.pullRequests)) {
      repository.pullRequests = [];
    }

    switch (this.action) {
      case 'created':
          {
            this.updated(repository, 1);
            break;
          }
      case 'deleted':
          {
            this.updated(repository, -1);
            break;
          }
      
      default: {
        Logger.info('ACTION: ', this.action);
        throw new Error('Not found action');
      }
    }

  }

  private updated(repository: DocumentData, number: number): void {
    const foundIndex: number = repository.pullRequests.findIndex((elem: GitHubPullRequestModel) => elem.uid === this.pull_request.id);
    if (foundIndex > -1) {
      repository.pullRequests[foundIndex].reviewComments += number;
    }
  }
}
