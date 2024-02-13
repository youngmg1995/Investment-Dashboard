import React from 'react';
import './App.css';
import {FileUploader, MainPage} from './frontend';

type Portfolio = any[];

function App() {
  // App state.
  const [portfolio, setPortfolio] = React.useState<Portfolio>([]);

  // Additional properties determined by the App state.
  const showUploadPage = (portfolio.length === 0);
  if (showUploadPage) return (
    <FileUploader dataCallback={(data)=>{console.log(data);}}/>
  );

  return (
    <MainPage portfolio={portfolio}/>
  )
}

export default App;
