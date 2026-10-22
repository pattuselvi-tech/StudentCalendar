const monthTitle=document.getElementById("month-title");
const yearTitle=document.getElementById("year-title");
const titleBlock=document.querySelector(".title-block");
const daysEl=document.getElementById("days");
const selectedDateEl=document.getElementById("selected-date");
const eventListEl=document.getElementById("event-list");
const eventCountEl=document.getElementById("event-count");
const eventInput=document.getElementById("event-input");
const toastEl=document.getElementById("toast");
const voiceBtn=document.getElementById("voice-btn");
const dictateBtn=document.getElementById("dictate-btn");
const listeningEl=document.getElementById("listening");
const listeningText=document.getElementById("listening-text");
const monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"];
const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)");

/* two college events per date */
const collegeEvents={
    "2026-10-25":["Internal Exam","Lab Record Submission"],
    "2026-11-02":["Hackathon","Project Demo Round"],
    "2026-11-14":["Holiday","Children's Day Celebration"]
};

/* two personal events per date, added once as a starting point */
const defaultPersonal={
    "2026-10-25":["Revise exam notes","Call home"],
    "2026-11-02":["Prepare pitch slides","Charge laptop and power bank"],
    "2026-11-14":["Wash clothes","Practice LeetCode"]
};

let personalEvents={};
try {
    personalEvents=JSON.parse(localStorage.getItem("personalEvents"))||{};
    if(!localStorage.getItem("personalSeeded")) {
        Object.keys(defaultPersonal).forEach((key)=>{
            if(!personalEvents[key]) personalEvents[key]=[...defaultPersonal[key]];
        });
        localStorage.setItem("personalEvents",JSON.stringify(personalEvents));
        localStorage.setItem("personalSeeded","1");
    }
} catch(e) {
    personalEvents={};
}

let currentDate=new Date();
let selectedKey=null;
let bounceKey=null;      /* date whose dot should bounce after adding */
let freshEvent=null;     /* {key,index} of the event just added */

function saveEvents() {
    try {
        localStorage.setItem("personalEvents",JSON.stringify(personalEvents));
    } catch(e) {}
}
function dateKey(year,month,day) {
    const m=String(month+1).padStart(2,"0");
    const d=String(day).padStart(2,"0");
    return `${year}-${m}-${d}`;
}
function prettyDate(key) {
    const [y,m,d]=key.split("-").map(Number);
    return new Date(y,m-1,d).toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
}
function getIcon(text) {
    const t=text.toLowerCase();
    if(t.includes("holiday")) return "🎉";
    if(t.includes("exam")) return "📚";
    if(t.includes("hackathon")) return "💻";
    return "🎓";
}
function isHoliday(key) {
    return (collegeEvents[key]||[]).some((t)=>t.toLowerCase().includes("holiday"));
}

/* restart a CSS animation class on an element */
function replay(el,...classes) {
    el.classList.remove(...classes);
    void el.offsetWidth;
}

/* ---------- toast ---------- */
let toastTimer;
function showToast(message,isError=false) {
    toastEl.textContent=message;
    toastEl.classList.toggle("error",isError);
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>toastEl.classList.remove("show"),3400);
}

/* ---------- confetti ---------- */
function burst(el) {
    if(!el||reduceMotion.matches) return;
    const r=el.getBoundingClientRect();
    const cx=r.left+r.width/2;
    const cy=r.top+r.height/2;
    const colors=["#f59e0b","#fbbf24","#7c3aed","#5b21b6","#fde68a"];
    for(let i=0;i<18;i++) {
        const p=document.createElement("span");
        const angle=Math.random()*Math.PI*2;
        const dist=50+Math.random()*80;
        p.className="confetti";
        p.style.left=cx+"px";
        p.style.top=cy+"px";
        p.style.background=colors[i%colors.length];
        p.style.setProperty("--dx",Math.cos(angle)*dist+"px");
        p.style.setProperty("--dy",(Math.sin(angle)*dist-30)+"px");
        p.style.setProperty("--rot",(Math.random()*720-360)+"deg");
        document.body.appendChild(p);
        p.addEventListener("animationend",()=>p.remove());
    }
}

