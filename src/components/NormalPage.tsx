// @ts-nocheck
import React, { useState, useEffect } from 'react';
import ConfigModal from './ConfigModal';
import { getConfig } from '../utils/config';
import { getStoredRecord, saveRecord, startNewRecord } from '../utils/functions';
import './NormalPage.css';
import { bitable, IOpenSingleSelect } from '@lark-base-open/js-sdk';
import { useI18n } from '../utils/i18n';

interface NormalPageProps {
  resetSelection: () => void;
}

const NormalPage: React.FC<NormalPageProps> = ({ resetSelection }) => {
  const { t } = useI18n();
  const [showConfig, setShowConfig] = useState(false);
  const [record, setRecord] = useState<any>(null);
  const [timer, setTimer] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [recordName, setRecordName] = useState<IOpenSingleSelect | string>(t('normalPage.gettingNotice'));
  const [startTime, setStartTime] = useState<number | null>(null);

  const getRecordName = async () => {
    try {
      const table = await bitable.base.getActiveTable();
      const fieldTitle = await table.getField(getConfig('titleField') ?? '');
      const recordId = getConfig('recordId');
      if (recordId) {
        const cell = await fieldTitle.getCell(recordId);
        const value = await cell.getValue();
        setRecordName(value);
      }
    } catch (error) {
      console.error('Error getting record name:', error);
    }
  };

  const setRecordTime = async () => {
    try {
      const table = await bitable.base.getActiveTable();
      const fieldTime = await table.getField(getConfig('fieldName') ?? '');
      const recordId = getConfig('recordId');
      if (recordId) {
        const cell = await fieldTime.getCell(recordId);
        const unit = getConfig('unit');
        const formattedTime = formatTimeUnit(timer, unit);
        await cell.setValue(formattedTime);
      }
    } catch (error) {
      console.error('Error setting record time:', error);
    }
  };

  useEffect(() => {
    getRecordName();
  }, []);

  useEffect(() => {
    const storedRecord = getStoredRecord();
    if (storedRecord) {
      setRecord(storedRecord);
      setTimer(storedRecord.elapsedTime);
      setIsRunning(storedRecord.isRunning);
      setStartTime(storedRecord.startTime);
    } else {
      const newRecord = startNewRecord();
      setRecord(newRecord);
      saveRecord(newRecord);
      setStartTime(newRecord.startTime);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning === true) {
      // console.log('timer running...')
      interval = setInterval(() => {
        if (startTime !== null) {
          setTimer(Math.floor((Date.now() - startTime) / 1000));
          saveRecord({ ...record, elapsedTime: timer, startTime: startTime, isRunning: isRunning });
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, startTime]);

  const handleEnd = async () => {
    setIsRunning(false);
    saveRecord({ ...record, elapsedTime: timer, startTime: startTime, isRunning: false });
    setRecord(record);
    await setRecordTime();
    resetSelection();
  };

  const handlePause = () => {
    if (!isRunning) {
      const newStartTime = Date.now() - timer * 1000;
      setStartTime(newStartTime);
    }
    setIsRunning(!isRunning);
    saveRecord({ ...record, elapsedTime: timer, startTime: startTime, isRunning: !isRunning });
    setRecord(record);
  };

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hrs = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return (
      <div className="line">
        <span className="large-text black">{days}</span>
        <span className="medium-text black">{t('normalPage.timeUnit.d.tiny')}</span>
        <span className="large-text black">{hrs}</span>
        <span className="medium-text black">{t('normalPage.timeUnit.h.tiny')}</span>
        <span className="large-text black">{mins}</span>
        <span className="medium-text black">{t('normalPage.timeUnit.m.tiny')}</span>
        {/* <span className="small-text light-black">{secs}</span> */}
      </div>
    );
  };

  const formatTimeUnit = (seconds: number, unit: string) => {
    switch (unit) {
      case 'h':
        return (seconds / 3600).toFixed(2) + ' ' + t('normalPage.timeUnit.h.tiny');
      case 'd':
        return (seconds / 86400).toFixed(2) + ' ' + t('normalPage.timeUnit.d.tiny');
      case 'm':
        return (seconds / 60).toFixed(2) + ' ' + t('normalPage.timeUnit.m.tiny');
      case 's':
      default:
        return seconds + ' ' + t('normalPage.timeUnit.s.tiny');
    }
  };

  return (
    <div className="normal-page">
      <div className="header">
        <button className="btn btn-noBackground" onClick={() => setShowConfig(true)}>
          {t('configModal.entranceName')}
        </button>
      </div>
      <div className="content">
        <div className="upper-content">
          <div className="line">
            <span className="small-text light-black">{t('normalPage.titleFiledNotice')}</span>
            <span className="medium-text black">{recordName[0]?.text ?? recordName}</span>
          </div>
          {formatTime(timer)}
          <div className="line">
            <span className="small-text light-black">{t('normalPage.startTimeNotice')}{new Date(record?.startTime).toLocaleString()}</span>
          </div>
        </div>
        <div className="bottom-content">
          <div style={{ marginRight: '10vw' }}>
            <button className="btn circle-button red" onClick={handleEnd}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="22" height="22" rx="1" stroke="white" strokeWidth="2" />
              </svg>
            </button>
            <span className="circle-button-text">{t('normalPage.endButton')}</span>
          </div>
          <div>
            <button className="btn circle-button blue" onClick={handlePause}>
              {!isRunning ? (
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M45.4375 31.1752C45.6875 31.3196 45.6875 31.6804 45.4375 31.8248L24.8125 43.7326C24.5625 43.8769 24.25 43.6965 24.25 43.4078V19.5922C24.25 19.3035 24.5625 19.1231 24.8125 19.2674L45.4375 31.1752Z" stroke="white" strokeWidth="2.6" />
                </svg>
              ) : (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.4001 7.80005V23.4" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M20.8001 7.80005V23.4" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <span className="circle-button-text">{!isRunning ? t('normalPage.pauseButtonRun') : t('normalPage.pauseButton')}</span>
          </div>
        </div>
        <div className="tips">
          <p>{t('normalPage.tipsFirstLine')}
            <br />{t('normalPage.tipsSecondLine')}
          </p>
        </div>
      </div>
      {showConfig && <ConfigModal onClose={() => setShowConfig(false)} onComplete={() => setShowConfig(false)} />}
    </div>
  );
};

export default NormalPage;
