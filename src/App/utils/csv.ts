import Papa, {ParseConfig, ParseResult} from 'papaparse';

type CsvCallback = (data: any[]) => any;

export function parseCSVFile(csv_file: any, callback: CsvCallback): void {
    const config: ParseConfig = {
        header: true,
        skipEmptyLines: true,
        complete: (results: ParseResult<any>) => {
            callback(results.data);
        }
    }
    
    Papa.parse(csv_file, config);
}