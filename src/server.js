
// READ CONFIGURATION FILE

var config = require('./config')

function demand(name)
{
	if (name in config)
	{
		return config[name]
	}
	console.error('Need `' + name + '` in config.json')
	process.exit(1)
}

var PORT = demand('port')
var TOKEN = demand('token')
var SECRET = demand('secret')
var COMMENT_LIMIT = demand('commentLimit')

// LISTEN FOR EVENTS
var doNothing = function () {}

var server = require('githubhook')({
	port: PORT,
	secret: SECRET,
	logger: (process.env.NODE_ENV === 'production')
    ? { log: doNothing, error: doNothing }
    : console
});

server.listen(function () {
  console.log(`Ready!`)
});

server.on('*', function (event, repo, ref, data) {
	try
	{
    if (data.action === 'opened') {
		  commentOnOpenedIssue(data)
    } else if (event === 'issue_comment' &&
      data.action === 'created' &&
      data.issue.comments === COMMENT_LIMIT) {
      commentOnTooManyComments(data)
    }
	}
	catch(e) {}
})


// SETUP GITHUB

var Client = require('github')
var github = new Client({ debug: (process.env.NODE_ENV !== 'production') })

github.authenticate({
    type: 'token',
    token: TOKEN
})


// COMMENT ON ISSUES

function commentOnOpenedIssue(event)
{
  // https://mikedeboer.github.io/node-github/#api-issues-createComment
	github.issues.createComment({
		owner: event.repository.owner.login,
		repo: event.repository.name,
		number: (event.issue || event.pull_request).number,
		body: typeof event.issue !== 'undefined'
			? makeOpenedIssueMessage('issue', 'issues')
			: makeOpenedIssueMessage('pull request', 'pulls')
	})
}

function commentOnTooManyComments (event) {
  github.issues.createComment({
    owner: event.repository.owner.login,
    repo: event.repository.name,
    number: (event.issue || event.pull_request).number,
    body: makeTooManyPostsMessage()
  })
}

function makeOpenedIssueMessage(noun, path)
{
	return [
		'Thanks for the ' + noun + '! Make sure it satisfies [this checklist][checklist]. My human colleagues will appreciate it!',
		'',
		'Here is [what to expect next][expectations], and if anyone wants to comment, keep [these things][participation] in mind.',
		'',
		'[checklist]: https://github.com/process-bot/contribution-checklist/blob/master/' + path + '.md',
		'[expectations]: https://github.com/process-bot/contribution-checklist/blob/master/expectations.md',
		'[participation]: https://github.com/process-bot/contribution-checklist/blob/master/participation.md'
	].join('\n')
}

function makeTooManyPostsMessage()
{
  return [
    `__Wow, that's a lot of comments!__`,
    '',
    `It looks like it's time to: `,
    `1. Close this issue and summarize the state of affairs in a new issue.`,
    `2. Move this discussion somewhere else until it can be made more clear.`,
    `3. Keep talking in this closed thread until you decide to do 1 or 2.`
  ].join('\n')
}

function makeContibutorAgreementMessage()
{
  return [
    'Thanks for the pull request!',
    '',
    'Please take a look at the next steps on [how to proceed][agreements].',
    '[agreements]: https://github.com/process-bot/contribution-checklist/blob/master/agreements.md'
  ].join('\n')
}
