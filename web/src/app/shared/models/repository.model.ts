
// Third party modules
import { firestore } from 'firebase';

// DashboardHub models
import { ContributorModel } from './contributor.model';
import { ProjectModel } from './index.model';
import { IssueModel } from './issue.model';
import { MilestoneModel } from './milestone.model';
import { IModel, Model } from './model.model';
import { PullRequestModel } from './pullRequest.model';
import { RatingModel } from './rating.model';
import { ReleaseModel } from './release.model';
import { WebhookModel } from './webhook.model';

export interface IRepository extends IModel {
  uid: string;
  id?: number;
  name?: string;
  description?: string;
  fullName?: string;
  owner?: string;
  ownerId?: string;
  private?: boolean;
  fork?: string;
  archived?: string;
  forks?: number;
  stargazers?: string;
  watchers?: number;
  branch?: string;
  license?: {
    name: string;
  };
  pullRequests?: PullRequestModel[];
  events?: Event[];
  releases?: ReleaseModel[];
  issues?: IssueModel[];
  contributors?: ContributorModel[];
  milestones?: MilestoneModel[];
  projects?: ProjectModel[];
  webhook?: WebhookModel;
  url?: string;
  forksCount?: number;
  stargazersCount?: number;
  watchersCount?: number;
  lastUpdated?: firestore.Timestamp;
  updatedAt?: firestore.Timestamp;
  resetWebhook?: boolean;
}

/**
 * Repository model
 */
export class RepositoryModel extends Model<IRepository> implements IRepository {
  uid: string;
  id: number;
  name: string;
  description?: string;
  fullName: string;
  owner: string;
  ownerId: string;
  private: boolean;
  fork: string;
  archived: string;
  forks: number;
  stargazers: string;
  watchers: number;
  branch: string;
  license?: {
    name: string;
  };
  pullRequests?: PullRequestModel[];
  projects?: ProjectModel[];
  events?: Event[];
  releases?: ReleaseModel[];
  issues?: IssueModel[];
  contributors: ContributorModel[];
  milestones: MilestoneModel[];
  webhook: WebhookModel;
  url?: string;
  forksCount: number;
  stargazersCount: number;
  watchersCount: number;
  lastUpdated: firestore.Timestamp;
  updatedAt: firestore.Timestamp;
  resetWebhook?: boolean;

  constructor(repository: IRepository) {
    super();
    this.uid = repository.uid;
    this.id = repository.id ? repository.id : undefined;
    this.name = repository.name ? repository.name : undefined;
    this.description = repository.description ? repository.description : undefined;
    this.fullName = repository.fullName ? repository.fullName : undefined;
    this.owner = repository.owner ? repository.owner : undefined;
    this.ownerId = repository.ownerId ? repository.ownerId : undefined;
    this.private = repository.private ? repository.private : undefined;
    this.fork = repository.fork ? repository.fork : undefined;
    this.stargazers = repository.stargazers ? repository.stargazers : undefined;
    this.watchers = repository.watchers ? repository.watchers : undefined;
    this.branch = repository.branch ? repository.branch : undefined;
    this.license = repository.license ? repository.license : undefined;
    this.pullRequests = repository.pullRequests ? repository.pullRequests : undefined;
    this.projects = repository.projects ? repository.projects : undefined;
    this.events = repository.events ? repository.events : undefined;
    this.releases = repository.releases ? repository.releases : undefined;
    this.issues = repository.issues ? repository.issues : undefined;
    this.contributors = repository.contributors ? repository.contributors : undefined;
    this.milestones = repository.milestones ? repository.milestones : undefined;
    this.webhook = repository.webhook ? repository.webhook : undefined;
    this.url = repository.url ? repository.url : undefined;
    this.forksCount = repository.forksCount ? repository.forksCount : undefined;
    this.stargazersCount = repository.stargazersCount ? repository.stargazersCount : undefined;
    this.lastUpdated = repository.lastUpdated ? repository.lastUpdated : undefined;
    this.updatedAt = repository.updatedAt ? repository.updatedAt : undefined;
    this.resetWebhook = repository.resetWebhook ? repository.resetWebhook : false;
  }

