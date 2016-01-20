package main

import (
	"bytes"
	"fmt"
	"net/http"
	"os"

	"golang.org/x/net/websocket"
)

var socket *websocket.Conn

// Start the sftp connection with the received JSON credentials
func sftpConnect(id int, data map[string]string) {
	if initClients(id, data) {
		printDirectory(id, getHomeDir(id))
	}
}

func fetchFiles(id int, data map[string]string) {
	fmt.Println("--> fetching files")
	printDirectory(id, data["path"])
}

// Map of functions to determine ui actions
var fxns = map[string]func(id int, data map[string]string){
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
			connId := json.ConnId

			go fxns[json.Function](connId, json.Data)
		}
	}
}

func main() {
	hostname := os.Getenv("hostname")
	if hostname == "" {
		hostname = "localhost"
	}
	hostname += ":1337"

	fmt.Println("🌎  Started a server at", hostname)
	http.Handle("/connect", websocket.Handler(handler))
	http.Handle("/", http.FileServer(http.Dir("../")))
	http.ListenAndServe(hostname, nil)
}
