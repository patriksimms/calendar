import moment from 'moment';
import 'moment/locale/en-gb';
import { useState } from 'react';
import enUS from '@patriksimms/calendar/src/locale/en_US';
import DatePicker from '@patriksimms/calendar/src/Picker';
import RangeCalendarComponent from '@patriksimms/calendar/src/RangeCalendar';

const format = 'YYYY-MM-DD';
const fullFormat = 'YYYY-MM-DD dddd';

const buildNow = () => moment().locale('en-gb').utcOffset(0);

const Picker = ({
    type,
    showValue,
    open,
    value,
    onOpenChange,
    onChange,
    disabledDate,
}: {
    type: 'start' | 'end';
    showValue: moment.Moment | null;
    open: boolean;
    value: Array<moment.Moment | null>;
    onOpenChange: (open: boolean) => void;
    onChange: (value: Array<moment.Moment | null>) => void;
    disabledDate?: (current: moment.Moment | undefined) => boolean;
}) => {
    const [hoverValue, setHoverValue] = useState<moment.Moment[]>([]);
    const calendar = (
        <RangeCalendarComponent
            hoverValue={hoverValue}
            onHoverChange={setHoverValue}
            type={type}
            locale={enUS}
            defaultValue={buildNow()}
            format={format}
            onChange={onChange}
            disabledDate={disabledDate}
        />
    );

    return (
        <DatePicker open={open} onOpenChange={onOpenChange} calendar={calendar} value={value}>
            {() => (
                <span>
                    <input
                        placeholder="please select date"
                        style={{ width: 250 }}
                        readOnly
                        value={(showValue && showValue.format(fullFormat)) || ''}
                    />
                </span>
            )}
        </DatePicker>
    );
};

const StartEndRange = () => {
    const [startValue, setStartValue] = useState<moment.Moment | null>(null);
    const [endValue, setEndValue] = useState<moment.Moment | null>(null);
    const [startOpen, setStartOpen] = useState(false);
    const [endOpen, setEndOpen] = useState(false);

    const disabledEndDate = (current: moment.Moment | undefined) => {
        if (!current || !startValue) return false;
        return current.diff(startValue, 'days') < 0;
    };

    return (
        <div style={{ width: 240, margin: 20 }}>
            <p>
                Start time:{' '}
                <Picker
                    onOpenChange={setStartOpen}
                    type="start"
                    showValue={startValue}
                    open={startOpen}
                    value={[startValue, endValue]}
                    onChange={(values) => {
                        setStartValue(values[0] ?? null);
                        setStartOpen(false);
                        setEndOpen(true);
                    }}
                />
            </p>
            <p>
                End time:{' '}
                <Picker
                    onOpenChange={setEndOpen}
                    open={endOpen}
                    type="end"
                    showValue={endValue}
                    disabledDate={disabledEndDate}
                    value={[startValue, endValue]}
                    onChange={(values) => {
                        setEndValue(values[1] ?? null);
                    }}
                />
            </p>
        </div>
    );
};

export default StartEndRange;
