  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-analytics.js";
import {
      getFirestore,
      collection,
      addDoc,
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
let n = 42;

let seatsAvailable = [];
const boys = [1,2,4,5,6,7,8,9,10,11,12,13,15,19,20,21,22,24,29,30,31,32,33,37,38,39,41];
const girls = [3,14,16,17,18,23,25,26,27,28,34,35,36,40];
const absent = [31];
const secret = "beitosei";
const password = "(._.)"
let input = "";
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
	const seat = document.createElement('button');
	seat.className = "seat";
    seat.id = `seat-${i}`;
	seat.addEventListener('click', () => {
			const id = i;
            seat.textContent = "";
            seat.classList.remove("boy","girl");
			if (seatsAvailable[id]) {
				seat.classList.add("notAvailable");
				seatsAvailable[id] = false;
				n--;
			} else {
				seat.classList.remove("notAvailable");
				seatsAvailable[id] = true;
				n++;
			}
	});
	if (i == 4 || i == 5) {
		seatsAvailable[i] = false;
		seat.classList.add("notAvailable");
		n--;
	}

	seats.appendChild(seat);
}

function shuffle(array) {
    for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        // 要素を交換
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
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
	const l = input.length;
	if (secret[l] == e.key) {
		input += e.key;
	} else {
		input = "";
	}
	console.log(input);
	if (secret == input) {
		console.log("modal");
		const a = prompt("passward: ");
		if (a == password) {
			console.log("success");
		}
		input = "";
	}
});