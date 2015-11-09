package main

import (
    "os"
    "fmt"
    "log"
    "strings"
    "encoding/json"
)

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

// Echos the $HOME env to find the home directory, returns root if err
func getHomeDir(id int) (string) {
    // Create a new ssh session to access the remote host's $HOME env variable
    session, err := conns[id].sshClient.NewSession()
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


func FileStruct(file os.FileInfo) File {
    return File {
        Filename: file.Name(),
        ModTime: file.ModTime(),
        IsDir: file.IsDir(),
        Size: file.Size(),
    }
}

// Print the target directory's file listing 
func printDirectory(id int, dirpath string) {
    fmt.Println("Printing contents of", dirpath)
    listing, err := conns[id].sftpClient.ReadDir(dirpath)
    if err != nil {
        log.Fatal(err)
    }

    var files []File
    for _, file := range listing {
        files = append(files, FileStruct(file))
    }

    jsonMessage, _ := json.Marshal(FileMessage{id, "sftp-ls", files})
    _, _ = socket.Write(jsonMessage)
}
