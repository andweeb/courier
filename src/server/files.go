package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"path"
	"strings"
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

func FileStruct(file os.FileInfo, dir string) File {
	return File{
		Filename: file.Name(),
		Path:     dir + "/" + file.Name(),
		ModTime:  file.ModTime(),
		IsDir:    file.IsDir(),
		Size:     file.Size(),
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
		files = append(files, FileStruct(file, dirpath))
	}

	jsonMessage, _ := json.Marshal(FileMessage{id, "FETCH_FILES_SUCCESS", files})
	_, _ = socket.Write(jsonMessage)
}

func (c *clients) putDirectory(filepath string) {
	fmt.Println("Putting directory ", filepath)
	session, _ := c.sshClient.NewSession()

	session.Run("sh -c `mkdir " + path.Base(filepath) + " && cd " + path.Base(filepath) + "`")
	session.Close()

	files, _ := ioutil.ReadDir(filepath)
	for _, file := range files {
		c.putFile(filepath + "/" + file.Name())
	}

	session, _ = c.sshClient.NewSession()
	session.Run("cmd ..")
	session.Close()
}

func (c *clients) getDirectory(filepath string) {
	fmt.Println("Fetching directory ", filepath)

	os.Mkdir(path.Base(filepath), os.ModeDir|os.ModePerm)
	os.Chdir(path.Base(filepath))

	files, err := c.sftpClient.ReadDir(filepath)
	if err != nil {
		fmt.Println(err)
		return
	}

	for _, file := range files {
		f := FileStruct(file, filepath)
		c.getFile(f)
	}

	os.Chdir("..")
}

// getFile copies the file specified to the local host
func (c *clients) getFile(file File) {
	fmt.Println("Fetching ", file.Filename)
	dest, err := os.Create(file.Filename)
	if err != nil {
		fmt.Println(err)
	}

	src, err := c.sftpClient.Open(file.Path)
	info, err := src.Stat()
	contents := make([]byte, info.Size())

	src.Read(contents)
	dest.Write(contents)
	dest.Close()
}

// putFile copies the file specified to the remote
func (c *clients) putFile(filename string) {
	src, _ := os.Open(filename)
	dest, _ := c.sftpClient.Create(filename)

	info, err := src.Stat()
	contents := make([]byte, info.Size())
	src.Read(contents)

	_, err = dest.Write(contents)
	if err != nil {
		fmt.Println("Problem writing file : ", err)
	}
}
