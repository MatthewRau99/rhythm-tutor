<template>
    <h1>Rhythm Tutor</h1>
    <div class="column">
        <img class="problemPic" ref="problemPic" src='./../../static/p1.png'/>
        <!-- <button @click="this.metronomeLoop(this.problem.counts + 4)">Start metronome</button> -->
        <div v-if="settings.showArrays">
            <p>Beats: {{ this.beats }}</p>
            <p>Expected: {{ this.expectedPresses }}</p>
            <p>Recorded: {{ this.recordedPresses }}</p>
            <p>Connected: {{ this.connected }}</p>
            <p>Margins of Error: {{ this.margins }}</p>
            <p>Played: {{ this.played }}</p>
        </div>
        <p>Feedback: {{ this.feedback }}</p>
        <div v-if="success">
            <button @click="nextProblem">Next Problem</button>
        </div>
    </div>
    <div class="Settings" v-if="!showSettings">
        <button @click="toggleSettings">Show Settings</button>
    </div>
    <div class="Settings" v-if="showSettings">
        <button @click="toggleSettings">Hide Settings</button>
        <div class="labeled">
            <input type="checkbox" id="playMetronome" name="playMetronome" @change="metToggle" v-model="this.settings.playMetronome">
            <label for="playMetronome">Metronome</label><br>
        </div>
        <div class="SettingsCol">
            <div class="labeled">
                <input type="checkbox" id="beat1" name="beat1" @change="beatToggle" v-model="this.settings.metBeats[0]">
                <label for="beat1">Beat 1</label>
            </div>
            <div class="labeled">
                <input type="checkbox" id="beat2" name="beat2" @change="beatToggle" v-model="this.settings.metBeats[1]">
                <label for="beat2">Beat 2</label>
            </div>
            <div class="labeled">
                <input type="checkbox" id="beat3" name="beat3" @change="beatToggle" v-model="this.settings.metBeats[2]">
                <label for="beat3">Beat 3</label>
            </div>
            <div class="labeled">
                <input type="checkbox" id="beat4" name="beat4" @change="beatToggle" v-model="this.settings.metBeats[3]">
                <label for="beat4">Beat 4</label>
            </div>
        </div>
        <div class="labeled">
            <input class="numInput" type="number" id="tempoMod" name="tempoMod" v-model="this.settings.tempoMod" >
            <label for="tempoMod">Modify Tempo</label>
        </div>
        <div class="labeled">
            <input class="numInput" type="number" id="marginMod" name="marginMod" v-model="this.settings.marginMod">
            <label for="marginMod">Modify Margins</label>
        </div>
        <div class="labeled">
            <input type="checkbox" id="showArrays" name="showArrays" v-model="this.settings.showArrays">
            <label for="showArrays">Show Arrays</label>
        </div>
        <button @click="nextProblem">Skip Problem</button>
        <button @click="playAnswer">Play Answer</button>
    </div>
</template>

<script>
import * as fbr from './../FeedbackRight'
import * as fbm from './../FeedbackMany'
import * as fbf from './../FeedbackFew'

