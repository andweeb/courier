package main

import (
    // "os"
    "io"
    "fmt" 
    "net/http"
    // "io/ioutil"
    // "encoding/json"
    // "github.com/pkg/sftp"
    "golang.org/x/net/websocket"
)

func printBinary(s []byte) {
    fmt.Printf("Received:")
    for i := 0; i < len(s); i++ {
        fmt.Printf("%d,", s[i])
    }
    fmt.Printf("\n")
}

func handler(socket *websocket.Conn) {
    fmt.Println("- - - - - - - - - - - - - - - - - -")
    fmt.Println("Client has connected to the server!")

    io.Copy(socket, socket)
}

func main() {
//    http.HandleFunc("/connect", handler)
    http.Handle("/connect", websocket.Handler(handler))
    http.Handle("/", http.FileServer(http.Dir("../../")))
    http.ListenAndServe("localhost:1337", nil)
}
