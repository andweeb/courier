package main

import (
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

// Map of functions to determine ui actions
var fxns = map[string]func(id int, data string){
	"LOGIN_REQUEST": sftpConnect,
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
		data := make(map[string]string)
		websocket.JSON.Receive(socket, &data)
		if len(data) != 0 {
			fmt.Println("Received data from the client:")
			connId, _ := strconv.Atoi(data["id"])
			go fxns[data["type"]](connId, data["data"])
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
