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
func handleLoginRequest(id int, data map[string]string) {
	if initClients(id, data) {
		SendFileList(id, GetHomeEnv(id))
	}
}

func handleFetchFilesRequest(id int, data map[string]string) {
	fmt.Println("--> fetching files")
	SendFileList(id, data["path"])
}

func handleFileTransferRequest(id int, data map[string]string) {
	fmt.Println("--> transferring file")
	srcId, _ := strconv.Atoi(data["src"])
	destId, _ := strconv.Atoi(data["dest"])

	fmt.Println(srcId, "--> to -->", destId)
	if srcId == destId {
		fmt.Println("Move file within same remote server here")
	} else {
		TransferFile(data["srcpath"], data["destpath"], srcId, destId)
	}
}

func handleDirectoryTransferRequest(id int, data map[string]string) {
	fmt.Println("--> transferring directory")
	srcId, _ := strconv.Atoi(data["src"])
	destId, _ := strconv.Atoi(data["dest"])

	fmt.Println(srcId, "--> to -->", destId)
	if srcId == destId {
		fmt.Println("Move directory within same remote server here")
		// MoveDirectory(data["srcpath"], data["destpath"], srcId)
	} else {
		TransferDirectory(data["srcpath"], data["destpath"], srcId, destId)
	}
}

// Map of functions to determine ui actions
var handle = map[string]func(id int, data map[string]string){
	"LOGIN_REQUEST":              handleLoginRequest,
	"FETCH_FILES_REQUEST":        handleFetchFilesRequest,
	"FILE_TRANSFER_REQUEST":      handleFileTransferRequest,
	"DIRECTORY_TRANSFER_REQUEST": handleDirectoryTransferRequest,
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
			n := bytes.Index(data, []byte{0})

			fmt.Println("Received data from the client:")

			json := parse(string(data[:n]))
			request := json.Function
			connId := json.ConnId

			go handle[request](connId, json.Data)
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
