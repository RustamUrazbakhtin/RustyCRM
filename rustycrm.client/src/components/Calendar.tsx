import React, { useMemo, useState } from "react";
import "./Calendar.css";

type EventType = "orange" | "green" | "blue" | "gray" | "red";

interface CalendarEvent {
    date: string;          // формат YYYY-MM-DD
    title: string;
    type: EventType;
}

const eventsData: CalendarEvent[] = [
    { date: "2024-04-01", title: "Meeting", type: "orange" },
    { date: "2024-04-12", title: "Yoga", type: "green" },
    { date: "2024-04-17", title: "Project Deadline", type: "blue" },
    { date: "2024-04-22", title: "Doctor Appointment", type: "gray" },
    { date: "2024-04-23", title: "Dinner", type: "red" },
    { date: "2024-04-29", title: "Workshop", type: "orange" },
];

const getDaysInMonth = (year: number, month: number): number =>
    new Date(year, month + 1, 0).getDate();

const Calendar: React.FC = () => {
    // мес€цы: 0Ц11, 3 = апрель
    const [month] = useState<number>(3);
    const [year] = useState<number>(2024);

    // 0 = воскресенье ... 6 = суббота
    const firstDayOfMonth = useMemo<number>(() => new Date(year, month, 1).getDay(), [year, month]);

    const days: Array<number | null> = useMemo(() => {
        const arr: Array<number | null> = [];
        for (let i = 0; i < firstDayOfMonth; i++) arr.push(null);
        for (let d = 1; d <= getDaysInMonth(year, month); d++) arr.push(d);
        return arr;
    }, [year, month, firstDayOfMonth]);

    const getEventsForDay = (day: number): CalendarEvent[] => {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        return eventsData.filter((e) => e.date === dateStr);
    };

    return (
        <div className="calendar">
            <div className="header">
                <h2>{`${year}-${String(month + 1).padStart(2, "0")}`}</h2>
                <button type="button">New Event</button>
            </div>

            <div className="days-names">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d} className="day-name">
                        {d}
                    </div>
                ))}
            </div>

            <div className="days-grid">
                {days.map((day, idx) => (
                    <div key={idx} className="day-cell">
                        {day !== null && (
                            <>
                                <div>{day}</div>
                                {getEventsForDay(day).map((event, i) => (
                                    <div key={`${event.date}-${i}`} className={`event ${event.type}`}>
                                        {event.title}
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Calendar;
