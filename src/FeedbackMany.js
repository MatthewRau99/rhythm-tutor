// import { findSingleNote, compareAbsNumbers, compareNumbers, getPlacement, getBeatName, getTimingString } from './FeedbackUtil'

import { findDuplicates, getBeatName } from "./FeedbackUtil"

export function feedbackMany(problem, recorded, expected, connected, played) { 
    var feedback = ""
    const unconnected = expected.filter(x => !connected.includes(x))
    const duplicates = findDuplicates(connected)
    var dupeRecorded = []
    var dupeConnected = []
    for (const dupe of duplicates) {
        dupeRecorded.push(recorded[dupe])
        dupeConnected.push(connected[dupe])
    }
    var prefix = ""
    if (played.length == problem.beats.length + 1) {
        if (unconnected.length == 0) {
            const closer = closest(dupeConnected[0], dupeRecorded)
            if (closer == dupeRecorded[0]) { prefix = 'after' }
            else { prefix = 'before' }

            feedback = `You played an extra note ${prefix} ${getBeatName(problem.beats[expected.findIndex((element) => element == dupeConnected[0])])}`
        } else {
            feedback = `Played one extra note`
        }
    } else if (played.length == problem.beats.length + 2) {
        if (unconnected.length == 0) {
            const closer = closest(dupeConnected[0], dupeRecorded.slice(0,2))
            if (closer == dupeRecorded[0]) { prefix = 'after' }
            else { prefix = 'before' }

            const closer2 = closest(dupeConnected[2], dupeRecorded.slice(2,4))
            var prefix2 = ""
            if (closer2 == dupeRecorded[2]) { prefix2 = 'after' }
            else { prefix2 = 'before' }

            feedback = `You played an extra note ${prefix} ${getBeatName(problem.beats[expected.findIndex((element) => element == dupeConnected[0])])} and ${prefix2} ${getBeatName(problem.beats[expected.findIndex((element) => element == dupeConnected[2])])}`
        } else {
            feedback = `Played two extra notes`
        }    
    } else {
        feedback = `You played many extra notes, try reading the passage carefully before trying again.`
    }

    return {'feedback': feedback, 'success': false}
}

function closest (num, arr) {
    var curr = arr[0];
    var diff = Math.abs (num - curr);
    for (var val = 0; val < arr.length; val++) {
        var newdiff = Math.abs (num - arr[val]);
        if (newdiff < diff) {
            diff = newdiff;
            curr = arr[val];
        }
    }
    return curr;
}