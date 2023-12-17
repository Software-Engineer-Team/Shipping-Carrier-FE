import * as XLSX from 'xlsx';

export interface ColumnConfig<T> {
  key: keyof T | string;
  label: string;
}
function extractValueFromKey<T>(obj: T, key: ColumnConfig<T>['key']): any {
  if (typeof key === 'string') {
    const keys = key.split('.'); // Split nested keys
    let value: any = obj;
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return undefined;
      }
    }
    return value;
  }
  return obj[key];
}

function extractFieldsFromObjects<T>(objects: T[], config: ColumnConfig<T>[]): Record<string, any>[] {
  return objects.map(obj => {
    const extractedObj: Record<string, any> = {};
    config.forEach(item => {
      const value = extractValueFromKey(obj, item.key);
      extractedObj[item.label] = value !== undefined ? value : '';
    });
    return extractedObj;
  });
}

export const exportToExcel = <T extends Record<string, any>>(data: T[], columns: ColumnConfig<T>[] = [], filename: string = 'BSS') => {
  try {
    const wb = XLSX.utils.book_new();
    const wsData = extractFieldsFromObjects(data, columns);
    const ws = XLSX.utils.json_to_sheet(wsData, {
      header: columns.map(column => column.label),
    });

    // Custom style for header cells
    const headerStyle = {
      border: {
        bottom: { color: { auto: 1 }, style: 'thin' },
        left: { color: { auto: 1 }, style: 'thin' },
        right: { color: { auto: 1 }, style: 'thin' },
        top: { color: { auto: 1 }, style: 'thin' },
      },
      fill: { fgColor: { rgb: '2E74B5' } },
      font: { bold: true, color: { rgb: 'FFFFFF' } },
    };

    ws['!cols'] = []; // Clear default column width
    columns.forEach((_, colIndex) => {
      if (ws['!cols']) {
        ws['!cols'][colIndex] = { width: 15 }; // Set custom column width
      }
    });

    // Apply header style
    for (let col = 0; col < columns.length; col++) {
      const cell = XLSX.utils.encode_cell({ c: col, r: 0 }); // Header row is at index 0
      ws[cell].s = headerStyle;
    }

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${filename}.xlsx`);
  } catch (e) {
    console.error(e);
  }
};
