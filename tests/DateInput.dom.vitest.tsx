import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import moment from 'moment';
import Calendar from '../src/Calendar';

describe('DateInput (RTL)', () => {
    it('emits onChange with parsed moment when a valid date is typed', () => {
        const onChange = vi.fn();
        const { container } = render(
            <Calendar
                defaultValue={moment('2017-03-29')}
                onChange={onChange}
            />,
        );

        const input = container.querySelector('.rc-calendar-input') as HTMLInputElement;
        fireEvent.change(input, { target: { value: '4/15/2017' } });

        expect(onChange).toHaveBeenCalled();
        const arg = onChange.mock.calls[0][0];
        expect(arg.format('YYYY-MM-DD')).toBe('2017-04-15');
    });

    it('marks the input invalid when an unparseable string is typed', () => {
        const { container } = render(
            <Calendar defaultValue={moment('2017-03-29')} />,
        );

        const input = container.querySelector('.rc-calendar-input') as HTMLInputElement;
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: 'not-a-date' } });

        expect(input.className).toContain('rc-calendar-input-invalid');
    });

    it('does not accept disabled dates typed in the input', () => {
        const onChange = vi.fn();
        const disabledDate = (current: moment.Moment | undefined) =>
            !!current && current.date() === 15;
        const { container } = render(
            <Calendar
                defaultValue={moment('2017-03-29')}
                onChange={onChange}
                disabledDate={disabledDate}
            />,
        );

        const input = container.querySelector('.rc-calendar-input') as HTMLInputElement;
        fireEvent.focus(input);
        fireEvent.change(input, { target: { value: '4/15/2017' } });

        expect(onChange).not.toHaveBeenCalled();
        expect(input.className).toContain('rc-calendar-input-invalid');
    });

    it('clears the input via the clear button', () => {
        const onChange = vi.fn();
        const { container } = render(
            <Calendar
                defaultValue={moment('2017-03-29')}
                defaultSelectedValue={moment('2017-03-29')}
                onChange={onChange}
            />,
        );

        const clearBtn = container.querySelector('.rc-calendar-clear-btn') as HTMLElement;
        expect(clearBtn).not.toBeNull();
        fireEvent.click(clearBtn.parentElement!);

        const input = container.querySelector('.rc-calendar-input') as HTMLInputElement;
        expect(input.value).toBe('');
    });

    it('fires onSelect on Enter key when value is valid', () => {
        const onSelect = vi.fn();
        const { container } = render(
            <Calendar
                defaultValue={moment('2017-03-29')}
                onSelect={onSelect}
            />,
        );

        const input = container.querySelector('.rc-calendar-input') as HTMLInputElement;
        fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });

        expect(onSelect).toHaveBeenCalled();
    });
});
