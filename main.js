  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-analytics.js";
import {
      getFirestore,
      collection,
      addDoc,
      getDoc,
      doc,
      getDocs,
      serverTimestamp
    } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCQPJx5Sr-geBOmdk9quHKI-Q9YS_U5tmg",
    authDomain: "changeseats-2bebc.firebaseapp.com",
    projectId: "changeseats-2bebc",
    storageBucket: "changeseats-2bebc.firebasestorage.app",
    messagingSenderId: "898744904934",
    appId: "1:898744904934:web:c1f277cb5bd86d84d85f27",
    measurementId: "G-T326Z0W5L4"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
    const db = getFirestore(app);




const seats = document.getElementById("seats");
const shuffleBtn = document.getElementById("shuffle");
const stopBtn = document.getElementById('stop');
const animationT = document.getElementById('animation');
const modal = document.getElementById("modal");
const pass = document.getElementById("password");
const meta = document.getElementById("meta");
const spinner = document.getElementById("spinner");
const seatsData = document.getElementById("seatsData");
const problem = document.getElementById("problem");
const passInput = document.getElementById("input");
let n = 42;
let passwordFrag = false;

let seatsAvailable = [];
const boys = [1,2,4,5,6,7,8,9,10,11,12,13,15,19,20,21,22,24,29,30,31,32,33,37,38,39,41];
const girls = [3,14,16,17,18,23,25,26,27,28,34,35,36,40];
const absent = [31];
let secret = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
let secretDoc = "wjR9ji1aSo829O9ytMU4";
const genderSecretDoc = "7rdGOakTclBrP5GGeAgQ";
let genderSecretHash = null;
let genderKeyBuffer = "";
const MAX_GENDER_KEYS = 128;
const genderRules = Array(42).fill(null);
const password = "ao6SizD9U3klF9BLgnrN";
let isFixed = false;
let fixed = {};
let input = 0;
const scenes = {
	prepare: 0,
	shuffling: 1,
	finish: 2
};
let scene = scenes.prepare;
let flags = [];



