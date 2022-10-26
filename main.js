(async() => {
        var started = false
        function getFullFunctionName(name) {
            let found = false

            for (let i in window) {
                if (i.startsWith(name)) {
                    found = i
                }
            }

            return found
        }

        function getCurrentPlayer() {
            let found = false

            for (let v of document.getElementsByTagName('ytd-reel-video-renderer')) {
                if (v.isActive) {
                    found = v.id
                }
            }

            return found
        }

        function getCurrentPlayerById(id) {
            console.log(id)
            return document.getElementsByTagName('ytd-reel-video-renderer')[id]
        }

        try {
            console.log('waiting for shorts to be loaded...')

            do {
                await new Promise(r => setTimeout(r, 200));
                console.log('waiting')

            } while(getFullFunctionName('ytPlayeronStateChange') == false)

            console.log('loaded')

            let name = getFullFunctionName('ytPlayeronStateChange')

            let func = window[name]

            window[name] = (s) => {
                func(s)
                if (s == 1) {
                    started = true 
                } else if (s == 3 && started) {
                    started = false
                    let currentId = getCurrentPlayer()
                    let current = getCurrentPlayerById(Number(currentId) +1)
                    current.scrollIntoView()
                }
            }
            
        } catch(e) {
            console.log(e)
        }
})()