/* ---------- quotes ---------- */
const quotes=[
    "Bug-a paathu bayapadaatha, bug thaan unna paathu bayapadanum.",
    "Monday-a paathu bayapadaatha, Monday-ku nee yaarunu kaattu.",
    "Commit pannitta, push pannitta, ini win pannama vidamaatom.",
    "24 hours thaan irukku, aana namma code 24 years-ku pesum.",
    "innum konjam naal thaen leave vanthurum",
    "nee code pannu kabila intha ulagamae pakkatum ",
    "time waste pannatha, padi",
    "un hard work-a yaarum thadukka mudiyathu",
    "Kavalaiya vidu, pathukalam",
    "Exam mudinjathunu romba sandhosa padatha",
    "Thookuramo jeikoramo try pannu",
    "Doubt clear pannu mind thana clear aagum"
];
const quoteEl=document.getElementById("quote-text");
function showQuote(date) {
    const start=new Date(date.getFullYear(),0,0);
    const dayOfYear=Math.floor((date-start)/86400000);
    const words=quotes[dayOfYear%quotes.length].split(" ").filter(Boolean);
    quoteEl.textContent="";
    words.forEach((word,i)=>{
        const span=document.createElement("span");
        span.className="w";
        span.style.setProperty("--w",i);
        span.textContent=word;
        quoteEl.appendChild(span);
    });
}

/* ---------- calendar grid ---------- */
/* direction: "next" | "prev" | undefined (no month animation) */
function renderCalendar(direction) {
    const year=currentDate.getFullYear();
    const month=currentDate.getMonth();
    monthTitle.textContent=monthNames[month];
    yearTitle.textContent=year;
    daysEl.innerHTML="";

    if(direction) {
        replay(daysEl,"flip-next","flip-prev");
        daysEl.classList.add("flip-"+direction);
        replay(titleBlock,"slide-next","slide-prev");
        titleBlock.classList.add("slide-"+direction);
    }

    const firstDay=new Date(year,month,1).getDay();
    const totalDays=new Date(year,month+1,0).getDate();
    for(let i=0;i<firstDay;i++) {
        daysEl.appendChild(document.createElement("div"));
    }
    const today=new Date();
    for(let d=1;d<=totalDays;d++) {
        const key=dateKey(year,month,d);
        const cell=document.createElement("div");
        cell.classList.add("day");
        cell.textContent=d;
        cell.tabIndex=0;
        cell.setAttribute("role","button");
        cell.setAttribute("aria-label",prettyDate(key));
        if(d===today.getDate() && month===today.getMonth() && year===today.getFullYear()) {
            cell.classList.add("today");
        }
        if(key===selectedKey) cell.classList.add("selected");
        if((collegeEvents[key]||[]).length>0) cell.classList.add("has-college");
        if((personalEvents[key]||[]).length>0) cell.classList.add("has-personal");
        if(key===bounceKey) cell.classList.add("dot-bounce");

        const select=()=>{
            if(isHoliday(key)) burst(cell);
            showQuote(new Date(year,month,d));
            selectedKey=key;
            renderCalendar();
            renderEvents();
        };
        cell.addEventListener("click",select);
        cell.addEventListener("keydown",(e)=>{
            if(e.key==="Enter"||e.key===" ") {
                e.preventDefault();
                select();
            }
        });
        daysEl.appendChild(cell);

        /* dates cascade in one after another when the month changes */
        if(direction && !reduceMotion.matches && cell.animate) {
            cell.animate(
                [{opacity:0,transform:"translateY(14px) scale(0.8)"},{opacity:1,transform:"none"}],
                {duration:450,delay:d*14,easing:"cubic-bezier(0.34, 1.56, 0.64, 1)",fill:"backwards"}
            );
        }
    }
    bounceKey=null;
}

