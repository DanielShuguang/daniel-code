package core

type StringResult struct {
	Data string `json:"data"`
	Err  string `json:"err,omitempty"`
}
