package main 

import (
    "fmt"
    "log"
    "github.com/pkg/sftp"
    "golang.org/x/crypto/ssh"
)

// Create the client configuration/authentication object necessary for ssh
func createConfig(user string, pw string) (*ssh.ClientConfig) {
    // To-do: rsa key authentication 
    config := &ssh.ClientConfig{
        User: user,
        Auth: []ssh.AuthMethod {
            ssh.Password(pw),
        },
    }
    return config
}

func getClient(auth map[string]string) (*sftp.Client) {
    // Configure credentials and dial up for a tcp connection to a remote machine
    config := createConfig(auth["username"], auth["password"])
    connection, err := ssh.Dial("tcp", auth["hostname"] + ":" + auth["port"], config)
    if err != nil {
        fmt.Println("Error connecting to ssh server at", auth["hostname"], err)
    } else {
        fmt.Println("└── Successfully connected to", auth["hostname"])
    }

    // Create the sftp client from the existing ssh connection
    client, err := sftp.NewClient(connection)
    // defer client.Close()

    if err != nil {
        fmt.Println("└── Successfully connected to", auth["hostname"])
    }

    return client
}

func printRootDir(client *sftp.Client) {
    // Print the root directory's file listing 
    files, err := client.ReadDir("/")
    if err != nil {
        log.Fatal(err)
    }
    for _, file := range files {
        fmt.Println(file.Name())
    }
}