/* ---------- event panel ---------- */
function renderEvents() {
    eventListEl.innerHTML="";
    eventCountEl.hidden=true;
    if(!selectedKey) {
        selectedDateEl.textContent="Select a date";
        const hint=document.createElement("li");
        hint.classList.add("empty-state");
        hint.textContent="Pick a date to see what is planned.";
        eventListEl.appendChild(hint);
        return;
    }
    selectedDateEl.textContent=prettyDate(selectedKey);
    let i=0;

    (collegeEvents[selectedKey]||[]).forEach((text)=>{
        const li=document.createElement("li");
        li.classList.add("college-event");
        li.style.setProperty("--i",i++);
        li.textContent=getIcon(text)+" "+text;
        eventListEl.appendChild(li);
    });

    (personalEvents[selectedKey]||[]).forEach((text,index)=>{
        const li=document.createElement("li");
        li.classList.add("personal-event");
        li.style.setProperty("--i",i++);
        if(freshEvent && freshEvent.key===selectedKey && freshEvent.index===index) {
            li.classList.add("fresh");
        }
        const label=document.createElement("span");
        label.textContent="📝 "+text;
        const del=document.createElement("button");
        del.type="button";
        del.textContent="❌";
        del.setAttribute("aria-label","Delete event "+text);
        del.classList.add("delete-btn");
        del.addEventListener("click",()=>{
            li.classList.add("removing");
            setTimeout(()=>{
                personalEvents[selectedKey].splice(index,1);
                if(personalEvents[selectedKey].length===0) delete personalEvents[selectedKey];
                saveEvents();
                renderCalendar();
                renderEvents();
            },280);
        });
        li.appendChild(label);
        li.appendChild(del);
        eventListEl.appendChild(li);
    });
    freshEvent=null;

    if(i===0) {
        const empty=document.createElement("li");
        empty.classList.add("empty-state");
        empty.textContent="Nothing planned. Add an event below or use the mic.";
        eventListEl.appendChild(empty);
    } else {
        eventCountEl.textContent=i+(i===1?" event":" events");
        replay(eventCountEl);
        eventCountEl.hidden=false;
    }
}

function shakeInput() {
    replay(eventInput,"shake");
    eventInput.classList.add("shake");
    eventInput.addEventListener("animationend",()=>eventInput.classList.remove("shake"),{once:true});
}

function addEvent(textArg) {
    const text=(typeof textArg==="string"?textArg:eventInput.value).trim();
    if(!selectedKey||!text) {
        shakeInput();
        if(!selectedKey) eventInput.placeholder="Select a date first";
        return false;
    }
    eventInput.placeholder="Add an event";
    if(!personalEvents[selectedKey]) personalEvents[selectedKey]=[];
    personalEvents[selectedKey].push(text);
    bounceKey=selectedKey;
    freshEvent={key:selectedKey,index:personalEvents[selectedKey].length-1};
    saveEvents();
    eventInput.value="";
    renderCalendar();
    renderEvents();
    burst(daysEl.querySelector(".day.selected"));
    return true;
}

/* ---------- navigation helpers ---------- */
function moveMonth(delta) {
    currentDate=new Date(currentDate.getFullYear(),currentDate.getMonth()+delta,1);
    renderCalendar(delta>0?"next":"prev");
}

/* target: {year, month, day|null}. Shows that month and selects the day if given. */
function goToDate(target) {
    const shown=currentDate.getFullYear()*12+currentDate.getMonth();
    const wanted=target.year*12+target.month;
    const direction=wanted>shown?"next":wanted<shown?"prev":undefined;
    currentDate=new Date(target.year,target.month,1);
    if(target.day) {
        selectedKey=dateKey(target.year,target.month,target.day);
        showQuote(new Date(target.year,target.month,target.day));
    }
    renderCalendar(direction);
    renderEvents();
}

function goToday() {
    const now=new Date();
    goToDate({year:now.getFullYear(),month:now.getMonth(),day:now.getDate()});
}

