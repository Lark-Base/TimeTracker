export const getStoredRecord = () => {
  const record = localStorage.getItem('record');
  return record ? JSON.parse(record) : null;
};

export const saveRecord = (record: any) => {
  localStorage.setItem('record', JSON.stringify(record));
};

export const startNewRecord = () => {
  return { startTime: Date.now(), elapsedTime: 0, isRunning: true };
};
