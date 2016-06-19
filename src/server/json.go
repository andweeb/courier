package main

import (
	"encoding/json"
	"fmt"
)

type Message struct {
	ConnId   string   `json:"id"`
	Function string   `json:"type"`
	Data     []string `json:"data"`
}

type ClientMessage struct {
	ConnId   string            `json:"id"`
	Function string            `json:"type"`
	Data     map[string]string `json:"data"`
}

// Parse a json string into a hashmap
func parse(jsonStr []byte) ClientMessage {
	message := ClientMessage{}

	err := json.Unmarshal([]byte(jsonStr), &message)
	if err != nil {
		panic(err)
	}

	return message
}

// Simply print contents of a json map
func printJSON(json map[string]string) {
	for i := range json {
		fmt.Println(i, ":", json[i])
	}
}

// Encode any variable amount of arguments into json
func jsonify(id string, fxn string, values ...string) []byte {
	// Create a struct to store the data
	message := &Message{
		ConnId:   id,
		Function: fxn,
		Data:     values,
	}

	jsonMessage, err := json.Marshal(message)
	if err != nil {
		fmt.Println("JSON Marshal error:", err)
	}

	return jsonMessage
}
