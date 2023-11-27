// import { findSingleNote, compareAbsNumbers, compareNumbers, getPlacement, getBeatName, getTimingString } from './FeedbackUtil'

export function feedbackMany(problem, recorded, expected, connected, margins, played, acceptedMargin) { 
    var feedback = ""
    const temp = [problem, recorded, expected, connected, margins, played, acceptedMargin]
    console.log(temp)
    if (played.length == problem.beats.length + 1) {
        feedback = `Played one extra note`
    }
    else {
        feedback = `Too many notes played`
    }

    return {'feedback': feedback, 'success': false}
}
