import { useState } from 'react';
import Calendar from '@patriksimms/calendar/src';
import RangeCalendarComponent from '@patriksimms/calendar/src/RangeCalendar';
import 'rc-select/assets/index.css';

type Mode = 'time' | 'date' | 'month' | 'year' | 'decade';
type RangeMode = 'date' | 'month' | 'year' | 'decade';

const ControlPanel = () => {
    const [mode, setMode] = useState<Mode>('month');
    const [rangeStartMode, setRangeStartMode] = useState<RangeMode>('date');
    const [rangeEndMode, setRangeEndMode] = useState<RangeMode>('date');

    return (
        <div style={{ zIndex: 1000, position: 'relative' }}>
            <h2>Control Calendar panel</h2>
            <select
                value={mode}
                style={{ width: 500 }}
                onChange={(e) => setMode(e.target.value as Mode)}
            >
                {(['time', 'date', 'month', 'year', 'decade'] as const).map((item) => (
                    <option value={item} key={item}>
                        {item}
                    </option>
                ))}
            </select>
            <Calendar mode={mode} />

            <h2>Control RangeCalendar panel</h2>
            <select
                value={rangeStartMode}
                style={{ width: 500 }}
                onChange={(e) => setRangeStartMode(e.target.value as RangeMode)}
            >
                {(['date', 'month', 'year', 'decade'] as const).map((item) => (
                    <option value={item} key={item}>
                        {item}
                    </option>
                ))}
            </select>
            <select
                value={rangeEndMode}
                style={{ width: 500 }}
                onChange={(e) => setRangeEndMode(e.target.value as RangeMode)}
            >
                {(['date', 'month', 'year', 'decade'] as const).map((item) => (
                    <option value={item} key={item}>
                        {item}
                    </option>
                ))}
            </select>
            <RangeCalendarComponent mode={[rangeStartMode, rangeEndMode]} />
        </div>
    );
};

export default ControlPanel;
