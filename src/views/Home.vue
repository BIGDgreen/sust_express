<template>
  <div class="home">
    <!---------------头部搜索框---------------->
    <div class="header">
      <div class="logo">logo</div>
      <input type="text" placeholder="搜索订单..."></input>
      <span class="iconfont icon-yonghu" @click="toMe()"></span>
    </div>
    <!--------------订单列表------------------>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="lists-wrapper">
        <div class="lists" v-for="(list,index) in lists" @click="forMore_receiver(index)">
          <div class="fee-wrapper">
            {{list.fee}}
          </div>
          <div class="other-wrapper">
            <div class="deliveryInfo">
              <div>
                <b>{{list.deliveryPoint.area}} {{list.deliveryPoint.deliveryPoint}}</b>
              </div>
              <div class="deadline">截止时间：{{list.deadline}}</div>
            </div>
            <div class="destination">送至：{{list.destination}}</div>
            <div class="timeInfo">
              发布时间：{{list.updateTime}}
            </div>
          </div>
        </div>
      </div>
    </van-pull-refresh>
    <div class="loading" v-if="pageLoading">
      <van-loading type="spinner" color="#1DA57A" size="24px" vertical>加载中...</van-loading>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator';
import {Toast} from 'vant';

@Component({
  components: {
  },
})
export default class Home extends Vue {
  @Provide() isLoading:boolean = false;
  @Provide() pageLoading:boolean = true;
  // 订单列表
  @Provide() lists:Object[] = [
    // {
    //   id:1,
    //   updateTime: "2019.08.27 12:00",
    //   deadline: "2018.10.29 16:04",
    //   destination: "12公寓",
    //   deliveryPoint: {
    //     deliveryPoint: "韵达",
    //     area: "二餐厅东侧菜鸟驿站"
    //   },
    //   fee: "￥5",
    // }
  ];

  // 下拉刷新
  private onRefresh() {
    setTimeout(() => {
      Toast.success('刷新成功');
      this.isLoading = false;
    }, 500);
  }

  private forMore_receiver(index: number): void{
    sessionStorage.setItem("list_id",(this as any).lists[index].id);  //存储当前点击订单的id
    (this as any).$router.push({
        name:'forMore',
        params:{
          role:"receiver"
        }
      })
  }

  mounted(){
    (this as any).$axios
        .get((this as any).baseUrl + '/api/v1.0/SUSTDelivery/view/order/lists/0',{
          params:{
            page:1,
            pageSize:10
          },
          headers:{
            'Authorization':sessionStorage.getItem('login_token')
          }
        })
        .then((res: any) => {
          console.log(res);
          if (res.data.status === "success") {
            this.pageLoading = false;
            res.data.data.map((data: any) => {
              data.updateTime = (this as any).resolvingDate(data.updateTime);
              data.deadline = (this as any).resolvingDate(data.deadline);
            });
            this.lists = res.data.data;
          } else {
            Toast.fail(res.data.errorMsg);
          }
        })
        .catch((error: any) => {
          this.pageLoading = false;
          // 未认证，跳转至易班认证页面
          console.log(error.response);
          // console.log(error.response.data);
          // console.log(error.response.status);
          // console.log(error.response.headers);
          if(error.response.status==403){
            location.href = error.response.data.data.url;
          } else {
            Toast.fail("网络连接错误！");
          }
        })
  }

  // 进入个人中心
   private toMe(): void {
    this.$router.push({path: '/aboutMe'});
  }
}
</script>

<style lang="less" scoped>
  @mainColor:#1DA57A;
  .home {
    width: 100%;
    .header {
      z-index: 1000;
      .logo {
        width: 15%;
        text-align: center;
        color: white;
      };
      input {
        border: 0;
        border-radius: .4rem;
        height: 60%;
        width: 70%;
        padding-left: 1rem;
        outline: none;
        font-size: 1rem;
        &:focus{
          border: 1px solid tint(@mainColor,80%);
        }
      }
      .icon-yonghu{
        color: white;
        font-size: 1.86rem;
        width: 15%;
        text-align: center;
        &:active{
          color: lighten(@mainColor,50%);
        }
      }
    }

    .lists-wrapper{
      margin-top: 15%;
      .lists {
        display: flex;
        flex-direction: row;
        margin-top: 1rem;
        padding: 0 1rem 0 0;

        .fee-wrapper{
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 18%;
          text-align: center;
          font-size: 1.2rem;
          margin-right: 5%;
          background-color: lighten(@mainColor,5%);
          color: white;
          font-weight: bold;
        }
        .other-wrapper{
          margin-top: 1rem;
          margin-bottom: 1rem;
          .destination{
            font-size: .92rem;
          }
        }
      }
    }
  }
</style>
