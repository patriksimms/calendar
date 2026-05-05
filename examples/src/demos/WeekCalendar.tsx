import moment from 'moment';
import 'moment/locale/en-gb';
import { useState } from 'react';
import Calendar from 'rc-calendar/src/Calendar';
import enUS from 'rc-calendar/src/locale/en_US';
import DatePicker from 'rc-calendar/src/Picker';

const format = 'YYYY-Wo';

const styles = `
.week-calendar {
  width: 386px;
}
.week-calendar .rc-calendar-tbody > tr:hover .rc-calendar-date {
  background: #ebfaff;
}
.week-calendar .rc-calendar-tbody > tr:hover .rc-calendar-selected-day .rc-calendar-date {
    background: #3fc7fa;
}
.week-calendar .week-calendar-sidebar {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100px;
  border-right: 1px solid #ccc;
}
.week-calendar .rc-calendar-panel {
  margin-left: 100px;
}
`;

const buildNow = () => moment().locale('en-gb').utcOffset(0);

const WeekCalendar = () => {
    const [value, setValue] = useState<moment.Moment | undefined>(undefined);
    const [open, setOpen] = useState(false);

    const dateRender = (current: moment.Moment) => {
        if (
            value &&
            current.year() === value.year() &&
            current.week() === value.week()
        ) {
            return (
                <div className="rc-calendar-selected-day">
                    <div className="rc-calendar-date">{current.date()}</div>
                </div>
            );
        }
        return <div className="rc-calendar-date">{current.date()}</div>;
    };

    const lastWeek = () => {
        const next = (value ?? buildNow()).clone();
        next.add(-1, 'weeks');
        setValue(next);
        setOpen(false);
    };

    const renderSidebar = () => (
        <div className="week-calendar-sidebar" key="sidebar">
            <button onClick={lastWeek} style={{ margin: 20 }}>
                Last week
            </button>
        </div>
    );

    const calendar = (
        <Calendar
            className="week-calendar"
            showWeekNumber
            renderSidebar={renderSidebar}
            dateRender={dateRender}
            locale={enUS}
            format={format}
            style={{ zIndex: 1000 }}
            dateInputPlaceholder="please input"
            defaultValue={buildNow()}
            showDateInput
        />
    );

    return (
        <div style={{ zIndex: 1000, position: 'relative', width: 900, margin: '20px auto' }}>
            <style dangerouslySetInnerHTML={{ __html: styles }} />
            <div style={{ width: 400, margin: 20 }}>
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
                        onOpenChange={setOpen}
                        open={open}
                        animation="slide-up"
                        calendar={calendar}
                        value={value}
                        onChange={setValue}
                    >
                        {({ value: pickerValue }: { value: moment.Moment | null }) => (
                            <span tabIndex={0}>
                                <input
                                    placeholder="please select week"
                                    style={{ width: 250 }}
                                    readOnly
                                    tabIndex={-1}
                                    className="ant-calendar-picker-input ant-input"
                                    value={(pickerValue && pickerValue.format(format)) || ''}
                                />
                            </span>
                        )}
                    </DatePicker>
                </div>
            </div>
        </div>
    );
};

export default WeekCalendar;
