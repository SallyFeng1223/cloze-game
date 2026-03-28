import React, { useState, useEffect, useRef } from 'react';
import { Star, Award, ArrowRight, CheckCircle2, XCircle, RotateCcw, Home, Sparkles, Clock, Volume2, LogOut, Trophy, User, Download, Upload, AlertCircle, Loader2, ListOrdered, X } from 'lucide-react';

// 👇👇👇 內建題庫區 (做為無法連線 Google Sheet 時的備援資料) 👇👇👇
const rawCSVData = `題型(1=克漏字/2=單字),題目或單字,選項(克漏字專用請用分號;隔開),正確答案(克漏字專用),翻譯(克漏字專用)
1,"I _____ Abby.","am;are;is",am,我是 Abby。
1,"You _____ Nick.","is;am;are",are,你是 Nick。
1,"He _____ Oz.","am;is;are",is,他是 Oz。
1,"She _____ Fifi.","are;is;am",is,她是 Fifi.
1,"_____ morning.","Good;Bad;Nice",Good,早安。
1,"How _____ you?","am;are;is",are,你好嗎？
1,"I am 7, _____.","too;two;to",too,我也七歲。
1,"_____ is my hat. It is blue.","This;He;You",This,這是我的帽子。它是藍色的。
1,"That _____ my book.","am;are;is",is,那是我的書。
1,"What _____ it?","am;are;is",is,它又是什麼？
1,"It is _____ apple.","a;an;the",an,它是一顆蘋果。
1,"It is a _____ star.","blue;big;red",blue,它是一個藍色的星星。
1,"_____ you OK?","Am;Is;Are",Are,你還好嗎？
1,"Is _____ a window?","this;you;I",this,這是一個窗戶嗎？
1,"No, it is _____.","no;not;am",not,不，它不是。
1,"Is it a door? Yes, it _____.","am;is;are",is,它是一扇門嗎？是的，它是。
1,"Is this a banana? No, it is _____.","not;no;yes",not,這是一根香蕉嗎？不，它不是。
1,"Is this a pencil? Yes, _____ is.","it;I;you",it,這是一枝筆嗎？是的，它是。
1,"Is that _____ apple?","a;an;the",an,那是蘋果嗎？
1,"What _____ that?","am;are;is",is,那是什麼？
1,"Who _____ he?","is;am;are",is,他是誰？
1,"Who is _____? She is my mother.","he;she;it",she,她是誰？她是我的媽媽。
1,"Are you _____? Yes, I am.","sad;is;it",sad,你傷心嗎？是的，我傷心。
1,"Are you happy? _____, I am.","Yes;No;Not",Yes,你開心嗎？是的，我開心。
1,"Is it _____ the box?","in;on;under",in,它在盒子裡面嗎？
1,"_____ is it? It is three o'clock.","Who;Where;What",What,現在幾點？現在是三點。
1,"_____ old are you? I am seven.","How;What;Who",How,你幾歲？我七歲。
1,"_____ is the bookstore? It is near the park.","What;Where;How",Where,書店在哪裡？在公園附近。
1,"_____ many robots? Ten.","How;What;Are",How,有多少個機器人？十個。
1,"Are _____ your brothers? No, they are not.","this;that;they",they,他們是你的兄弟嗎？不，他們不是。
1,"_____ there three glasses? Yes, there are.","Is;Am;Are",Are,那裡有三個玻璃杯嗎？是的，有。
1,"Who is _____? It is a dog.","he;she;it",it,那是誰？是一隻狗。
1,"Is it a black cat? No, it is _____.","red;white;not",not,它是一隻黑貓嗎？不，它不是。
1,"What color is _____? It is yellow.","it;he;she",it,它是什麼顏色？它是黃色。
1,"_____ go!","Let's;Let;Is",Let's,我們走吧！
1,"This is _____. He can sing!","Tom;Abby;a dog",Tom,這是 Tom。他會唱歌！
1,"My name _____ Nini.","is;am;are",is,我的名字是 Nini。
1,"I _____ 4.","am;are;is",am,我四歲。
1,"This is your hat. It is _____.","orange;apple;hat",orange,這是你的帽子。它是橘色的。
1,"_____ is my book.","That;They;You",That,那是我的書。
1,"This is my pencil. _____ is your pencil.","That;This;These",That,這是我的筆。那是你的筆。
1,"It is _____ ant.","a;an;the",an,它是一隻螞蟻。
1,"It is a blue _____.","star;apple;ant",star,它是一個藍色的星星。
1,"Are you _____? No, I am not.","OK;sad;happy",OK,你還好嗎？不，我不好。
1,"Is _____ a door? Yes, it is.","it;I;you",it,它是一扇門嗎？是的，它是。
1,"Is _____ a banana? No, it is not.","this;they;we",this,這是一根香蕉嗎？不，它不是。
1,"Is that an _____? Yes, it is.","apple;banana;pencil",apple,那是蘋果嗎？是的，它是。
1,"What is _____? It is a yo-yo.","that;they;you",that,那是什麼？它是一個溜溜球。
1,"Who _____ she? She is Fifi.","is;am;are",is,她是誰？她是 Fifi。
1,"Who is he? He is my _____.","father;mother;sister",father,他是誰？他是我的父親。
1,"Are you _____? No, I am not.","sad;happy;OK",sad,你傷心嗎？不，我不傷心。
1,"Is it _____ the desk? Yes, it is.","on;in;to",on,它在書桌上嗎？是的，它是。
2,apple,蘋果 (水果),,
2,banana,香蕉 (水果),,
2,orange,橘子 (水果),,
2,pencil,鉛筆 (文具),,
2,book,書本 (物品),,
2,eraser,橡皮擦 (文具),,
2,father,父親 (家人),,
2,mother,母親 (家人),,
2,brother,兄弟 (家人),,
2,sister,姊妹 (家人),,
2,teacher,老師 (職業),,
2,doctor,醫生 (職業),,
2,red,紅色 (顏色),,
2,blue,藍色 (顏色),,
2,black,黑色 (顏色),,
2,yellow,黃色 (顏色),,
2,orange (color),橘色 (顏色),,
2,white,白色 (顏色),,
2,sad,傷心的 (形容詞),,
2,happy,開心的 (形容詞),,
2,OK,好的/沒事的 (形容詞),,
2,good,好的 (形容詞),,
2,quiet,安靜的 (形容詞),,
2,aloud,大聲地 (副詞),,
2,too,也 (副詞),,
2,near,在...附近 (介系詞),,
2,who,誰 (疑問詞),,
2,what,什麼 (疑問詞),,
2,where,在哪裡 (疑問詞),,
2,how,如何/怎樣 (疑問詞),,
2,three,三 (數字),,
2,seven,七 (數字),,
2,ten,十 (數字),,
2,sing,唱歌 (動作),,
2,read,閱讀 (動作),,
2,write,書寫 (動作),,
2,run,跑 (動作),,
2,thumbs up,豎起大拇指 (動作),,
`;
// 👆👆👆 貼上到上方為止 👆👆👆

