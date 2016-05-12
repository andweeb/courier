
# Courier
A visual abstraction of the Secure File Transfer Protocol ([SFTP](https://en.wikipedia.org/wiki/SSH_File_Transfer_Protocol)) to view, transfer, and traverse through files and directories between SSH-enabled remote servers on your web browser.

## Installing
Uses [Gulp](http://gulpjs.com) and [Browserify](http://browserify.org) to bundle the frontend and live-reload the [Go](https://golang.org) server.

- `npm install` 
- `npm start`
- Go to `http://localhost:1337`
###### A preinstall script automatically installs `gulp` globally and runs `go get . && go install .` Ensure that Go is installed correctly and the repository path is in your `$GOPATH`

A rough but functional prototype of Courier written in Node.js exists in the `old` branch.  <br /> Unfortunately only works in Chrome 😥.
Run the following commands:

- `git checkout old`
- `npm install` 
- `node app.js`
- Go to `http://localhost:1337` 

## Screencast
Here's a demo showing me transferring a couple files from my iPhone's filesystem (on the right) to one of the computers at the CSIF @ UC Davis (on the left).
![](https://raw.githubusercontent.com/askwon/courier/master/src/assets/images/demo.gif "ay waddup")


