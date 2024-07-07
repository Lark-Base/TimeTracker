export const getConfig = (configName: string): string | null => {
  return localStorage.getItem(configName);
};

export const setConfig = (configName: string, configValue: string): void => {
  localStorage.setItem(configName, configValue);
};
