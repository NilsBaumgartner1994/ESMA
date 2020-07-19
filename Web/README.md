# SWOSY Webservice

## Setup

```
./setup.sh
```

## Quickstart

```
./start.sh
```

## Errors

Development Local Server

Error:
```
has been blocked by CORS policy: The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'.
```

Solution:
https://alfilatov.com/posts/run-chrome-without-cors/
```
OSX
open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security

Linux
google-chrome --disable-web-security

chromium-browser --disable-web-security --user-data-dir="[some directory here]"

Make sure to close all browser instances before running these commands!!!
```
