package main

import (
	"bytes"
	"fmt"
	"net/http"
	"os"
	"strconv"

	"golang.org/x/net/websocket"
)

var socket *websocket.Conn

// Start the sftp connection with the received JSON credentials
func sftpConnect(id int, data string) {
	auth := parse(data)
	if initClients(id, auth) {
		printDirectory(id, getHomeDir(id))
	}
}

func fetchFiles(id int, data string) {
	fmt.Println("--> fetching files")
	printDirectory(id, data)
}

// Map of functions to determine ui actions
var fxns = map[string]func(id int, data string){
	"LOGIN_REQUEST":       sftpConnect,
	"FETCH_FILES_REQUEST": fetchFiles,
}

// Main handler upon client web connection to the server
func handler(sock *websocket.Conn) {
	fmt.Println("- - - - - - - - - - - - - - - - - -")
	fmt.Println("Client has connected to the server!")

	socket = sock

	// Read the initial message upon client connection
	var msg = make([]byte, 512)
	_, _ = socket.Read(msg)
	fmt.Println(string(msg))

	for {
		// Receive the sftp auth information and store in a map
		var data = make([]byte, 512)
		_, _ = socket.Read(data)
		if len(data) != 0 {
			fmt.Println("Received data from the client:")
			n := bytes.Index(data, []byte{0})
			json := parse(string(data[:n]))
			connId, _ := strconv.Atoi(json["id"])
			go fxns[json["type"]](connId, json["data"])
		}
	}
}

func main() {
	hostname := os.Getenv("hostname")
	if hostname == "" {
		hostname = "localhost"
	}

	http.Handle("/connect", websocket.Handler(handler))
	http.Handle("/", http.FileServer(http.Dir("../")))
	http.ListenAndServe(hostname+":1337", nil)
}
