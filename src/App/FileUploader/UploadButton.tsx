import React from 'react';

type UploadButtonProps = {
  onSubmit: (files: FileList) => any,
  accept?: string, 
}

export const UploadButton: React.FC<UploadButtonProps> = (props) => {

  const inputRef = React.createRef<HTMLInputElement>();
  
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (inputRef.current?.files && inputRef.current?.files?.length > 0) {
      // if (inputRef.current.files.length > 1) {
      //   alert("Please submit 1 file.")
      //   return;
      // }
      props.onSubmit(inputRef.current?.files);
    };
  }

  return (
    <div className="UploadButton">
    <form onSubmit={onSubmit}>
        <label>
          Upload file:
          <input type="file" ref={inputRef} multiple
            accept={props.accept} 
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
