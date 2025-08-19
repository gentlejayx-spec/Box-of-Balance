// --- JavaScript: ส่วนของ Logic และการทำงานของเกม ---

// 1. กำหนดข้อมูลอาหาร (สามารถเพิ่ม/แก้ไขได้ที่นี่)
const foods = [
    { name: 'แอปเปิ้ล', emoji: '🍎', type: 'healthy' },
    { name: 'สลัด', emoji: '🥗', type: 'healthy' },
    { name: 'บรอกโคลี', emoji: '🥦', type: 'healthy' },
    { name: 'ปลา', emoji: '🐟', type: 'healthy' },
    { name: 'นม', emoji: '🥛', type: 'healthy' },
    { name: 'พิซซ่า', emoji: '🍕', type: 'unhealthy' },
    { name: 'โดนัท', emoji: '🍩', type: 'unhealthy' },
    { name: 'แฮมเบอร์เกอร์', emoji: '🍔', type: 'unhealthy' },
    { name: 'เฟรนช์ฟรายส์', emoji: '🍟', type: 'unhealthy' },
    { name: 'น้ำอัดลม', emoji: '🥤', type: 'unhealthy' }
];

// 2. ดึง Element ต่างๆ จาก HTML มาเก็บในตัวแปร
const startScreen = document.getElementById('start-screen');
const gameArea = document.getElementById('game-area');
const endScreen = document.getElementById('end-screen');

const startButton = document.getElementById('startButton');
const playAgainButton = document.getElementById('playAgainButton');

const scoreElement = document.getElementById('score');
const cardBoard = document.getElementById('card-board');
const dropBoxes = document.querySelectorAll('.drop-box');

// 3. สร้างตัวแปรสำหรับควบคุมเกม
let score = 0;
let draggedCard = null; // ตัวแปรเก็บการ์ดที่กำลังถูกลาก
let totalCards = 0;

// 4. ตั้งค่า Event Listeners
startButton.addEventListener('click', startGame);
playAgainButton.addEventListener('click', startGame);

// 5. ฟังก์ชันหลักของเกม
function startGame() {
    score = 0;
    updateScoreDisplay();
    
    startScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    gameArea.classList.remove('hidden');

    createCards();
}

// ฟังก์ชันสร้างการ์ดบนกระดาน
function createCards() {
    cardBoard.innerHTML = ''; // ล้างการ์ดเก่าออกก่อน
    totalCards = foods.length;

    // สลับลำดับของอาหารเพื่อให้เกมไม่ซ้ำเดิม
    const shuffledFoods = [...foods].sort(() => Math.random() - 0.5);

    shuffledFoods.forEach(food => {
        const card = document.createElement('div');
        card.className = 'card';
        card.draggable = true;
        card.textContent = food.emoji;
        card.dataset.type = food.type; // เก็บ "คำตอบ" ไว้ในการ์ด

        // เพิ่ม Event Listener สำหรับการลาก
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);

        cardBoard.appendChild(card);
    });
}

// ฟังก์ชันอัปเดตคะแนน
function updateScoreDisplay() {
    scoreElement.textContent = score;
}

// 6. ฟังก์ชันเกี่ยวกับการลากและวาง (Drag and Drop)

// เมื่อเริ่มลากการ์ด
function handleDragStart(e) {
    draggedCard = e.target; // จำไว้ว่ากำลังลากการ์ดใบไหน
    setTimeout(() => e.target.classList.add('dragging'), 0); // ใส่ class เพื่อให้โปร่งใส
}

// เมื่อเลิกลากการ์ด
function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    draggedCard = null;
}

// เพิ่ม Event Listener ให้กับกล่องวาง
dropBoxes.forEach(box => {
    box.addEventListener('dragover', handleDragOver);
    box.addEventListener('dragleave', handleDragLeave);
    box.addEventListener('drop', handleDrop);
});

// เมื่อลากการ์ดมาอยู่เหนือกกล่อง
function handleDragOver(e) {
    e.preventDefault(); // จำเป็น! เพื่อให้ event 'drop' ทำงานได้
    e.currentTarget.classList.add('drag-over');
}

// เมื่อลากการ์ดออกจากกล่อง
function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

// เมื่อปล่อยการ์ดลงในกล่อง
function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');

    if (draggedCard) {
        const cardType = draggedCard.dataset.type;
        const boxType = e.currentTarget.dataset.type;

        // ตรวจสอบคำตอบ
        if (cardType === boxType) {
            score++; // ตอบถูก +1 คะแนน
        } else {
            score--; // ตอบผิด -1 คะแนน
        }
        updateScoreDisplay();

        draggedCard.remove(); // นำการ์ดที่ลากแล้วออกไป
        totalCards--;

        // ตรวจสอบว่าเกมจบหรือยัง
        if (totalCards === 0) {
            endGame();
        }
    }
}

// 7. ฟังก์ชันจบเกม
function endGame() {
    gameArea.classList.add('hidden');
    endScreen.classList.remove('hidden');

    document.getElementById('final-score').textContent = `คะแนนรวมของคุณคือ: ${score}`;
    
    let message = '';
    if (score >= foods.length / 2) {
         message = 'เยี่ยมมาก! คุณมีความเข้าใจเรื่องการเลือกรับประทานอาหารที่ดี พยายามเลือกทานอาหารที่มีประโยชน์หลากหลายและครบ 5 หมู่อยู่เสมอนะครับ';
    } else {
         message = 'ไม่เป็นไรนะ! ลองศึกษาเพิ่มเติมเกี่ยวกับการเลือกอาหารที่มีประโยชน์ การทานอาหารที่ดีช่วยให้ร่างกายแข็งแรงและสดใสนะครับ พยายามลดอาหารแปรรูป ของทอด และของหวานดูนะ';
    }
    document.getElementById('end-message').textContent = message;
}