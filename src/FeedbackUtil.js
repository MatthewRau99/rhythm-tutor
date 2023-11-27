export function findSingleNote(problem, answer) {
    var maxFound = answer[0] - problem[0]
    var index = 0
    for (var i = 1; i < problem.length; i++) {
        if (Math.abs(answer[i] - problem[i]) > Math.abs(maxFound)) {
            maxFound = answer[i] - problem[i]
            index = i
        }
    }
    return index
}

export function compareAbsNumbers(a, b) {
    return Math.abs(a) - Math.abs(b)
}

export function compareNumbers(a, b) {
    return a - b;
}

export function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
}

export function findDuplicates(array) {
    let duplicates = []
    for (var i = 0; i < array.length - 1; i++) {
        if (array[i]==array[i+1]) {
            if (!duplicates.includes(i)) {
                duplicates.push(i)
            }
            duplicates.push(i+1)
        }
    }
    return duplicates
}

export function getTimingString(number, acceptableMargin) {
    if (number > 1.5 * acceptableMargin) {
        return "early"
    } else if (number > acceptableMargin) {
        return "slightly early"
    } else if (number < -(1.5 * acceptableMargin)) {
        return "late"
    } else {
        return "slightly late"
    }
}

export function getPlacement(number) {
    const numericPlacements = [
        "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth",
        "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth", "nineteenth", "twentieth",
        "twenty-first", "twenty-second", "twenty-third", "twenty-fourth", "twenty-fifth", "twenty-sixth", "twenty-seventh", "twenty-eighth", "twenty-ninth", "thirtieth"
    ];
    return numericPlacements[number]
}

export function getBeatName(played) {
    const beat = Math.floor(played)
    const sub = (played + "").split(".")[1]
    if (Number.isNaN(sub)) {
        return `beat ${beat}`
    }
    var msg = ''
    switch (sub) {
        case undefined:
            msg = `beat ${beat}`;
            break;
        case '5':
            msg =  `the and of ${beat}`;
            break;
        case '25':
            msg =  `the e of ${beat}`;
            break; 
        case '75':
            msg =  `the a of ${beat}`;
            break;
        case '33':
            msg =  `the trip of ${beat}`;
            break; 
        case '66':
            msg =  `the let of ${beat}`;
            break;
    }
    return msg
}