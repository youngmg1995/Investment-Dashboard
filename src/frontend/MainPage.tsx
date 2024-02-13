import React from 'react';
import logo from './logo.svg'
import './MainPage.css';

type MainPageProps = {
  portfolio: any[];
}

function portfolio2String(portfolio: any[]): string {
  let s = "";
  for (const row of portfolio) {
    for (const key in row) {
      s += `${key}: ${row[key]} `
    }
    s += "\n";
  }
  return s;
}

export const MainPage: React.FC<MainPageProps> = (props) => {
  return (
    <div className="MainPage">
      <header className="MainPage-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Portfolio Data below.
        </a>
        <p>
          {portfolio2String(props.portfolio)}
        </p>
      </header>
    </div>
  );
};
