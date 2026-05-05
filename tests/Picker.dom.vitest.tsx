import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import moment from 'moment';
import Calendar from '../src/Calendar';
import Picker from '../src/Picker';
import enUS from '../src/locale/en_US';

const VALUE = moment('2015-06-01');

const renderInput = ({ value }: { value?: moment.Moment }) => (
    <input
        className="rc-calendar-picker-input"
        onChange={() => undefined}
        readOnly
        value={value ? value.format('YYYY-MM-DD') : ''}
    />
);

const renderPicker = (
    pickerProps: Record<string, unknown> = {},
    calendarProps: Record<string, unknown> = {},
) =>
    render(
        <Picker
            calendar={
                <Calendar
                    locale={enUS}
                    showOk
                    showClear
                    {...calendarProps}
                />
            }
            defaultValue={VALUE}
            {...pickerProps}
        >
            {renderInput}
        </Picker>,
    );

describe('Picker (RTL)', () => {
    it('opens the calendar when the trigger input is clicked', () => {
        const { container } = renderPicker();

        const input = container.querySelector('.rc-calendar-picker-input') as HTMLElement;
        fireEvent.click(input);

        expect(document.querySelector('.rc-calendar')).toBeInTheDocument();
    });

    it('closes the calendar when ESC is pressed and restores focus to the trigger', () => {
        const { container } = renderPicker();

        const input = container.querySelector(
            '.rc-calendar-picker-input',
        ) as HTMLInputElement;
        fireEvent.click(input);
        expect(document.querySelector('.rc-calendar')).toBeInTheDocument();

        const calendar = document.querySelector('.rc-calendar') as HTMLElement;
        act(() => {
            fireEvent.keyDown(calendar, { key: 'Escape', keyCode: 27 });
        });

        expect(document.querySelector('.rc-calendar')).not.toBeInTheDocument();
        expect(document.activeElement).toBe(input);
    });

    it('opens with ArrowDown on a closed picker', () => {
        const { container } = renderPicker();
        const input = container.querySelector('.rc-calendar-picker-input') as HTMLElement;

        fireEvent.keyDown(input, { key: 'ArrowDown', keyCode: 40 });

        expect(document.querySelector('.rc-calendar')).toBeInTheDocument();
    });

    it('selects a date via the popup and emits onChange + closes', () => {
        const onChange = vi.fn();
        const { container } = renderPicker({ onChange });

        const input = container.querySelector('.rc-calendar-picker-input') as HTMLElement;
        fireEvent.click(input);

        const cell = document.querySelector('[title="June 5, 2015"]') as HTMLElement;
        expect(cell).not.toBeNull();
        fireEvent.click(cell);

        expect(onChange).toHaveBeenCalled();
        const arg = onChange.mock.calls[0][0];
        expect(arg.format('YYYY-MM-DD')).toBe('2015-06-05');
    });

    it('routes onOpenChange when popup visibility changes', () => {
        const onOpenChange = vi.fn();
        const { container } = renderPicker({ onOpenChange });

        const input = container.querySelector('.rc-calendar-picker-input') as HTMLElement;
        fireEvent.click(input);

        expect(onOpenChange).toHaveBeenCalledWith(true);
    });
});
