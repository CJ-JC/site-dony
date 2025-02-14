import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Editor = ({ name, value, onChange }) => {
  const handleEditorChange = (content) => {
    onChange({ target: { name, value: content } });
  };

  return (
    <div className="max-h-[300px] overflow-auto">
      <ReactQuill value={value} onChange={handleEditorChange} />
    </div>
  );
};

export default Editor;
