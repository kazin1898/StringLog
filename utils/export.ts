export function exportToCSV<T>(data: T[], filename: string): void {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  const headers = Object.keys(data[0] as object).join(',');
  const rows = data.map(item => 
    Object.values(item as object).map(value => {
      if (value === null || value === undefined) return '';
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',')
  );

  const csvContent = [headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportSessionsToCSV(sessions: unknown[]): void {
  exportToCSV(sessions, 'stringlog-sessions');
}

export function exportSongsToCSV(songs: unknown[]): void {
  exportToCSV(songs, 'stringlog-songs');
}
