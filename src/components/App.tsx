import React from 'react';

import Portfolio, { parsePortfolioFromFiles } from '../portfolio';
import Dashboard from './dashboard';
import FileUploader from './FileUploader';

const App: React.FC = () => {
  // State
  const [portfolio, setPortfolio] = React.useState<Portfolio>();
  console.log(portfolio);
  console.log(portfolio?.value());

  const uploadPortfolioFromFiles = async (files: FileList) => {
    const portfolio = await parsePortfolioFromFiles(files)
    setPortfolio(portfolio);
  }

  if (portfolio) {
    return <Dashboard portfolio={portfolio} />
  } else {
    return <FileUploader onSubmit={uploadPortfolioFromFiles}/>
  }
}

export default App;