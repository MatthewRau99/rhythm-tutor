<template>
    <h1>Welcome to Rhythm Tutor</h1>
    <div class="column">
        <img class="problemPic" ref="problemPic" src='./../../static/p1.png'/>
        <!-- <button @click="this.metronomeLoop(this.problem.counts + 4)">Start metronome</button> -->
        <button @click="this.nextProblem()">Next problem</button>
        <p>Beats: {{  this.beats }}</p>
        <p>Recorded: {{ this.recordedPresses }}</p>
        <p>Expected: {{ this.expectedPresses }}</p>
    </div>
</template>

<script>

export default {
    data() {
        return {
            audio: new Audio(require('./../../static/metronome-85688.mp3')),
            problems: require('./../../static/problems.json').problems,
            index: 0,
            problem: null,
            metronomeOn: false,
            recordedPresses: [],
            beats: [],
            expectedPresses: [],
        }
    },
    mounted() {
        document.addEventListener( "keydown", this.onKeydown );
        this.problem = this.problems[this.index]
    },
    methods: {
        onKeydown( event ) {
            if(event.key === " "){   
                if (this.metronomeOn) {
                    this.recordPress()
                    console.log('recorded')
                }   
                else {
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
        },
        calculatedExpected() {
            let beat = 0
            for (const note of this.problem.rhythm) {
                console.log(beat)
                if (!note.rest) {
                    if (beat % 1 == 0) {
                        this.expectedPresses.push(this.beats[Math.floor(beat)])
                    }
                    else {
                        const time = this.beats[Math.floor(beat)] + ((this.beats[Math.floor(beat) + 1] - this.beats[Math.floor(beat)]) * (beat % 1))
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
            }
        },
        async metronomeLoop(times) {
            for (let i = 0; i < 4; i++) {
                this.playAudio()
                await this.sleep(60 / this.problem.bpm * 1000)
            }
            for (let i = 0; i < times-4; i++) {
                this.beats.push(Date.now())
                this.playAudio()
                await this.sleep(60 / this.problem.bpm * 1000)
            }
            this.beats.push(Date.now())


            this.metronomeOn = false
            this.calculatedExpected()

        },
        playAudio() {
            this.audio.currentTime = 0;
            this.audio.play()
        },
        sleep(duration) {
            return new Promise((resolve) => {
                setTimeout(resolve, duration)
            })
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
</style>