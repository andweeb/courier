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

func printFile(id int, filename string, path string) {
	fmt.Println("Fetching ", filename)
	dest, err := os.Create(filename)
	if err != nil {
		fmt.Println(err)
	}

	src, err := conns[id].sftpClient.Open(path + "/" + filename)
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

	var files []File
	for _, file := range listing {
		files = append(files, FileStruct(file, dirpath))
	}

	// conns[id].putDirectory("./TestingDir", ".")

	data := make(map[string]interface{})
	data["files"] = files
	data["path"] = dirpath

	jsonMessage, _ := json.Marshal(FileMessage{id, "FETCH_FILES_SUCCESS", data})
	_, _ = socket.Write(jsonMessage)
}

func (c *clients) putDirectory(src, dest string) {
	fmt.Println("Putting directory ", src)

	session, _ := c.sshClient.NewSession()
	session.Run("mkdir " + path.Join(dest, path.Base(src)))
	session.Close()

	files, _ := ioutil.ReadDir(src)
	for _, file := range files {
		if file.IsDir() {
			c.putDirectory(path.Join(src, file.Name()), path.Join(dest, path.Base(src)))
		} else {
			c.putFile(path.Join(src, file.Name()), path.Join(dest, path.Base(src)))
		}
	}
}

func (c *clients) putFile(src, dest string) {
	srcFile, _ := os.Open(src)
	destFile, err := c.sftpClient.Create(path.Join(dest, path.Base(src)))
	if err != nil {
		fmt.Println(err)
		return
	}

	info, _ := srcFile.Stat()
	contents := make([]byte, info.Size())
	srcFile.Read(contents)

	_, err = destFile.Write(contents)
	if err != nil {
		fmt.Println("Problem writing file : ", err)
	}
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
		if f.IsDir {
			c.getDirectory(f.Path)
		} else {
			c.getFile(f)
		}
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
