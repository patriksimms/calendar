import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import moment from 'moment';
import Calendar from '../src/Calendar';

const renderCalendar = (props: Record<string, unknown> = {}) =>
    render(<Calendar defaultValue={moment('2017-03-29')} {...props} />);

describe('Calendar (RTL)', () => {
    it('renders the date panel for the supplied value', () => {
        const { container } = renderCalendar();

        expect(container.querySelector('.rc-calendar')).toBeInTheDocument();
        expect(screen.getByText('29')).toBeInTheDocument();
    });

    it('fires onSelect when a date cell is clicked', () => {
        const onSelect = vi.fn();
        const { container } = renderCalendar({ onSelect });

        const cell = container.querySelector('[title="March 15, 2017"]');
        expect(cell).not.toBeNull();
        fireEvent.click(cell!);

        expect(onSelect).toHaveBeenCalledTimes(1);
        const arg = onSelect.mock.calls[0][0];
        expect(moment.isMoment(arg)).toBe(true);
        expect(arg.format('YYYY-MM-DD')).toBe('2017-03-15');
    });

    it('selects today when the today button is clicked', () => {
        const onSelect = vi.fn();
        const { container } = renderCalendar({ onSelect });

        fireEvent.click(container.querySelector('.rc-calendar-today-btn')!);

        expect(onSelect).toHaveBeenCalledTimes(1);
        const arg = onSelect.mock.calls[0][0];
        expect(moment.isMoment(arg)).toBe(true);
    });

    it('calls onClear and onSelect(null) when the clear icon is pressed', () => {
        const onClear = vi.fn();
        const onSelect = vi.fn();
        const { container } = renderCalendar({
            onClear,
            onSelect,
            defaultSelectedValue: moment('2017-03-29'),
        });

        const clearBtn = container.querySelector('.rc-calendar-clear-btn') as HTMLElement;
        expect(clearBtn).not.toBeNull();
        fireEvent.click(clearBtn.parentElement!);

        expect(onSelect).toHaveBeenCalledWith(null, undefined);
        expect(onClear).toHaveBeenCalledTimes(1);
    });

    it('disabledDate prevents selection on the disabled cell', () => {
        const disabledDate = (current: moment.Moment | undefined) =>
            !!current && current.date() === 15;
        const onSelect = vi.fn();
        const { container } = renderCalendar({ disabledDate, onSelect });

        fireEvent.click(container.querySelector('[title="March 15, 2017"]')!);

        expect(onSelect).not.toHaveBeenCalled();
    });

    it('calls onOk with selectedValue when the OK button is clicked', () => {
        const onOk = vi.fn();
        renderCalendar({
            onOk,
            showOk: true,
            defaultSelectedValue: moment('2017-03-29'),
        });

        fireEvent.click(screen.getByText('Ok'));

        expect(onOk).toHaveBeenCalledTimes(1);
        const arg = onOk.mock.calls[0][0];
        expect(arg.format('YYYY-MM-DD')).toBe('2017-03-29');
    });

    it('navigates to the next week with ArrowDown keyboard', () => {
        const onChange = vi.fn();
        const { container } = renderCalendar({ onChange });

        const root = container.querySelector('.rc-calendar') as HTMLElement;
        fireEvent.keyDown(root, { key: 'ArrowDown', keyCode: 40 });

        expect(onChange).toHaveBeenCalled();
        const arg = onChange.mock.calls[0][0];
        expect(arg.format('YYYY-MM-DD')).toBe('2017-04-05');
    });

    it('navigates to month panel when month button is clicked', () => {
        const { container } = renderCalendar();

        const monthBtn = container.querySelector(
            '.rc-calendar-month-select',
        ) as HTMLElement;
        expect(monthBtn).not.toBeNull();
        fireEvent.click(monthBtn);

        expect(container.querySelector('.rc-calendar-month-panel')).toBeInTheDocument();
    });

    it('renders translated text from a custom locale', async () => {
        const deLocale = (await import('../src/locale/de_DE')).default;
        renderCalendar({ locale: deLocale });

        expect(screen.getByText('Heute')).toBeInTheDocument();
    });
});
