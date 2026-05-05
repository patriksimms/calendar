const sectionStyle = {
    borderTop: '1px solid #ddd',
    marginTop: 32,
    paddingTop: 24,
} satisfies React.CSSProperties;

const codeStyle = {
    background: '#f6f8fa',
    borderRadius: 4,
    overflowX: 'auto',
    padding: 12,
} satisfies React.CSSProperties;

const tableStyle = {
    borderCollapse: 'collapse',
    width: '100%',
} satisfies React.CSSProperties;

const cellStyle = {
    border: '1px solid #ddd',
    padding: '6px 8px',
    textAlign: 'left',
    verticalAlign: 'top',
} satisfies React.CSSProperties;

const calendarProps = [
    ['value / defaultValue', 'moment', 'controlled or uncontrolled selected date'],
    ['locale', 'Object', 'locale messages, for example @patriksimms/calendar/lib/locale/en_US'],
    ['format', 'String | String[]', 'input format or accepted parse formats'],
    ['disabledDate', '(current: moment) => boolean', 'disable selection for a date'],
    ['disabledTime', '(current: moment) => Object', 'disable hours, minutes, or seconds'],
    ['showDateInput', 'Boolean', 'show the input above the panel'],
    ['showWeekNumber', 'Boolean', 'show week-of-year column'],
    ['showToday / showOk', 'Boolean', 'show footer action buttons'],
    ['timePicker', 'ReactElement', 'time picker panel, usually rc-time-picker/lib/Panel'],
    ['onSelect / onChange / onOk', 'Function', 'selection, value-change, and OK callbacks'],
    ['dateRender', '(current, value) => ReactNode', 'custom date cell renderer'],
    ['renderSidebar / renderFooter', 'Function', 'custom sidebar or footer renderer'],
];

const rangeProps = [
    ['selectedValue / defaultSelectedValue', 'moment[]', 'controlled or uncontrolled [start, end] range'],
    ['format', 'String', 'input format'],
    ['disabledDate', '(current: moment) => boolean', 'disable selection for a date'],
    ['disabledTime', '(dates, type) => Object', 'disable time per start/end side'],
    ['showClear', 'Boolean', 'show the clear button'],
    ['type', "'both' | 'start' | 'end'", 'fix start, end, or both range values'],
    ['mode', "('date' | 'month' | 'year' | 'decade')[]", 'per-panel mode'],
    ['hoverValue / onHoverChange', 'moment[] / Function', 'controlled hover preview'],
    ['onSelect / onInputSelect / onChange / onClear', 'Function', 'range callbacks'],
];

const pickerProps = [
    ['calendar', 'ReactElement', 'calendar component rendered in the popup'],
    ['value / defaultValue', 'moment | moment[]', 'controlled or uncontrolled picker value'],
    ['open / onOpenChange', 'Boolean / Function', 'controlled popup visibility'],
    ['placement / align', 'String | Object', 'popup placement and dom-align config'],
    ['animation / transitionName', 'String', 'popup motion class names'],
    ['getCalendarContainer', '() => HTMLElement', 'popup container, defaults to document.body'],
    ['onChange', 'Function', 'called when the value changes'],
];

const fullCalendarProps = [
    ['value / defaultValue', 'moment', 'controlled or uncontrolled selected date'],
    ['type / defaultType', 'String', 'controlled or initial panel type, date or month'],
    ['fullscreen', 'Boolean', 'fullscreen layout'],
    ['monthCellRender / dateCellRender', 'Function', 'custom cell renderers'],
    ['monthCellContentRender / dateCellContentRender', 'Function', 'append content to default cells'],
    ['onSelect / onTypeChange', 'Function', 'selection and type-change callbacks'],
];

const PropsTable = ({ rows }: { rows: string[][] }): JSX.Element => (
    <table style={tableStyle}>
        <thead>
            <tr>
                <th style={cellStyle}>name</th>
                <th style={cellStyle}>type</th>
                <th style={cellStyle}>description</th>
            </tr>
        </thead>
        <tbody>
            {rows.map(([name, type, description]) => (
                <tr key={name}>
                    <td style={cellStyle}>
                        <code>{name}</code>
                    </td>
                    <td style={cellStyle}>
                        <code>{type}</code>
                    </td>
                    <td style={cellStyle}>{description}</td>
                </tr>
            ))}
        </tbody>
    </table>
);

const ReadmeContent = (): JSX.Element => (
    <section aria-labelledby="documentation" style={sectionStyle}>
        <h2 id="documentation">rc-calendar</h2>
        <p>React Calendar component, built around moment for date math and i18n.</p>

        <h3>Fork note</h3>
        <p>
            This fork exists to keep <code>rc-calendar</code> usable in modern React applications,
            especially React 19. It preserves the historical API and examples while modernizing the
            build, tests, demo deployment, and React usage patterns.
        </p>

        <h3>Installation</h3>
        <pre style={codeStyle}>
            <code>{`npm install @patriksimms/calendar
bun add @patriksimms/calendar
yarn add @patriksimms/calendar`}</code>
        </pre>

        <h3>Usage</h3>
        <pre style={codeStyle}>
            <code>{`import { createRoot } from 'react-dom/client';
import Calendar from '@patriksimms/calendar';
import '@patriksimms/calendar/assets/index.css';

createRoot(document.getElementById('root')).render(<Calendar />);`}</code>
        </pre>

        <h3>Features</h3>
        <ul>
            <li>date, month, year, decade, and time panels</li>
            <li>range calendar with two synced panels and hover preview</li>
            <li>full calendar with month/date layouts</li>
            <li>week-number selection mode</li>
            <li>localized labels and moment utcOffset time zones</li>
            <li>ARIA attributes and keyboard navigation</li>
            <li>React 16.9 through React 19 support</li>
        </ul>

        <h3>Styles</h3>
        <p>
            Import <code>@patriksimms/calendar/assets/index.css</code> for compiled styles, or{' '}
            <code>@patriksimms/calendar/assets/index.less</code> for Less source theming.
        </p>

        <h3>Keyboard</h3>
        <ul>
            <li>PageUp: previous month</li>
            <li>PageDown: next month</li>
            <li>Ctrl + Left: previous year</li>
            <li>Ctrl + Right: next year</li>
            <li>Up/Down in time inputs: step hour, minute, or second values</li>
        </ul>

        <h3>API</h3>
        <h4>Calendar props</h4>
        <PropsTable rows={calendarProps} />

        <h4>RangeCalendar props</h4>
        <PropsTable rows={rangeProps} />

        <h4>Picker props</h4>
        <PropsTable rows={pickerProps} />

        <h4>FullCalendar props</h4>
        <PropsTable rows={fullCalendarProps} />

        <h3>Development</h3>
        <pre style={codeStyle}>
            <code>{`bun install
bun run typecheck
bun run lint
bun run test
bun run build`}</code>
        </pre>
    </section>
);

export default ReadmeContent;
