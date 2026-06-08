import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './DatePickerField.module.css';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MIN_YEAR = 1900;

function getTodayDate() {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

function parseDateValue(value) {
  const match = String(value ?? '').match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return null;
  }

  const [, yearString, monthString, dayString] = match;
  const year = Number(yearString);
  const month = Number(monthString);
  const day = Number(dayString);
  const date = new Date(year, month - 1, day);

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function formatDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function buildYearOptions(today) {
  const years = [];

  for (let year = today.getFullYear(); year >= MIN_YEAR; year -= 1) {
    years.push(year);
  }

  return years;
}

function DatePickerField({ input, meta, label }) {
  const fieldRef = useRef(null);
  const today = useMemo(() => getTodayDate(), []);
  const selectedDate = parseDateValue(input.value);
  const initialPanelDate = selectedDate && selectedDate <= today ? selectedDate : today;
  const [isOpen, setIsOpen] = useState(false);
  const [panelYear, setPanelYear] = useState(initialPanelDate.getFullYear());
  const [panelMonth, setPanelMonth] = useState(initialPanelDate.getMonth());
  const fieldError = meta.touched || meta.submitFailed ? meta.error || meta.submitError : '';
  const yearOptions = useMemo(() => buildYearOptions(today), [today]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleDocumentMouseDown(event) {
      if (!fieldRef.current?.contains(event.target)) {
        setIsOpen(false);
        input.onBlur();
      }
    }

    document.addEventListener('mousedown', handleDocumentMouseDown);

    return () => {
      document.removeEventListener('mousedown', handleDocumentMouseDown);
    };
  }, [input, isOpen]);

  function openPanel() {
    const nextPanelDate = selectedDate && selectedDate <= today ? selectedDate : today;
    setPanelYear(nextPanelDate.getFullYear());
    setPanelMonth(nextPanelDate.getMonth());
    setIsOpen(true);
    input.onFocus();
  }

  function closePanel() {
    setIsOpen(false);
    input.onBlur();
  }

  function handleYearChange(event) {
    const nextYear = Number(event.target.value);
    const nextDate = new Date(nextYear, panelMonth, 1);

    if (nextDate > today) {
      setPanelYear(today.getFullYear());
      setPanelMonth(today.getMonth());
      return;
    }

    setPanelYear(nextYear);
  }

  function handleMonthChange(event) {
    const nextMonth = Number(event.target.value);
    const nextDate = new Date(panelYear, nextMonth, 1);

    if (nextDate > today) {
      setPanelYear(today.getFullYear());
      setPanelMonth(today.getMonth());
      return;
    }

    setPanelMonth(nextMonth);
  }

  function selectDay(day) {
    const nextDate = new Date(panelYear, panelMonth, day);

    if (nextDate > today) {
      return;
    }

    input.onChange(formatDateValue(nextDate));
    closePanel();
  }

  const firstWeekday = new Date(panelYear, panelMonth, 1).getDay();
  const daysInMonth = getDaysInMonth(panelYear, panelMonth);
  const leadingBlanks = Array.from({ length: firstWeekday }, (_, index) => `blank-${index}`);
  const dayNumbers = Array.from({ length: daysInMonth }, (_, index) => index + 1);

  return (
    <div className={styles.fieldGroup} ref={fieldRef}>
      <label className={styles.fieldLabel} htmlFor={input.name}>
        {label}
      </label>

      <div className={styles.inputRow}>
        <input
          {...input}
          id={input.name}
          className={styles.dateInput}
          type="text"
          readOnly
          placeholder="YYYY-MM-DD"
          value={input.value || ''}
          onClick={openPanel}
          onFocus={openPanel}
          aria-invalid={Boolean(fieldError)}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
        />
      </div>

      {isOpen ? (
        <div className={styles.panel} role="dialog" aria-label="Choose date of birth">
          <div className={styles.panelHeader}>
            <div className={styles.selectGroup}>
              <select className={styles.monthSelect} value={panelMonth} onChange={handleMonthChange}>
                {MONTH_NAMES.map((monthName, index) => (
                  <option key={monthName} value={index} disabled={new Date(panelYear, index, 1) > today}>
                    {monthName}
                  </option>
                ))}
              </select>
              <select className={styles.yearSelect} value={panelYear} onChange={handleYearChange}>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.weekdayGrid}>
            {WEEKDAY_LABELS.map((weekday) => (
              <span className={styles.weekday} key={weekday}>
                {weekday}
              </span>
            ))}
          </div>

          <div className={styles.dayGrid}>
            {leadingBlanks.map((blankKey) => (
              <span className={styles.blankDay} key={blankKey} />
            ))}
            {dayNumbers.map((day) => {
              const date = new Date(panelYear, panelMonth, day);
              const isFuture = date > today;
              const isSelected = selectedDate?.getTime() === date.getTime();

              return (
                <button
                  className={isSelected ? styles.selectedDayButton : styles.dayButton}
                  type="button"
                  key={day}
                  onClick={() => selectDay(day)}
                  disabled={isFuture}
                  aria-pressed={isSelected}
                >
                  {day}
                </button>
              );
            })}
          </div>

        </div>
      ) : null}

      <p className={styles.fieldError}>{fieldError}</p>
    </div>
  );
}

export default DatePickerField;
