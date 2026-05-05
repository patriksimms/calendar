import moment from 'moment';
import 'moment/locale/en-gb';
import { useState } from 'react';
import enUS from '@patriksimms/calendar/src/locale/en_US';
import Picker from '@patriksimms/calendar/src/Picker';
import RangeCalendarComponent from '@patriksimms/calendar/src/RangeCalendar';
import TimePickerPanel from 'rc-time-picker/lib/Panel';
import 'rc-time-picker/assets/index.css';

const formatStr = 'YYYY-MM-DD HH:mm:ss';

const buildNow = () => moment().locale('en-gb').utcOffset(0);

const timePickerElement = (
    <TimePickerPanel
        defaultValue={[moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]}
    />
);

const newArray = (start: number, end: number) => {
    const result: number[] = [];
    for (let i = start; i < end; i++) result.push(i);
    return result;
};

const disabledDate = (current: moment.Moment | undefined) => {
    if (!current) return false;
    const start = moment().hour(0).minute(0).second(0);
    return current.isBefore(start);
};

const disabledTime = (_time: moment.Moment[] | undefined, type: string) => {
    if (type === 'start') {
        return {
            disabledHours: () => {
                const hours = newArray(0, 60);
                hours.splice(20, 4);
                return hours;
            },
            disabledMinutes: (h: number) => {
                if (h === 20) return newArray(0, 31);
                if (h === 23) return newArray(30, 60);
                return [];
            },
            disabledSeconds: () => [55, 56],
        };
    }
    return {
        disabledHours: () => {
            const hours = newArray(0, 60);
            hours.splice(2, 6);
            return hours;
        },
        disabledMinutes: (h: number) => {
            if (h === 20) return newArray(0, 31);
            if (h === 23) return newArray(30, 60);
            return [];
        },
        disabledSeconds: () => [55, 56],
    };
};

const format = (v: moment.Moment | null | undefined) => (v ? v.format(formatStr) : '');

const isValidRange = (
    v: Array<moment.Moment | null> | undefined,
): v is [moment.Moment, moment.Moment] => Boolean(v && v[0] && v[1]);

const PickerDemo = () => {
    const [value, setValue] = useState<Array<moment.Moment | null>>([]);
    const [hoverValue, setHoverValue] = useState<moment.Moment[]>([]);

    const now = buildNow();

    const calendar = (
        <RangeCalendarComponent
            hoverValue={hoverValue}
            onHoverChange={setHoverValue}
            showWeekNumber={false}
            dateInputPlaceholder={['start', 'end']}
            defaultValue={[now, now.clone().add(1, 'months')]}
            locale={enUS}
            disabledTime={disabledTime}
            timePicker={timePickerElement}
        />
    );

    return (
        <Picker value={value} onChange={setValue} animation="slide-up" calendar={calendar}>
            {({ value: pickerValue }: { value: Array<moment.Moment | null> }) => (
                <span>
                    <input
                        placeholder="please select"
                        style={{ width: 350 }}
                        readOnly
                        className="ant-calendar-picker-input ant-input"
                        value={
                            isValidRange(pickerValue)
                                ? `${format(pickerValue[0])} - ${format(pickerValue[1])}`
                                : ''
                        }
                    />
                </span>
            )}
        </Picker>
    );
};

const RangeCalendarDemo = () => (
    <div>
        <h2>calendar</h2>
        <div style={{ margin: 10 }}>
            <RangeCalendarComponent
                showToday={false}
                showWeekNumber
                dateInputPlaceholder={['start', 'end']}
                locale={enUS}
                showOk={false}
                showClear
                format={formatStr}
                disabledDate={disabledDate}
                timePicker={timePickerElement}
                disabledTime={disabledTime}
                renderFooter={() => <span>extra footer</span>}
            />
        </div>
        <div style={{ margin: 20 }}>
            <PickerDemo />
        </div>
    </div>
);

export default RangeCalendarDemo;
