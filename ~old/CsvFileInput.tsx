import React from 'react';

import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';

import Papa, {ParseConfig, ParseResult} from 'papaparse';

type CsvCallback = (data: any[]) => any;

function parseCSVFile(csv_file: any, callback: CsvCallback): void {
  const config: ParseConfig = {
    header: true,
    skipEmptyLines: true,
    complete: (results: ParseResult<any>) => {
      callback(results.data);
    }
  }
  
  Papa.parse(csv_file, config);
}


type CsvFileInputProps = {
  submitCallback: (csv_data: any[]) => any,
}

export const CsvFileInput: React.FC<CsvFileInputProps> = (props) => { 

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const value = event.target.value
  }
  
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
    <FormControl>
      <Input type='file' value={"hello"} onChange={onChange}/>
    </FormControl>
  );
};