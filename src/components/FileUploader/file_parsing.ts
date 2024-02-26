import Papa, {ParseConfig, ParseResult} from 'papaparse';

// Default CSV file parsong config.
const DEFAULT_CSV_CONFIG: ParseConfig = {
    header: true,
    skipEmptyLines: true,
}

type CsvCallback = (data: any[]) => any;

export function parseCSVFile(csvFile: any, callback: CsvCallback): void {
    const config: ParseConfig = {
        ...DEFAULT_CSV_CONFIG,
        complete: (results: ParseResult<any>) => {
            callback(results.data);
        }
    }
    
    Papa.parse(csvFile, config);
}