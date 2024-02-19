import Papa, {ParseConfig, ParseResult} from 'papaparse';

export type csvRow = { [field: string]: string };

export function parseCSVFile(csv_file: any): Promise<csvRow[]> {
  return new Promise((resolve, reject) => {
    const config: ParseConfig = {
        header: true,
        skipEmptyLines: true,
        complete: (results: ParseResult<csvRow>) => {
            resolve(results.data);
        }
    }
    Papa.parse(csv_file, config);
  });
}