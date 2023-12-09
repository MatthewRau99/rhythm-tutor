import { findSingleNote, compareAbsNumbers, compareNumbers, getPlacement, getBeatName, getTimingString } from './FeedbackUtil'

export function feedbackRight(problem, recorded, expected, connected, margins, played, acceptedMargin) {

    const badMargins = margins.filter(note => (note > acceptedMargin || note < -acceptedMargin))
    var success = false
    var feedback = ""
    if (badMargins.length == 1 && badMargins.every(note => note > 0) ) {
        const bad = findSingleNote(recorded, expected)
        if (Math.abs(badMargins[0]) < 1.5 * acceptedMargin) {
            feedback = `You were slightly early on ${getBeatName(problem.beats[bad])}`
        }
        else {
            feedback = `You played on ${getBeatName(played[bad])} instead of ${getBeatName(problem.beats[bad])}`
        }
    }
    else if (badMargins.length == 1 && badMargins.every(note => note < 0)) {
        const bad = findSingleNote(recorded, expected)
        if (Math.abs(badMargins[0]) < 1.5 * acceptedMargin) {
            feedback = `You were slightly late on ${getBeatName(problem.beats[bad])}`
        }
        else {
            feedback = `You played on ${getBeatName(played[bad])} instead of ${getBeatName(problem.beats[bad])}`
        }
    }
    else if (badMargins.length > 1 && badMargins.every(note => note > 0)) {
        const veryBad = badMargins.filter(note => note >  1.5 * acceptedMargin)
        if (veryBad.length == 0) {
            if (badMargins.length >= Math.ceil(0.5 * problem.beats.length)) {
                feedback = "You are slightly rushing"
            }
            else {
                badMargins.sort(compareNumbers).reverse()
                const chosen = [
                    problem.beats[margins.findIndex((element) => element == badMargins[0])],
                    problem.beats[margins.findIndex((element) => element == badMargins[1])]
                ].sort(compareNumbers)
                feedback = `You were slightly early on a few notes, such as ${getBeatName(chosen[0])} and ${getBeatName(chosen[1])}`
            }
        }
        else if (badMargins.length >= Math.ceil(0.5 * problem.beats.length)) {
            // TODO check for skipped rest
            feedback = "You are rushing"
        }
        else {
            const chosen = []
            for (let margin of badMargins) {
                chosen.push(margins.findIndex((element) => element == margin))
            }
            // TODO deal with more than two early
            feedback = `You were early on the ${getPlacement(chosen[0])} and ${getPlacement(chosen[1])} notes`
        }
    }
    else if (badMargins.length > 1 && badMargins.every(note => note < 0)) {
        const veryBad = badMargins.filter(note => note <  -(1.5 * acceptedMargin))
        if (veryBad.length == 0) {
            if (badMargins.length >= Math.ceil(0.5 * problem.beats.length)) {
                feedback = "You are slightly dragging"
            }
            else {
                badMargins.sort(compareNumbers)
                const chosen = [
                    problem.beats[margins.findIndex((element) => element == badMargins[0])],
                    problem.beats[margins.findIndex((element) => element == badMargins[1])]
                ].sort(compareNumbers)
                feedback = `You were slightly early on a few notes, such as ${getBeatName(chosen[0])} and ${getBeatName(chosen[1])}`
            }
        }
        else if (badMargins.length >= Math.ceil(0.5 * problem.beats.length)) {
            // TODO check for added beat
            feedback = "You are dragging"
        }
        else {
            const chosen = []
            for (let margin of badMargins) {
                chosen.push(margins.findIndex((element) => element == margin))
            }
            // TODO deal with more than two early
            feedback = `You were late on the ${getPlacement(chosen[0])} and ${getPlacement(chosen[1])} notes`
        }
    }
    else if (badMargins.length > 1) {
        badMargins.sort(compareAbsNumbers).reverse()
        const chosen = [
            problem.beats[margins.findIndex((element) => element == badMargins[0])],
            problem.beats[margins.findIndex((element) => element == badMargins[1])]
        ]
        // TODO order chronologically and deal with more than two problems.
        feedback = `You were ${getTimingString(badMargins[0], acceptedMargin)} on ${getBeatName(chosen[0])} and ${getTimingString(badMargins[1], acceptedMargin)} on ${getBeatName(chosen[1])}`
    }
    else {
        feedback = 'Good Job!'
        success = true
    }
    return {'feedback': feedback, 'success': success}
}

