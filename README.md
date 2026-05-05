# @patriksimms/calendar

React Calendar component, built around `moment` for date math and i18n.

## Fork note

This fork exists to keep `rc-calendar` usable in modern React applications,
especially React 19. It preserves the historical API and examples while
modernizing the build, tests, demo deployment, and React usage patterns.

## Features

- date, month, year, decade, and time panels
- range calendar with two synced panels and hover preview
- full calendar with month/date layouts
- week-number selection mode
- localized labels (50+ locales) and `moment.utcOffset` time zones
- ARIA attributes and keyboard navigation
- works with React 16.9+ through React 19

### Browser support

Modern evergreen browsers: latest Chrome, Firefox, Safari, and Edge.

### Keyboard

- Previous month: PageUp
- Next month: PageDown
- Previous year: Ctrl + Left
- Next year: Ctrl + Right
- In hour/minute/second time inputs: Up/Down to step

## Installation

```sh
npm install @patriksimms/calendar
# or
bun add @patriksimms/calendar
# or
yarn add @patriksimms/calendar
```

## Usage

```jsx
import { createRoot } from 'react-dom/client';
import Calendar from '@patriksimms/calendar';
import '@patriksimms/calendar/assets/index.css';

createRoot(document.getElementById('root')).render(<Calendar />);
```

### Styles

The package ships both Less sources and a precompiled stylesheet under
`assets/`:

- `import '@patriksimms/calendar/assets/index.css';` — drop-in compiled styles.
- `import '@patriksimms/calendar/assets/index.less';` — Less source for theming.

## Development

The project uses a modern toolchain:

