/*
type FileInfo interface {
    Name() string       // base name of the file
    Size() int64        // length in bytes for regular files; 
    Mode() FileMode     // file mode bits
    ModTime() time.Time // modification time
    IsDir() bool        // abbreviation for Mode().IsDir()
    Sys() interface{}   // underlying data source (can return nil)
}
*/

package main 

import (
    "fmt"
    "log"
    "strings"
    "encoding/json"
    "github.com/pkg/sftp"
    "golang.org/x/crypto/ssh"
)

type Message struct {
    Function string `json:"fxn"`
    Data     string `json:"data"`
}

// Map of clients for each tcp connection
type clients struct {
    sshClient   *ssh.Client
    sftpClient  *sftp.Client
}
var conns = make(map[int]*clients)

// Create the client configuration/authentication object necessary for ssh
func createConfig(user string, pw string) (*ssh.ClientConfig) {
    config := &ssh.ClientConfig{
        User: user,
        Auth: []ssh.AuthMethod {
            ssh.Password(pw),
        },
    }
    return config
}

// Initialize the ssh and sftp connections with the given remote host info 
func initClients(auth map[string]string) (bool) {
    // Configure credentials and dial up for a tcp connection to a remote machine
    config := createConfig(auth["username"], auth["password"])
    connection, err := ssh.Dial("tcp", auth["hostname"] + ":" + auth["port"], config)

    // Attempt to establish an ssh connection
    if err != nil {
        fmt.Println("└── Failed to establish an ssh connection to", 
                    auth["hostname"], ":", err)
        return false

    } else {
        fmt.Println("└── Successfully established an ssh connection to", 
                    auth["hostname"])
    }

    // Save clients with the existing ssh connection
    conns[0] = &clients{}
    conns[0].sshClient = connection
    conns[0].sftpClient, err = sftp.NewClient(connection)

    // Attempt to establish an sftp connection
    if err != nil {
        fmt.Println("└── Failed to establish an sftp connection to", 
                    auth["hostname"], ":", err)
        message := &Message {
            Function:   "sftp-fail",
            Data:       "{}\n",
        }
        jsonMsg, _ := json.Marshal(message)
        _, _ = socket.Write(jsonMsg)

        return false

    } else {
        fmt.Println("└── Successfully established an sftp connection to", 
                    auth["hostname"])
        message := &Message {
            Function:   "sftp-success",
            Data:       "{}\n",
        }
        jsonMsg, _ := json.Marshal(message)
        _, _ = socket.Write(jsonMsg)
        
        return true
    }
}

// Echos the $HOME env to find the home directory, returns root if err
func getHomeDir() (string) {
    // Create a new ssh session to access the remote host's $HOME env variable
    session, err := conns[0].sshClient.NewSession()
    if err != nil {
        fmt.Println("Error creating ssh session:", err)
        return "/" 
    }
    output, err := session.Output("echo $HOME")
    if err != nil {
        fmt.Println("Error finding home dir:", err)
        return "/"
    }
    return strings.TrimSpace(string(output))
}

// Print the root directory's file listing 
func printDirectory(dirpath string) {
    fmt.Println("Printing contents of", dirpath)
    files, err := conns[0].sftpClient.ReadDir(dirpath)
    if err != nil {
        log.Fatal(err)
    }
    for _, file := range files {
        fmt.Println(file.Name(), ":", file.Sys())
    }
}
