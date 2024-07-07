import React, { useState, useEffect } from 'react';
import { setConfig, getConfig } from '../utils/config';
import { bitable, IFieldMeta, FieldType } from '@lark-base-open/js-sdk';
import { useI18n } from '../utils/i18n';

interface ConfigModalProps {
  onClose: () => void;
  onComplete: () => void;
}

const ConfigModal: React.FC<ConfigModalProps> = ({ onClose, onComplete }) => {
  const [fieldName, setFieldName] = useState<string>('');
  const [unit, setUnit] = useState<string>('h');
  const [titleField, setTitleField] = useState<string>('');
  const [textFields, setTextFields] = useState<IFieldMeta[]>([]);
  const { t } = useI18n();

  useEffect(() => {
    const getFieldList = async () => {
      try {
        const table = await bitable.base.getActiveTable();
        const fieldMetaList = await table.getFieldMetaListByType<IFieldMeta>(FieldType.Text);
        setTextFields(fieldMetaList);

        const storedFieldName = getConfig('fieldName');
        const storedUnit = getConfig('unit');
        const storedTitleField = getConfig('titleField');

        if (storedFieldName) {
          setFieldName(storedFieldName);
        } else if (fieldMetaList.length > 1) {
          setFieldName(fieldMetaList[1].name);
        }

        if (storedUnit) setUnit(storedUnit);

        if (storedTitleField) {
          setTitleField(storedTitleField);
        } else if (fieldMetaList.length > 0) {
          setTitleField(fieldMetaList[0].name);
        }
      } catch (error) {
        console.error('Error fetching field meta list:', error);
      }
    };

    getFieldList();
  }, []);

  const handleSave = () => {
    if (fieldName === titleField) {
      alert(t('configModal.notice'));
      return;
    }

    setConfig('fieldName', fieldName);
    setConfig('unit', unit);
    setConfig('titleField', titleField);
    onComplete();
  };

  return (
    <div className="modal">
      <div className="tip-trangle-top"></div>
      <h3>{t('configModal.entranceName')}</h3>
      <label>
        {t('configModal.textFiledName')}
        <select className='textEditor' value={titleField} onChange={(e) => setTitleField(e.target.value)}>
          {textFields.map((field) => (
            <option key={field.id} value={field.name}>
              {field.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        {t('configModal.timeFiledName')}
        <select className='textEditor' value={fieldName} onChange={(e) => setFieldName(e.target.value)}>
          {textFields.map((field) => (
            <option key={field.id} value={field.name}>
              {field.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        {t('configModal.timeUnit')}
        <select className='textEditor' value={unit} onChange={(e) => setUnit(e.target.value)}>
          <option value="h">{t('configModal.timeUnit.h')}</option>
          <option value="d">{t('configModal.timeUnit.d')}</option>
          <option value="m">{t('configModal.timeUnit.m')}</option>
          <option value="s">{t('configModal.timeUnit.s')}</option>
        </select>
      </label>
      <button className='btn btn-primary' onClick={handleSave}>{t('configModal.save')}</button>
      <button className='btn btn-primary-e' onClick={onClose}>{t('configModal.cancel')}</button>
    </div>
  );
};

export default ConfigModal;
