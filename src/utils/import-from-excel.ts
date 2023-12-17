import dayjs from 'dayjs';
import * as XLSX from 'xlsx';

export interface ExcelImportOptions {
  headerRowIndex: number;
  dataRowIndexStart: number;
  dateColumns: string[]; // Specify column headers that contain date values
}

export const importFromExcel = async <T>(e: React.ChangeEvent<HTMLInputElement>, options: ExcelImportOptions): Promise<T[] | null> => {
  return new Promise<T[] | null>(resolve => {
    const file = e.target?.files?.[0];
    if (!file) {
      console.error('No file selected');
      resolve(null);
      return;
    }

    const reader = new FileReader();

    reader.onload = e => {
      const data = e.target?.result as string | ArrayBuffer | null;

      if (!data) {
        console.error('Failed to read data from the file');
        resolve(null);
        return;
      }

      try {
        const workbook = XLSX.read(data, {
          cellDates: true,
          type: 'binary',
        });

        const sheetName = workbook.SheetNames[0]; // Assuming you want the first sheet
        const sheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(sheet, {
          header: options.headerRowIndex - 1,
          raw: true, // Enable parsing of dates and formatting
        }) as Array<{ [key: string]: string | number | boolean | Date }>; // Specify the expected shape of your data

        // Filter out empty rows
        const filteredData = jsonData.filter(row => Object.values(row).some(Boolean));

        const headers: { [p: string]: string | number | boolean | Date } = filteredData[0];

        // Row data starts from options.dataRowIndexStart - 1 (data row index)
        const rowData = filteredData.slice(options.dataRowIndexStart - 1);

        // Convert row data to objects with keys from headers
        const result = rowData.map(row => {
          const obj: { [key: string]: string | number | boolean | Date } = {};
          Object.keys(headers).forEach(key => {
            const value = row[key];
            if (options.dateColumns.includes(key) && typeof value === 'string' && dayjs(value, ['HH:mm, DD-MM-YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'], 'vi', true).isValid()) {
              if (dayjs(value, 'YYYY-MM-DD', 'vi', true).isValid()) {
                obj[key] = dayjs(value, 'YYYY-MM-DD').toISOString();
              } else if (dayjs(value, 'HH:mm, DD-MM-YYYY').isValid()) {
                obj[key] = dayjs(value, ['HH:mm, DD-MM-YYYY']).toISOString();
              } else if (dayjs(value, 'DD/MM/YYYY', 'vi', true).isValid()) {
                obj[key] = dayjs(value, 'DD/MM/YYYY').toISOString();
              } else {
                obj[key] = '';
              }
            } else {
              obj[key] = value;
            }
          });
          return obj as T;
        });

        // Resolve with the result if needed
        resolve(result);
      } catch (error) {
        console.error('Error parsing the Excel file:', error);
        resolve(null);
      }
    };

    reader.readAsBinaryString(file);
  });
};
