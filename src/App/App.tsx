import React from 'react';

import Portfolio from './portfolio';
import { portfolioFromFile } from './portfolio';
import Dashboard from './dashboard';
import FileUploader from './FileUploader';

const App: React.FC = () => {
  // State
  const [portfolio, setPortfolio] = React.useState<Portfolio>();
  console.log(portfolio);

  const uploadPortfolioFromFiles = async (files: FileList) => {
    if (files.length > 1) {
      throw new Error('Can only upload a single file for a portfolio.');
    }
    const portfolio = await portfolioFromFile(files[0])
    setPortfolio(portfolio);
  }

  if (portfolio) {
    return <Dashboard portfolio={portfolio} />
  } else {
    return <FileUploader onSubmit={uploadPortfolioFromFiles}/>
  }
}

export default App;