const parseCSVRow = (str) => {
  const result = [];
  let cur = '';
  let inQuote = false;
  for (let i = 0; i < str.length; i++) {
      if (str[i] === '"') {
          inQuote = !inQuote;
      } else if (str[i] === ',' && !inQuote) {
          result.push(cur.trim());
          cur = '';
      } else {
          cur += str[i];
      }
  }
  result.push(cur.trim());
  return result.map(val => val.replace(/^"|"$/g, '').replace(/""/g, '"').trim());
};

// --- 音效產生器 (Web Audio API) ---
const playSound = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } else if (type === 'incorrect') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
      gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch (e) {
    console.log("Audio play failed", e);
  }
};

// --- 語音提示產生器 (Web Speech API) --- 
const speakWord = (word) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US'; 
    utterance.rate = 0.85; 
    utterance.pitch = 1.0; 

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const englishVoices = voices.filter(v => v.lang.startsWith('en'));
      const preferredVoice = 
        englishVoices.find(v => v.name.includes('Google US English')) || 
        englishVoices.find(v => v.name.includes('Samantha')) ||        
        englishVoices.find(v => v.name.includes('Alex')) ||            
        englishVoices.find(v => v.name.includes('Daniel')) ||          
        englishVoices[0];                                              
        
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    }
    window.speechSynthesis.speak(utterance);
  }
};

