import React from 'react';

import { parseCSVFile } from './utils';
import { Portfolio } from './types';
import Dashboard from './Dashboard';
import FileUploader from './FileUploader';

const App: React.FC = () => {
  // State
  const [portfolio, setPortfolio] = React.useState<Portfolio>();
  console.log(portfolio);

  const onFileSubmit = (files: FileList) => {
    for (let i=0; i<files.length; i++) {
      const file = files[i];
      parseCSVFile(
        file,
        (data: any[]) => {
          setPortfolio((portfolio?: Portfolio) => {
            if (portfolio) {
              portfolio.appendData(data);
              return portfolio;
            } else {
              return new Portfolio(data);
            }
          })
        }
      );
    }
  }

  if (portfolio) {
    return <Dashboard portfolio={portfolio} />
  } else {
    return <FileUploader onSubmit={onFileSubmit}/>
  }
}

export default App;