// import { findSingleNote, compareAbsNumbers, compareNumbers, getPlacement, getBeatName, getTimingString } from './FeedbackUtil'

export function feedbackFew(problem, recorded, expected, connected, margins, played, acceptedMargin) { 
    var feedback = ""
    const temp = [problem, recorded, expected, connected, margins, played, acceptedMargin]
    console.log(temp)

    if (played.length == problem.beats.length + 1) {
        feedback = `Played one too few notes`
    }
    else {
        feedback = `Too few notes played`
    }

    return {'feedback': feedback, 'success': false}
}
