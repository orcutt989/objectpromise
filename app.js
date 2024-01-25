
// Replace with your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBvbXJ4p4u3Nf9DZMk556GRqhwGPoIdCQQ",
    authDomain: "move-high-scores.firebaseapp.com",
    projectId: "move-high-scores",
    storageBucket: "move-high-scores.appspot.com",
    messagingSenderId: "506931017616",
    appId: "1:506931017616:web:9a021f85ba95636759e515",
    measurementId: "G-1T90DQS163"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
// Check if analytics is available before initializing
if ('analytics' in firebase) {
    const analytics = firebase.analytics();
}

// Reference to the Firestore database
const db = app.firestore();

// Initialize Firebase with Anonymous Authentication
firebase.auth().signInAnonymously()
    .then(() => {
        // Anonymous authentication successful
        console.log("Anonymous authentication successful");
    })
    .catch((error) => {
        // Handle errors during anonymous authentication
        console.error("Error during anonymous authentication:", error);
    });

document.addEventListener("DOMContentLoaded", function () {
    const gameBox = document.getElementById("game-box");
    const scoreDisplay = document.getElementById("score-display");
    const timerDisplay = document.getElementById("timer-display");
    const scoresContainer = document.getElementById("scores-container");
    let posX = 0;
    let posY = 0;
    let score = 0;
    let timerSeconds = 10;
    let timerInterval;
    let gameActive = true;

    // Function to check if the device is a mobile device with touch
    function isMobileDeviceWithTouch() {
        return 'ontouchstart' in window || navigator.maxTouchPoints;
    }

    // Add touch controls only for mobile devices with touchscreens
    if (isMobileDeviceWithTouch()) {
        const touchControls = document.getElementById("touch-controls");
        const upArrow = document.getElementById("up-arrow");
        const downArrow = document.getElementById("down-arrow");
        const leftArrow = document.getElementById("left-arrow");
        const rightArrow = document.getElementById("right-arrow");

        // Calculate the position for the touch controls
        const windowHeight = window.innerHeight;
        const bottomThird = windowHeight * (2 / 3);
        const verticalCenter = windowHeight / 2;

        // Set the position of touch controls
        touchControls.style.position = "fixed";
        touchControls.style.bottom = "0"; // Position at the top of the bottom third
        touchControls.style.left = "50%";
        touchControls.style.transform = "translate(-50%, 0%)"; // Adjust transform to center horizontally


        // Add touch event listeners
        upArrow.addEventListener("touchstart", (event) => {
            console.log("Up arrow touched");
            event.preventDefault();
            handleTouchControl("up")
        });
        downArrow.addEventListener("touchstart", (event) => {
            console.log("Down arrow touched");
            event.preventDefault();
            handleTouchControl("down")
        });
        leftArrow.addEventListener("touchstart", (event) => {
            console.log("Left arrow touched");
            event.preventDefault();
            handleTouchControl("left")
        });
        rightArrow.addEventListener("touchstart", (event) => {
            console.log("Right arrow touched");
            event.preventDefault();
            handleTouchControl("right")
        });

        // Add touch move listeners
        upArrow.addEventListener("touchmove", (event) => {
            event.preventDefault();
        });
        downArrow.addEventListener("touchmove", (event) => {
            event.preventDefault();
        });
        leftArrow.addEventListener("touchmove", (event) => {
            event.preventDefault();
        });
        rightArrow.addEventListener("touchmove", (event) => {
            event.preventDefault();
        });
        
        // Function to handle touch controls
        function handleTouchControl(direction) {
            const boxSize = 10;
            const maxX = window.innerWidth - boxSize;
            const maxY = window.innerHeight - boxSize;

            switch (direction) {
                case "up":
                    posY = Math.max(0, posY - 10);
                    break;
                case "down":
                    posY = Math.min(maxY, posY + 10);
                    break;
                case "left":
                    posX = Math.max(0, posX - 10);
                    break;
                case "right":
                    posX = Math.min(maxX, posX + 10);
                    break;
            }

            updatePosition();
        }
    } else {
        // If not a mobile device, hide touch controls
        const touchControls = document.getElementById("touch-controls");
        touchControls.style.display = "none";
    }

    // Function to generate a consistent username based on IP and user agent
    async function generateUsername() {

        // Check if the user is authenticated
        const user = firebase.auth().currentUser;

        if (user) {
            // User is authenticated, obtain UID
            const uid = user.uid;

            // Rest of the function remains unchanged
            // Use the UID to customize the username generation if needed
        } else {
            // User is not authenticated, handle accordingly
            console.warn("User is not authenticated.");
            // Handle anonymous user or fallback
        }

        const adjectives = ["Absolute", "Abstract", "Abyssal", "Adorable", "Adventurous", "Angry", "Agreeable", "Awful", "Bad", "Basic", "Based", "Better", "Billionaire", "Bizarre", "Blushing", "Bored", "Brave", "Chaotic", "Charming", "Cheeky", "Cheerful", "Clever", "Crusty", "Cryptic", "Curious", "Dank", "Dark", "Defiant", "Dizzy", "Eager", "Embarrassed", "Energetic", "Excited", "Famous", "Fierce", "Filthy", "Fluffy", "Foolish", "Friendly", "Funny", "Glamorous", "Gnarly", "Goofy", "Gothic", "Groovy", "Grumpy", "Helpful", "Hilarious", "Hungry", "Imaginary", "Important", "Innocent", "Itchy", "Jealous", "Jolly", "Juicy", "Lethal", "Lit", "Lively", "Lovely", "Lucky", "Meaty", "Memetic", "Moist", "Mushy", "Nasty", "Natural", "Normcore", "Nostalgic", "Orbular", "Outgoing", "Perfect", "Powerful", "Prickly", "Puzzled", "Quantum", "Quirky", "Reckless", "Regal", "Relativistic", "Retro", "Rusty", "Salty", "Scary", "Scrumptuous", "Shiny", "Sigma", "Silly", "Sloppy", "Super", "Tasty", "Toasty", "Trendy", "True", "Turbo", "Unusual", "Ultra", "Victorious", "Witty", "Zealous"];
        const nouns = ["Abacus", "Adventure", "Anarchoegoist", "Android", "Anticapitalist", "Arch", "Battlepass", "Bean", "Berserker", "Bingus", "Blender", "Brandon", "Bread", "Carrot", "Cat", "Cloud", "Clummster", "Coffee", "Company", "Comrade", "Cookie", "Crab", "Crane", "Creed", "Custard", "Cyborg", "Dentist", "Dirt", "Dongle", "Dragon", "Egg", "Entity", "Fairy", "Flamingo", "Fork", "Fossil", "Frog", "Fungus", "Gamer", "Gender", "Goblin", "Grindset", "Herb", "Hippie", "Humbler", "Illusion", "Jellyfish", "Joker", "Kangaroo", "Ketchup", "Koala", "Kolache", "Laborer", "Landmine", "Lemonade", "Lumpenprole", "Mascot", "Mayonnaise", "Meme", "Monk", "Mushroom", "Ninja", "Noodle", "Obelisk", "Object", "Orb", "Outlaw", "Panda", "Paperclip", "Pendulum", "Pierogi", "Pizza", "Potion", "Promise", "Q-tip", "Rebel", "Rizzler", "Robot", "Sauce", "Socialist", "Slug", "Soda", "Soup", "Spoon", "Stinker", "Sword", "Taco", "Theory", "Toast", "Tornado", "Troll", "Unit", "Villager", "Virus", "Wiggler", "Wickhead", "Wizard", "Xenomorph", "Zammy", "Zebra"];

        // Use IP and user agent as input to generate a hash
        const ip = await getUserIP();
        const inputString = `${ip}${navigator.userAgent}`;
        
        // Use the hash to determine indices for adjective and noun
        const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(inputString));
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        // Use the hash to determine indices for adjective and noun
        const adjectiveIndex = parseInt(hashHex.substr(0, 8), 16) % adjectives.length;
        const nounIndex = parseInt(hashHex.substr(8, 8), 16) % nouns.length;

        return `${adjectives[adjectiveIndex]}${nouns[nounIndex]}`;
    }

    // Create the username display element
    const usernameDisplay = document.createElement("div");
    usernameDisplay.id = "username-display";
    usernameDisplay.style.position = "fixed";
    usernameDisplay.style.top = "30px";
    usernameDisplay.style.left = "10px";
    document.body.appendChild(usernameDisplay);

    // Set the initial username
    let initialUsername = generateUsername();
    usernameDisplay.textContent = `You are a ${initialUsername}`;

    // Function to update the list of scores in the upper right-hand corner
    async function updateScoresList() {
        const scoresList = document.getElementById("scores-list");
        scoresList.innerHTML = "";
    
        // Fetch scores from Firestore in descending order based on timestamp
        const querySnapshot = await db.collection("scores").orderBy("timestamp", "desc").get();
    
        querySnapshot.forEach((doc) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${doc.data().username}, Score: ${doc.data().score}`;
            scoresList.appendChild(listItem);
        });
    }

    function updatePosition() {
        gameBox.style.left = posX + "px";
        gameBox.style.top = posY + "px";
    
        // Check for collisions with red boxes
        document.querySelectorAll(".red-box").forEach((redBox) => {
            if (checkCollision(redBox)) {
                document.body.removeChild(redBox);
                score++;
                updateScore();
            }
        });
    }

    function createRedBox() {
        if (!gameActive) {
            return;
        }

        const redBox = document.createElement("div");
        redBox.classList.add("red-box");

        redBox.style.left = Math.random() * (window.innerWidth - 10) + "px";
        redBox.style.top = Math.random() * (window.innerHeight - 10) + "px";

        document.body.appendChild(redBox);

        return redBox;
    }

    function checkCollision(redBox) {
        const boxRect = gameBox.getBoundingClientRect();
        const redBoxRect = redBox.getBoundingClientRect();

        return (
            boxRect.left < redBoxRect.right &&
            boxRect.right > redBoxRect.left &&
            boxRect.top < redBoxRect.bottom &&
            boxRect.bottom > redBoxRect.top
        );
    }

    function updateScore() {
        scoreDisplay.textContent = "Score: " + score;
        usernameDisplay.textContent = `You are a ${initialUsername}`;
    }

    function endGame() {
        clearInterval(timerInterval);
    
        const popup = document.createElement("div");
        popup.classList.add("popup");
        
        if (score > 0) {
            popup.innerHTML = `
                <p>Your Score: ${score}</p>
                <button onclick="saveAndReset()">Play Again</button>
            `;
        } else {
            popup.innerHTML = `
                <p>Your Score: 0</p>
                <button onclick="resetGame()">Play Again</button>
            `;
        }
    
        document.body.appendChild(popup);
        gameActive = false;
    }
    
// Add a new function to save the score and reset the game
window.saveAndReset = async function () {
    // Save the current score to Firestore with a timestamp
    await db.collection("scores").add({
        username: initialUsername, // Add the username field
        score: score,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    // Update the list of scores
    updateScoresList();

    // Reset the game
    resetGame();
};
    
window.resetGame = async function () {
    console.log("Resetting game...");

    score = 0;
    timerSeconds = 10;
    posX = Math.random() * (window.innerWidth - 10);
    posY = Math.random() * (window.innerHeight - 10);
    updateScore();
    updateTimer();
    clearInterval(timerInterval);

    document.querySelectorAll(".red-box").forEach((redBox) => {
        document.body.removeChild(redBox);
    });

    timerInterval = setInterval(function () {
        timerSeconds--;
        updateTimer();
        if (timerSeconds <= 0) {
            endGame();
        }
    }, 1000);

    gameActive = true;

    const redBoxesContainer = document.getElementById("red-boxes-container");
    redBoxesContainer.innerHTML = "";

    for (let i = 0; i < 15; i++) {
        createRedBox();
    }

    updatePosition();
    console.log("Game reset complete.");

    // Update the initial username immediately after the game reset
    initialUsername = await generateUsername();
    usernameDisplay.textContent = `You are a ${initialUsername}`;

    // Remove the pop-up element
    const popup = document.querySelector(".popup");
    if (popup) {
        document.body.removeChild(popup);
    }
};

    function updateTimer() {
        const milliseconds = timerSeconds % 1000;
        const seconds = Math.floor(timerSeconds / 1000) % 60;
        const minutes = Math.floor(timerSeconds / (1000 * 60));

        timerDisplay.textContent = `Time: ${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(4, "0")}`;
    }

    updateScore();

    timerDisplay.style.position = "fixed";
    timerDisplay.style.top = "10px";
    timerDisplay.style.left = "50%";
    timerDisplay.style.transform = "translateX(-50%)";
    document.body.appendChild(timerDisplay);

    document.addEventListener("keydown", function (event) {
        if (!gameActive) {
            return;
        }

        const boxSize = 10;
        const maxX = window.innerWidth - boxSize;
        const maxY = window.innerHeight - boxSize;

        switch (event.key) {
            case "ArrowUp":
                posY = Math.max(0, posY - 10);
                break;
            case "ArrowDown":
                posY = Math.min(maxY, posY + 10);
                break;
            case "ArrowLeft":
                posX = Math.max(0, posX - 10);
                break;
            case "ArrowRight":
                posX = Math.min(maxX, posX + 10);
                break;
        }

        updatePosition();

        document.querySelectorAll(".red-box").forEach((redBox) => {
            if (checkCollision(redBox)) {
                document.body.removeChild(redBox);
                score++;
                updateScore();
            }
        });
    });

    setInterval(() => {
        createRedBox();

        document.querySelectorAll(".red-box").forEach((redBox) => {
            if (checkCollision(redBox)) {
                document.body.removeChild(redBox);
                score++;
                updateScore();
            }
        });
    }, 3000);

    resetGame();
    updateScoresList(); // Initialize scores list on page load
});

// Function to get the user's IP address
async function getUserIP() {
    const response = await fetch('https://api64.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
}
