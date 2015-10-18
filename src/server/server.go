package main

import (
    "fmt" 
    "net/http"
    "encoding/json"
    "golang.org/x/net/websocket"
)

type UserInfo struct {
    Hostname string
    Port     int
    Username string
    Password string
}

func handler(socket *websocket.Conn) {
    fmt.Println("- - - - - - - - - - - - - - - - - -")
    fmt.Println("Client has connected to the server!")

    var msg = make([]byte, 512) 
    _, _ = socket.Read(msg)
    fmt.Println(string(msg))

    var data = make([]byte, 512) 
    _, _ = socket.Read(data)
    var auth UserInfo
    err := json.Unmarshal(data, auth)
    if err != nil {
        fmt.Println("Error decoding json: ", err)
    }
}

func main() {
    http.Handle("/connect", websocket.Handler(handler))
    http.Handle("/", http.FileServer(http.Dir("../../")))
    http.ListenAndServe("localhost:1337", nil)
}
