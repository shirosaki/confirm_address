# Roundcube Confirm Address

This plugin aim to prevent sending an email to the wrong person.
Users are required to check each recipient addresses in a dialog before sending a message.
My domain and other domains are listed separately.

## Installation
To install, get the plugin with composer in your roundcube directory.

```
composer require shirosaki/confirm_address
```

## Usage
`$config['mail_domain']` is used as my domain by default.
`$config['confirm_address_my_domain']` is used as my domain if the setting exists.

When a user compose an email and click `Send` button, the confirm address dialog is opened.
If the user checks all recipient address, the user can send the email.

# License
`addressparser.js` is from https://github.com/nodemailer/nodemailer/.
Other code is MIT License.
