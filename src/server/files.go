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
func GetHomeEnv(id int) string {
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

// Print the target directory's file listing
func SendFileList(id int, dirpath string) {
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

func MoveDirectory(from, to string, id int) {

	// target := path.Join(to, path.Base(from))
	// session, err := conns[dest].sshClient.NewSession()
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// session.Run("sh -c `mkdir " + target + " && cd " + target + "`")
	// session.Close()

}

// TransferDirectory moves named directory from src -> dest
func TransferDirectory(from, to string, src, dest int) {

	target := path.Join(to, path.Base(from))
	backslashedTarget := strings.Replace(target, " ", "\\ ", -1)
	session, err := conns[dest].sshClient.NewSession()
	if err != nil {
		log.Fatal(err)
	}
	session.Run("sh -c `mkdir " + backslashedTarget + " && cd " + backslashedTarget + "`")
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
			fmt.Println("└── \tTransferring directory ", file.Name(), "to", destination)
			TransferDirectory(destination, target, src, dest)
		} else {
			fmt.Println("└── \tTransferring file", file.Name(), "to", destination)
			TransferFile(destination, target, src, dest)
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

// TransferFile moves named file from src -> dest
func TransferFile(from, to string, src, dest int) {
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
