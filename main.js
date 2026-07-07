  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-analytics.js";
import {
      getFirestore,
      collection,
      addDoc,
      getDoc,
      doc,
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
let n = 42;

let seatsAvailable = [];
const boys = [1,2,4,5,6,7,8,9,10,11,12,13,15,19,20,21,22,24,29,30,31,32,33,37,38,39,41];
const girls = [3,14,16,17,18,23,25,26,27,28,34,35,36,40];
const absent = [31];
let secret = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
let secretDoc = "wjR9ji1aSo829O9ytMU4";
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

await getDoc(doc(db, "password", secretDoc)).then(doc => {
    secret = doc.data().secret;
    console.log(secret);
});

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

    seatInput.className = "seat-input";
    seatInput.id = `seat-input-${i}`;
    seatsData.appendChild(seatInput);
}
function shuffle(array) {

    // 固定する生徒を除く
    const freeStudents = array.filter(x => !Object.values(fixed).includes(x));

    // シャッフル
    for (let i = freeStudents.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [freeStudents[i], freeStudents[j]] = [freeStudents[j], freeStudents[i]];
    }

    // 結果配列
    const result = Array(n);

    // 固定席以外の座席
    const freeSeats = [];
    for (let i = 0; i < n; i++) {
        if (!(i in fixed)) {
            freeSeats.push(i);
        }
    }

    // 固定席を配置
    for (const [seat, student] of Object.entries(fixed)) {
        result[Number(seat)] = student;
    }

    // 残りを配置
    freeSeats.forEach((seat, i) => {
        result[seat] = freeStudents[i];
    });

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
    const shuffledArray = shuffle(originalArray);
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


window.addEventListener("keydown", (e) => {
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

document.getElementById("submit-btn").addEventListener('click', async () =>  {
    const e = document.getElementById("input").value;
    pass.style.visibility = "hidden";
    spinner.style.display = "block";

    await new Promise(requestAnimationFrame);
    
    await getDoc(doc(db, "password", password))
        .then(doc => {
            if (doc.data().password == e) {
                meta.style.display = "block";
                pass.style.display = "none";
                isFixed = true;

            }
            spinner.style.display = "none";
            pass.style.visibility = "visible";
        });
});

document.getElementById("fin-btn").addEventListener('click', () => {
    for (let i = 0; i < 42; i++) {
        delete fixed[i];
        const e = document.getElementById(`seat-input-${i}`);
        if (e.style.visibility == 'hidden') continue;
        if (/^\d+$/.test(e.value)) {
            const n = Number(e.value);
            if (true) {
                fixed[i] = n;
            }
        }
    }



    modal.style.display = 'none';
});