/* ---------- voice ---------- */
const monthPatterns=[
    /\bjan(uary)?\b/,/\bfeb(ruary)?\b/,/\bmar(ch)?\b/,/\bapr(il)?\b/,/\bmay\b/,/\bjun(e)?\b/,
    /\bjul(y)?\b/,/\baug(ust)?\b/,/\bsep(t|tember)?\b/,/\boct(ober)?\b/,/\bnov(ember)?\b/,/\bdec(ember)?\b/
];

/* turns phrases like "25th October", "october 25 2026", "tomorrow" into {year,month,day} */
function parseDatePhrase(phrase) {
    let s=phrase.toLowerCase()
        .replace(/(\d+)(st|nd|rd|th)\b/g,"$1")
        .replace(/\bof\b/g," ")
        .replace(/[,.]/g," ");
    const now=new Date();
    if(/\btoday\b/.test(s)) {
        return {year:now.getFullYear(),month:now.getMonth(),day:now.getDate()};
    }
    if(/\btomorrow\b/.test(s)) {
        const t=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1);
        return {year:t.getFullYear(),month:t.getMonth(),day:t.getDate()};
    }
    let year=currentDate.getFullYear();
    const yearMatch=s.match(/\b(20\d\d)\b/);
    if(yearMatch) {
        year=Number(yearMatch[1]);
        s=s.replace(yearMatch[0]," ");
    }
    const month=monthPatterns.findIndex((re)=>re.test(s));
    const dayMatch=s.match(/\b(\d{1,2})\b/);
    let day=dayMatch?Number(dayMatch[1]):null;

    if(month===-1 && day===null) return null;
    const useMonth=month===-1?currentDate.getMonth():month;
    const lastDay=new Date(year,useMonth+1,0).getDate();
    if(day!==null && (day<1||day>lastDay)) day=null;
    if(month===-1 && day===null) return null;
    return {year,month:useMonth,day};
}

/* handles "add event revise notes on 2 November" or just "revise notes" while a date is selected */
function addFromSpeech(raw) {
    let text=raw.replace(/[.!?]+$/,"").trim();
    let target=null;
    const m=text.match(/^(.*)\s+(?:on|for)\s+(.+)$/i);
    if(m) {
        const parsed=parseDatePhrase(m[2]);
        if(parsed && parsed.day) {
            target=parsed;
            text=m[1].trim();
        }
    }
    if(!text) {
        showToast("I did not catch the event name. Try again.",true);
        return;
    }
    text=text.charAt(0).toUpperCase()+text.slice(1);
    if(target) goToDate(target);
    if(!selectedKey) {
        eventInput.value=text;
        shakeInput();
        showToast('Pick a date first, or say it: "'+text+' on 25 October".',true);
        return;
    }
    if(addEvent(text)) showToast('Added "'+text+'" on '+prettyDate(selectedKey));
}

function handleCommand(heard) {
    const t=heard.toLowerCase().replace(/[.!?]+$/,"").trim();

    const addMatch=heard.match(/^\s*(?:add|create|new|schedule)\s+(?:an?\s+)?(?:new\s+)?(?:event|reminder|task)?\s*(?:called|named|saying|that|:)?\s*(.*)$/i);
    if(addMatch) {
        if(!addMatch[1].trim()) {
            showToast('Say the event too, for example: "add event revise notes".',true);
            return;
        }
        addFromSpeech(addMatch[1]);
        return;
    }
    if(/\b(next|forward)\b/.test(t) && /\bmonth\b/.test(t)) {
        moveMonth(1);
        showToast("Next month");
        return;
    }
    if(/\b(previous|last|back|prior)\b/.test(t) && /\bmonth\b/.test(t)) {
        moveMonth(-1);
        showToast("Previous month");
        return;
    }
    if(/^(go to |show |open |jump to )?(today|current date)$/.test(t)) {
        goToday();
        showToast("Back to today");
        return;
    }
    const cleaned=t.replace(/^(go to|open|show|select|jump to|navigate to|take me to)\s+/,"");
    const parsed=parseDatePhrase(cleaned);
    if(parsed) {
        goToDate(parsed);
        showToast(parsed.day?prettyDate(selectedKey):monthNames[parsed.month]+" "+parsed.year);
        return;
    }
    showToast('Sorry, I did not understand "'+heard+'". Try "next month" or "go to 25 October".',true);
}

