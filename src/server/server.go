package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"

	"golang.org/x/net/websocket"
)

var counter int

// Start the sftp connection with the received JSON credentials
func handleLoginRequest(id string, data map[string]string, s *websocket.Conn) {
	if initClients(id, data, s) {
		SendFileList(id, GetHomeEnv(id), s)
	}
}

func handleFetchFilesRequest(id string, data map[string]string, s *websocket.Conn) {
	fmt.Println("└── Fetching files")
	SendFileList(id, data["path"], s)
}

func handleFileTransferRequest(id string, data map[string]string, s *websocket.Conn) {
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

func handleDirectoryTransferRequest(id string, data map[string]string, s *websocket.Conn) {
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
var handle = map[string]func(id string, data map[string]string, s *websocket.Conn){
	"LOGIN_REQUEST":              handleLoginRequest,
	"FETCH_FILES_REQUEST":        handleFetchFilesRequest,
	"FILE_TRANSFER_REQUEST":      handleFileTransferRequest,
	"DIRECTORY_TRANSFER_REQUEST": handleDirectoryTransferRequest,
}

// Main handler upon client web connection to the server
func handler(sock *websocket.Conn) {
	fmt.Println("- - - - - - - - - - - - - - - - - -")
	fmt.Println("Client has connected to the server!")

	// Read the initial message upon client connection
	var msg = make([]byte, 512)
	_, err := sock.Read(msg)
	if err != nil {
		log.Println(err)
		return
	}

	for {
		// Receive the sftp auth information and store in a map
		n, err := sock.Read(msg)
		if err != nil {
			log.Println(err)
			return
		}

		fmt.Println("Received data from the client: ", string(msg[:n]))

		json := parse(msg[:n])
		go handle[json.Function](json.ConnId, json.Data, sock)
	}
}

func main() {
	hostname := flag.String("hostname", "localhost", "Host for server")
	port := flag.Int("port", 1337, "Port for app to listen on")

	flag.Parse()

	log.Println("🌎  Started a server at ", *hostname, ":", *port)
	http.Handle("/connect", websocket.Handler(handler))
	http.Handle("/", http.FileServer(http.Dir("../")))
	http.ListenAndServe(fmt.Sprintf("%s:%d", *hostname, *port), nil)
}
