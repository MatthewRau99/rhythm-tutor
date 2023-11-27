// import { findSingleNote, compareAbsNumbers, compareNumbers, getPlacement, , getTimingString } from './FeedbackUtil'
import { hasDuplicates, getBeatName, findDuplicates } from "./FeedbackUtil"

export function feedbackFew(problem, recorded, expected, connected, played) { 
    var feedback = ""
    // const badMargins = margins.filter(note => (note > acceptedMargin || note < -acceptedMargin))


    if (!hasDuplicates(connected)) {
        if (played.length == problem.beats.length - 1) {
            const missed = expected.filter(x => !connected.includes(x))[0]
            feedback = `You missed the note on ${getBeatName(problem.beats[expected.findIndex((element) => element == missed)])}`
        } else if (played.length == problem.beats.length - 2) {
            const missed = expected.filter(x => !connected.includes(x))
            const chosen =  [
                problem.beats[expected.findIndex((element) => element == missed[0])],
                problem.beats[expected.findIndex((element) => element == missed[1])]
            ]
            feedback = `You missed the note on ${getBeatName(chosen[0])} and ${getBeatName(chosen[1])}`
        } else {
            feedback = `You missed many notes, try reading the passage carefully before trying again.`
        }
    }
    else {
        const unconnected = expected.filter(x => !connected.includes(x))
        let duplicates = findDuplicates(connected)
        const dupRecorded = []
        for (const index of duplicates) {
            dupRecorded.push(recorded[index])
        }
        var temp = null
        while (unconnected.length > problem.beats.length - played.length) {
            temp = smallestDifference(unconnected, dupRecorded)
            unconnected.splice(temp[0],1)
            dupRecorded.splice(temp[1],1)
        }



        if (played.length == problem.beats.length - 1) { 
            const missed = unconnected[0]
            feedback = `You missed the note on ${getBeatName(problem.beats[expected.findIndex((element) => element == missed)])}`
        } else if (played.length == problem.beats.length - 2) {
            const missed = unconnected
            const chosen =  [
                problem.beats[expected.findIndex((element) => element == missed[0])],
                problem.beats[expected.findIndex((element) => element == missed[1])]
            ]
            feedback = `You missed the note on ${getBeatName(chosen[0])} and ${getBeatName(chosen[1])}`
        } else {
            feedback = `You missed many notes, try reading the passage carefully before trying again.`
        }
    }

    return {'feedback': feedback, 'success': false}
}

function smallestDifference(arr1, arr2){
    if(arr1.length === 0 || arr2.length === 0){ return -1; }
    let result = Number.MAX_SAFE_INTEGER; // (2^53) - 1
    var sI = 0
    var sJ = 0
    
    for(let i = 0; i < arr1.length; i++){
      for(let j = 0; j < arr2.length; j++){
        if(Math.abs(arr1[i] - arr2[j]) < result){
          result = Math.abs(arr1[i] - arr2[j]);
          sI = i
          sJ = j
        }
      }    
    }
    return [sI, sJ];
  }