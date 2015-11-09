package main 

import (
    "fmt"
    "encoding/json"
)

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
