import moment from 'moment';
import 'moment/locale/en-gb';
import { useState } from 'react';
import FullCalendarComponent from '@patriksimms/calendar/src/FullCalendar';
import enUS from '@patriksimms/calendar/src/locale/en_US';
import Select from 'rc-select';
import 'rc-select/assets/index.css';

const buildNow = () => moment().locale('en-gb').utcOffset(0);

const FullCalendar = () => {
    const [type, setType] = useState<'month' | 'date'>('month');
    const now = buildNow();

    return (
        <div style={{ zIndex: 1000, position: 'relative' }}>
            <FullCalendarComponent
                style={{ margin: 10 }}
                Select={Select}
                fullscreen={false}
                defaultValue={now}
                locale={enUS}
            />
            <FullCalendarComponent
                style={{ margin: 10 }}
                Select={Select}
                fullscreen
                defaultValue={now}
                type={type}
                onTypeChange={setType}
                locale={enUS}
            />
        </div>
    );
};

export default FullCalendar;
