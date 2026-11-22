(function (root) {
  "use strict";
  const MEETING_MS = 3 * 60 * 1000;
  const timestamp = (value) => value ? Date.parse(value) : NaN;
  const iso = (value) => new Date(value).toISOString();

  function remaining(state, now = Date.now()) {
    if (state.dismissed) return 0;
    if (Number.isFinite(state.emergencyClockPause?.remainingMs)) return Math.max(0, state.emergencyClockPause.remainingMs);
    const pause = state.boardroomClockPause;
    if (pause && Number.isFinite(pause.remainingMs) && Number.isFinite(timestamp(pause.resumeAt))) {
      return Math.max(0, pause.remainingMs - Math.max(0, now - timestamp(pause.resumeAt)));
    }
    return Math.max(0, (timestamp(state.sessionEndsAt) || 0) - now);
  }

  function endMeeting(state, now = Date.now()) {
    const pause = state.boardroomClockPause;
    if (pause && Number.isFinite(pause.remainingMs) && Number.isFinite(timestamp(pause.resumeAt))) {
      // Credit only actual meeting time, never time beyond the three-minute deadline.
      state.sessionEndsAt = iso(Math.min(now, timestamp(pause.resumeAt)) + pause.remainingMs);
    }
    state.boardroomClockPause = null;
    state.meetingActive = false;
    state.meetingEndsAt = null;
  }

  function startMeeting(state, now = Date.now()) {
    const left = remaining(state, now);
    if (!state.onboardingComplete || state.meetingUsed || state.sessionReportShown || state.emergencyClockPause || left <= 0) return false;
    state.meetingUsed = true;
    state.meetingActive = true;
    state.meetingStartedAt = iso(now);
    state.meetingEndsAt = iso(now + MEETING_MS);
    state.boardroomClockPause = { remainingMs: left, resumeAt: state.meetingEndsAt };
    return true;
  }

  function restore(state, now = Date.now()) {
    if (!state.onboardingComplete || state.dismissed || state.sessionReportShown) {
      state.emergencyClockPause = null;
      state.boardroomClockPause = null;
      state.meetingActive = false;
      return state;
    }
    if (!state.meetingActive) {
      if (state.boardroomClockPause) endMeeting(state, now);
      return state;
    }
    let started = timestamp(state.meetingStartedAt);
    const oldEnd = timestamp(state.meetingEndsAt);
    // Older saves used a four-minute meeting and did not pause the main clock.
    if (!Number.isFinite(started)) started = oldEnd - 4 * 60 * 1000;
    if (!Number.isFinite(started) || !Number.isFinite(oldEnd)) {
      state.boardroomClockPause = null;
      state.meetingActive = false;
      state.meetingEndsAt = null;
      return state;
    }
    state.meetingStartedAt = iso(started);
    state.meetingUsed = true;
    state.meetingEndsAt = iso(Math.min(oldEnd, started + MEETING_MS));
    const pause = state.boardroomClockPause;
    state.boardroomClockPause = {
      remainingMs: Math.max(0, Number.isFinite(pause?.remainingMs) ? pause.remainingMs : remaining(state, now)),
      resumeAt: state.meetingEndsAt,
    };
    if (now >= timestamp(state.meetingEndsAt)) endMeeting(state, now);
    return state;
  }

  root.SecondOrderSessionClock = { MEETING_MS, remaining, startMeeting, endMeeting, restore };
})(typeof window !== "undefined" ? window : globalThis);
