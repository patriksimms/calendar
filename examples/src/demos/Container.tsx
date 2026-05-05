import { useRef, useState } from 'react';
import Calendar from 'rc-calendar/src/Calendar';
import enUS from 'rc-calendar/src/locale/en_US';
import DatePicker from 'rc-calendar/src/Picker';
import Dialog from 'rc-dialog';
import 'rc-dialog/assets/index.css';
import moment from 'moment';

const format = 'YYYY-MM-DD';

const Container = () => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    return (
        <div>
            <button onClick={() => setOpen(true)}>open dialog</button>
            <Dialog visible={open} onClose={() => setOpen(false)}>
                <div ref={containerRef} />
                <div style={{ marginTop: 20 }}>
                    <DatePicker
                        getCalendarContainer={() => containerRef.current ?? document.body}
                        calendar={<Calendar locale={enUS} />}
                    >
                        {({ value }: { value: moment.Moment | null }) => (
                            <span>
                                <input
                                    style={{ width: 250 }}
                                    readOnly
                                    value={(value && value.format(format)) || ''}
                                />
                            </span>
                        )}
                    </DatePicker>
                </div>
            </Dialog>
        </div>
    );
};

export default Container;
