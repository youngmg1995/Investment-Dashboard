import React from 'react';
import './App.css';
import MainPage from './frontend/MainPage';
import UploadPage from './frontend/UploadPage';
import {parseCSVFile} from './backend/utils'

type Portfolio = any[];

function App() {
  // App state.
  const [portfolio, setPortfolio] = React.useState<Portfolio>([]);

  const onInputFileSubmission = (f: File) => {
    // Check file is valid type, format, etc.
    // Callback once CSV data extracted.
    const parsingCallback = (data: any[]) => {
      setPortfolio(data);
    };
    // Parse file.
    parseCSVFile(f, parsingCallback);
  }

  // Additional properties determined by the App state.
  const showUploadPage = (portfolio.length === 0);
  if (showUploadPage) return (
    <UploadPage onSubmit={onInputFileSubmission}/>
  );

  return (
    <MainPage portfolio={portfolio}/>
  )
}

export default App;
