
import { canSchedule, Appointment } from "./index";

function runTest(name: string, existing: Appointment[], candidate: Appointment, expectedAllowed: boolean, expectedReasonPart?: string, expectedWarning?: boolean) {
    console.log(`Running test: ${name}`);
    const result = canSchedule(existing, candidate);
    
    if (result.allowed !== expectedAllowed) {
        console.error(`FAILED: Expected allowed=${expectedAllowed}, but got ${result.allowed}`);
        if(result.reason) console.error(`Reason: ${result.reason}`);
        return;
    }

    if (!expectedAllowed && expectedReasonPart && result.reason) {
        if (!result.reason.includes(expectedReasonPart)) {
            console.error(`FAILED: Reason did not contain "${expectedReasonPart}". Got: "${result.reason}"`);
            return;
        }
    }

    if (expectedWarning) {
        if (!result.warning) {
            console.error(`FAILED: Expected warning but got none.`);
            return;
        } else {
            console.log(`  Warning received as expected: ${result.warning}`);
        }
    } else if (result.warning) {
        console.error(`FAILED: Unexpected warning: ${result.warning}`);
        return;
    }

    console.log("PASSED");
}

const baseTime = 1000000000000; // Arbitrary start
const oneHour = 60 * 60 * 1000;

const docId = "doc1";
const patId = "pat1";

const normalAppt: Appointment = {
    id: "existing1",
    doctorId: docId,
    patientId: "patA",
    start: baseTime,
    end: baseTime + oneHour, // 10:00 - 11:00
    type: "NORMAL"
};

const existingList = [normalAppt];

// Test 1: Normal overlap Normal (Rule 1) - Should fail
runTest(
    "Normal overlap Normal",
    existingList,
    {
        id: "cand1",
        doctorId: docId,
        patientId: patId,
        start: baseTime + 1000, // Starts inside
        end: baseTime + oneHour + 1000,
        type: "NORMAL"
    },
    false,
    "overlaps with existing NORMAL"
);

// Test 2: Normal touching Normal (Rule 4) - Should pass
runTest(
    "Normal touching Normal (End to Start)",
    existingList,
    {
        id: "cand2",
        doctorId: docId,
        patientId: patId,
        start: baseTime + oneHour, // Starts exactly when previous ends
        end: baseTime + 2 * oneHour,
        type: "NORMAL"
    },
    true
);

// Test 3: Emergency overlapping Normal without approval (Rule 2) - Should fail
runTest(
    "Emergency overlapping Normal (No Approval)",
    existingList,
    {
        id: "cand3",
        doctorId: docId,
        patientId: patId,
        start: baseTime + 1000,
        end: baseTime + oneHour / 2,
        type: "EMERGENCY"
    },
    false,
    "must be approved"
);

// Test 4: Emergency overlapping Normal WITH approval (Rule 2) - Should pass
runTest(
    "Emergency overlapping Normal (With Approval)",
    existingList,
    {
        id: "cand4",
        doctorId: docId,
        patientId: patId,
        start: baseTime + 1000,
        end: baseTime + oneHour / 2,
        type: "EMERGENCY",
        approvedBy: "Admin"
    },
    true,
    undefined,
    true // Warning expected because start time diff is small! (1000ms < 5min)
);

// Test 5: Normal overlapping Emergency (Rule 3) - Should fail
const emergencyList: Appointment[] = [{
    id: "emerg1",
    doctorId: docId,
    patientId: "patB",
    start: baseTime,
    end: baseTime + oneHour,
    type: "EMERGENCY",
    approvedBy: "Admin"
}];

runTest(
    "Normal overlapping Emergency",
    emergencyList,
    {
        id: "cand5",
        doctorId: docId,
        patientId: patId,
        start: baseTime + 1000,
        end: baseTime + oneHour + 1000,
        type: "NORMAL"
    },
    false,
    "cannot overlap with existing EMERGENCY"
);

// Test 6: Warning check (Rule 5)
// Gap is large, no overlap, but starts close?
// Actually, rule 5: "If appointments start within 5 minutes of another"
// If I schedule one at 12:00-13:00.
// Another at 12:04-13:04 (Normal-Normal overlap -> Fail).
// Another at 13:00-14:00. Start diff = 60 mins. No warning.
// Another at 12:00-13:00 (Emergency). Overlap allowed. Start diff = 0. Warning? Yes.
// Let's test non-overlapping but close start? 
// 10:00 - 10:01 (Short appt).
// 10:04 - 10:05.
// No overlap. Start diff 4 mins. Should warn.

const shortAppt: Appointment = {
    id: "short1",
    doctorId: docId,
    patientId: "patC",
    start: baseTime,
    end: baseTime + 60 * 1000, // 1 min duration
    type: "NORMAL"
};

runTest(
    "Close start times warning",
    [shortAppt],
    {
        id: "cand6",
        doctorId: docId,
        patientId: patId,
        start: baseTime + 4 * 60 * 1000, // starts 4 mins later
        end: baseTime + 10 * 60 * 1000,
        type: "NORMAL"
    },
    true, // Allowed (no overlap: [0,1] vs [4,10])
    undefined,
    true // Warning expected
);
