import React from 'react';
import './SelectionModal.css';
import { useI18n } from '../utils/i18n';

interface SelectionModalProps {
  onContinue: () => void;
  onDelete: () => void;
}

const SelectionModal: React.FC<SelectionModalProps> = ({ onContinue, onDelete }) => {
  const { t } = useI18n();
  return (
    <div className="modal2">
      <div className="modal2-content">
        <span className="modal2-header">
          {t('selectionModal.line1')}
        </span>
        <p>{t('selectionModal.line2')}</p>
        <div className="modal2-actions">
          <button onClick={onContinue} className="btn btn-secondary">{t('selectionModal.continueButton')}</button>
          <button onClick={onDelete} className="btn btn-danger">{t('selectionModal.deleteButton')}</button>
        </div>
      </div>
    </div>
  );
};

export default SelectionModal;
