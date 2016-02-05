package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"path"
	"strings"
	"time"
)

type File struct {
	Filename string
	Path     string
	Size     int64
	ModTime  time.Time
	IsDir    bool
}

type FileMessage struct {
	ConnId   int                    `json:"id"`
	Function string                 `json:"type"`
	Data     map[string]interface{} `json:"data"`
}

func FileStruct(file os.FileInfo, dir string) File {
	return File{
		Filename: file.Name(),
		Path:     path.Join(dir, file.Name()),
		ModTime:  file.ModTime(),
		IsDir:    file.IsDir(),
		Size:     file.Size(),
	}
}

// Echos the $HOME env to find the home directory, returns root if err
func getHomeDir(id int) string {
	// Create a new ssh session to access the remote host's $HOME env variable
	session, err := conns[id].sshClient.NewSession()
	defer session.Close()

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

func printFile(id int, filename, filepath string) {
	dest, err := os.Create(filename)
	if err != nil {
		fmt.Println(err)
	}

	src, err := conns[id].sftpClient.Open(path.Join(filepath, filename))
	info, err := src.Stat()
	contents := make([]byte, info.Size())

	src.Read(contents)
	dest.Write(contents)
	dest.Close()
}

// Print the target directory's file listing
func printDirectory(id int, dirpath string) {
	fmt.Println("Printing contents of", dirpath)

	listing, err := conns[id].sftpClient.ReadDir(dirpath)
	if err != nil {
		log.Fatal("Could not open directory : ", err)
	}

	files := make([]File, len(listing))
	for i, file := range listing {
		files[i] = FileStruct(file, dirpath)
	}

	data := make(map[string]interface{})
	data["files"] = files
	data["path"] = dirpath

	jsonMessage, _ := json.Marshal(FileMessage{id, "FETCH_FILES_SUCCESS", data})
	_, _ = socket.Write(jsonMessage)
}

// MoveDirectory moves named directory from src -> dest
func MoveDirectory(from, to string, src, dest int) {
	target := path.Join(to, path.Base(from))
	session, err := conns[dest].sshClient.NewSession()
	if err != nil {
		log.Fatal(err)
	}
	session.Run("sh -c `mkdir " + target + " && cd " + target + "`")
	session.Close()

	// Read contents of the directory
	files, err := conns[src].sftpClient.ReadDir(from)
	if err != nil {
		log.Println(err)
		session, err = conns[src].sshClient.NewSession()
		if err != nil {
			log.Fatal(err)
		}
		session.Run("cd ..")
		session.Close()
		return
	}

	// Copy each file in that directory
	for _, file := range files {
		destination := path.Join(from, file.Name())
		if file.IsDir() {
			MoveDirectory(destination, target, src, dest)
		} else {
			MoveFile(destination, target, src, dest)
		}
	}

	// Change back to parent directory
	session, err = conns[src].sshClient.NewSession()
	if err != nil {
		log.Fatal(err)
	}
	session.Run("cd ..")
	session.Close()
}

/// MoveFile moves named file from src -> dest
func MoveFile(from, to string, src, dest int) {
	file, err := conns[src].sftpClient.Open(from)
	if err != nil {
		log.Fatal(err)
	}

	contents, err := ioutil.ReadAll(file)
	file.Close()

	file, err = conns[dest].sftpClient.Create(path.Join(to, path.Base(from)))
	if err != nil {
		log.Fatal(err)
	}
	file.Write(contents)
	file.Close()
}
