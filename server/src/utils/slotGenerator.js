/**
 * Slot generation & time helpers for the appointment scheduling workflow.
 * Availability is derived from a doctor's real OPD schedule so the public UI
 * never depends on hardcoded slot arrays.
 */

const SLOT_MINUTES = 30;
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Parse "09:30 AM" -> minutes since midnight. Returns null if unparseable.
export function parseClockToMinutes(str) {
  if (!str) return null;
  const m = String(str).trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return null;
  let hours = parseInt(m[1], 10);
  const minutes = parseInt(m[2], 10);
  const mer = m[3].toUpperCase();
  if (mer === 'PM' && hours !== 12) hours += 12;
  if (mer === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

// Minutes since midnight -> "09:30 AM"
export function minutesToClock(mins) {
  let hours = Math.floor(mins / 60) % 24;
  const minutes = mins % 60;
  const mer = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  return `${hh}:${mm} ${mer}`;
}

// Extract the first "<clock> - <clock>" range from a free-text schedule string.
export function extractTimingRange(availableTimings) {
  if (!availableTimings) return null;
  const matches = String(availableTimings).match(/\d{1,2}:\d{2}\s*[AP]M/gi);
  if (!matches || matches.length < 2) return null;
  const start = parseClockToMinutes(matches[0]);
  const end = parseClockToMinutes(matches[1]);
  if (start == null || end == null || end <= start) return null;
  return { start, end };
}

export function isWeekdayAvailable(doctor, dateISO) {
  const days = doctor?.availableDays;
  if (!Array.isArray(days) || days.length === 0) return true;
  const d = new Date(`${dateISO}T00:00:00`);
  if (Number.isNaN(d.getTime())) return true;
  const name = DAY_NAMES[d.getDay()];
  return days.some((day) => day.slice(0, 3).toLowerCase() === name.toLowerCase());
}

/**
 * Return the canonical list of time-slot windows for a doctor on a date,
 * based on their schedule. Falls back to a standard 09:00-17:00 OPD grid
 * (skipping the 12:30-14:00 lunch break) when a precise range is unavailable.
 */
export function generateSlotWindowsForDoctor(doctor, dateISO) {
  if (!isWeekdayAvailable(doctor, dateISO)) return [];

  const range = extractTimingRange(doctor?.availableTimings);
  let start;
  let end;
  if (range) {
    start = range.start;
    end = range.end;
  } else {
    start = 9 * 60;
    end = 17 * 60;
  }

  const windows = [];
  for (let t = start; t + SLOT_MINUTES <= end; t += SLOT_MINUTES) {
    // Skip hospital lunch break 12:30-14:00 when the day spans it
    if (t >= 12 * 60 + 30 && t < 14 * 60) continue;
    windows.push(`${minutesToClock(t)} - ${minutesToClock(t + SLOT_MINUTES)}`);
  }
  return windows;
}
