import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Heart, 
  Calendar, 
  Film, 
  Popcorn, 
  Sparkles, 
  Send, 
  Check, 
  Volume2, 
  VolumeX, 
  Lock, 
  Smile, 
  Copy, 
  Trash2,
  MapPin,
  Ticket,
  Music,
  Gift
} from 'lucide-react';
import { playPopChime, playLoveFanfare } from './utils/audio';

// CGV Vincom Đà Nẵng Schedule exact per day from user's screenshots
const CGV_DATES = [
  { id: 'mon-05', dayName: 'Mon', num: '05', fullDate: 'Thứ Hai (05/10)' },
  { id: 'tue-06', dayName: 'Tue', num: '06', fullDate: 'Thứ Ba (06/10)' },
  { id: 'wed-07', dayName: 'Wed', num: '07', fullDate: 'Thứ Tư (07/10)' },
  { id: 'thu-08', dayName: 'Thu', num: '08', fullDate: 'Thứ Năm (08/10)' },
  { id: 'fri-09', dayName: 'Fri', num: '09', fullDate: 'Thứ Sáu (09/10)' },
  { id: 'sat-10', dayName: 'Sat', num: '10', fullDate: 'Thứ Bảy (10/10)' },
  { id: 'sun-11', dayName: 'Sun', num: '11', fullDate: 'Chủ Nhật (11/10)' }
];

// Movie dictionary with user's uploaded poster images
const MOVIES_DICT = {
  'trai-buon-nguoi': {
    title: 'TRẠI BUÔN NGƯỜI',
    rating: 'T18',
    format: '2D Phụ Đề Anh & Việt',
    poster: '/assets/posters/trai_buon_nguoi.png'
  },
  'avengers': {
    title: 'AVENGERS: HỒI KẾT - PHIÊN BẢN ĐẶC BIỆT',
    rating: 'T13',
    format: '2D Phụ Đề Việt | Rạp Infinity Vision',
    poster: '/assets/posters/avengers.png'
  },
  'trai-tim-quai-thu': {
    title: 'TRÁI TIM QUÁI THÚ',
    rating: 'T13',
    format: '2D Phụ Đề Việt',
    poster: '/assets/posters/trai_tim_quai_thu.png'
  },
  'scotty': {
    title: 'SCOTTY: GIẢI CỨU HOÀNG THƯỢNG',
    rating: 'P',
    format: '2D Lồng Tiếng Việt',
    poster: '/assets/posters/scotty.png'
  },
  'chung-quy': {
    title: 'THẦN SƯ CHUNG QUỲ: LINH GIỚI ĐẠI CHIẾN',
    rating: 'T13',
    format: '2D Phụ Đề Anh & Việt',
    poster: '/assets/posters/chung_quy.png'
  },
  'quyet-cua-anh-nay': {
    title: 'QUYẾT CUA ANH NÀY',
    rating: 'T13',
    format: '2D Phụ Đề Việt',
    poster: '/assets/posters/quyet_cua_anh_nay.png'
  },
  'suzume': {
    title: 'KHÓA CHẶT CỬA NÀO SUZUME',
    rating: 'P',
    format: '2D Phụ Đề Anh & Việt',
    poster: '/assets/posters/suzume.png'
  }
};

