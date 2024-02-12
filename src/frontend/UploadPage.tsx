import React from 'react';

type UploadPageProps = {
  onSubmit: (file: File) => void;
}

function UploadPage(props: UploadPageProps) {

  const inputRef = React.createRef<HTMLInputElement>();
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const inputFile = inputRef.current?.files?.[0];
    if (inputFile === undefined) {
      return;
    }
    console.log(`Submitting form for file: ${inputFile.name}`);
    props.onSubmit(inputFile);
  }

  return (
    <div className="UploadPage">
    <form onSubmit={handleSubmit}>
        <label>
          Upload file:
          <input type="file" ref={inputRef} />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default UploadPage;
