# Contribution Checklist

Creating great issues and pull requests is actually kind of tricky. Even folks who are super experienced forget important details sometimes! So whether you are opening your first issue or your hundreth, be sure to go through the relevant checklist:

  * [Issue Checklist](issues.md)
  * [Pull Request Checklist](pulls.md)

From there, it is important to know [what to expect](expectations.md) and [how to participate](participation.md).

Normally no one would ever find this repo, so a robot named [process-bot](https://github.com/process-bot) wanders around telling people about it.


### Local Setup

__Github Configuration__

- [Create a Personal Access Token](https://github.com/settings/tokens) for the bot user who will comment.
    - Should only have `public_repo` permissions.
- [Configure a Webhook](https://developer.github.com/webhooks/) for the repo that will receive issue comments.
    - Payload URL must end in `/github/callback`
        - (Example: `http://yoursite.com:3000/github/callback` )
    - Content Type: `application/json`
    - Only needs "__Issues__" and "__Issue comment__" events enabled


__NodeJS__

- Run __`npm install`__ to install project dependencies.
- Create a __`.env`__ file at the project root that has all your settings.
    - Example `.env` file:
    ```
    PORT=1234
    TOKEN=my-secretest-token
    SECRET=my-even-more-secreter-secret
    ```
- Run __`npm start`__
