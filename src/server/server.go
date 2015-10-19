package main

import (
    "fmt" 
    "net/http"
    "encoding/json"
    "golang.org/x/net/websocket"
)

// Parse a json string into a hashmap
func parse(jsonStr string) (map[string]string) {
    obj := make(map[string]string)

    err := json.Unmarshal([]byte(jsonStr), &obj)
    if err != nil {
        panic(err)
    }

    return obj
}

// Simply print contents of a json map
func printJSON(json map[string]string) {
    for i := range json {
        fmt.Println(i, ":", json[i])
    }
}

// Start the sftp connection 
func sftpConnect(data string) {
    auth   := parse(data)
    client := getClient(auth)
    printRootDir(client)
}

// Map of functions to determine ui actions
var fxns = map[string]func(data string) {
    "sftpConnect"   : sftpConnect,
}

func handler(socket *websocket.Conn) {
    fmt.Println("- - - - - - - - - - - - - - - - - -")
    fmt.Println("Client has connected to the server!")

    // Read the message that a client was connected
    var msg = make([]byte, 512) 
    _, _ = socket.Read(msg)
    fmt.Println(string(msg))
	
    for {
	    // Receive the sftp auth information and store in a map
        data := make(map[string]string)
	    websocket.JSON.Receive(socket, &data)
	    if(len(data) != 0) {
	        fmt.Println("Received data from the client:")
            fxns[data["key"]](data["data"])
	    }
    }
}

func main() {
    http.Handle("/connect", websocket.Handler(handler))
    http.Handle("/", http.FileServer(http.Dir("../../")))
    http.ListenAndServe("localhost:1337", nil)
}
