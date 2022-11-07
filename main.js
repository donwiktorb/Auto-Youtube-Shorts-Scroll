(async() => {
        let started = false
        let scrolled = false
        let timeout = 0

        function setTimer() {
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                scrolled = false
            }, 500)
        }


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
            return document.getElementsByTagName('ytd-reel-video-renderer')[id]
        }

        try {
            console.log('waiting for shorts to be loaded...')

            do {
                await new Promise(r => setTimeout(r, 200));
                console.log('waiting')

            } while(getFullFunctionName('ytPlayeronStateChange') == false)

            console.log('loaded')
            
            let elem = document.getElementById('shorts-container')

            if (elem)
                elem.addEventListener('wheel', function(event){
                    if (scrolled) return
                    scrolled = true
                    setTimer()
                })

            let name = getFullFunctionName('ytPlayeronStateChange')

            let func = window[name]

            console.log(func, name)

            window[name] = (s) => {
                console.log(s, scrolled, started)
                func(s)
                if (scrolled) return
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
