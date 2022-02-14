const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY ="mode"

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY ))||{},  
    songs: [
    {
      name: 'Heat waves',
      singer: 'Glass Animal',
      path: 'assets/music/song1.mp3',
      image: 'assets/img/song1.png'
    },
    {
      name: 'Industry Baby',
      singer: 'Lil Nas',
      path: 'assets/music/song2.mp3',
      image: 'assets/img/song2.png'
    },
    {
      name: 'Sugar',
      singer: 'Maroon 5',
      path: 'assets/music/song3.mp3',
      image: 'assets/img/song3.png',
    },
    {
      name: 'Cưới thôi',
      singer: 'Masew',
      path: 'assets/music/song4.mp3',
      image: 'assets/img/song4.png'
    },
    {
      name: 'Thế giới sẽ mất đi 2 người cô đơn',
      singer: 'Peach',
      path: 'assets/music/song5.mp3',
      image: 'assets/img/song5.png'
    },
    {
      name: 'Sài Gòn đâu có lạnh',
      singer: 'Changg',
      path: 'assets/music/song6.mp3',
      image: 'assets/img/song6.png'
    },
    {
      name: 'Độ Tộc 2',
      singer: 'Phúc Du x Pháo',
      path: 'assets/music/song7.mp3',
      image: 'assets/img/song7.png'
    },
    {
      name: 'ABCDEFU',
      singer: 'GAYLE',
      path: 'assets/music/song8.mp3',
      image: 'assets/img/song8.png'
    },
    {
      name: 'ALL FALLS DOWN',
      singer: 'Alan Walker',
      path: 'assets/music/song9.mp3',
      image: 'assets/img/song9.png'
    },
    {
      name: 'Phi hành gia',
      singer: 'Renja x Slow T x Lil Wyn',
      path: 'assets/music/song10.mp3',
      image: 'assets/img/song10.png'
    },
    ],

    setConfig: function(key, value) {
      this.config[key] = value;
      localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config))
    },

    render: function () {
    const htmls = this.songs.map((song, index) => {
        return `
        <div class="song ${index === this.currentIndex ? "active" : " "}" data-index="${index}">
            <div class="thumb" 
            style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>`;
    })

    playlist.innerHTML = htmls.join('')
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function () {
        const _this = this
        const cdWidth = cd.offsetWidth
        
        //Xử lí CD quay/ dừng
        const cdThumbAnimate = cdThumb.animate([
          {transform: 'rotate(360deg)'}
        ], {
          duration: 10000, //10 second
          iterations: Infinity
        })

        cdThumbAnimate.pause()

        //Xử lí phóng to, thu nhỏ CD
        document.onscroll = function() {
            const scrollTop = window.scrollY
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        //Xử lí khi click play
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        //Khi bài hát được play
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        //Khi bài hát bị pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        //Xử lí thanh tiến độ bài hát
        audio.ontimeupdate = function() {
          if (audio.duration) {
            const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
            progress.value = progressPercent
          }
        }

        //Xử lí khi tua bài hát
        audio.ontimeupdate = function () {
          if (this.duration && app.isMouseUp) {
            const progressPrecent = (this.currentTime / this.duration) * 100;
            progress.value = progressPrecent.toFixed(0);
          }
        };
        progress.oninput = function (e) {
          audio.currentTime = (progress.value / 100) * audio.duration;
        };
        progress.onmousedown = function (e) {
          app.isMouseUp = false;
        };
        progress.onmouseup = function (e) {
          app.isMouseUp = true;
        };


        //xử lí khi next bài hát
        nextBtn.onclick = function() {
          if (_this.isRandom) {
            _this.playRandomSong()
          } else {
            _this.nextSong()
          }
          audio.play()
          _this.render()
          _this.scrollToActiveSong()
        }

         //xử lí khi prev bài hát
         prevBtn.onclick = function() {
          if (_this.isRandom) {
            _this.playRandomSong()
          } else {
            _this.prevSong()
          }
          audio.play()
          _this.render()
        }

        //Xử lí random bật tắt random 
        randomBtn.onclick = function(e) {
          _this.isRandom = !_this.isRandom
          _this.setConfig('isRandom', _this.isRandom)
          randomBtn.classList.toggle('active', _this.isRandom)
        }

        //Xử lí lặp lại 1 bài hát
        repeatBtn.onclick = function() {
          _this.isRepeat = !_this.isRepeat
          _this.setConfig('isRepeat', _this.isRepeat)
          repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        //Xử lí next song khi bài hát kết thúc
        audio.onended = function() {
          if (_this.isRepeat) {
            audio.play();
          } else {
            nextBtn.click()
          }
        }

        //Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e) {
          const songNode = e.target.closest('.song:not(.active)')
          if (songNode || e.target.closest('.option')) {
              //Xử lí khi click vào song
              if (songNode) {
                _this.currentIndex = Number(songNode.dataset.index)
                _this.loadCurrentSong()
                _this.render()
                audio.play()     
              }
              
              //Xử lí khi click vào song option
              if (e.target.closest('.option')) {

              }
          }
        }
    },

    loadCurrentSong: function () {
        
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    scrollToActiveSong: function () {
        setTimeout(() => {
          $('.song.active').scrollIntoView({
            behavior: 'smooth',
            block: 'end'
          })
        })
    },

    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
          this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function () {
      this.currentIndex--
      if (this.currentIndex < 0) {
        this.currentIndex = this.songs.length - 1
      }
      this.loadCurrentSong()
  },

    playRandomSong: function () {
      let newIndex
      do {
        newIndex = Math.floor(Math.random() * this.songs.length)
      } while (newIndex === this.currentIndex)

      this.currentIndex = newIndex
      this.loadCurrentSong()
    },



    start: function () {
        //Định nghĩa các thuộc tính cho Object
        this.defineProperties()

        //Xử lí DOM events
        this.handleEvents()

        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        //Render playlist
        this.render()
    
    },
};


app.start();
