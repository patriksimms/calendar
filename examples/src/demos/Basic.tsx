import moment from 'moment';
import 'moment/locale/en-gb';
import { useRef, useState } from 'react';
import Calendar from '@patriksimms/calendar/src/Calendar';
import enUS from '@patriksimms/calendar/src/locale/en_US';
import DatePicker from '@patriksimms/calendar/src/Picker';
import TimePickerPanel from 'rc-time-picker/lib/Panel';
import 'rc-time-picker/assets/index.css';

const format = 'YYYY-MM-DD HH:mm:ss';
const dateFormat = 'YYYY-MM-DD';

const buildNow = () => moment().locale('en-gb').utcOffset(0);

const timePickerElement = <TimePickerPanel defaultValue={moment('00:00:00', 'HH:mm:ss')} />;

const disabledTime = (date: moment.Moment | undefined) => {
    if (date && date.date() === 15) {
        return { disabledHours: () => [3, 4] };
    }
    return { disabledHours: () => [1, 2] };
};

const disabledDate = (current: moment.Moment | undefined) => {
    if (!current) return false;
    const start = moment().hour(0).minute(0).second(0);
    return current.valueOf() < start.valueOf();
};

type DemoProps = {
    defaultValue?: moment.Moment;
    defaultCalendarValue?: moment.Moment;
};

const PickerDemo = ({ defaultValue, defaultCalendarValue }: DemoProps) => {
    const [value, setValue] = useState<moment.Moment | null>(defaultValue ?? null);
    const [showTime, setShowTime] = useState(true);
    const [showDateInput, setShowDateInput] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const formatStr = showTime ? format : dateFormat;

    const calendar = (
        <Calendar
            locale={enUS}
            style={{ zIndex: 1001 }}
            dateInputPlaceholder="please input"
            format={formatStr}
            disabledTime={showTime ? disabledTime : undefined}
            timePicker={showTime ? timePickerElement : null}
            defaultValue={defaultCalendarValue}
            showDateInput={showDateInput}
            disabledDate={disabledDate}
            focusablePanel={false}
        />
    );

    return (
        <div style={{ width: 400, margin: 20 }}>
            <div style={{ marginBottom: 10 }}>
                <label>
                    <input
                        type="checkbox"
                        checked={showTime}
                        onChange={(e) => setShowTime(e.target.checked)}
                    />
                    showTime
                </label>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <label>
                    <input
                        type="checkbox"
                        checked={showDateInput}
                        onChange={(e) => setShowDateInput(e.target.checked)}
                    />
                    showDateInput
                </label>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <label>
                    <input
                        type="checkbox"
                        checked={disabled}
                        onChange={(e) => setDisabled(e.target.checked)}
                    />
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
                    calendar={calendar}
                    value={value}
                    onChange={setValue}
                    getCalendarContainer={() => containerRef.current ?? document.body}
                    onOpenChange={setOpen}
                    open={open}
                    style={{ zIndex: 1001 }}
                >
                    {({ value: pickerValue }: { value: moment.Moment | null }) => (
                        <span tabIndex={0}>
                            <input
                                placeholder="please select"
                                style={{ width: 250 }}
                                disabled={disabled}
                                readOnly
                                tabIndex={-1}
                                className="ant-calendar-picker-input ant-input"
                                value={
                                    (pickerValue && pickerValue.format(formatStr)) || ''
                                }
                            />
                            <div ref={containerRef} />
                        </span>
                    )}
                </DatePicker>
            </div>
        </div>
    );
};

const Basic = () => {
    const now = buildNow();
    const lastMonth = now.clone().add(-1, 'month');

    return (
        <div style={{ zIndex: 1000, position: 'relative', width: 900, margin: '20px auto' }}>
            <div style={{ margin: 10 }}>
                <Calendar
                    showWeekNumber={false}
                    locale={enUS}
                    defaultValue={now}
                    disabledTime={disabledTime}
                    showToday
                    format={format}
                    showOk={false}
                    timePicker={timePickerElement}
                    disabledDate={disabledDate}
                    renderFooter={(mode: string) => <span>{mode} extra footer</span>}
                />
            </div>
            <div style={{ float: 'left', width: 300 }}>
                <PickerDemo defaultValue={now} />
            </div>
            <div style={{ float: 'right', width: 300 }}>
                <PickerDemo defaultCalendarValue={lastMonth} />
            </div>
            <div style={{ clear: 'both' }} />
        </div>
    );
};

export default Basic;
