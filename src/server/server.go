package main

import (
    // "os"
    "fmt" 
    "net/http"
    // "encoding/json"
    // "github.com/pkg/sftp"
    "github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader {
    ReadBufferSize: 1024,
    WriteBufferSize: 1024,
}

func printBinary(s []byte) {
    fmt.Printf("Received:")
    for i := 0; i < len(s); i++ {
        fmt.Println("%d,", s[i])
    }
    fmt.Printf("\n")
}

func handler(w http.ResponseWriter, r *http.Request) {
    // Serve the index html file here
    fmt.Println("- - - - - - - - - - - - - - - - - -")
    fmt.Println("Client has connected to the server!")

    // Upgrade the http server connection to the websocket protocol
    // (Implement the request origin check later) 
    // ^ FOLLOW THE SAME ORIGIN POLICY
    socket, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        fmt.Println("Error establishing a websocket with the http session:", err)
        return
    }

    for {
        // Listen for messages from the client
        messageType, p, err := socket.ReadMessage()
        if err != nil { return }

        // Print out the message
        printBinary(p)

        // Write a message to the client
        err = socket.WriteMessage(messageType, p)
        if err != nil { return }
    }
}

func main() {
    http.HandleFunc("/connect", handler)
    http.Handle("/", http.FileServer(http.Dir("../../")))
    http.ListenAndServe(":1337", nil)
}