  public calculateRating(): number {
    const repoRatings: RatingModel[] = this.getRatings();
    const ratingValues: number[] = repoRatings.map((rating: RatingModel) => rating.value);

    return ratingValues.reduce((total: number, current: number) => total + current, 0) / repoRatings.length;
  }

  public getRatings(): RatingModel[] {
    const checks: RatingModel[] = [];

    checks.push({
      name: 'Issues',
      description: 'Keep issues up to date',
      value: this.issues && this.issues.length > 0 ? this.getPoints(this.issues[0].createdOn.toDate()) : 0,
    });
    checks.push({
      name: 'Releases',
      description: 'Mark key stages in your project with releases',
      value: this.releases && this.releases.length > 0 ? this.getPoints(this.releases[0].createdOn.toDate()) : 0,
    });
    checks.push({
      name: 'Milestones',
      description: 'Organise issues into milestones',
      value: this.milestones && this.milestones.length > 0 ? this.getPoints(this.milestones[0].updatedAt.toDate()) : 0,
    });
    checks.push({
      name: 'Url',
      description: 'Repository url is great way for people to easily find more information',
      value: this.url ? 100 : 0,
    });
    checks.push({
      name: 'Description',
      description: 'Repository',
      value: this.description ? 100 : 0,
    });
    checks.push({
      name: 'Forks',
      description: 'Encourage others to contribute to your repository and build your community',
      value: this.forksCount ? this.getPointsByCount(this.forksCount, 50) : 0,
    });
    checks.push({
      name: 'Stars',
      description: 'Encourage others to favourite your repository to watch the activity in their timeline',
      value: this.stargazersCount ? this.getPointsByCount(this.stargazersCount, 100) : 0,
    });
    checks.push({
      name: 'Watchers',
      description: 'Encourage others to watch your repository to get notified of events',
      value: this.watchersCount ? this.getPointsByCount(this.watchersCount, 25) : 0,
    });

    return checks.sort((a: RatingModel, b: RatingModel) => b.value - a.value);
  }

  public getPoints(date: Date): number {
    const boundary: number = 30; // days
    const currentDate: Date = new Date();
    const referenceDate: Date = new Date(date);
    let lapse: number = Math.floor((currentDate.getTime() - referenceDate.getTime()) / 1000);
    const hoursInDay: number = 24 * 60 * 60;
    const duration: number = Math.ceil(lapse / hoursInDay);

    if (duration > boundary) {
      return 0;
    }

    return ((boundary - duration) / 30) * 100; // percentage
  }

  public getPointsByCount(count: number, limit: number): number {
    let points: number;
    switch (true) {
      case (count >= 1 && count <= limit):
        points = 50;
        break;
      case (count > limit):
        points = 100;
        break;
      default:
        points = 0;
    }

    return points;
  }

  /**
   * The models to data only
   */
  public toData(): IRepository {
    return {
      uid: this.uid,
      id: this.id,
      name: this.name,
      description: this.description,
      fullName: this.fullName,
      owner: this.owner,
      ownerId: this.ownerId,
      private: this.private,
      fork: this.fork,
      archived: this.archived,
      forks: this.forks,
      stargazers: this.stargazers,
      watchers: this.watchers,
      branch: this.branch,
      license: this.license,
      pullRequests: this.pullRequests,
      events: this.events,
      releases: this.releases,
      issues: this.issues,
      contributors: this.contributors,
      milestones: this.milestones,
      webhook: this.webhook,
      url: this.url,
      forksCount: this.forksCount,
      stargazersCount: this.stargazersCount,
      watchersCount: this.watchersCount,
      lastUpdated: this.lastUpdated,
    };
  }
}
