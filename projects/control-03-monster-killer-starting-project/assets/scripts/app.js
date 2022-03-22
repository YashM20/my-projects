// ======== Monster Attack Game =========

const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';

// const enteredValue = prompt('Maximum Life for you and the monster.', '100');
// let chosenMaxLife = parseInt(enteredValue);
let battleLog = [];
// if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
//   chosenMaxLife = 100;
// }

function getMaxLifeValues() {
  const enteredValue = prompt('Maximum Life for you and the monster.', '100');

  let parsedValue = parseInt(enteredValue);

  if (isNaN(parsedValue) || parsedValue <= 0) {
    throw { message: 'Invalid input'}
  }
  return parsedValue;
}

// Error Handling
let chosenMaxLife;

try {
  chosenMaxLife = getMaxLifeValues();
}  catch (error) {
  console.log(error);
  chosenMaxLife = 100;
  alert('You entere something wrong')
} 


let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(ev, val, monsterHealth, playerHealth) {
  let logEntry = {
    event: ev,
    value: val,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth
  };

switch (ev) {
  case LOG_EVENT_PLAYER_STRONG_ATTACK:
    logEntry.target = 'MONSTER';
    break;
  case LOG_EVENT_PLAYER_STRONG_ATTACK:
    logEntry.target = 'MONSTER';
    break;
  case LOG_EVENT_MONSTER_ATTACK:
    logEntry.target = 'PLAYER';
    break;
  case LOG_EVENT_PLAYER_HEAL:
    logEntry.target = 'PLAYER';
    break;
  case LOG_EVENT_GAME_OVER:
    logEntry.message = 'OVER'
    break;
  default:
    logEntry = {};
}
  
  battleLog.push(logEntry);
}

function reset() {
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

function endRound() {
  const initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );

  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    alert('You Would be dead but the bonus life saved you!');
  }

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert('You Won!');
    writeToLog(
      LOG_EVENT_GAME_OVER,
      'Player Won',
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert('You Lost!');
    writeToLog(
      LOG_EVENT_GAME_OVER,
      'Monster Won',
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    alert('Draw');
    writeToLog(
      LOG_EVENT_GAME_OVER,
      'A Draw',
      currentMonsterHealth,
      currentPlayerHealth
    );
  }

  if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0)  {
    reset();
  }
}

function attackMonster(mode) {
  // let maxDamage;
  // let logEvent;
  // if (mode === MODE_ATTACK) {
  //   maxDamage = ATTACK_VALUE;
  //   logEvent = LOG_EVENT_PLAYER_ATTACK;
  // } else if (mode === MODE_STRONG_ATTACK) {
  //   maxDamage = STRONG_ATTACK_VALUE;
  //   logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
  // }

  let maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  let logEvent =
    mode === MODE_ATTACK 
    ? LOG_EVENT_PLAYER_ATTACK 
    : LOG_EVENT_PLAYER_STRONG_ATTACK;

  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;
  writeToLog(
    logEvent,
    damage,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
}

function attackHandler() {
  attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
  attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler() {
  let healValue;
  if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE){
    alert("You cant heal to more than your max life");
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
}

function printLogHandler() {
  // for (let i = 0; i < 3; i++) {
  //   console.log('---------');
  // }

  //          <for loop>
  // for (let i = 0; i < battleLog.length; i++){
  //   console.log(battleLog[i]);
  // }

  //        <for of loop>
  // for (const logEntry of battleLog) {
  //   console.log(logEntry);
  // }

  let i = 0;
  for (const logEntry of battleLog) {
    console.log(`#${i}`);
    for (const key in logEntry){
      console.log(`${key} => ${logEntry[key]}`);
    }
    i++;
  }
  
  console.log(battleLog);
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click', printLogHandler);
