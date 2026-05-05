import { useEffect, useState } from 'react';
import Basic from './demos/Basic';
import Container from './demos/Container';
import ControlPanel from './demos/ControlPanel';
import CustomClearIcon from './demos/CustomClearIcon';
import FullCalendar from './demos/FullCalendar';
import MonthCalendar from './demos/MonthCalendar';
import RangeCalendar from './demos/RangeCalendar';
import StartEnd from './demos/StartEnd';
import StartEndRange from './demos/StartEndRange';
import WeekCalendar from './demos/WeekCalendar';

type Demo = {
    slug: string;
    label: string;
    Component: () => JSX.Element;
};

const demos: Demo[] = [
    { slug: 'basic', label: 'Basic', Component: Basic },
    { slug: 'range', label: 'Range', Component: RangeCalendar },
    { slug: 'week', label: 'Week', Component: WeekCalendar },
    { slug: 'month', label: 'Month', Component: MonthCalendar },
    { slug: 'full', label: 'Full Calendar', Component: FullCalendar },
    { slug: 'custom-clear-icon', label: 'Custom Clear Icon', Component: CustomClearIcon },
    { slug: 'container', label: 'Container', Component: Container },
    { slug: 'control-panel', label: 'Control Panel', Component: ControlPanel },
    { slug: 'start-end', label: 'Start / End', Component: StartEnd },
    { slug: 'start-end-range', label: 'Start / End Range', Component: StartEndRange },
];

const initialSlug = (): string => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    return demos.some((demo) => demo.slug === hash) ? hash : demos[0].slug;
};

const App = (): JSX.Element => {
    const [slug, setSlug] = useState<string>(initialSlug);

    useEffect(() => {
        const onHashChange = () => setSlug(initialSlug());
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    const active = demos.find((demo) => demo.slug === slug) ?? demos[0];
    const Active = active.Component;

    return (
        <div style={{ fontFamily: 'system-ui, sans-serif', padding: 16 }}>
            <header style={{ borderBottom: '1px solid #ddd', paddingBottom: 12, marginBottom: 16 }}>
                <h1 style={{ margin: '0 0 8px' }}>rc-calendar examples</h1>
                <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {demos.map((demo) => {
                        const isActive = demo.slug === active.slug;
                        return (
                            <a
                                key={demo.slug}
                                href={`#/${demo.slug}`}
                                style={{
                                    padding: '4px 10px',
                                    border: '1px solid #ccc',
                                    borderRadius: 4,
                                    textDecoration: 'none',
                                    color: isActive ? '#fff' : '#333',
                                    background: isActive ? '#3fc7fa' : '#fff',
                                }}
                            >
                                {demo.label}
                            </a>
                        );
                    })}
                </nav>
            </header>
            <main>
                <Active />
            </main>
        </div>
    );
};

export default App;
