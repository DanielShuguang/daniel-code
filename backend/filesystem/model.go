package filesystem

type DirTree struct {
	Name     string     `json:"name"`
	Path     string     `json:"path"`
	IsDir    bool       `json:"isDir"`
	Type     string     `json:"type"`
	Children []*DirTree `json:"children,omitempty"`
}

type FileContentResult struct {
	Content      string `json:"content,omitempty"`
	ErrorMessage string `json:"errorMessage,omitempty"`
	IsBinary     bool   `json:"isBinary"`
}

type FileDetails struct {
	Name     string `json:"name"`
	Path     string `json:"path"`
	Content  string `json:"content"`
	Err      string `json:"err,omitempty"`
	IsBinary bool   `json:"isBinary"`
	Type     string `json:"type,omitempty"`
}
