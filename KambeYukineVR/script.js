/*
$('#keyBox0').on('click', function() {
      	if ($('#keyBox0').attr('color') == 'red') {
          	$(this).attr('color', 'yellow');
        }else{
        	$(this).attr('color', 'red');
        }
      });

    let otamesi =  function(){
      	if ($(this).attr('color') == 'red') {
          	$(this).attr('color', 'yellow');
        }else{
        	$(this).attr('color', 'red');
        }
      };

    


      $('#keyBox1').on('click', otamesi);
    */



//ヒントクラス
class Hinto {
  constructor(time, text){
    this.time = time;
    this.text = text;
  }

  //https://qiita.com/afujiu/items/d1885710acaf7b35fe03
  //日本語にする
  convert2HTML(){
    const text = this.text;
    const text_cnt = text.length;
    const width = text_cnt*1.4;
    const height= 1.6;
    let cvs = document.createElement('canvas');
    let ctx = cvs.getContext('2d');
    cvs.width = width*100;
    cvs.height = height*100;
    ctx.fillStyle = "#000000";
    ctx.font = '100pt Arial';
    ctx.fillText(text,0,125);

    /*
    const base64 = cvs.toDataURL("image/png");
    return `<a-image scale="${width/10} ${height/10} 1" src="${base64}"></a-image>`;
    */

   const base64 = cvs.toDataURL("image/png");
   return `<a-image scale="${(width)/10} ${height/10} 1" src="${base64}"></a-image>`;
  }
}

//兄
//ヒントを管理するオブジェクト
let hinto_kanri = {
  hinto_array: [],
  index: -1,
  
  push(hinto){
    this.hinto_array.push(hinto);
  },

  sort(){
    this.hinto_array.sort((a, b) => {
      //timeで大から小へ
      let a_t = a.time;
      let b_t = b.time;
      if(a_t > b_t){
        return -1;
      }else if(a_t < b_t){
        return 1;
      }else{
        return 0;
      }
    });
  },
  //idx番のヒントで上書きする
  overwrite_hinto(idx){
    let html = this.hinto_array[idx].convert2HTML();
    $("#hinto").html(html);
  },
  //tを受け取り必要ならoverwrite_hintoを呼ぶ
  receive_timer(now_t){
    let next = this.index+1;
    if(this.hinto_array.length <= next){
      return; //ヒントを使い切った
    }
    if(this.hinto_array[next].time >= now_t){
      this.overwrite_hinto(next);
      this.index = next;
    }
  },
};

//let hint_ex = new Hinto(0, "試しです");
//$("#hinto").innerHTML = hint_ex.convert_innerHTML();
//$("#hinto").html(hint_ex.convert2HTML());

//SE音 https://soundeffect-lab.info/sound/anime/
let seikaiSE = new Audio("jyajya.mp3");
let sippaiSE = new Audio("pokupoku.mp3");


//コントローラーが見えるやつ
let isIntersecting = false;
let isAButtonDown = false;

$('#ctlR').on('raycaster-intersection', function(evt) {
  let intersectedEl = evt.originalEvent.detail.els[0];
  $(intersectedEl).click();
});


//タイマー
let t = 3*60*10;
let stopman = setInterval(function(){
  t -= 1;
  let conma = t % 10;
  let byou = Math.floor(t/10);
  let hun = Math.floor(byou/60);
  let showByou = byou % 60;
  $('#timer').attr('value', String(hun) + ":" + String(showByou) + "." + String(conma));
  //console.log("hghg");

  hinto_kanri.receive_timer(t);
  if (t <= 0) {
    clearInterval(stopman); // 無効化するときはsetintervalのタイマーをclearIntervalに渡してあげるだけです。
  }

}, 100);


//サイコロの色が変わる
let colorList = ["#FF7F7F", "#6687CC", "#FFFFFF", "#AA7FFF", "#FFFF7F", "#66CC66", "#7CD3FF", "#FFB2E5"];

let changeColor = function(){
  for(let i=0; i<colorList.length; i++){
    if($(this).attr('color') == colorList[i]){
      $(this).attr('color', colorList[(i+1) % colorList.length]);
      break;
    }
  }
};

$('#keyBox0').on('click', changeColor);
$('#keyBox1').on('click', changeColor);
$('#keyBox2').on('click', changeColor);
$('#keyBox3').on('click', changeColor);
$('#keyBox4').on('click', changeColor);
$('#keyBox5').on('click', changeColor);


//完了ボタンを押した時のイベント
$('#kanryou').on('click', function(){
  if($('#keyBox0').attr('color') == '#FF7F7F' && 
    $('#keyBox1').attr('color') == '#6687CC' && 
    $('#keyBox2').attr('color') == '#FFFFFF' && 
    $('#keyBox3').attr('color') == '#AA7FFF' && 
    $('#keyBox4').attr('color') == '#FFFF7F' && 
    $('#keyBox5').attr('color') == '#66CC66'){

    $('#kanryou').attr('color', '#FF7F7F');
        seikaiSE.currentTime = 0;
        seikaiSE.play();
        clearInterval(stopman);
  }else{
    sippaiSE.currentTime = 0;
    sippaiSE.play();
  }

});



