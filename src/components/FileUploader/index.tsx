import React from 'react';

import { UploadButton } from './UploadButton';

const _ACCEPT = ".csv,text/csv"

type FileUploaderProps = {
  onSubmit: (files: FileList) => any;
}

const FileUploader: React.FC<FileUploaderProps> = (props) => {
  return (
    <div className="FileUploader">
      <UploadButton onSubmit={props.onSubmit} accept={_ACCEPT}/>
    </div>
  );
}

export default FileUploader;