// Exact movies and showtimes mapping by selected day
const SCHEDULE_BY_DAY = {
  'mon-05': [
    {
      ...MOVIES_DICT['trai-buon-nguoi'],
      id: 'trai-buon-nguoi',
      showtimes: ['21:15', '21:45']
    },
    {
      ...MOVIES_DICT['quyet-cua-anh-nay'],
      id: 'quyet-cua-anh-nay',
      showtimes: ['22:10']
    }
  ],
  'tue-06': [
    {
      ...MOVIES_DICT['trai-buon-nguoi'],
      id: 'trai-buon-nguoi',
      showtimes: [
        '08:30', '09:00', '09:40', '10:15', '11:10', '11:40', 
        '12:15', '12:50', '13:45', '14:15', '14:50', '15:30', 
        '16:20', '18:10', '19:00', '19:30', '20:20', '20:50', '21:15', '21:45'
      ]
    },
    {
      ...MOVIES_DICT['avengers'],
      id: 'avengers',
      showtimes: ['16:50']
    },
    {
      ...MOVIES_DICT['trai-tim-quai-thu'],
      id: 'trai-tim-quai-thu',
      showtimes: ['17:25', '19:10', '22:10']
    },
    {
      ...MOVIES_DICT['scotty'],
      id: 'scotty',
      showtimes: ['08:35']
    },
    {
      ...MOVIES_DICT['chung-quy'],
      id: 'chung-quy',
      showtimes: ['14:30']
    },
    {
      ...MOVIES_DICT['suzume'],
      id: 'suzume',
      showtimes: ['16:40']
    },
    {
      ...MOVIES_DICT['quyet-cua-anh-nay'],
      id: 'quyet-cua-anh-nay',
      showtimes: ['09:30']
    }
  ],
  'wed-07': [
    {
      ...MOVIES_DICT['trai-buon-nguoi'],
      id: 'trai-buon-nguoi',
      showtimes: [
        '08:30', '09:00', '09:40', '10:10', '10:40', '11:10', '11:40', 
        '12:15', '12:50', '13:20', '13:45', '14:15', '14:50', '15:30', 
        '16:20', '18:10', '19:00', '19:30', '20:20', '20:50', '21:15', '21:45'
      ]
    },
    {
      ...MOVIES_DICT['avengers'],
      id: 'avengers',
      showtimes: ['16:50']
    }
  ],
  'thu-08': [
    {
      ...MOVIES_DICT['trai-buon-nguoi'],
      id: 'trai-buon-nguoi',
      showtimes: ['18:10', '19:00', '19:30', '20:20', '20:50', '21:15', '21:45']
    },
    {
      ...MOVIES_DICT['trai-tim-quai-thu'],
      id: 'trai-tim-quai-thu',
      showtimes: ['17:25', '19:10', '22:10']
    }
  ],
  'fri-09': [
    {
      ...MOVIES_DICT['trai-buon-nguoi'],
      id: 'trai-buon-nguoi',
      showtimes: ['18:00', '19:20', '20:00', '20:40', '21:30', '22:00']
    },
    {
      ...MOVIES_DICT['chung-quy'],
      id: 'chung-quy',
      showtimes: ['20:05']
    }
  ],
  'sat-10': [
    {
      ...MOVIES_DICT['trai-buon-nguoi'],
      id: 'trai-buon-nguoi',
      showtimes: ['18:00', '19:20', '20:00', '20:40', '21:30', '22:00']
    },
    {
      ...MOVIES_DICT['chung-quy'],
      id: 'chung-quy',
      showtimes: ['20:05']
    }
  ],
  'sun-11': [
    {
      ...MOVIES_DICT['trai-buon-nguoi'],
      id: 'trai-buon-nguoi',
      showtimes: [
        '09:30', '10:10', '11:00', '11:35', '12:10', '12:45', '13:35', 
        '14:10', '14:45', '16:10', '16:45', '17:20', '18:00', '19:20', 
        '20:00', '20:40', '21:30', '22:00'
      ]
    },
    {
      ...MOVIES_DICT['chung-quy'],
      id: 'chung-quy',
      showtimes: ['20:05']
    }
  ]
};

const SNACKS_LIST = [
  { id: 'popcorn', name: 'Bắp Bơ Phô Mai', emoji: '🍿' },
  { id: 'boba', name: 'Trà Sữa Trân Châu', emoji: '🧋' },
  { id: 'coca', name: 'Coca-Cola Ướp Lạnh', emoji: '🥤' },
  { id: 'cake', name: 'Bánh Ngọt & Kem', emoji: '🍰' }
];

