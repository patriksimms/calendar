import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import moment from 'moment';
import TimePickerPanel from 'rc-time-picker/lib/Panel';
import Calendar from '../src/Calendar';

describe('Calendar + time picker integration (RTL)', () => {
    it('toggles the time-picker panel via the time-picker button', () => {
        const timePicker = (
            <TimePickerPanel defaultValue={moment('00:00:00', 'HH:mm:ss')} />
        );
        const { container } = render(
            <Calendar
                defaultValue={moment('2017-03-29')}
                defaultSelectedValue={moment('2017-03-29 00:00:00')}
                timePicker={timePicker}
            />,
        );

        const btn = container.querySelector('.rc-calendar-time-picker-btn') as HTMLElement;
        expect(btn).not.toBeNull();
        fireEvent.click(btn);

        expect(container.querySelector('.rc-calendar-time-picker')).toBeInTheDocument();
    });

    it('uses the time picker default value when no time has been selected yet', () => {
        const timePicker = (
            <TimePickerPanel defaultValue={moment('06:30:15', 'HH:mm:ss')} />
        );
        const { container } = render(
            <Calendar
                defaultValue={moment('2017-03-29')}
                timePicker={timePicker}
            />,
        );

        fireEvent.click(container.querySelector('[title="March 15, 2017"]')!);

        const input = container.querySelector('.rc-calendar-input') as HTMLInputElement;
        expect(input.value).toBe('3/15/2017 06:30:15');
    });
});
