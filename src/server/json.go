package main 

import (
    "fmt"
    "encoding/json"
)

type Message struct {
    ConnId   int      `json:"id"`
    Function string   `json:"fxn"`
    Data     []string `json:"data"`
}

// Parse a json string into a hashmap
func parse(jsonStr string) (map[string]string) {
    hashmap := make(map[string]string)

    err := json.Unmarshal([]byte(jsonStr), &hashmap)
    if err != nil {
        panic(err)
    }

    return hashmap
}

// Simply print contents of a json map
func printJSON(json map[string]string) {
    for i := range json {
        fmt.Println(i, ":", json[i])
    }
}

// Encode any variable amount of arguments into json
func jsonify(id int, fxn string, values ...string) ([]byte) {
    // Create a struct to store the data
    message := &Message {
        ConnId:     id,
        Function:    fxn,
        Data:   values,
    }

    jsonMessage, err := json.Marshal(message)
    if err != nil {
        fmt.Println("JSON Marshal error:", err)
    }

    return jsonMessage 
}
