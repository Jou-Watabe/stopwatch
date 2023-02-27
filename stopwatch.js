const time = document.getElementById('time_area');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const resetButton = document.getElementById('reset');
const rapButton = document.getElementById('rap');
const rapArea = document.getElementById('rap-info');
const annotationArea = document.getElementById('annotation');
const recordButton = document.getElementById('check');
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

//ここにPDFのURL
var url = "./watabe-project_study_2.pdf";
 
var pdfjsLib = window['pdfjs-dist/build/pdf'];

// pdf.worker.js のURL
pdfjsLib.GlobalWorkerOptions.workerSrc
= "./pdfjs-dist/build/pdf.worker.js";

// var loadingTask = pdfjsLib.getDocument(url);
var pdfjs_target = document.getElementById('pdf_view');
 
var page_w = 1000;
var scale = 1;

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

function clickPage(){
  annotationArea.value = "";
  var page_num = this.previousElementSibling.innerHTML;
  annotationArea.value = page_num+"\n";
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
  // contentArea.innerHTML += "p." + ("00" + count).slice(-2) + " " + annotationArea.value + "\n";
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
    // contentArea.innerHTML += "p." + ("00" + count).slice(-2) + " " + annotationArea.value + "\n";
    // annotationArea.value = "";
    /*console.log(contentArea.textContent);*/

    let rap_time = new Date(now_time - old_time);
    const m = String(rap_time.getMinutes()).padStart(2, '0');
    const s = String(rap_time.getSeconds()).padStart(2, '0');
    const ms = String(rap_time.getMilliseconds()).padStart(3, '0');

    
    rapArea.innerHTML += "p." + ("00" + count).slice(-2) + " " +  `${m}:${s}.${ms}` + "\n";
    old_time = now_time;
});

recordButton.addEventListener('click', () => {
  contentArea.innerHTML += /*"p." + ("00" + count).slice(-2) + " " +*/ annotationArea.value + "\n";
  annotationArea.value = "";
  /*console.log(contentArea.textContent);*/
});

document.getElementById('pdf').addEventListener('change', ev => {
  while(document.getElementById('pdf_view').firstChild){
    document.getElementById('pdf_view').removeChild(document.getElementById('pdf_view').firstChild)
  };
  let file = ev.target.files[0];

  if(file.type != "application/pdf"){
		console.error(file.name, "is not a pdf file.")
		return
	}
	
	var fileReader = new FileReader();  

	fileReader.onload = function() {
		var typedarray = new Uint8Array(this.result);
    var loadingTask = pdfjsLib.getDocument(typedarray);

		loadingTask.promise.then(
            function(pdf) {
                // you can now use *pdf* here
                console.log("the pdf has ",pdf.numPages, "page(s).")
                for( var i=1; i<=pdf._pdfInfo.numPages; i++ ){
                    var count = 0;
                    pdf.getPage(i).then(function (page) {
                        count = count + 1;
                        //横幅を1000pxに調整
                        page_w = page._pageInfo.view[2];
                        scale = 1000 / page_w;
                         
                        var viewport = page.getViewport({ scale: scale });
                        var div = document.createElement("div");
                        var canvas = document.createElement("canvas");
                        var context = canvas.getContext("2d");

                        var p1 = document.createElement("p");
                        var text1 = document.createTextNode("p."+count);
                        p1.appendChild(text1);

                        div.width = viewport.width;
                        div.height = viewport.height;
                        
                        canvas.width = viewport.width;
                        canvas.height = viewport.height;
                        canvas.onclick = clickPage;
        
                        var renderContext = {
                            canvasContext: context,
                            viewport: viewport,
                        };
                        div.appendChild(p1);
                        div.appendChild(canvas)
                        pdfjs_target.appendChild(div);
                        page.render(renderContext);
                    });
                }
		    });
	};

	fileReader.readAsArrayBuffer(file);
});