import { firestore } from 'firebase-admin';
import { DocumentData } from '../../../client/firebase-admin';

// Dashboard mappers/models
import { GitHubEventModel, GitHubEventType } from '../event.mapper';
import { GitHubPayloadInput, GitHubPayloadMapper } from '../payload.mapper';
import { GitHubPullRequestModel } from '../pullRequest.mapper';
import { GitHubRepositoryMapper } from '../repository.mapper';
import { GitHubUserMapper } from '../user.mapper';
import { Logger } from './../../../client/logger';
import { isExistProperties, HubEventActions, Repository, User } from './shared';


interface InfoRepoObj {
  label: string;
  ref: string;
  sha: string;
  user: User;
  repo: Repository;
}

interface LinkObj {
  href: string;
}

interface Links {
  self: LinkObj;
  html: LinkObj;
  issue: LinkObj;
  comments: LinkObj;
  review_comments: LinkObj;
  review_comment: LinkObj;
  commits: LinkObj;
  statuses: LinkObj;
}

export interface PullRequest {
  url: string;
  id: string;
  node_id: string;
  html_url: string;
  diff_url: string;
  patch_url: string;
  issue_url: string;
  number: number;
  state: string;
  locked: boolean;
  title: string;
  user: User;
  body: string;
  created_at: string;
  updated_at: string;
  closed_at?: any;
  merged_at?: any;
  merge_commit_sha?: any;
  assignee?: any;
  assignees: any[];
  requested_reviewers: any[];
  requested_teams: any[];
  labels: any[];
  milestone?: any;
  commits_url: string;
  review_comments_url: string;
  review_comment_url: string;
  comments_url: string;
  statuses_url: string;
  head: InfoRepoObj;
  base: InfoRepoObj;
  _links: Links;
  author_association: string;
  draft: boolean;
  merged: boolean;
  mergeable?: any;
  rebaseable?: any;
  mergeable_state: string;
  merged_by?: any;
  comments: number;
  review_comments: number;
  maintainer_can_modify: boolean;
  commits: number;
  additions: number;
  deletions: number;
  changed_files: number;
}

type Action = 'assigned' | 'unassigned' | 'review_requested' | 'review_request_removed' | 'labeled' | 'unlabeled' | 'opened' | 'edited' | 'closed' | 'ready_for_review' | 'locked' | 'unlocked' | 'reopened' | 'synchronize';

export interface PullRequestEventInput {
  action: Action;
  number: number;
  pull_request: PullRequest;
  repository: Repository;
  sender: User;
}

export class PullRequestEventModel implements PullRequestEventInput, HubEventActions {
  action: Action;
  number: number;
  pull_request: PullRequest;
  repository: Repository;
  sender: User;

  constructor(input: PullRequestEventInput) {
    Object.assign(this, input);
  }

  public static isCurrentModel(input: any): boolean {
    const requireKeys: string[] = ['action', 'number', 'pull_request', 'repository', 'sender'];
    return isExistProperties(input, requireKeys);
  }

  convertToHubEvent(): GitHubEventModel {
    const eventType: GitHubEventType = 'PullRequestEvent';
    const payload: GitHubPayloadInput = {
      action: this.action,
      pull_request: this.pull_request,
    };

    const data: GitHubEventModel = {
      type: eventType,
      public: true, // TODO where get
      actor: GitHubUserMapper.import(this.sender),
      repository: GitHubRepositoryMapper.import(this.repository, 'event'),
      payload: GitHubPayloadMapper.import(eventType, payload),
      createdOn: firestore.Timestamp.now(),
    };

    return data;
  }

  updateData(repository: DocumentData): void {

    if (!Array.isArray(repository.pullRequests)) {
      repository.pullRequests = [];
    }

    switch (this.action) {
      case 'opened': {
        this.opened(repository);
        break;
      }
      case 'closed': {
        this.closed(repository);
        break;
      }
      case 'synchronize':
      case 'assigned':
      case 'unassigned':
      case 'review_requested':
      case 'review_request_removed':
      case 'labeled':
      case 'unlabeled':
      case 'ready_for_review':
      case 'locked':
      case 'unlocked':
      case 'reopened':
      case 'edited': {
        this.edited(repository);
        break;
      }
      default: {
        Logger.info('ACTION: ', this.action);
        throw new Error('Not found action');
      }
    }

  }

  private getModel(): GitHubPullRequestModel {
    return {
      uid: this.pull_request.id,
      url: this.pull_request.html_url,
      state: this.pull_request.state,
      title: this.pull_request.title,
      description: this.pull_request.body,
      id: this.pull_request.number,
      owner: GitHubUserMapper.import(this.pull_request.user),
      assignees: this.pull_request.assignees.map((assignee: User) => GitHubUserMapper.import(assignee)),
      reviewers: this.pull_request.requested_reviewers.map((reviewer: User) => GitHubUserMapper.import(reviewer)),
      statusesUrl: this.pull_request.statuses_url,
      createdOn: firestore.Timestamp.fromDate(new Date(this.pull_request.created_at)),
      updatedOn: firestore.Timestamp.fromDate(new Date(this.pull_request.updated_at)),
      comments: this.pull_request.comments,
      reviewComments: this.pull_request.review_comments,
      maintainerCanModify: this.pull_request.maintainer_can_modify,
      commits: this.pull_request.commits,
      additions: this.pull_request.additions,
      deletions: this.pull_request.deletions,
      changedFiles: this.pull_request.changed_files,
    }
  }

  private opened(repository: DocumentData): void {

    const pull_request: GitHubPullRequestModel = this.getModel();

    repository.pullRequests.unshift(pull_request);
  }


  private edited(repository: DocumentData): void {
    const foundIndex: number = repository.pullRequests.findIndex((elem: GitHubPullRequestModel) => elem.uid === this.pull_request.id);
    if (foundIndex > -1) {
      repository.pullRequests[foundIndex] = this.getModel();
    } else {
      this.opened(repository);
    }
  }


  private closed(repository: DocumentData): void {
    if (!Array.isArray(repository.pullRequests)) {
      return;
    }
    repository.pullRequests = repository.pullRequests.filter((item: GitHubPullRequestModel) => item.uid !== this.pull_request.id);
  }

}
