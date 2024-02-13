import React from 'react';

import { parseCSVFile } from './file_parsing';
import { UploadButton } from './UploadButton';

const _ACCEPT = ".csv,text/csv"

type FileUploaderProps = {
  dataCallback: (data: any[]) => any;
}

export const FileUploader: React.FC<FileUploaderProps> = (props) => {
  
  const onSubmit = (files: FileList) => {
    for (let i=0; i<files.length; i++) {
      const file = files[i];
      parseCSVFile(file, props.dataCallback); 
    }
  }

  return (
    <div className="FileUploader">
      <UploadButton onSubmit={onSubmit} accept={_ACCEPT}/>
    </div>
  );
}
