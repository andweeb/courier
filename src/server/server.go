package main

import (
	"bytes"
	"flag"
	"fmt"
	"net/http"

	"golang.org/x/net/websocket"
)

var counter int
var socket *websocket.Conn

// Start the sftp connection with the received JSON credentials
func handleLoginRequest(id string, data map[string]string) {
	if initClients(id, data) {
		SendFileList(id, GetHomeEnv(id))
	}
}

func handleFetchFilesRequest(id string, data map[string]string) {
	fmt.Println("└── Fetching files")
	SendFileList(id, data["path"])
}

func handleFileTransferRequest(id string, data map[string]string) {
	fmt.Println("└── Transferring file")
	srcId, _ := data["src"]
	destId, _ := data["dest"]

	fmt.Println(srcId, "--> to -->", destId)
	if srcId == destId {
		fmt.Println("Move file within same remote server here")
	} else {
		TransferFile(data["srcpath"], data["destpath"], srcId, destId)
	}
}

func handleDirectoryTransferRequest(id string, data map[string]string) {
	fmt.Println("└── Transferring directory")
	srcId, _ := data["src"]
	destId, _ := data["dest"]

	fmt.Println("Window", srcId, "-->", "Window", destId)
	fmt.Println(data["srcpath"], "-->", data["destpath"])
	if srcId == destId {
		fmt.Println("Move directory within same remote server here")
		// MoveDirectory(data["srcpath"], data["destpath"], srcId)
	} else {
		TransferDirectory(data["srcpath"], data["destpath"], srcId, destId)
	}
}

// Map of functions to determine ui actions
var handle = map[string]func(id string, data map[string]string){
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

var hostname = flag.String("hostname", "localhost", "Host for server")
var port = flag.Int("port", 1337, "Port for app to listen on")

func main() {
	flag.Parse()

	fmt.Println("🌎  Started a server at ", *hostname, ":", *port)
	http.Handle("/connect", websocket.Handler(handler))
	http.Handle("/", http.FileServer(http.Dir("../")))
	http.ListenAndServe(fmt.Sprintf("%s:%d", *hostname, *port), nil)
}