- **Build:** [`tsdown`](https://github.com/sxzz/tsdown) (rolldown-based)
  emits CJS to `lib/` and ESM to `es/`. Less sources are compiled to
  `assets/index.css` via the `lessc` CLI.
- **Lint / format:** [`oxlint`](https://oxc.rs/docs/guide/usage/linter.html)
  and [`oxfmt`](https://oxc.rs/docs/guide/usage/formatter.html).
- **Type check:** `tsc --noEmit` against `index.d.ts` and the public
  TypeScript surface.
- **Test runner:** [`vitest`](https://vitest.dev) running on `jsdom` with
  [`@testing-library/react`](https://testing-library.com/docs/react-testing-library/intro/).
- **Demo app:** [`vite`](https://vitejs.dev) under `examples/` runs against
  React 19 and the local `src/` sources.
- **Package manager:** [`bun`](https://bun.sh) is the canonical runner; `bun.lock`
  is committed.

```sh
bun install
bun run typecheck
bun run lint
bun run test
bun run build
```

### Examples / demo app

The `examples/` directory is a standalone Vite React 19 app that exercises
the package through its public entry points (Calendar, RangeCalendar,
MonthCalendar, FullCalendar, Picker). It mirrors the historical demo
scenarios — basic, range, week, month, full calendar, custom clear icon,
container, control panel, start/end pickers, and start/end range pickers.

```sh
cd examples
bun install
bun run dev
```

Vite serves the demo at <http://localhost:8002>. Each scenario is
reachable via the in-app navigation (the URL hash is updated to keep
deep links working).

### Testing approach

Tests live under `tests/` as `*.vitest.{ts,tsx}`. They drive the public
DOM surface with `@testing-library/react`, asserting on rendered output
and callback invocations rather than internal component state. A
package smoke test (`tests/package.smoke.vitest.ts`) builds the package
and verifies the published artefacts: CJS/ESM entrypoints, deep imports
(`RangeCalendar`, `MonthCalendar`, `Picker`, `FullCalendar`), locale
imports, the compiled `assets/index.css`, and the `index.d.ts` type
entry.

## API

### Calendar props

| name | type | default | description |
| --- | --- | --- | --- |
| prefixCls | String | | prefix className for this component |
| className | String | | additional className for the root node |
| style | Object | | additional style for the root node |
| dateRender | (current, value) => ReactNode | | custom date cell renderer |
| renderSidebar | () => ReactNode | | sidebar renderer |
| renderFooter | (mode) => ReactNode | | footer renderer |
| value | moment | | controlled value |
| defaultValue | moment | | uncontrolled default value |
| locale | Object | `import '@patriksimms/calendar/lib/locale/en_US'` | locale messages |
| format | String \| String[] | locale-dependent | input format(s) |
| disabledDate | (current: moment) => boolean | | disable selection for a date |
| disabledTime | (current: moment) => Object | | disable hours/minutes/seconds via rc-time-picker |
| showDateInput | Boolean | true | show the input above the panel |
| showWeekNumber | Boolean | false | show week-of-year column |
| showToday | Boolean | true | show the today button |
| showOk | Boolean | auto | show the OK button |
| timePicker | ReactElement | | time picker panel (e.g. `rc-time-picker/lib/Panel`) |
| onSelect | (date: moment) => void | | called when a cell is selected |
| onClear | () => void | | called when clear is pressed |
| onChange | (date: moment \| null) => void | | called when value changes (panel/keyboard) |
| onOk | (date: moment) => void | | called when OK is pressed |
| dateInputPlaceholder | String | | input placeholder |
| mode | 'time' \| 'date' \| 'month' \| 'year' \| 'decade' | 'date' | which panel to show |
| onPanelChange | (date: moment, mode) => void | | called when panel changes |
| clearIcon | ReactNode | | clear-button icon |
| inputMode | String | text | mobile input mode |

### RangeCalendar props

| name | type | default | description |
| --- | --- | --- | --- |
| prefixCls | String | | prefix className for this component |
| className | String | | additional className for the root node |
| style | Object | | additional style for the root node |
| renderSidebar | () => ReactNode | | sidebar renderer |
| renderFooter | () => ReactNode | | footer renderer |
| selectedValue | moment[] | | controlled `[start, end]` |
| defaultSelectedValue | moment[] | | uncontrolled `[start, end]` |
| locale | Object | `import '@patriksimms/calendar/lib/locale/en_US'` | locale messages |
| format | String | locale-dependent | input format |
| disabledDate | (current: moment) => boolean | | disable selection for a date |
| showWeekNumber | Boolean | false | show week-of-year column |
| showToday | Boolean | true | show the today button |
| showOk | Boolean | auto | show the OK button |
| showClear | Boolean | false | show the clear button |
| timePicker | ReactElement | | time picker panel |
| onSelect | (dates: moment[]) => void | | called when a range is picked |
| onInputSelect | (dates: moment[]) => void | | called when the input parses a valid date |
| onClear | () => void | | called when clear is pressed |
| onChange | (dates: moment[]) => void | | called when value changes |
| onOk | (date: moment) => void | | called when OK is pressed |
| dateInputPlaceholder | String[] | | per-input placeholders |
| disabledTime | (dates: moment[], type: 'start' \| 'end') => Object | | disable hours/minutes/seconds |
| showDateInput | Boolean | true | show the inputs above the panels |
| type | 'both' \| 'start' \| 'end' | 'both' | fix start or end of the range |
| mode | ('date' \| 'month' \| 'year' \| 'decade')[] | ['date', 'date'] | per-panel mode |
| onPanelChange | (dates: moment[], modes) => void | | called when panel(s) change |
| hoverValue | moment[] | | controlled hover preview |
| onHoverChange | (dates: moment[]) => void | | called when hover preview changes |
| clearIcon | ReactNode | | clear-button icon |

### MonthCalendar props

| name | type | default | description |
| --- | --- | --- | --- |
| prefixCls | String | | prefix className for this component |
| className | String | | additional className for the root node |
| style | Object | | additional style for the root node |
| value | moment | | controlled value |
| defaultValue | moment | | uncontrolled default value |
| locale | Object | `import '@patriksimms/calendar/lib/locale/en_US'` | locale messages |
| disabledDate | (current: moment) => boolean | | disable selection for a month |
| onSelect | (date: moment) => void | | called when a month is selected |
| onChange | (date: moment) => void | | called when value changes |
| monthCellRender | function | | custom month cell renderer |
| monthCellContentRender | function | | append content to default cell |
| renderFooter | () => ReactNode | | footer renderer |

### Picker props

| name | type | default | description |
| --- | --- | --- | --- |
| prefixCls | String | | prefix className |
| calendar | ReactElement | | the calendar component to render |
| disabled | Boolean | | disable the picker |
| placement | String \| Object | | trigger placement |
| align | Object | | merged into placement's align config (see `dom-align`) |
| animation | String | | popup animation key (e.g. `slide-up`) |
| transitionName | String | | popup transition class |
| value | moment \| moment[] | | controlled value |
| defaultValue | moment \| moment[] | | uncontrolled value |
| onChange | (value) => void | | called when value changes |
| onOpenChange | (open: boolean) => void | | called when popup visibility changes |
| open | Boolean | | controlled open state |
| getCalendarContainer | () => HTMLElement | `() => document.body` | popup container |
| dropdownClassName | String | | className applied to the popup |

### FullCalendar props

| name | type | default | description |
| --- | --- | --- | --- |
| prefixCls | String | | prefix className |
| Select | React component | | rc-select component class |
| value | moment | | controlled value |
| defaultValue | moment | | uncontrolled value |
| defaultType | String | 'date' | initial panel type (`date`/`month`) |
| type | String | | controlled panel type |
| onTypeChange | (type) => void | | called when panel type changes |
| fullscreen | Boolean | false | fullscreen layout |
| monthCellRender | function | | custom month cell renderer |
| dateCellRender | function | | custom date cell renderer |
| monthCellContentRender | function | | append content to default month cell |
| dateCellContentRender | function | | append content to default date cell |
| onSelect | (date: moment) => void | | called when a date/month is selected |

## License

rc-calendar is released under the MIT license.