for(let i = 0; i < 42; i++) {
    flags.push(false);
	seatsAvailable.push(true);
    const seatInput = document.createElement('input');
	const seat = document.createElement('button');
	seat.className = "seat";
    seat.id = `seat-${i}`;
	seat.addEventListener('click', () => {
            if (isFixed) {
                alert("変更できません。");
                return;
            }
			const id = i;
            seat.textContent = "";
            seat.classList.remove("boy","girl");
			if (seatsAvailable[id]) {
				seat.classList.add("notAvailable");
                seatInput.style.visibility = 'hidden';
				seatsAvailable[id] = false;
				n--;
			} else {
				seat.classList.remove("notAvailable");
                seatInput.style.visibility = 'visible';
				seatsAvailable[id] = true;
				n++;
			}
	});
	if (i == 4 || i == 5) {
		seatsAvailable[i] = false;
		seat.classList.add("notAvailable");
        seatInput.style.visibility = 'hidden';
		n--;
	}

	seats.appendChild(seat);

    seatInput.autocomplete = "off";
    seatInput.className = "seat-input";
    seatInput.id = `seat-input-${i}`;
    seatsData.appendChild(seatInput);
}
function shuffleList(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
function genderOf(student) {
    return boys.includes(student) ? "boy" : girls.includes(student) ? "girl" : null;
}
function shuffle(array) {
    const activeSeats = seatsAvailable.flatMap((ok, i) => ok ? [i] : []);
    const result = Array(activeSeats.length);
    const fixedStudents = new Set(Object.values(fixed));
    if (fixedStudents.size !== Object.keys(fixed).length || array.length !== activeSeats.length) {
        throw new Error("生徒数・固定席・使用可能な座席数を確認してください。");
    }
    const freeStudents = array.filter(x => !fixedStudents.has(x));
    const pools = {
        boy: shuffleList(freeStudents.filter(x => genderOf(x) === "boy")),
        girl: shuffleList(freeStudents.filter(x => genderOf(x) === "girl"))
    };
    if (pools.boy.length + pools.girl.length !== freeStudents.length) {
        throw new Error("生徒の男女情報を確認してください。");
    }
    const openSeats = [];
    for (let i = 0; i < activeSeats.length; i++) {
        const rule = genderRules[activeSeats[i]];
        if (Object.hasOwn(fixed, i)) {
            const student = fixed[i];
            if (!array.includes(student) || (rule && genderOf(student) !== rule)) {
                throw new Error("固定席と男女指定に矛盾があります。");
            }
            result[i] = student;
        } else if (rule) {
            if (!pools[rule].length) {
                throw new Error("男女指定の座席数が該当する生徒数を超えています。");
            }
            result[i] = pools[rule].pop();
        } else {
            openSeats.push(i);
        }
    }
    const remaining = shuffleList([...pools.boy, ...pools.girl]);
    openSeats.forEach((i, k) => result[i] = remaining[k]);
    return result;
}
function setSeats(array) {
    
    let index = 0;
    for (let i = 0; i < 42; i++) {
        if (!seatsAvailable[i]) continue;
        const element = document.getElementById(`seat-${i}`);
        element.textContent = String(array[index]);
        if (boys.includes(array[index])) element.classList.add("boy");
         else element.classList.add("girl");

        index++;
    }
}
function getRandomly(array) {
    const i = Math.floor(Math.random()*n);
    return array[i];
}

let id = "";
await getDocs(collection(db, "password")).then(docs => {
    docs.forEach(doc => {
        switch (doc.id) {
            case secretDoc:
                secret = doc.data().secret;
                break;
            case "problemid":
                id = doc.data().id;
                const problemDoc = docs.docs.filter(e => e.id == id)[0];
                problem.innerHTML = problemDoc.data().text;
                break
            default:
                break;
        }
    });
    MathJax.typeset();
});
try {
    const genderDoc = await getDoc(doc(db, "password", genderSecretDoc));
    const hash = genderDoc.exists() ? genderDoc.data().secret : null;
    if (typeof hash === "string" && /^[a-f0-9]{64}$/i.test(hash)) {
        genderSecretHash = hash.toLowerCase();
    } else {
        console.warn("男女指定用のsecretフィールドにはSHA-256の16進数64文字を設定してください。");
    }
} catch (error) {
    console.error("男女指定の起動キーを取得できませんでした:", error);
}

shuffleBtn.addEventListener('click', async () => {
    if (scene == scenes.shuffling) return;
    for (let i = 0; i < 42; i++) {
        flags[i] = false;
        const element = document.getElementById(`seat-${i}`);
        element.classList.remove("boy","girl");
        
    }
    scene = scenes.shuffling;
	let originalArray = [];
    let plus = 0;
    for (let i = 1; i < n+1; i++) {
        if (absent.includes(i)) {
            plus++;
        }
        originalArray.push(i+plus);
    }
    let shuffledArray;
    try {
        shuffledArray = shuffle(originalArray);
    } catch (error) {
        scene = scenes.finish;
        alert(error.message);
        return;
    }
    if (animationT.checked == false) {
        setSeats(shuffledArray);
    } else {
        stopBtn.style.display = 'block';
        let extra = 0;
        for (let i = 0; i < 42; i++) {
            if (!seatsAvailable[i]) {
                extra++;
                continue;
            }
            let index = i - extra;
            const e = document.getElementById(`seat-${i}`);
            const timer = setInterval(() => {
                if (flags[i]) {
                    clearInterval(timer);
                    scene = scenes.finish;
                    
                    e.classList.remove("boy","girl");
                    e.textContent = String(shuffledArray[index]);
                    if (boys.includes(shuffledArray[index])) e.classList.add("boy");
                    else e.classList.add("girl");

                    return;
                }
                e.classList.remove("boy","girl");

                let s = getRandomly(originalArray);
                e.textContent = String(s);
                if (boys.includes(s)) e.classList.add("boy");
                else e.classList.add("girl");
                scene = scenes.shuffling;

            }, 1000 / 10);
        }
    }
    scene = scenes.finish;
});

function getSeats() {
    let S = [];
    for (let i = 0; i < 42; i++) {
        const e = document.getElementById(`seat-${i}`).textContent;
        S.push(e === "" ? -1 : Number(e));
    }
    return S;
}
window.addEventListener("keydown", async (e) => {
    if (e.ctrlKey && e.altKey && e.code === "KeyC") {
        e.preventDefault();

        const seats = getSeats();
        try {
            await navigator.clipboard.writeText(JSON.stringify(seats));
            console.log("席順をコピーしました！");
        } catch (error) {
            console.error("コピーに失敗しました:", error);
        }
    }
});

animationT.addEventListener('change', () => {
    if (scene == scenes.shuffling) {
        for (let i = 0; i < flags.length; i++) {
            flags[i] = true;
            
        }
    }
});

stopBtn.addEventListener('click', () => {
    
    if (scene == scenes.shuffling) {
        for (let i = 0; i < flags.length; i++) {
            flags[i] = true;
            
        }
    }
    stopBtn.style.display = 'none';
});


 window.send = async function () {
      const name = document.getElementById("name").value;
      const comment = document.getElementById("comment").value;

      if (comment.trim() === "") {
        alert("感想を入力してください");
        return;
      }

      try {
        await addDoc(collection(db, "feedbacks"), {
          name: name,
          comment: comment,
          createdAt: serverTimestamp()
        });

        alert("送信完了！");
        document.getElementById("message").style.display = "block";

        document.getElementById("name").value = "";
        document.getElementById("comment").value = "";

      } catch (e) {
        console.error(e);
        alert("送信に失敗しました");
      }
    };


// キー名をそのまま連結してハッシュ化する。例: "password" / "ArrowUpArrowDowna"
// 入力フォーム内のキー操作・修飾キー・ショートカットは収集しない。
async function sha256Hex(value) {
    const bytes = new TextEncoder().encode(value);
    const hash = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(hash), x => x.toString(16).padStart(2, "0")).join("");
}

