

export type Appointment = {
    id: string;
    doctorId: string;
    patientId: string;
    start: number; // timestamp
    end: number;   // timestamp
    type: "NORMAL" | "EMERGENCY";
    approvedBy?: string; // required for EMERGENCY
};

export type ScheduleResult = {
    allowed: boolean;
    reason?: string;
    warning?: string;
};

/**
 * Determines whether a candidate appointment can be scheduled.
 * 
 * Rules:
 * 1. A doctor cannot have overlapping NORMAL appointments.
 * 2. EMERGENCY appointments may overlap NORMAL ones but must be approved.
 * 3. NORMAL appointments may NOT overlap EMERGENCY appointments.
 * 4. Appointments ending exactly when another starts are allowed.
 * 5. If appointments start within 5 minutes of another, allow but return a warning.
 * 6. Every rejection must include a reason.
 */
export function canSchedule(
    existing: Appointment[],
    candidate: Appointment
): ScheduleResult {
    const FIVE_MINUTES_MS = 5 * 60 * 1000;
    const warnings: string[] = [];

    // Filter appointments for the relevant doctor only
    const doctorAppointments = existing.filter(a => a.doctorId === candidate.doctorId);

    // Initial validity checks for the candidate itself
    if (candidate.start >= candidate.end) {
        return { allowed: false, reason: "Appointment start time must be before end time." };
    }

    for (const appt of doctorAppointments) {
        // Check for overlaps
        // Two intervals [start1, end1) and [start2, end2) overlap if start1 < end2 && start2 < end1
        // We use strict inequality because rule 4 says: "Appointments ending exactly when another starts are allowed."
        const isOverlapping = candidate.start < appt.end && appt.start < candidate.end;

        if (isOverlapping) {
            // Case A: Candidate is NORMAL
            if (candidate.type === "NORMAL") {
                // Rule 1: Cannot overlap overlapping NORMAL appointments
                if (appt.type === "NORMAL") {
                    return {
                        allowed: false,
                        reason: `Candidate NORMAL appointment overlaps with existing NORMAL appointment ${appt.id}.`
                    };
                }
                // Rule 3: NORMAL appointments may NOT overlap EMERGENCY appointments
                if (appt.type === "EMERGENCY") {
                    return {
                        allowed: false,
                        reason: `Candidate NORMAL appointment cannot overlap with existing EMERGENCY appointment ${appt.id}.`
                    };
                }
            }

            // Case B: Candidate is EMERGENCY
            if (candidate.type === "EMERGENCY") {
                // Rule 2: EMERGENCY appointments may overlap NORMAL ones but must be approved.
                if (appt.type === "NORMAL") {
                    if (!candidate.approvedBy) {
                        return {
                            allowed: false,
                            reason: "EMERGENCY appointment overlapping with NORMAL appointment must be approved."
                        };
                    }
                    // If approved, it is allowed (continue checking other appointments)
                    // Note: We don't return early success here because it might overlap *another* illegal appointment
                }

                // Assumption: EMERGENCY cannot overlap another EMERGENCY appointment (common sense, though prompt is silent)
                // If the prompt strictly allows anything not forbidden, we might skip this. 
                // However, "Safe Appointment Scheduling Engine" implies correctness.
                if (appt.type === "EMERGENCY") {
                    return {
                        allowed: false,
                        reason: `Candidate EMERGENCY appointment overlaps with existing EMERGENCY appointment ${appt.id}.`
                    };
                }
            }
        }

        // Rule 5: If appointments start within 5 minutes of another, allow but return a warning.
        // We check this regardless of overlap correctness, assuming it's legally scheduled.
        // "Start within 5 minutes of another" interpreted as abs(start - start) < 5 mins
        const startDiff = Math.abs(candidate.start - appt.start);
        if (startDiff < FIVE_MINUTES_MS && startDiff >= 0) { // >= 0 check is redundant but clear
             // Check if we haven't already added this warning generically, or add specific details
             // Only add warning if allowed? The return type has one warning field.
             // If multiple warnings, we might concatenate or pick the first.
             // We'll accumulate and join them at the end if allowed.
             warnings.push(`Starts within 5 minutes of appointment ${appt.id}`);
        }
    }

    return {
        allowed: true,
        // If there are warnings, join them. Otherwise undefined.
        warning: warnings.length > 0 ? warnings.join("; ") : undefined
    };
}


/*
--------------------------------------------------
ADDITIONAL DISCUSSION
--------------------------------------------------

1. How would you prevent race conditions in a multi-server setup?

In a multi-server environment, multiple requests might try to schedule appointments for the same doctor simultaneously. 
If both fetch the `existing` list at the same time, neither sees the other, and both might successfully write overlapping appointments to the database.

Strategies:
- Database Transactions & Locking: Use a transaction with `SERIALIZABLE` isolation level or row-level locking (e.g., `SELECT ... FOR UPDATE` in SQL) when fetching the doctor's existing appointments. This ensures that only one process can read/write a doctor's schedule at a time.
- Optimistic Locking: Add a version number to the doctor's schedule or aggregate record. When writing, check if the version matches what was read. If not, retry.
- Distributed Locks: Use a distributed locking mechanism (e.g., Redis / Redlock) keying off the `doctorId`. A server must acquire the lock for `doctor:{id}` before checking and booking.
- Constraint Constraints: Use database-level exclusion constraints (e.g., PostgreSQL `EXCLUDE USING GIST`) to physically prevent overlapping time ranges for the same doctor at the DB layer as a final safety net.

2. What assumptions are you making?

- Data Consistency: `start` and `end` are valid timestamps (numbers) and `start < end` (though I included a basic check).
- Scope: We only care about `doctorId`. `patientId` logic (e.g., a patient can't be in two places) is ignored for this specific function scope.
- Emergency Overlap: I assumed that an EMERGENCY appointment cannot overlap another EMERGENCY appointment. The rules didn't explicitly forbid it, but physically it's impossible for one doctor.
- "Starts within 5 minutes": Interpreted as the absolute difference between `start` times being less than 5 minutes.
- Approval Validity: `approvedBy` is just a string check. We assume logic validating that user exists or has permissions is handled elsewhere.
- Timezone: Timestamps are UTC or consistently uniform (Unix epoch).

3. What would you explicitly not solve yet?

- Recurrence: Repeating appointments (daily, weekly) add significant complexity to collision detection.
- Shift / Availability Logic: We are checking against "Existing Appointments", but not against "Doctor's Working Hours" or "Holidays".
- Patient Constraints: Preventing double-booking for the *patient*.
- Authorization: Verifying if `approvedBy` is actually a valid supervisor.
- Performance optimization for massive datasets: Linear scan `O(N)` is fine for one doctor's schedule, but if history grows indefinitely, we'd need time-range queries (e.g., "fetch appointments only for this day").

*/
