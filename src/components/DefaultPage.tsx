import React, { useState } from 'react';
import ConfigModal from './ConfigModal';
import { useI18n } from '../utils/i18n';

const DefaultPage: React.FC = () => {
  const [showConfig, setShowConfig] = useState(false);

  const handleConfigComplete = () => {
  };

  const { t } = useI18n();

  return (
    <div className="default-page">
      <div className="header">
        <button className="btn-noBackground" onClick={() => setShowConfig(true)}>{t('configModal.entranceName')}</button>
      </div>
      <div className="content">
        <svg width="325" height="57" viewBox="0 0 325 57" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.354804" y="2.3548" width="235.589" height="28.3843" fill="var(--svg-bg-color)" stroke="var(--svg-stroke-color)" strokeWidth="0.709607" />
          <rect x="236.654" y="2.35478" width="87.9913" height="28.3843" fill="var(--svg-bg-color)" stroke="var(--svg-stroke-color)" strokeWidth="0.709607" />
          <rect x="65.2839" y="1.29037" width="74.5087" height="30.5131" fill="var(--svg-rect-fill-color)" stroke="var(--svg-rect-stroke-color)" strokeWidth="1.41921" />
          <path d="M131.945 28.5223C131.71 26.6646 133.814 25.4296 135.321 26.5414L153.908 40.2567C155.473 41.4119 154.797 43.8885 152.861 44.0874L144.855 44.9099C144.241 44.973 143.685 45.2995 143.33 45.8048L138.707 52.3927C137.589 53.9853 135.097 53.3679 134.853 51.4378L131.945 28.5223Z" fill="var(--svg-path-fill-color)" />
        </svg>
        <p>{t('defaultPage.leadNotice')}
          <br /><span className="small-text light-black">{t('defaultPage.useWayNotice')}</span></p>
      </div>
      {showConfig && <ConfigModal onClose={() => setShowConfig(false)} onComplete={handleConfigComplete} />}
    </div>
  );
};

export default DefaultPage;