export default {
    data() {
        return {
            audio: new Audio(require('./../../static/metronome-85688.mp3')),
            problems: require('./../../static/problems.json').problems,
            index: 0,
            problem: null,
            metronomeOn: false,
            recordedPresses: [],
            played: [],
            beats: [],
            expectedPresses: [],
            connected: [],
            startBeat: null,
            margins: [],
            feedback: null,
            acceptableMargin: 115,
            showSettings: false,
            settings: {
                playMetronome: true,
                metBeats: [true, true, true, true],
                tempoMod: 0,
                marginMod: 100,
                showArrays: false,
            },
            success: false,
        }
    },
    mounted() {
        document.addEventListener( "keydown", this.onKeydown );
        this.problem = this.problems[this.index]
    },
    methods: {
        toggleSettings() {
            this.showSettings = !this.showSettings
        },
        onKeydown( event ) {
            if(event.key === " "){   
                if (this.metronomeOn) {
                    this.recordPress()
                }   
                else if (this.success == false) {
                    this.metronomeOn = true
                    this.resetForRetry()

                    this.metronomeLoop(this.problem.counts + 4)
                } 
            }
        },
        recordPress() {
            this.recordedPresses.push(Date.now())
        },
        resetForRetry() {
            this.recordedPresses = []
            this.beats = []
            this.expectedPresses = []
            this.startBeat = null
            this.connected = []
            this.margins = []
            this.played = []
        },
        calculatedExpected() {
            let beat = 0
            for (const note of this.problem.rhythm) {
                if (!note.rest) {
                    if (beat % 1 == 0) {
                        this.expectedPresses.push(this.beats[Math.floor(beat)])
                    }
                    else {
                        const time = Math.round(this.beats[Math.floor(beat)] + ((this.beats[Math.floor(beat) + 1] - this.beats[Math.floor(beat)]) * (beat % 1)))
                        this.expectedPresses.push(time)
                    }
                }
                if (note.length == 0.3333) {
                    beat += (1/3)
                }
                else {
                    beat += note.length
                }
            }
        },
        nextProblem() {
            if (this.index < this.problems.length - 1) {
                this.index += 1
                this.problem = this.problems[this.index]  
                this.recordedPresses = []
                this.$refs.problemPic.src = require( `./../../static/${this.problem.picture}`) 
                this.feedback = ''
                this.settings = {
                    playMetronome: true,
                    metBeats: [true, true, true, true],
                    tempoMod: 0,
                    marginMod: 100,
                    showArrays: false,
                }
                this.success = false
            }
        },
        async metCountIn() {
            for (let i = 0; i < 4; i++) {
                this.playAudio()
                await this.sleep(60 / (this.problem.bpm + this.settings.tempoMod) * 1000)
            }
        },
        async metronomeLoop(times) {
            await this.metCountIn()
            for (let i = 0; i < times-4; i++) {
                const time = Date.now()
                if (i == 0) {
                    this.startBeat = time
                }
                this.beats.push(time - this.startBeat)
                if (this.settings.playMetronome && this.settings.metBeats[i % 4]) {
                    this.playAudio()
                }
                await this.sleep(60 / (this.problem.bpm + this.settings.tempoMod) * 1000)
            }
            this.beats.push(Date.now() - this.startBeat)


            this.updateRecorded()
            this.calculatedExpected()
            this.connect()
            this.calculateMargins()
            this.calculateActual()
            this.generateFeedback()
            await this.sleep(60 / (this.problem.bpm + this.settings.tempoMod) * 1000 * 2)
            this.metronomeOn = false
        },
        async playAnswer() {
            await this.metCountIn()
            for (const note of this.problem.rhythm) {
                if (note.rest == false) {
                    this.playAudio()
                }
                await this.sleep((60 / this.problem.bpm * 1000) * note.length)
            }
        },
        metToggle() {
            for (var i = 0; i < this.settings.metBeats.length; i ++) {
                this.settings.metBeats[i] = this.settings.playMetronome
            }
            
        },
        beatToggle() {
            if (this.settings.metBeats.some(beat => beat == true)) {
                this.settings.playMetronome = true
            } else {
                this.settings.playMetronome = false
            }
        },
        playAudio() {
            this.audio.currentTime = 0;
            this.audio.play()
        },
        sleep(duration) {
            return new Promise((resolve) => {
                setTimeout(resolve, duration)
            })
        },
        updateRecorded() {
            for (var i = 0; i < this.recordedPresses.length; i++) {
                this.recordedPresses[i] = this.recordedPresses[i] - this.startBeat
            }
            this.recordedPresses = this.recordedPresses.filter(x => x > -150)
        },
        connect() {
            if (this.expectedPresses.length == this.recordedPresses.length) {
                this.connected = this.expectedPresses
            }
            else {
                for (const recorded of this.recordedPresses) {
                    this.connected.push(this.closest(recorded, this.expectedPresses))
                }
                
            }
        },
        calculateActual() {
            var possible = {}
            for (var i = 0; i < this.problem.counts; i++) {
                possible[this.beats[i]] = i+1
                possible[Math.round(this.beats[i] + ((this.beats[i+1] - this.beats[i]) * (1/3)))] = i+1.33
                possible[Math.round((this.beats[i] + this.beats[i+1]) / 2)] = i+1.5 
                possible[Math.round(this.beats[i] + ((this.beats[i+1] - this.beats[i]) * (2/3)))] = i+1.66
            }
            for (const recorded of this.recordedPresses) {
                const actual = this.closest(recorded, Object.keys(possible))
                this.played.push(possible[actual])
            }
        },
        closest (num, arr) {
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
        },
        calculateMargins() {
            for (var i = 0; i < this.recordedPresses.length; i++) {
                this.margins.push(this.connected[i] - this.recordedPresses[i])
            }
        },
        getAcceptableMargin() {
            return this.acceptableMargin * (this.settings.marginMod / 100)
        },
        generateFeedback() {
            var feedback
            if (this.expectedPresses.length > this.recordedPresses.length) {
                feedback = fbf.feedbackFew(
                    this.problem, 
                    this.recordedPresses,
                    this.expectedPresses,
                    this.connected,
                    // this.margins,
                    this.played,
                    // this.acceptableMargin * (this.settings.marginMod / 100),
                )
            }
            else if (this.expectedPresses.length < this.recordedPresses.length) {
                feedback = fbm.feedbackMany(
                    this.problem, 
                    this.recordedPresses,
                    this.expectedPresses,
                    this.connected,
                    // this.margins,
                    this.played,
                    // this.acceptableMargin * (this.settings.marginMod / 100),
                )
            }
            else {
                feedback = fbr.feedbackRight(
                    this.problem, 
                    this.recordedPresses,
                    this.expectedPresses,
                    this.connected,
                    this.margins,
                    this.played,
                    this.acceptableMargin * (this.settings.marginMod / 100),
                )
            }

            this.feedback = feedback['feedback']
            this.success = feedback['success']
        }

    },
}
</script>

<style>
.column {
    display: flex;
    flex-direction: column;
}

img {
    object-fit: contain;
}

.problemPic {
    height:100px;
}

.Settings {
    position:fixed;
    bottom:0;
    left:0;
    margin-bottom: 20px;
    margin-left: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.SettingsCol {
    display: flex;
    flex-direction: column;
}

.Labeled {
    display:flex;
    flex-direction: row;
}

.numInput {
    width: 40px;
}
</style>