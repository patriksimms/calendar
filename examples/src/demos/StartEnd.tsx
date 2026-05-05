import moment from 'moment';
import 'moment/locale/en-gb';
import { useState } from 'react';
import Calendar from 'rc-calendar/src/Calendar';
import enUS from 'rc-calendar/src/locale/en_US';
import DatePicker from 'rc-calendar/src/Picker';
import TimePickerPanel from 'rc-time-picker/lib/Panel';
import 'rc-time-picker/assets/index.css';

const format = 'YYYY-MM-DD HH:mm:ss';

const buildNow = () => moment().locale('en-gb').utcOffset(0);

const timePickerElement = <TimePickerPanel />;

const PickerSlot = ({
    value,
    onChange,
    disabledDate,
}: {
    value: moment.Moment | null;
    onChange: (next: moment.Moment | null) => void;
    disabledDate?: (current: moment.Moment | undefined) => boolean;
}) => {
    const calendar = (
        <Calendar
            locale={enUS}
            defaultValue={buildNow()}
            timePicker={timePickerElement}
            disabledDate={disabledDate}
        />
    );

    return (
        <DatePicker animation="slide-up" calendar={calendar} value={value} onChange={onChange}>
            {({ value: pickerValue }: { value: moment.Moment | null }) => (
                <span>
                    <input
                        placeholder="please select"
                        style={{ width: 250 }}
                        readOnly
                        value={(pickerValue && pickerValue.format(format)) || ''}
                    />
                </span>
            )}
        </DatePicker>
    );
};

const StartEnd = () => {
    const [startValue, setStartValue] = useState<moment.Moment | null>(null);
    const [endValue, setEndValue] = useState<moment.Moment | null>(null);

    const disabledStartDate = (current: moment.Moment | undefined) => {
        if (!current || !endValue) return false;
        return endValue.isBefore(current);
    };

    const disabledEndDate = (current: moment.Moment | undefined) => {
        if (!current || !startValue) return false;
        return current.isBefore(startValue);
    };

    return (
        <div style={{ width: 240, margin: 20 }}>
            <p>
                Start time:{' '}
                <PickerSlot
                    value={startValue}
                    onChange={setStartValue}
                    disabledDate={disabledStartDate}
                />
            </p>
            <p>
                End time:{' '}
                <PickerSlot
                    value={endValue}
                    onChange={setEndValue}
                    disabledDate={disabledEndDate}
                />
            </p>
        </div>
    );
};

export default StartEnd;
