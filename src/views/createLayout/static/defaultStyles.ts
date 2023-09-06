// 默认样式集合
export const defaultStyles = {
  pageBox: `.pageBox{
        width: 100%;
        height: 100vh;
        overflow-y: auto;
    }`,
  flex_row: `.flex_row{
        display: flex;
        justify-content: flex-start;
        flex-flow: wrap;
    }`,
  flex_w_cover: `.flex_w_cover{
        flex: 0 0 100%;
    }`,
}

//预览是附加样式
export const previewStyles = `
.preview .pageBox{
    height:100%;
    padding: 8px 8px ;
    // background: #FAFCFF;
    border-radius: 5px;
    box-sizing: border-box;
    border:2px dashed #fff;
    // border-left: 1px solid #DCDFE6;
}
.preview .grid_box{
    padding: 3px;
    box-sizing: border-box;
    display:grid;
    background-color: #fff;
}
.preview .flex_grid{
    
}
.preview .component_box{
    width: 100%;
    height:100%;
    // border: 1px solid #EBEEF5;
    box-shadow: 0px 0px 12px rgba(0,0,0,0.12);
}
`