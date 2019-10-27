<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="less">
html,body{
  width: 100%;
  margin: 0;
  padding: 0;
}

// 顶部导航栏
.header{
  position: fixed;
  top: 0;
  height: 6%;
  background: #1DA57A;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

// 加载状态
.loading {
  position: absolute;
  left:50%;
  top:50%;
  transform: translate(-50%, -50%);
}

// 订单列表公共样式
@mainColor:#1DA57A;
.lists-wrapper{
  .lists{
    width: 80%;
    margin: 0 auto 1rem auto;
    border: .5px solid #eee;
    border-radius: .5rem;
    padding: 1rem;
    box-shadow: 0 1px 2px #aaaaaa;
    overflow: hidden;
    word-break: break-all;
    &:active{
      background: lighten(@mainColor,55%);
    }

    .deliveryInfo{
      margin-bottom: .48rem;
      div:nth-child(1){
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-size: 1.2rem;
        margin-bottom: .6rem;
        b{
          color: darken(@mainColor,15%);
        }
      }
      .deadline {
        font-size: .92rem;
      }
    }
  }
  .timeInfo{
    font-size: .6rem;
    color: #333333;
    margin-top: .68rem;
  }
}
</style>