// --- 遊戲組件 ---
export default function App() {
  const [gameState, setGameState] = useState('menu'); 
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null); 
  const [timeLeft, setTimeLeft] = useState(20); 
  const [wrongAnswers, setWrongAnswers] = useState([]);
  
  // 讀取狀態與題庫狀態
  const [isLoading, setIsLoading] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  
  const [clozeQuestions, setClozeQuestions] = useState([]);
  const [spellingQuestions, setSpellingQuestions] = useState([]);
  const [activeQuestions, setActiveQuestions] = useState([]);

  const [userName, setUserName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [leaderboard, setLeaderboard] = useState(() => {
    const saved = localStorage.getItem('joyEnglishLeaderboard');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentMode, setCurrentMode] = useState('');
  
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(null);
  const fileInputRef = useRef(null);
  const [scrambledLetters, setScrambledLetters] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);

  // ✅ 核心功能：向 Google Apps Script 獲取雲端題庫，並處理錯誤備援
  useEffect(() => {
    const GOOGLE_API_URL = 'https://script.google.com/macros/s/AKfycbwYOUR_API_KEY_HERE/exec';
    
    // 載入備用離線題庫的函數
    const loadOfflineData = () => {
      const cloze = [];
      const spelling = [];
      const lines = rawCSVData.split(/\r?\n/).filter(line => line.trim() !== '');
      for (let i = 1; i < lines.length; i++) {
        const cols = parseCSVRow(lines[i]);
        if (cols.length < 2) continue;
        
        const type = cols[0].toString().trim();
        if (type === '1') {
          cloze.push({
            id: cloze.length + 1,
            question: cols[1] || "",
            options: (cols[2] || "").split(';').map(s => s.trim()).filter(s => s !== ""),
            answer: cols[3] || "",
            translation: cols[4] || ""
          });
        } else if (type === '2') {
          const safeWord = (cols[1] || "").toLowerCase().replace(/\([^)]*\)/g, '').replace(/[^a-z]/g, '');
          spelling.push({
            id: spelling.length + 1,
            word: safeWord,
            hint: cols[2] || ""
          });
        }
      }
      setClozeQuestions(cloze);
      setSpellingQuestions(spelling);
      setIsOfflineMode(true);
      setIsLoading(false);
    };

    const fetchQuestions = async () => {
      // 1. 若網址尚未替換，直接載入離線資料
      if (GOOGLE_API_URL.includes('YOUR_API_KEY_HERE')) {
        console.warn("尚未設定 Google API 網址，將使用離線題庫。");
        loadOfflineData();
        return;
      }

      try {
        const response = await fetch(GOOGLE_API_URL);
        if (!response.ok) throw new Error('網路回應錯誤');
        
        const data = await response.json();
        
        if (data.clozeQuestions && data.clozeQuestions.length > 0) {
          setClozeQuestions(data.clozeQuestions);
        }
        if (data.spellingQuestions && data.spellingQuestions.length > 0) {
          setSpellingQuestions(data.spellingQuestions);
        }
        setIsLoading(false);
        setIsOfflineMode(false);
      } catch (error) {
        console.error("無法載入雲端題庫，切換至離線模式:", error);
        loadOfflineData();
      }
    };

    fetchQuestions();
    
    // 預先載入語音
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const generateSpellingOptions = (word) => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    let letters = word.split('');
    const totalOptions = Math.max(10, word.length + 5); 
    while (letters.length < totalOptions) {
      const randomChar = alphabet[Math.floor(Math.random() * alphabet.length)];
      letters.push(randomChar);
    }
    let scrambled = letters.map((char, index) => ({ char, id: index }));
    for (let i = scrambled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [scrambled[i], scrambled[j]] = [scrambled[j], scrambled[i]];
    }
    return scrambled;
  };

  // --- 題庫上傳與下載功能 ---
  const downloadTemplate = () => {
    let csvContent = '\uFEFF'; 
    csvContent += '題型(1=克漏字/2=單字),題目或單字,選項(克漏字專用請用分號;隔開),正確答案(克漏字專用),翻譯(克漏字專用)\n';
    clozeQuestions.forEach(q => {
      const escape = (str) => `"${String(str).replace(/"/g, '""')}"`;
      const optionsStr = escape(q.options.join(';'));
      csvContent += `1,${escape(q.question)},${optionsStr},${escape(q.answer)},${escape(q.translation)}\n`;
    });
    spellingQuestions.forEach(q => {
      const escape = (str) => `"${String(str).replace(/"/g, '""')}"`;
      csvContent += `2,${escape(q.word)},${escape(q.hint)},,\n`;
    });
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'joy_english_題庫範本.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
        
        const newCloze = [];
        const newSpelling = [];
        
        for (let i = 1; i < lines.length; i++) {
          const cols = parseCSVRow(lines[i]);
          if (cols.length < 2) continue; 
          const type = cols[0].toString().trim();
          
          if (type === '1') {
            newCloze.push({
              id: newCloze.length + 1,
              question: cols[1] || "",
              options: (cols[2] || "").split(';').map(s => s.trim()).filter(s => s !== ""),
              answer: cols[3] || "",
              translation: cols[4] || ""
            });
          } else if (type === '2') {
            const safeWord = (cols[1] || "").toLowerCase().replace(/\([^)]*\)/g, '').replace(/[^a-z]/g, '');
            newSpelling.push({
              id: newSpelling.length + 1,
              word: safeWord,
              hint: cols[2] || ""
            });
          }
        }

        let isValid = false;
        if (newCloze.length > 0) { setClozeQuestions(newCloze); isValid = true; }
        if (newSpelling.length > 0) { setSpellingQuestions(newSpelling); isValid = true; }

        if (isValid) {
          setUploadMessage({ type: 'success', text: `🎉 自訂題庫載入成功！` });
          setIsOfflineMode(true); 
        } else {
          setUploadMessage({ type: 'error', text: '⚠️ 檔案中找不到有效的題目格式！' });
        }
      } catch (err) {
        setUploadMessage({ type: 'error', text: '⚠️ 解析失敗，請確認上傳的是正確的 CSV 格式！' });
      }
      setTimeout(() => setUploadMessage(null), 4000);
    };
    reader.readAsText(file, "UTF-8");
    e.target.value = ''; 
  };


  const initSpellingQuestion = (questionObj) => {
    if (questionObj) {
      setScrambledLetters(generateSpellingOptions(questionObj.word));
      setSelectedLetters([]);
    }
  };

  const startGame = (mode) => {
    if (!userName.trim()) {
      setNameError(true);
      setTimeout(() => setNameError(false), 2000); 
      return;
    }
    
    const sourceQuestions = mode === 'spelling' ? spellingQuestions : clozeQuestions;
    let shuffledQuestions = shuffleArray(sourceQuestions);
    
    // ✅ 新增核心邏輯：如果是克漏字模式，將每個題目的「選項 (options)」也進行隨機洗牌
    if (mode === 'cloze') {
      shuffledQuestions = shuffledQuestions.map(q => ({
        ...q,
        options: shuffleArray(q.options)
      }));
    }
    
    const MAX_QUESTIONS_PER_GAME = 10;
    shuffledQuestions = shuffledQuestions.slice(0, MAX_QUESTIONS_PER_GAME);

    setGameState(mode);
    setCurrentMode(mode);
    setActiveQuestions(shuffledQuestions); 
    setCurrentQIndex(0);
    setScore(0);
    setFeedback(null);
    setWrongAnswers([]); 
    setTimeLeft(mode === 'spelling' ? 30 : 20); 
    
    if (mode === 'spelling' && shuffledQuestions.length > 0) {
      initSpellingQuestion(shuffledQuestions[0]);
    }
  };

  const moveToNextQuestion = (isSpelling = false) => {
    setFeedback(null);
    if (currentQIndex + 1 < activeQuestions.length) {
      const nextIndex = currentQIndex + 1;
      setCurrentQIndex(nextIndex);
      setTimeLeft(isSpelling ? 30 : 20); 
      if (isSpelling) {
        initSpellingQuestion(activeQuestions[nextIndex]);
      }
    } else {
      setGameState('result');
    }
  };

  useEffect(() => {
    if (gameState === 'result') {
      setLeaderboard(prev => {
        const isDuplicate = prev.find(p => p.name === userName && p.score === score && (Date.now() - p.id) < 2000);
        if (isDuplicate) return prev;
        const newEntry = { 
          name: userName, score: score, mode: currentMode === 'spelling' ? '單字拼圖' : '克漏字', id: Date.now(), date: new Date().toLocaleDateString()
        };
        const newBoard = [...prev, newEntry].sort((a, b) => b.score - a.score);
        localStorage.setItem('joyEnglishLeaderboard', JSON.stringify(newBoard));
        return newBoard;
      });
    }
  }, [gameState, score, userName, currentMode]);

  useEffect(() => {
    let timer;
    if ((gameState === 'cloze' || gameState === 'spelling') && !feedback && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && !feedback) {
      playSound('incorrect');
      setFeedback('incorrect');
      
      const currentQ = activeQuestions[currentQIndex];
      const isSpelling = gameState === 'spelling';
      setWrongAnswers(prev => [...prev, {
          type: isSpelling ? 'spelling' : 'cloze',
          question: isSpelling ? currentQ.hint : currentQ.question,
          userAnswer: "超時未作答",
          correctAnswer: isSpelling ? currentQ.word : currentQ.answer,
          translation: isSpelling ? '' : currentQ.translation
      }]);

      setTimeout(() => moveToNextQuestion(isSpelling), 1500);
    }
    return () => clearInterval(timer);
  }, [gameState, feedback, timeLeft, currentQIndex, activeQuestions]);

  const handleClozeAnswer = (selectedOption) => {
    if (feedback) return;
    const currentQ = activeQuestions[currentQIndex];
    if (!currentQ) return;
    
    if (selectedOption === currentQ.answer) {
      playSound('correct');
      setScore(s => s + 10);
      setFeedback('correct');
    } else {
      playSound('incorrect');
      setFeedback('incorrect');
      setWrongAnswers(prev => [...prev, { type: 'cloze', question: currentQ.question, userAnswer: selectedOption, correctAnswer: currentQ.answer, translation: currentQ.translation }]);
    }
    setTimeout(() => moveToNextQuestion(false), 1500);
  };

  const handleLetterClick = (letterObj) => {
    if (feedback) return;
    setSelectedLetters([...selectedLetters, letterObj]);
    setScrambledLetters(scrambledLetters.filter(l => l.id !== letterObj.id));
  };

  const handleRemoveLetter = (letterObj) => {
    if (feedback) return;
    setScrambledLetters([...scrambledLetters, letterObj]);
    setSelectedLetters(selectedLetters.filter(l => l.id !== letterObj.id));
  };

  useEffect(() => {
    if (gameState === 'spelling' && selectedLetters.length > 0 && activeQuestions.length > 0) {
      const currentQ = activeQuestions[currentQIndex];
      const currentWord = currentQ.word;
      
      if (selectedLetters.length === currentWord.length) {
        const formedWord = selectedLetters.map(l => l.char).join('');
        if (formedWord === currentWord) {
          playSound('correct');
          setScore(s => s + 10);
          setFeedback('correct');
        } else {
          playSound('incorrect');
          setFeedback('incorrect');
          setWrongAnswers(prev => [...prev, { type: 'spelling', question: currentQ.hint, userAnswer: formedWord, correctAnswer: currentWord, translation: '' }]);
        }
        setTimeout(() => moveToNextQuestion(true), 1500);
      }
    }
  }, [selectedLetters, gameState, currentQIndex, activeQuestions]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-gray-700">正在與題庫連線中...</h2>
      </div>
    );
  }

  const renderMenu = () => (
    <div className="flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-3xl shadow-xl text-center max-w-md w-full border-4 border-yellow-300">
        <Sparkles className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
        <h1 className="text-3xl font-bold text-blue-600 mb-2">英語檢定闖關</h1>
        <p className="text-gray-500 font-medium mb-2">第一級 (Level 1) 考前特訓</p>
        
        {isOfflineMode ? (
          <p className="text-xs text-orange-600 font-bold mb-8 bg-orange-50 border border-orange-200 rounded-full py-1">
            ⚠️ 雲端連線失敗，目前使用離線題庫 (共 {clozeQuestions.length + spellingQuestions.length} 題)
          </p>
        ) : (
          <p className="text-xs text-green-600 font-bold mb-8 bg-green-50 border border-green-200 rounded-full py-1">
            ✓ 雲端題庫載入完成 (共 {clozeQuestions.length + spellingQuestions.length} 題)
          </p>
        )}
        
        <div className="mb-6 relative">
          <div className={`flex items-center bg-gray-50 border-2 ${nameError ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-2xl px-4 py-3 focus-within:border-blue-500 focus-within:bg-white transition-all`}>
            <User className={`w-6 h-6 ${nameError ? 'text-red-400' : 'text-gray-400'} mr-2`} />
            <input 
              type="text" 
              placeholder={nameError ? "請先輸入代號才能開始喔！" : "請輸入你的闖關代號"}
              className={`bg-transparent border-none outline-none w-full text-lg font-bold ${nameError ? 'text-red-600 placeholder-red-400' : 'text-gray-700'}`}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              maxLength={10}
            />
          </div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => startGame('cloze')}
            className="w-full py-4 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-bold text-xl shadow-lg transform transition active:scale-95 flex items-center justify-between"
          >
            <span>✍️ 克漏字挑戰</span>
            <ArrowRight className="w-6 h-6" />
          </button>
          <button 
            onClick={() => startGame('spelling')}
            className="w-full py-4 px-6 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold text-xl shadow-lg transform transition active:scale-95 flex items-center justify-between"
          >
            <span>🧩 單字拼圖王</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 w-full grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowLeaderboardModal(true)}
            className="col-span-2 py-3 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-xl font-bold flex items-center justify-center transition active:scale-95 border-2 border-yellow-300"
          >
            <ListOrdered className="w-5 h-5 mr-2" /> 查詢所有名次排名
          </button>

          <button
            onClick={downloadTemplate}
            className="py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm font-bold flex items-center justify-center transition active:scale-95 border border-gray-300"
          >
            <Download className="w-4 h-4 mr-1" /> 下載 CSV 題庫
          </button>

          <button
            onClick={() => fileInputRef.current.click()}
            className="py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-sm font-bold flex items-center justify-center transition active:scale-95 border border-blue-200"
          >
            <Upload className="w-4 h-4 mr-1" /> 上傳 CSV 題庫
          </button>
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {uploadMessage && (
          <div className={`mt-4 p-3 rounded-xl text-sm font-bold animate-in fade-in slide-in-from-bottom-2 ${uploadMessage.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
            {uploadMessage.text}
          </div>
        )}
      </div>

      {showLeaderboardModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl overflow-hidden border-4 border-yellow-400">
            <div className="bg-yellow-400 p-4 flex justify-between items-center text-yellow-900">
              <h2 className="text-2xl font-black flex items-center">
                <Trophy className="w-6 h-6 mr-2 fill-current" /> 完整名次排名
              </h2>
              <button onClick={() => setShowLeaderboardModal(false)} className="bg-yellow-500/50 hover:bg-yellow-500 rounded-full p-1 transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="overflow-y-auto p-4 flex-1">
              {leaderboard.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-100 text-gray-500">
                      <th className="py-2 pl-2">名次</th>
                      <th className="py-2">代號</th>
                      <th className="py-2">模式</th>
                      <th className="py-2 text-right pr-2">分數</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, idx) => (
                      <tr key={entry.id} className="border-b border-gray-50 hover:bg-yellow-50/50 transition-colors">
                        <td className="py-3 pl-2 font-bold text-gray-500">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}</td>
                        <td className="py-3 font-bold text-gray-800">{entry.name}</td>
                        <td className="py-3 text-xs text-gray-500">{entry.mode}</td>
                        <td className="py-3 text-right pr-2 font-black text-blue-600">{entry.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12 text-gray-400 font-medium flex flex-col items-center">
                  <Star className="w-12 h-12 mb-2 text-gray-200" />目前還沒有人挑戰喔！<br/>趕快成為第一名吧！
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderClozeGame = () => {
    const currentQ = activeQuestions[currentQIndex];
    if (!currentQ) return null;
    return (
      <div className="w-full max-w-lg animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex justify-between items-center mb-6 px-2">
          <div className="flex items-center gap-3">
            <button onClick={() => setGameState('menu')} className="flex items-center text-gray-400 hover:text-red-500 transition-colors p-1 bg-white rounded-full shadow-sm border border-gray-200">
              <LogOut className="w-6 h-6 p-1" />
            </button>
            <span className="text-lg font-bold text-blue-700 bg-blue-100 px-4 py-1 rounded-full">題數 {currentQIndex + 1} / {activeQuestions.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-lg font-bold flex items-center px-4 py-1 rounded-full ${timeLeft <= 5 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-200 text-gray-700'}`}>
              <Clock className="w-5 h-5 mr-1" /> {timeLeft}s
            </span>
            <span className="text-lg font-bold text-yellow-600 flex items-center bg-yellow-100 px-4 py-1 rounded-full hidden md:flex">
              <Star className="w-5 h-5 mr-1 fill-current" /> {score} 分
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl border-t-8 border-blue-500 relative">
          <p className="text-gray-500 text-sm font-bold mb-2">請選出最適合的答案：</p>
          <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
            {currentQ.question.split('_____').map((part, i, arr) => (
              <React.Fragment key={i}>
                {part}{i < arr.length - 1 && <span className="inline-block border-b-4 border-gray-400 w-20 mx-2 align-bottom"></span>}
              </React.Fragment>
            ))}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {currentQ.options.map((option, idx) => {
              let btnClass = "py-4 px-6 rounded-2xl font-bold text-xl transition-all shadow-sm border-2 ";
              if (feedback && option === currentQ.answer) btnClass += "bg-green-100 border-green-500 text-green-700";
              else if (feedback === 'incorrect' && option !== currentQ.answer) btnClass += "bg-red-50 border-red-200 text-red-400 opacity-50";
              else btnClass += "bg-gray-50 border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50 active:scale-95";
              return <button key={idx} disabled={feedback !== null} onClick={() => handleClozeAnswer(option)} className={btnClass}>{option}</button>;
            })}
          </div>
          {feedback && (
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full p-4 animate-bounce shadow-2xl ${feedback === 'correct' ? 'bg-green-500' : 'bg-red-500'}`}>
              {feedback === 'correct' ? <CheckCircle2 className="w-16 h-16 text-white" /> : <XCircle className="w-16 h-16 text-white" />}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSpellingGame = () => {
    const currentQ = activeQuestions[currentQIndex];
    if (!currentQ) return null;
    return (
      <div className="w-full max-w-lg animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex justify-between items-center mb-6 px-2">
          <div className="flex items-center gap-3">
            <button onClick={() => setGameState('menu')} className="flex items-center text-gray-400 hover:text-red-500 transition-colors p-1 bg-white rounded-full shadow-sm border border-gray-200">
              <LogOut className="w-6 h-6 p-1" />
            </button>
            <span className="text-lg font-bold text-green-700 bg-green-100 px-4 py-1 rounded-full">單字 {currentQIndex + 1} / {activeQuestions.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-lg font-bold flex items-center px-4 py-1 rounded-full ${timeLeft <= 5 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-200 text-gray-700'}`}>
              <Clock className="w-5 h-5 mr-1" /> {timeLeft}s
            </span>
            <span className="text-lg font-bold text-yellow-600 flex items-center bg-yellow-100 px-4 py-1 rounded-full hidden md:flex">
              <Star className="w-5 h-5 mr-1 fill-current" /> {score} 分
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl border-t-8 border-green-500 relative">
          <div className="text-center mb-8">
            <h3 className="text-gray-500 font-bold mb-2 flex items-center justify-center">
              請拼出正確的單字
              <button onClick={() => speakWord(currentQ.word)} className="ml-2 bg-blue-100 hover:bg-blue-200 text-blue-600 p-1.5 rounded-full transition shadow-sm active:scale-90">
                <Volume2 className="w-5 h-5" />
              </button>
            </h3>
            <div className="inline-block bg-green-50 px-6 py-3 rounded-2xl border border-green-200 text-2xl font-bold text-green-800">{currentQ.hint}</div>
          </div>
          <div className="flex justify-center gap-2 mb-8 min-h-[4rem]">
            {Array.from({ length: currentQ.word.length }).map((_, i) => (
              <div key={i} onClick={() => selectedLetters[i] && handleRemoveLetter(selectedLetters[i])}
                className={`w-12 h-14 md:w-14 md:h-16 flex items-center justify-center text-3xl font-bold rounded-xl border-b-4 cursor-pointer transition-colors ${selectedLetters[i] ? 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200 shadow-inner' : 'bg-gray-100 text-transparent border-gray-300'}`}>
                {selectedLetters[i] ? selectedLetters[i].char.toUpperCase() : ''}
              </div>
            ))}
          </div>
          <div className="flex justify-center flex-wrap gap-3">
            {scrambledLetters.map((letterObj) => (
              <button key={letterObj.id} disabled={feedback !== null} onClick={() => handleLetterClick(letterObj)} className="w-12 h-14 md:w-14 md:h-16 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 border-b-4 border-yellow-600 rounded-xl text-2xl font-bold transform transition active:scale-90 active:border-b-0 active:translate-y-1 shadow-md disabled:opacity-50">
                {letterObj.char.toUpperCase()}
              </button>
            ))}
          </div>
          {selectedLetters.length > 0 && !feedback && <p className="text-center text-gray-400 text-sm mt-6 animate-pulse">點擊上方的字母可以退回重選喔！</p>}
          {feedback && (
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full p-4 animate-bounce shadow-2xl ${feedback === 'correct' ? 'bg-green-500' : 'bg-red-500'}`}>
              {feedback === 'correct' ? <CheckCircle2 className="w-16 h-16 text-white" /> : <XCircle className="w-16 h-16 text-white" />}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderResult = () => {
    const totalPossible = activeQuestions.length * 10;
    const isPerfect = score === totalPossible && totalPossible > 0;

    return (
      <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full animate-in zoom-in-95 duration-500 border-4 border-yellow-300">
        <Award className={`w-24 h-24 mx-auto mb-4 ${isPerfect ? 'text-yellow-500' : 'text-blue-500'}`} />
        <h2 className="text-3xl font-black text-gray-800 mb-2">測驗完成！</h2>
        <p className="text-gray-500 mb-6">你總共獲得了</p>
        <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-8">{score} / {totalPossible}</div>
        {isPerfect ? <p className="text-green-600 font-bold text-lg mb-8 bg-green-50 py-2 rounded-xl">太棒了！你是英文檢定小大師！ 🎉</p> : <p className="text-blue-600 font-bold text-lg mb-8 bg-blue-50 py-2 rounded-xl">繼續加油，下次一定能拿滿分！ 💪</p>}
        <div className="space-y-4 mb-8">
          <button onClick={() => startGame(currentMode)} className="w-full py-4 px-6 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 rounded-2xl font-bold text-xl shadow-md transform transition active:scale-95 flex items-center justify-center">
            <RotateCcw className="w-5 h-5 mr-2" /> 再玩一次
          </button>
          <button onClick={() => setGameState('menu')} className="w-full py-4 px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-2xl font-bold text-xl shadow-md transform transition active:scale-95 flex items-center justify-center">
            <Home className="w-5 h-5 mr-2" /> 回主選單
          </button>
        </div>
        {wrongAnswers.length > 0 && (
          <div className="bg-red-50 p-4 rounded-2xl border-2 border-red-200 text-left w-full mt-6 animate-in slide-in-from-bottom-4">
            <h3 className="text-lg font-bold text-red-800 mb-4 flex items-center justify-center"><AlertCircle className="w-5 h-5 mr-2" /> 錯題回顧 ({wrongAnswers.length} 題)</h3>
            <ul className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {wrongAnswers.map((wrong, idx) => (
                <li key={idx} className="bg-white p-3 rounded-xl shadow-sm border border-red-100">
                  {wrong.type === 'cloze' ? (
                     <>
                       <p className="font-bold text-gray-800 mb-1">{wrong.question.replace('_____', '___')}</p>
                       <p className="text-xs text-gray-500 mb-3">{wrong.translation}</p>
                       <div className="text-sm font-medium flex flex-col gap-1">
                         <span className="text-red-500 line-through">你的答案: {wrong.userAnswer}</span>
                         <span className="text-green-600">正確答案: {wrong.correctAnswer}</span>
                       </div>
                     </>
                  ) : (
                     <>
                       <p className="font-bold text-gray-800 mb-3">{wrong.question}</p>
                       <div className="text-sm font-medium flex flex-col gap-1">
                         <span className="text-red-500 line-through">你的拼寫: {wrong.userAnswer}</span>
                         <span className="text-green-600 flex items-center">
                           正確拼法: {wrong.correctAnswer}
                           <button onClick={() => speakWord(wrong.correctAnswer)} className="ml-2 bg-blue-50 text-blue-600 p-1 rounded-full hover:bg-blue-100 transition"><Volume2 className="w-4 h-4" /></button>
                         </span>
                       </div>
                     </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans selection:bg-yellow-200">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob"></div>
         <div className="absolute top-[20%] right-[-10%] w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-2000"></div>
         <div className="absolute bottom-[-20%] left-[20%] w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>
      <div className="z-10 w-full flex justify-center">
        {gameState === 'menu' && renderMenu()}
        {gameState === 'cloze' && renderClozeGame()}
        {gameState === 'spelling' && renderSpellingGame()}
        {gameState === 'result' && renderResult()}
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #fee2e2; border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #fca5a5; border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ef4444; }
      `}} />
    </div>
  );
}
