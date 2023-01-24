const time = document.getElementById('time');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const resetButton = document.getElementById('reset');
const rapButton = document.getElementById('rap');
const rapArea = document.getElementById('rap-info');
const annotationArea = document.getElementById('annotation');
const contentArea = document.getElementById('invisible');

let count = 0;
/*let old_time = '00:00.000';*/
/*console.log('00:12.000' - old_time);*/

// 開始時間
let startTime;
// 停止時間
let stopTime = 0;
// タイムアウトID
let timeoutID;

let old_time;

// 時間を表示する関数
function displayTime() {
  const currentTime = new Date(Date.now() - startTime + stopTime); /*現在時刻から開始時間を引き、さらに停止時間を足している*/ 
  /*const h = String(currentTime.getHours()-9).padStart(2, '0');*/
  const m = String(currentTime.getMinutes()).padStart(2, '0');
  const s = String(currentTime.getSeconds()).padStart(2, '0');
  const ms = String(currentTime.getMilliseconds()).padStart(3, '0');
  /*console.log(h)*/

  /*time.textContent = `${h}:${m}:${s}.${ms}`;*/
  time.textContent = `${m}:${s}.${ms}`;
  timeoutID = setTimeout(displayTime, 10);
}

// スタートボタンがクリックされたら時間を進める
startButton.addEventListener('click', () => {
  startButton.disabled = true;
  stopButton.disabled = false;
  resetButton.disabled = true;
  startTime = Date.now();
  old_time = startTime;
  displayTime();
});

// ストップボタンがクリックされたら時間を止める
stopButton.addEventListener('click', function() {
  startButton.disabled = false;
  stopButton.disabled = true;
  resetButton.disabled = false;
  clearTimeout(timeoutID);
  let now_time = Date.now();
  stopTime += (now_time - startTime);

  count += 1;
  contentArea.innerHTML += "p." + ("00" + count).slice(-2) + " " + annotationArea.value + "\n";
  annotationArea.value = "";

  let rap_time = new Date(now_time - old_time);
  const m = String(rap_time.getMinutes()).padStart(2, '0');
  const s = String(rap_time.getSeconds()).padStart(2, '0');
  const ms = String(rap_time.getMilliseconds()).padStart(3, '0');
  rapArea.innerHTML += "p." + ("00" + count).slice(-2) + " " +  `${m}:${s}.${ms}` + "\n";

  const blob = new Blob(["=== === === ==="+"\n"+rapArea.textContent+"\n"+"=== === === ==="+"\n"+contentArea.textContent+"\n"+"=== === === ==="+"\n"+"=== === === ==="],{type:"text/plain"});
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = new Date(Date.now()).toLocaleString()+'.txt';
  link.click();
});

// リセットボタンがクリックされたら時間を0に戻す
resetButton.addEventListener('click', function() {
  startButton.disabled = false;
  stopButton.disabled = true;
  resetButton.disabled = true;
  time.textContent = '00:00.000';
  stopTime = 0;
  rapArea.innerHTML = "";
  count = 0;
  contentArea.innerHTML = "";
});

rapButton.addEventListener('click', () => {
    let now_time = Date.now();
    count += 1;
    contentArea.innerHTML += "p." + ("00" + count).slice(-2) + " " + annotationArea.value + "\n";
    annotationArea.value = "";
    /*console.log(contentArea.textContent);*/

    let rap_time = new Date(now_time - old_time);
    const m = String(rap_time.getMinutes()).padStart(2, '0');
    const s = String(rap_time.getSeconds()).padStart(2, '0');
    const ms = String(rap_time.getMilliseconds()).padStart(3, '0');

    
    rapArea.innerHTML += "p." + ("00" + count).slice(-2) + " " +  `${m}:${s}.${ms}` + "\n";
    old_time = now_time;
});