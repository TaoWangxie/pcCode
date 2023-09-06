//网格背景canvas
export const drawGrid =(target:string,colorObj?:{c1:string,c2:string})=>{
    let colorsBoard = genBoard(200, 200, colorObj);
    var canvas:any = document.getElementById(target);
    

    var classIndex = ''; // 当前操作的class是第几个(设置全局变量其他地方也可以用)
    var tests:any = document.getElementsByClassName('canvasCla'); // 假设class为test(有多个)
    // 循环
    for (var i = 0; i < tests.length; i++) {
      tests[i].setAttribute("index", i);
      tests[i].onclick = function () {
        classIndex = this.getAttribute("index"); // 当前操作的class下标
        // imgCutInputBoxs[imgCutInputBoxIndex].value = value; // 给当前操作的class赋值
        // alert('当前class是第' + classIndex);
        console.log(classIndex);
      }
      
    }
    console.log(tests);
    // let aa = document.querySelectorAll('.canvasCla');
    // console.log(aa);
    console.log(canvas);
    var context = canvas.getContext("2d");
    let [x, y, width, height] = [0, 0, 10, 10];

    colorsBoard.forEach((row:any, i:any) => row.forEach((color:any, j:any) => {
        [x, y] = [width * j, height * i];
        context.moveTo(x, y);
        context.fillStyle = color;
        context.fillRect(x, y, width, height);
    }));
}
function genBoard(cols:any, rows:any, colorObj:any) {
    let board:any = [];
    for (let i = 0; i < cols; i++) {
      board[i] = [];
      for (let j = 0; j < rows; j++) {
        [
          board[i - 1] && board[i - 1][j] || null,
          board[i][j - 1] || null
        ].reduce(() => {
          if(i % 2 != 1 && j % 2 == 1){
              board[i][j] = colorObj?.c1 ? colorObj?.c1 : '#F0F2F5'
          }
          if(i % 2 == 1 && j % 2 == 1){
              board[i][j] = colorObj?.c2 ? colorObj?.c2 : '#fff'
          }
          if(i % 2 == 1 && j % 2 != 1){
              board[i][j] = colorObj?.c1 ? colorObj?.c1 : '#F0F2F5'
          }
          if(i % 2 != 1 && j % 2 != 1){
            board[i][j] = colorObj?.c2 ? colorObj?.c2 : '#fff'
        }
        });
      }
    }
    return board;
  }


//随机颜色
//   function genBoard(cols, rows) {
//     let board = [];
    
//     for (let i = 0; i < cols; i++) {
//       board[i] = [];
//       for (let j = 0; j < rows; j++) {
//         [
//           board[i - 1] && board[i - 1][j] || null,
//           board[i][j - 1] || null
//         ].reduce((colorA, colorB) => {
//           do {
//             board[i][j] = '#' + (Math.random().toString(16) + '0000000').slice(2, 8);
//           } while (colorA === board[i][j] || colorB === board[i][j])
//         });
//       }
//     }
    
//     return board;
//   }
  
//   let colorsBoard = genBoard(5, 5);
//   console.log(JSON.stringify(colorsBoard));
  
//   var canvas = document.getElementById("canvas");
//   var context = canvas.getContext("2d");
//   let [x, y, width, height] = [0, 0, 50, 50];
  
//   colorsBoard.forEach((row, i) => row.forEach((color, j) => {
//     [x, y] = [width * j, height * i];
//     context.moveTo(x, y);
//     context.fillStyle = color;
//     context.fillRect(x, y, width, height);
//   }));