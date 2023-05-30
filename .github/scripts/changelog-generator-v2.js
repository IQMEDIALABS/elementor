import { Octokit } from "octokit";

const octokit = new Octokit({ auth: `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` });

const { baseBranch, headTag, filters } = process.env;
const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

// Fetch release details
const release = await octokit.rest.repos.getReleaseByTag({
    owner,
    repo,
    tag: headTag,
});

const releaseDate = new Date(release.data.created_at);

// Fetch all pull requests with pagination
const pullRequests = await octokit.paginate(octokit.rest.pulls.list, {
    owner,
    repo,
    per_page: 100,
    sort: 'updated',
    direction: 'desc',
    state: 'closed',
    base: base,
});

// Filter pull requests merged after the release
const pullRequestsAfterRelease = pullRequests.filter(pr => {
    if (pr.merged_at === null) return false;
    const prMergeDate = new Date(pr.merged_at);
    if (pr.base.ref === base && prMergeDate > releaseDate)  {
      return true;
    }
});

let newPullRequestsFilterd = results
.map((pullRequest) => ({
  title: pullRequest.title,
  url: pullRequest.html_url,
}));

if (filters.length > 0) {
newPullRequestsFilterd = newPullRequestsFilterd.filter((pullRequest) => {
  return !filters.some((filter) => pullRequest.title.includes(filter));
});
}

console.table(newPullRequestsFilterd);