const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
let recognition=null;
let activeMode=null;

function setListeningUI(on,mode) {
    document.body.classList.toggle("is-listening",on);
    listeningEl.hidden=!on;
    voiceBtn.classList.toggle("on",on&&mode==="command");
    dictateBtn.classList.toggle("on",on&&mode==="dictate");
    eventInput.classList.toggle("dictating",on&&mode==="dictate");
    if(on) {
        listeningText.textContent=mode==="command"?"Listening... say a command":"Listening... say your event";
    }
}

function stopListening() {
    if(!recognition) return;
    const rec=recognition;
    rec.discard=true;
    recognition=null;
    activeMode=null;
    setListeningUI(false);
    try { rec.abort(); } catch(e) {}
}

/* mode: "command" (voice navigation) or "dictate" (speak an event) */
function startListening(mode) {
    if(!SR) {
        showToast("Voice input works in Chrome or Edge. This browser does not support it.",true);
        return;
    }
    const sameMode=activeMode===mode;
    stopListening();
    if(sameMode) return;   /* second tap turns the mic off */

    const rec=new SR();
    rec.lang="en-IN";
    rec.interimResults=true;
    rec.continuous=false;
    rec.maxAlternatives=1;
    recognition=rec;
    activeMode=mode;
    setListeningUI(true,mode);

    let finalText="";
    rec.onresult=(e)=>{
        let interim="";
        for(let i=e.resultIndex;i<e.results.length;i++) {
            const piece=e.results[i][0].transcript;
            if(e.results[i].isFinal) finalText+=piece;
            else interim+=piece;
        }
        const heard=(finalText+interim).trim();
        listeningText.textContent=heard?'"'+heard+'"':"Listening...";
        if(mode==="dictate") eventInput.value=heard;
    };
    rec.onerror=(e)=>{
        rec.failed=true;
        const messages={
            "not-allowed":"Microphone is blocked. Allow mic access for this page in your browser settings.",
            "service-not-allowed":"Microphone is blocked. Allow mic access for this page in your browser settings.",
            "no-speech":"I did not hear anything. Tap the mic and try again.",
            "audio-capture":"No microphone found. Plug one in and try again.",
            "network":"Voice recognition needs an internet connection."
        };
        if(e.error!=="aborted") showToast(messages[e.error]||"Voice input stopped. Try again.",true);
    };
    rec.onend=()=>{
        if(rec.discard) return;
        recognition=null;
        activeMode=null;
        setListeningUI(false);
        const said=finalText.trim();
        if(rec.failed||!said) {
            if(mode==="dictate") eventInput.value="";
            return;
        }
        if(mode==="command") handleCommand(said);
        else addFromSpeech(said);
    };
    try {
        rec.start();
    } catch(err) {
        stopListening();
        showToast("Could not start the microphone. Try again.",true);
    }
}

if(!SR) {
    document.getElementById("voice-help").textContent="Voice input works in Chrome and Edge. Typing still works everywhere.";
}

/* ---------- wiring ---------- */
document.getElementById("add-event").addEventListener("click",()=>addEvent());
eventInput.addEventListener("keydown",(e)=>{
    if(e.key==="Enter") addEvent();
});
document.getElementById("prev").addEventListener("click",()=>moveMonth(-1));
document.getElementById("next").addEventListener("click",()=>moveMonth(1));
document.getElementById("today-btn").addEventListener("click",goToday);
voiceBtn.addEventListener("click",()=>startListening("command"));
dictateBtn.addEventListener("click",()=>startListening("dictate"));

renderCalendar();
renderEvents();
showQuote(new Date());