export default function App() {
  const [selectedDayId, setSelectedDayId] = useState('tue-06');
  const [selectedMovieId, setSelectedMovieId] = useState('trai-buon-nguoi');
  const [selectedTime, setSelectedTime] = useState('19:30');
  const [selectedSnacks, setSelectedSnacks] = useState(['popcorn', 'boba']);
  const [personalMessage, setPersonalMessage] = useState('');
  
  // UI & Audio States
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showWelcomeCard, setShowWelcomeCard] = useState(true);
  const [storedSubmissions, setStoredSubmissions] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [activeBalloons, setActiveBalloons] = useState([]);

  const audioRef = useRef(null);

  const floatingItems = ['🎈', '🌸', '💖', '🌷', '✨', '🎈', '🍿', '🎬', '🎈', '🌺', '💕', '🎈'];

  const triggerBalloonsAndFireworks = () => {
    // 1. Floating balloons
    const balloonEmojis = ['🎈', '🎈', '💖', '🎈', '🌸', '🎈', '💕', '🎈', '✨', '🎈', '💐', '🎈', '❤️', '🎉'];
    const newBalloons = Array.from({ length: 45 }).map((_, i) => ({
      id: Date.now() + i,
      emoji: balloonEmojis[i % balloonEmojis.length],
      left: Math.random() * 92 + 4,
      size: Math.random() * 26 + 28,
      delay: Math.random() * 1.5,
      duration: Math.random() * 2.5 + 4.5
    }));
    setActiveBalloons(newBalloons);

    setTimeout(() => {
      setActiveBalloons([]);
    }, 8500);

    // 2. High z-index fireworks & confetti burst
    const count = 180;
    const defaults = {
      origin: { y: 0.65 },
      zIndex: 99999
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#ff0054', '#ff4d6d']
    });
    fire(0.2, {
      spread: 60,
      colors: ['#ff85a1', '#ffd166']
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      colors: ['#7b2cbf', '#c77dff']
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45
    });
  };

  const attemptPlayAudio = () => {
    if (audioRef.current) {
      const promise = audioRef.current.play();
      if (promise !== undefined) {
        promise.then(() => {
          setIsPlayingMusic(true);
          setShowWelcomeCard(false);
          removeInteractionListeners();
        }).catch((err) => {
          console.log('Autoplay restriction active, waiting for user interaction:', err);
          setShowWelcomeCard(true);
        });
      }
    }
  };

  const handleUserGesture = () => {
    attemptPlayAudio();
    triggerBalloonsAndFireworks();
  };

  const addInteractionListeners = () => {
    ['click', 'touchstart', 'pointerdown', 'keydown', 'scroll'].forEach(evt => {
      window.addEventListener(evt, handleUserGesture, { once: true, passive: true });
    });
  };

  const removeInteractionListeners = () => {
    ['click', 'touchstart', 'pointerdown', 'keydown', 'scroll'].forEach(evt => {
      window.removeEventListener(evt, handleUserGesture);
    });
  };

  useEffect(() => {
    const saved = localStorage.getItem('bong_hoa_ly_date_choices');
    if (saved) {
      try {
        setStoredSubmissions(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
    const savedWebhook = localStorage.getItem('ly_webhook_url');
    if (savedWebhook) setWebhookUrl(savedWebhook);

    // Try playing immediately
    attemptPlayAudio();

    // Register global interaction listeners for instant audio trigger on user's first action
    addInteractionListeners();

    return () => {
      removeInteractionListeners();
    };
  }, []);

  const startMusicAndEnter = () => {
    if (soundEnabled) playPopChime();
    attemptPlayAudio();
    setShowWelcomeCard(false);
    triggerBalloonsAndFireworks();
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      triggerBalloonsAndFireworks();
      audioRef.current.play().then(() => {
        setIsPlayingMusic(true);
      }).catch(err => {
        console.log('Autoplay restriction:', err);
      });
    }
  };

  const currentDayObj = CGV_DATES.find(d => d.id === selectedDayId) || CGV_DATES[1];
  const currentMoviesList = SCHEDULE_BY_DAY[selectedDayId] || SCHEDULE_BY_DAY['tue-06'];

  const handleSelectDay = (dayId) => {
    if (soundEnabled) playPopChime();
    setSelectedDayId(dayId);
    const dayMovies = SCHEDULE_BY_DAY[dayId] || SCHEDULE_BY_DAY['tue-06'];
    if (dayMovies && dayMovies[0]) {
      setSelectedMovieId(dayMovies[0].id);
      if (dayMovies[0].showtimes && dayMovies[0].showtimes[0]) {
        setSelectedTime(dayMovies[0].showtimes[0]);
      }
    }
  };

  const handleSelectTime = (movieId, timeStr) => {
    if (soundEnabled) playPopChime();
    setSelectedMovieId(movieId);
    setSelectedTime(timeStr);
  };

  const toggleSnackSelection = (snackId) => {
    if (soundEnabled) playPopChime();
    setSelectedSnacks(prev =>
      prev.includes(snackId)
        ? prev.filter(id => id !== snackId)
        : [...prev, snackId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTime) {
      alert('Bông Hoa Ly ơi, nhớ bấm chọn suất chiếu khung giờ nhé! 🌸');
      return;
    }

    if (soundEnabled) playLoveFanfare();
    
    triggerBalloons();

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });

    const chosenMovieObj = currentMoviesList.find(m => m.id === selectedMovieId);

    const chosenSnackNames = selectedSnacks.map(id => {
      const s = SNACKS_LIST.find(item => item.id === id);
      return `${s?.emoji} ${s?.name}`;
    });

    const newSubmission = {
      id: Date.now(),
      timestamp: new Date().toLocaleString('vi-VN'),
      day: currentDayObj.fullDate,
      movie: chosenMovieObj?.title,
      time: selectedTime,
      cinema: 'CGV Vincom Đà Nẵng (Tầng 4, TTTM Vincom Đà Nẵng)',
      snacks: chosenSnackNames,
      message: personalMessage || 'Không có nhắn nhủ gì thêm (Chương đẹp trai nhớ đón em đúng giờ! 💕)'
    };

    const updatedList = [newSubmission, ...storedSubmissions];
    setStoredSubmissions(updatedList);
    localStorage.setItem('bong_hoa_ly_date_choices', JSON.stringify(updatedList));

    if (webhookUrl.trim()) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🎉 *BÔNG HOA LY ĐÃ CHỌN LỊCH PHIM CGV!*\n\n📅 *Ngày chọn:* ${currentDayObj.fullDate}\n🎬 *Phim:* ${chosenMovieObj?.title}\n⏰ *Suất chiếu:* ${selectedTime}\n📍 *Rạp:* CGV Vincom Đà Nẵng\n🍿 *Bắp nước:* ${chosenSnackNames.join(', ')}\n💌 *Lời nhắn:* ${personalMessage || 'Em chờ tin anh!'}`
          })
        });
      } catch (err) {
        console.log('Webhook push skipped:', err);
      }
    }

    setIsSubmitted(true);
  };

  const generateZaloMessage = () => {
    if (!storedSubmissions[0]) return '';
    const lastSub = storedSubmissions[0];
    return `🌸 *LỊCH HẸN CGV VINCOM ĐÀ NẴNG CỦA BÔNG HOA LY* 🌸\n` +
           `---------------------------------\n` +
           `📅 Ngày xem: ${lastSub.day}\n` +
           `🎬 Phim đã chọn: ${lastSub.movie}\n` +
           `⏰ Suất chiếu: ${lastSub.time}\n` +
           `📍 Địa điểm: ${lastSub.cinema}\n` +
           `🍿 Bắp nước khoái khẩu: ${lastSub.snacks.join(', ')}\n` +
           `💌 Lời nhắn gửi: "${lastSub.message}"\n` +
           `---------------------------------\n` +
           `Chương đẹp trai đặt vé luôn nha! 💖✨`;
  };

  const copyToClipboard = () => {
    const text = generateZaloMessage();
    navigator.clipboard.writeText(text);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 3000);
  };

  const deleteSingleSubmission = (id) => {
    const updated = storedSubmissions.filter(item => item.id !== id);
    setStoredSubmissions(updated);
    if (updated.length > 0) {
      localStorage.setItem('bong_hoa_ly_date_choices', JSON.stringify(updated));
    } else {
      localStorage.removeItem('bong_hoa_ly_date_choices');
    }
  };

  const clearAllSubmissions = () => {
    localStorage.removeItem('bong_hoa_ly_date_choices');
    setStoredSubmissions([]);
  };

  return (
    <>
      {/* Dynamic Floating Balloons Stream on Click */}
      {activeBalloons.length > 0 && (
        <div className="balloons-container">
          {activeBalloons.map((b) => (
            <div
              key={b.id}
              className="balloon-item"
              style={{
                left: `${b.left}%`,
                fontSize: `${b.size}px`,
                animationDelay: `${b.delay}s`,
                animationDuration: `${b.duration}s`
              }}
            >
              {b.emoji}
            </div>
          ))}
        </div>
      )}

      {/* Background audio player for Bèo Dạt Mây Trôi melody */}
      <audio 
        ref={audioRef} 
        autoPlay
        loop 
        preload="auto"
        playsInline
        onCanPlay={attemptPlayAudio}
        src="/assets/beo_dat_may_troi.mp3" 
      />

      {/* Floating Balloon Trigger Top Left */}
      <button 
        className="balloon-trigger-btn"
        onClick={triggerBalloonsAndFireworks}
        title="Bắn pháo hoa & thả bóng bay 🎈✨"
      >
        🎈 Thả Bóng Bay ✨
      </button>

      {/* Floating Music Player Widget Top Right - Bèo Dạt Mây Trôi */}
      <div 
        className="mck-music-player"
        onClick={toggleMusic}
        title={isPlayingMusic ? "Tạm dừng nhạc" : "Bật nhạc 'Bèo Dạt Mây Trôi'"}
      >
        <div className={`vinyl-disc ${isPlayingMusic ? '' : 'paused'}`}>
          <Music size={15} />
        </div>
        <div className="song-title-text">
          <span>🎵 Bèo Dạt Mây Trôi 🌸</span>
        </div>
        {isPlayingMusic ? <Volume2 size={16} color="#ff0054" /> : <VolumeX size={16} color="#888" />}
      </div>

      {/* Background floating icons */}
      <div className="bg-decorations">
        {Array.from({ length: 15 }).map((_, i) => (
          <div 
            key={i} 
            className="floating-item"
            style={{
              left: `${(i * 7 + 3) % 95}%`,
              animationDelay: `${(i * 1.3) % 8}s`,
              animationDuration: `${10 + (i % 5)}s`
            }}
          >
            {floatingItems[i % floatingItems.length]}
          </div>
        ))}
      </div>

      {/* Floating Admin Trigger */}
      <button 
        className="admin-trigger"
        onClick={() => setShowAdminModal(true)}
      >
        <Lock size={16} /> Dành Cho Bạn (Xem Kết Quả)
        {storedSubmissions.length > 0 && (
          <span style={{ 
            background: '#ff0054', 
            color: '#fff', 
            borderRadius: '50%', 
            width: '18px', 
            height: '18px', 
            fontSize: '0.75rem',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {storedSubmissions.length}
          </span>
        )}
      </button>

      {/* WELCOME INVITATION CARD MODAL ON INITIAL LOAD / RELOAD */}
      {showWelcomeCard && (
        <div className="modal-overlay" style={{ zIndex: 120, cursor: 'pointer' }} onClick={startMusicAndEnter}>
          <div className="modal-card" style={{ maxWidth: '440px', padding: '32px 24px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon" style={{ background: '#ffe5ec' }}>
              💌
            </div>
            <h2 className="modal-title" style={{ fontSize: '1.6rem', marginBottom: '24px' }}>
              Thiệp Mời Bông Hoa Ly 🌸
            </h2>
            <button className="btn-primary" onClick={startMusicAndEnter}>
              <Gift size={20} /> Mở Thiệp Lịch Hẹn & Phát Nhạc ✨
            </button>
          </div>
        </div>
      )}

      <div className="app-container">
        
        {/* Header Greeting Card */}
        <div className="glass-card header-card">
          <div className="header-image-wrapper">
            <img 
              src="/assets/lily_header.png" 
              alt="Bông Hoa Ly Header" 
              className="header-image"
            />
          </div>
          <h1 className="welcome-title">
            <span>Chào bông hoa</span>
            <span style={{ display: 'inline-block', animation: 'bounceSoft 2s infinite' }}>🌷✨</span>
          </h1>
          <p className="welcome-subtitle" style={{ whiteSpace: 'pre-line', marginTop: '6px', lineHeight: '1.6' }}>
            Cho mình hỏi tối nay người đẹp Ly rảnh giờ nào để Chương đẹp trai đặt lịch mời bông hoa đi xem phim, giải trí một chút sau những giờ làm việc căng thẳng nhé
          </p>
          <div className="cute-badge">
            <Sparkles size={16} /> Đi xem phim bình luận như một nhà phê bình phim chuyên nghiệp 🎬✨
          </div>
          <div style={{ fontSize: '0.88rem', color: '#e50914', fontWeight: 700, marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <MapPin size={16} /> Rạp chiếu: CGV Vincom Đà Nẵng (Tầng 4, TTTM Vincom Đà Nẵng)
          </div>
        </div>

        {/* MAIN FORM */}
        <form onSubmit={handleSubmit}>
          
          {/* STEP 1: CHỌN NGÀY XEM (LỊCH CGV CHÍNH XÁC) */}
          <div className="glass-card">
            <div className="section-header">
              <div className="section-icon">
                <Calendar size={22} />
              </div>
              <div>
                <h2 className="section-title">1. Chọn Ngày Bông Hoa Ly Rảnh Đi Xem</h2>
                <p className="section-desc">Lịch chiếu thực tế tại CGV Vincom Đà Nẵng từ 05/10 đến 11/10</p>
              </div>
            </div>

            {/* CGV Calendar Date Tabs */}
            <div className="days-grid">
              {CGV_DATES.map((d) => {
                const isSelected = selectedDayId === d.id;
                return (
                  <div 
                    key={d.id} 
                    className={`day-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectDay(d.id)}
                  >
                    <div className="day-name">{d.dayName}</div>
                    <div className="day-num">{d.num}</div>
                    <div className="day-date">Tháng 10</div>
                  </div>
                );
              })}
            </div>

            {/* Banner showing current selected day */}
            <div style={{ 
              background: '#fff0f3', 
              padding: '10px 16px', 
              borderRadius: '12px', 
              border: '1px solid #ffb3c1',
              color: '#d81b60',
              fontWeight: 700,
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Calendar size={18} /> Đang chọn lịch cho ngày: <b>{currentDayObj.fullDate}</b>
            </div>
          </div>

          {/* STEP 2: CHỌN PHIM & SUẤT CHIẾU CGV CÓ ÁNH PHIM CHÍNH XÁC */}
          <div className="glass-card">
            <div className="section-header">
              <div className="section-icon" style={{ background: 'linear-gradient(135deg, #e50914, #ff4d6d)' }}>
                <Film size={22} />
              </div>
              <div>
                <h2 className="section-title">2. Chọn Phim & Suất Chiếu CGV 🎬</h2>
                <p className="section-desc">Danh sách phim & suất chiếu ngày {currentDayObj.fullDate}</p>
              </div>
            </div>

            {currentMoviesList.map((movie) => {
              return (
                <div key={movie.id} className="cgv-movie-section" style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  {/* Movie Poster Image */}
                  <img 
                    src={movie.poster} 
                    alt={movie.title}
                    style={{
                      width: '85px',
                      height: '118px',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      flexShrink: 0,
                      border: '1px solid #ffe3e8'
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="cgv-movie-header" style={{ marginBottom: '6px', paddingBottom: '6px' }}>
                      <div className="cgv-movie-title" style={{ fontSize: '1.02rem', lineHeight: '1.3' }}>
                        {movie.title}
                      </div>
                      <span className="cgv-movie-rating">{movie.rating}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '10px' }}>
                      Format: {movie.format}
                    </div>

                    <div className="cgv-time-grid">
                      {movie.showtimes.map((t) => {
                        const isSelected = selectedMovieId === movie.id && selectedTime === t;
                        return (
                          <button
                            key={t}
                            type="button"
                            className={`cgv-time-btn ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleSelectTime(movie.id, t)}
                          >
                            {isSelected && <Check size={14} strokeWidth={3} />}
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Display Selected Showtime Summary */}
            {selectedTime && (
              <div style={{ 
                marginTop: '16px', 
                padding: '12px 16px', 
                background: '#fff0f3', 
                borderRadius: '12px',
                border: '2px dashed #ff4d6d',
                color: '#ff0054',
                fontWeight: '700',
                fontSize: '0.95rem'
              }}>
                ✨ Bông Hoa Ly đã chọn: <b>{currentMoviesList.find(m=>m.id===selectedMovieId)?.title}</b> vào suất <b>{selectedTime}</b> ngày <b>{currentDayObj.fullDate}</b>!
              </div>
            )}
          </div>

          {/* STEP 3: SNACKS & DRINKS */}
          <div className="glass-card">
            <div className="section-header">
              <div className="section-icon" style={{ background: 'linear-gradient(135deg, #c77dff, #7b2cbf)' }}>
                <Popcorn size={22} />
              </div>
              <div>
                <h2 className="section-title">3. Chọn Bắp Nước Đi Kèm 🍿</h2>
                <p className="section-desc">Để Chương đẹp trai mua sẵn mang đến cho Bông Hoa Ly nhen!</p>
              </div>
            </div>

            <div className="snack-grid">
              {SNACKS_LIST.map((s) => {
                const isSelected = selectedSnacks.includes(s.id);
                return (
                  <div 
                    key={s.id} 
                    className={`snack-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleSnackSelection(s.id)}
                  >
                    <span className="snack-icon">{s.emoji}</span>
                    <span className="snack-name">{s.name}</span>
                    <div style={{ marginLeft: 'auto' }}>
                      {isSelected && <Check size={16} color="#ff0054" strokeWidth={3} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 4: PERSONAL MESSAGE */}
          <div className="glass-card">
            <div className="section-header">
              <div className="section-icon" style={{ background: 'linear-gradient(135deg, #ff0054, #ff5400)' }}>
                <Heart size={22} />
              </div>
              <div>
                <h2 className="section-title">4. Nhắn Nhủ Gì Với Chương Đẹp Trai Không?</h2>
                <p className="section-desc">Viết thêm dặn dò riêng (VD: Nhớ mang áo khoác, qua đón lúc 19h00 nhen...)</p>
              </div>
            </div>

            <textarea 
              className="custom-input"
              placeholder="Bông Hoa Ly có lời nhắn đáng yêu nào gửi riêng cho Chương đẹp trai không? 💌"
              value={personalMessage}
              onChange={(e) => setPersonalMessage(e.target.value)}
            />
          </div>

          {/* SUBMIT BUTTON */}
          <div className="submit-btn-wrapper">
            <button type="submit" className="btn-primary">
              <Send size={22} /> Gửi Lịch Cho Chương Đẹp Trai ✨
            </button>
          </div>

        </form>
      </div>

      {/* SUCCESS CONFIRMATION MODAL */}
      {isSubmitted && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-icon">
              🎉
            </div>
            <h2 className="modal-title">Yeahhh! Cảm Ơn Bông Hoa Ly! 💖</h2>
            <p className="modal-text">
              Lịch hẹn xem phim đã được lưu lại rồi nè! Chương đẹp trai đang rất háo hức chờ tới buổi tối chúng mình đi xem phim đó!
            </p>

            <div className="summary-box">
              <div className="summary-item">
                <span>📅 <b>Ngày xem:</b> {currentDayObj.fullDate}</span>
              </div>
              <div className="summary-item">
                <span>🎬 <b>Bộ phim:</b> {currentMoviesList.find(m=>m.id===selectedMovieId)?.title}</span>
              </div>
              <div className="summary-item">
                <span>⏰ <b>Suất chiếu:</b> {selectedTime}</span>
              </div>
              <div className="summary-item">
                <span>📍 <b>Rạp:</b> CGV Vincom Đà Nẵng</span>
              </div>
              <div className="summary-item">
                <span>🍿 <b>Bắp nước:</b> {selectedSnacks.map(id => SNACKS_LIST.find(s=>s.id===id)?.name).join(', ')}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button className="btn-primary" onClick={copyToClipboard}>
                {copiedNotice ? <Check size={18} /> : <Copy size={18} />} 
                {copiedNotice ? 'Đã Copy Tin Nhắn!' : 'Copy Tin Nhắn Gửi Cho Anh Qua Zalo 📲'}
              </button>
              
              <button 
                className="btn-secondary" 
                onClick={() => setIsSubmitted(false)}
              >
                Chỉnh sửa lại lịch hẹn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN DASHBOARD MODAL */}
      {showAdminModal && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 className="modal-title" style={{ margin: 0, fontSize: '1.3rem' }}>
                💌 Dashboard Dành Cho Bạn
              </h2>
              <button 
                onClick={() => setShowAdminModal(false)}
                style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.4rem' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Đây là nơi xem tất cả các phản hồi của Bông Hoa Ly khi chọn lịch xem phim.
            </p>

            {storedSubmissions.length === 0 ? (
              <div style={{ padding: '30px 10px', textAlign: 'center', color: '#888' }}>
                <Smile size={36} color="#ff85a1" />
                <p style={{ marginTop: '10px' }}>Bông Hoa Ly chưa gửi phản hồi nào. Hãy gửi link trang web này cho cô ấy nhé! 🌸</p>
              </div>
            ) : (
              <div style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '4px' }}>
                {storedSubmissions.map((sub, index) => (
                  <div key={sub.id || index} style={{ background: '#fff0f3', borderRadius: '14px', padding: '14px', marginBottom: '12px', border: '1px solid #ffb3c1', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#ff0054', fontWeight: 'bold', marginBottom: '6px' }}>
                      <span>Lần gửi #{storedSubmissions.length - index} ({sub.timestamp})</span>
                      <button 
                        type="button"
                        onClick={() => deleteSingleSubmission(sub.id)}
                        title="Xóa lượt gửi này"
                        style={{
                          background: '#ffe5ec',
                          border: 'none',
                          color: '#e50914',
                          cursor: 'pointer',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.78rem',
                          fontWeight: '600'
                        }}
                      >
                        <Trash2 size={13} /> Xóa lượt này
                      </button>
                    </div>
                    <div style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                      <p>📅 <b>Ngày Chọn:</b> {sub.day}</p>
                      <p>🎬 <b>Phim Thích:</b> {sub.movie}</p>
                      <p>⏰ <b>Suất Chiếu:</b> {sub.time}</p>
                      <p>🍿 <b>Bắp Nước:</b> {sub.snacks.join(', ')}</p>
                      <p>💌 <b>Nhắn Gửi:</b> <i>"{sub.message}"</i></p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Telegram Webhook Config */}
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed #ffb3c1' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                📲 Cấu hình Telegram Webhook (Tùy chọn nhận thông báo điện thoại):
              </label>
              <input 
                type="text" 
                className="custom-input"
                style={{ fontSize: '0.8rem', padding: '8px 12px', marginTop: '4px' }}
                placeholder="Dán URL Webhook (VD: https://api.telegram.org/...)"
                value={webhookUrl}
                onChange={(e) => {
                  setWebhookUrl(e.target.value);
                  localStorage.setItem('ly_webhook_url', e.target.value);
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              {storedSubmissions.length > 0 && (
                <button 
                  type="button"
                  className="btn-secondary" 
                  style={{ color: '#d81b60', borderColor: '#d81b60', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  onClick={clearAllSubmissions}
                >
                  <Trash2 size={16} /> Xóa Tất Cả Lịch Sử
                </button>
              )}
              <button 
                type="button"
                className="btn-primary" 
                style={{ padding: '10px 16px', fontSize: '0.95rem', flex: 1 }}
                onClick={() => setShowAdminModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
