import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs';
import generatePicker from 'antd/es/date-picker/generatePicker';
import styles from './DatePicker.module.css';
import locale from 'antd/es/date-picker/locale/es_ES';

const AntDatePicker = generatePicker(dayjsGenerateConfig);

export function DatePicker(props) {
    return (
        <AntDatePicker
            locale={locale}
            inputReadOnly
            size="large"
            panelRender={panel =>
                <div className={styles.pickerPanel}>
                    {panel}
                </div>
            }
            {...props}
        />
    );
}