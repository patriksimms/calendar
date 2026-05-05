import moment from 'moment';
import 'moment/locale/en-gb';
import { useState } from 'react';
import enUS from 'rc-calendar/src/locale/en_US';
import MonthCalendarComponent from 'rc-calendar/src/MonthCalendar';
import DatePicker from 'rc-calendar/src/Picker';

const format = 'YYYY-MM';

const buildNow = () => moment().locale('en-gb').utcOffset(0);

const PickerDemo = ({ defaultValue }: { defaultValue: moment.Moment }) => {
    const [value, setValue] = useState<moment.Moment | null>(defaultValue);
    const [disabled, setDisabled] = useState(false);

    const calendar = <MonthCalendarComponent locale={enUS} style={{ zIndex: 1000 }} />;

    return (
        <div style={{ width: 240, margin: 20 }}>
            <div style={{ marginBottom: 10 }}>
                <label>
                    <input
                        type="checkbox"
                        checked={disabled}
                        onChange={(e) => setDisabled(e.target.checked)}
                    />{' '}
                    disabled
                </label>
            </div>
            <div
                style={{
                    boxSizing: 'border-box',
                    position: 'relative',
                    display: 'block',
                    lineHeight: 1.5,
                    marginBottom: 22,
                }}
            >
                <DatePicker
                    animation="slide-up"
                    disabled={disabled}
                    calendar={calendar}
                    value={value}
                    onChange={setValue}
                >
                    {({ value: pickerValue }: { value: moment.Moment | null }) => (
                        <input
                            style={{ width: 200 }}
                            readOnly
                            disabled={disabled}
                            value={(pickerValue && pickerValue.format(format)) || ''}
                            placeholder="please select"
                        />
                    )}
                </DatePicker>
            </div>
        </div>
    );
};

const MonthCalendar = () => {
    const now = buildNow();
    const defaultCalendarValue = now.clone().add(-1, 'month');

    const disabledDate = (value: moment.Moment | undefined) => {
        if (!value) return false;
        return (
            value.year() > now.year() ||
            (value.year() === now.year() && value.month() > now.month())
        );
    };

    const onMonthCellContentRender = (value: moment.Moment) => `Month ${value.month() + 1}`;

    return (
        <div style={{ zIndex: 1000, position: 'relative', width: 600, margin: '0 auto' }}>
            <MonthCalendarComponent
                locale={enUS}
                style={{ zIndex: 1000 }}
                disabledDate={disabledDate}
                monthCellContentRender={onMonthCellContentRender}
                defaultValue={defaultCalendarValue}
                renderFooter={() => 'extra footer'}
            />
            <div style={{ marginTop: 200 }}>
                <PickerDemo defaultValue={now} />
            </div>
        </div>
    );
};

export default MonthCalendar;