window.addEventListener("keydown", async (e) => {
    if (e.target instanceof HTMLElement &&
        (e.target.closest("input, textarea, select, button, [contenteditable]") ||
         e.target.isContentEditable)) {
        genderKeyBuffer = "";
        return;
    }
    if (e.ctrlKey || e.metaKey || e.altKey || e.isComposing || e.repeat) {
        genderKeyBuffer = "";
        return;
    }
    if (e.key === "Enter") {
        const candidate = genderKeyBuffer;
        genderKeyBuffer = "";
        if (candidate && genderSecretHash) {
            try {
                if (await sha256Hex(candidate) === genderSecretHash) {
                    input = 0;
                    openGenderModal();
                    return;
                }
            } catch (error) {
                console.error("SHA-256検証に失敗しました:", error);
            }
        }
        return;
    }
    if (e.key === "Backspace") {
        genderKeyBuffer = genderKeyBuffer.slice(0, -1);
    } else if (e.key.length === 1 || e.key.startsWith("Arrow")) {
        genderKeyBuffer = (genderKeyBuffer + e.key).slice(-MAX_GENDER_KEYS);
    } else {
        genderKeyBuffer = "";
    }
	if (secret[input] == e.key) {
		input++;
	} else {
		input = 0;
	}
	console.log(input);
	if (secret.length == input) {
		console.log("modal");
        modal.style.display = "flex";
        pass.style.display = "block";
        meta.style.display = "none";
		input = 0;
	}
});
document.getElementById("myForm").addEventListener("submit", async (event) => {
    event.preventDefault(); // ページ遷移を防ぐ

    const e = passInput.value;
    pass.style.visibility = "hidden";
    spinner.style.display = "block";

    await new Promise(requestAnimationFrame);
    
    await getDoc(doc(db, "password", id))
        .then(doc => {
            if (doc.data().ans == e) {
                passwordFrag = true;
                for (let i = 0; i < 42; i++) {
                    const e = document.getElementById(`seat-input-${i}`);
                    e.style.color = 'black';
                }
            } else {
                passwordFrag = false;
                for (let i = 0; i < 42; i++) {
                    const e = document.getElementById(`seat-input-${i}`);
                    e.style.color = 'white';
                }
            }
            meta.style.display = "block";
            pass.style.display = "none";
            isFixed = true;
            spinner.style.display = "none";
            pass.style.visibility = "visible";
        });
});


const fixedError = document.getElementById("fixed-error");
const roster = [...boys, ...girls].filter(student => !absent.includes(student));

