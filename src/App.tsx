import React, { useState, useEffect, useCallback } from 'react';
import DefaultPage from './components/DefaultPage';
import NormalPage from './components/NormalPage';
import SelectionModal from './components/SelectionModal';
import { bitable } from '@lark-base-open/js-sdk';
import { getConfig, setConfig } from './utils/config';
import { I18nProvider } from './utils/i18n';
import './components/dark.css'; // 引入深色模式CSS

const App: React.FC = () => {
  const [recordId, setRecordId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [recordIdTemp, setRecordIdTemp] = useState<string | null>(null);
  const [isSelectionActive, setIsSelectionActive] = useState<boolean>(true);
  const [globalSelectionId, setGlobalSelectionId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'LIGHT' | 'DARK'>('LIGHT');

  const checkSelection = async () => {
    try {
      const selection = await bitable.base.getSelection();
      if (selection && selection.recordId && isSelectionActive === true) {
        if (recordIdTemp === selection.recordId) {
          return;
        } else if (selection.recordId === null) {
          return;
        } else if (selection.recordId === getConfig('recordId')) {
          setRecordId(selection.recordId);
          setRecordIdTemp(selection.recordId);
          setIsSelectionActive(false);
        } else {
          setShowModal(true);
          setGlobalSelectionId(selection.recordId);
        }
      }
    } catch (error) {
      console.error('获取选择内容时出错:', error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(checkSelection, 1000); // 每秒检查一次
    return () => clearInterval(intervalId); // 清除定时器
  }, [recordId, isSelectionActive]);

  const resetSelection = useCallback(() => {
    setRecordId(null);
    setRecordIdTemp(null);
    setIsSelectionActive(true);
  }, []);

  const handleContinue = useCallback(() => {
    setRecordId(getConfig('recordId'));
    setRecordIdTemp(globalSelectionId);
    setShowModal(false);
    setIsSelectionActive(false);
  }, []);

  const handleDelete = useCallback(() => {
    setConfig('record', '');
    setConfig('recordId', globalSelectionId ?? '');
    setRecordId(globalSelectionId);
    setShowModal(false);
    setRecordIdTemp(globalSelectionId);
    setIsSelectionActive(false);
  }, [globalSelectionId]);

  const applyTheme = (theme: 'LIGHT' | 'DARK') => {
    document.body.classList.toggle('dark-mode', theme === 'DARK');
  };

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const theme = await bitable.bridge.getTheme();
        setTheme(theme);
        applyTheme(theme);
      } catch (error) {
        console.error('获取主题时出错:', error);
      }
    };

    const onThemeChange = (event: { data: { theme: 'LIGHT' | 'DARK' } }) => {
      const newTheme = event.data.theme;
      setTheme(newTheme);
      applyTheme(newTheme);
    };

    fetchTheme();

    const unsubscribe = bitable.bridge.onThemeChange(onThemeChange);

    return () => unsubscribe();
  }, []);

  return (
    <I18nProvider>
      <div className="App">
        {recordId ? <NormalPage resetSelection={resetSelection} /> : <DefaultPage />}
        {showModal && <SelectionModal onContinue={handleContinue} onDelete={handleDelete} />}
      </div>
    </I18nProvider>
  );
};

export default App;
