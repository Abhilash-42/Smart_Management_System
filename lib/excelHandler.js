import * as XLSX from 'xlsx';

export function exportToExcel(data, filename = 'students.xlsx') {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}

export function importFromExcel(buffer) {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(worksheet);
}