function validateSeatSettings(candidateFixed, candidateRules) {
    const active = seatsAvailable.flatMap((enabled, i) => enabled ? [i] : []);
    const studentSet = new Set(roster);
    if (active.length !== studentSet.size)
        return `使用可能な座席数と出席者数が一致しません（席：${active.length}、出席者：${studentSet.size}）。`;
    const seen = new Set();
    const remaining = {
        boy: roster.filter(x => genderOf(x) === "boy").length,
        girl: roster.filter(x => genderOf(x) === "girl").length
    };
    const needed = { boy: 0, girl: 0 };
    for (const [key, student] of Object.entries(candidateFixed)) {
        const index = Number(key);
        if (!Number.isInteger(index) || index < 0 || index >= active.length)
            return "固定先に存在しない座席があります。";
        if (!studentSet.has(student)) return `出席していない生徒 ${student} は指定できません。`;
        if (seen.has(student)) return `生徒 ${student} が重複して指定されています。`;
        seen.add(student);
        const g = genderOf(student);
        if (candidateRules[active[index]] && candidateRules[active[index]] !== g)
            return `座席 ${active[index] + 1} の男女指定と、生徒 ${student} の性別が矛盾しています。`;
        remaining[g]--;
    }
    for (let i = 0; i < active.length; i++) {
        if (Object.hasOwn(candidateFixed, i)) continue;
        const g = candidateRules[active[i]];
        if (g) needed[g]++;
    }
    if (needed.boy > remaining.boy || needed.girl > remaining.girl)
        return "男女指定の座席数が、固定席を除いた出席者数を超えています。";
    return null;
}
document.getElementById("fin-btn").addEventListener("click", () => {
    fixedError.textContent = "";
    if (!passwordFrag) {
        modal.style.display = "none";
        return;
    }
    const candidateFixed = {};
    let skipped = 0;
    for (let i = 0; i < 42; i++) {
        if (!seatsAvailable[i]) { skipped++; continue; }
        const value = document.getElementById(`seat-input-${i}`).value.trim();
        if (!value) continue;
        if (!/^\d+$/.test(value)) {
            fixedError.textContent = `座席 ${i + 1} に正しい生徒番号を入力してください。`;
            return;
        }
        candidateFixed[i - skipped] = Number(value);
    }
    const error = validateSeatSettings(candidateFixed, genderRules);
    if (error) { fixedError.textContent = error; return; }
    fixed = candidateFixed;
    modal.style.display = "none";
});
const genderModal = document.getElementById("gender-modal");
const genderSeats = document.getElementById("gender-seats");
const genderError = document.getElementById("gender-error");
const genderChoices = [null, "boy", "girl"];
const genderButtons = [];
let editingGenderRules = [...genderRules];

function renderGenderSeats() {
    genderButtons.forEach((button, i) => {
        const rule = editingGenderRules[i];
        button.disabled = !seatsAvailable[i];
        button.className = "gender-seat" + (rule ? " " + rule : "");
        button.textContent = !seatsAvailable[i] ? "×" : rule === "boy" ? "男" : rule === "girl" ? "女" : "－";
        button.setAttribute("aria-label", `座席${i + 1}：${rule === "boy" ? "男子" : rule === "girl" ? "女子" : "指定なし"}`);
    });
}
function openGenderModal() {
    editingGenderRules = [...genderRules];
    renderGenderSeats();
    genderError.textContent = "";
    genderModal.style.display = "flex";
}
for (let i = 0; i < 42; i++) {
    const button = document.createElement("button");
    button.type = "button";
    button.addEventListener("click", () => {
        editingGenderRules[i] = genderChoices[(genderChoices.indexOf(editingGenderRules[i]) + 1) % genderChoices.length];
        renderGenderSeats();
    });
    genderButtons.push(button);
    genderSeats.appendChild(button);
}
document.getElementById("gender-close").addEventListener("click", () => {
    genderModal.style.display = "none";
});
document.getElementById("gender-reset").addEventListener("click", () => {
    editingGenderRules.fill(null);
    renderGenderSeats();
    genderError.textContent = "";
});
document.getElementById("gender-save").addEventListener("click", () => {
    const error = validateSeatSettings(fixed, editingGenderRules);
    if (error) { genderError.textContent = error; return; }
    genderRules.splice(0, genderRules.length, ...editingGenderRules);
    genderError.textContent = "";
    genderModal.style.display = "none";
});
