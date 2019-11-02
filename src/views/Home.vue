<template>
  <div class="home">
    <!---------------头部搜索框---------------->
    <div class="header-wrapper">
      <div class="header-content">
        <div class="logo">Fehead</div>
        <input type="text" placeholder="请输入订单目的地" @focus="focused = true" @keyup="focused = false" @keyup.enter="searchByDestination" v-model="desInput"></input>
        <span class="iconfont icon-yonghu" @click="toMe()"></span>
      </div>
      <div class="tag-advice" v-if="focused">
        <div class="tag" v-for="item in expressPoints"><div @click="clickTag(item)">{{item.deliveryPoint}}</div></div>
      </div>
    </div>
    <!--------------订单列表------------------>
<!--    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">-->
    <div class="lists-wrapper">
      <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
        <div class="lists" v-for="(list,index) in lists" @click="forMore_receiver(index)">
          <div class="fee-wrapper">
            {{list.fee}}
          </div>
          <div class="other-wrapper">
            <div class="deliveryInfo">
              <div class="deliveryPoint">
                <div><b>{{list.deliveryPoint.area}}</b></div>
                <div><b>{{list.deliveryPoint.deliveryPoint}}</b></div>
              </div>
                <div class="sponsor">发起人：{{list.displayName}}</div>
              <div class="deadline">截止时间：{{list.deadline | formatDate}}</div>
            </div>
            <div class="destination">送至：{{list.destination}}</div>
            <div class="timeInfo">
              发布时间：{{list.updateTime | formatDate}}
            </div>
          </div>
        </div>
      </mescroll-vue>
    </div>
<!--    </van-pull-refresh>-->
    <div class="loading" v-if="pageLoading">
      <van-loading type="spinner" color="#1DA57A" size="24px" vertical>加载中...</van-loading>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator';
import {Toast} from 'vant';
//引入上拉加载、下拉刷新组件
import MescrollVue from 'mescroll.js/mescroll.vue'

@Component({
  components: {
    MescrollVue
  },
})
export default class Home extends Vue {
  @Provide() page:number = 1;  // 请求订单的页码
  @Provide() expressPoints:string[] = [];
  @Provide() desInput:string = '';
  @Provide() isLoading:boolean = false;
  @Provide() focused:boolean = false;
  @Provide() pageLoading:boolean = true;
  // 订单列表
  @Provide() lists:Object[] = [];

  // 上拉刷新，下拉加载组件
  @Provide() mescroll:any = null; // mescroll实例对象
  @Provide() mescrollDown:object = {};
  @Provide() mescrollUp:object = {
    callback: this.upCallback, // 上拉回调,此处可简写; 相当于 callback: function (page, mescroll) { getListData(page); }
    page: {
      num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
      size: 6 // 每页数据的数量
    },
    lazyLoad: {
      use: true // 是否开启懒加载,默认false
    },
    noMoreSize: 5,
    toTop: {
      //回到顶部按钮
      src: "data:image/png;base64,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", //图片路径,默认null,支持网络图
      offset: 600 //列表滚动600px才显示回到顶部按钮
    },
  };

  // mescroll组件初始化的回调,可获取到mescroll对象
  mescrollInit(mescroll: any) {
    this.mescroll = mescroll;  // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
  }

  // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
  upCallback(page: { num: number; size: any; }, mescroll: { endSuccess: (arg0: number) => void; endErr: { (): void; (): void; }; }) {
    let that = this;
    (this as any).$axios
      .get((this as any).baseUrl + '/api/v1.0/SUSTDelivery/view/order/lists/0', {
        params: {
          page: page.num,
          pageSize: page.size
        }
      })
      .then((res: any) => {
        // console.log("订单", res);
        if (res.data.status === "success") {
          this.pageLoading = false;
          let data_lists = [];
          // 将列表中的费用改成'X元'格式
          for ( let i: number = 0; i < this.lists.length; i ++) {
            (this as any).lists[i].fee = parseInt((this as any).lists[i].fee) + '元';
          }
          console.info("分页数据",res.data.data);
          if (res.data.data.length > 0) {   // 当下一页有数据时
            data_lists = res.data.data;
            let data = page.num === 1 ? [] : that.lists;
            // console.info("data",data);
            data.push(...data_lists);
            that.lists = data;
          }
          // 数据渲染成功后,隐藏下拉刷新的状态
          this.$nextTick(() => {
            mescroll.endSuccess(that.lists.length);
          });
          // 获取快递点信息
          (this as any).$axios
            .get((this as any).baseUrl + '/api/v1.0/SUSTDelivery/view/order/lists/delivery')
            .then((res: any) => {
              // console.info("tags",res);
              if (res.data.status === "success") {
                this.expressPoints = res.data.data;
                this.$store.commit('SET_DELIVERYPOINTS', this.expressPoints);
              } else {
                Toast.fail(res.data.data.errorMsg);
              }
            })
            .catch((err: any) => {
              Toast.fail("网络连接错误");
            })
        } else {
          Toast.fail(res.data.data.errorMsg);
        }
      })
      .catch((error: any) => {
        mescroll.endErr();
        this.pageLoading = false;
        console.error("errRes", error);
      });
  }
  beforeRouteEnter(to: any, from: any, next: (arg0: (vm: any) => void) => void) { // 如果没有配置回到顶部按钮或isBounce,则beforeRouteEnter不用写
    next(vm => {
      // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
      vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter() // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
    })
  }
  beforeRouteLeave(to: any, from: any, next: () => void) { // 如果没有配置回到顶部按钮或isBounce,则beforeRouteLeave不用写
    // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
    this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave(); // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
    next()
  }

  // 快递点搜索
  private clickTag(point: any): void {
    this.pageLoading = true;
    this.focused = false;
    // console.log(point);
    (this as any).$axios
      .get((this as any).baseUrl + `/api/v1.0/SUSTDelivery/view/order/lists/${point.id}`,{
        params:{
          page: 1,
          pageSize: 10
        }
      })
        .then((res: any) => {
          console.log(res);
          this.pageLoading = false;
          if (res.data.status === 'success') {
            this.lists = res.data.data;
          } else {
            Toast.fail(res.data.data.errorMsg);
          }
        })
        .catch((err: any) => {
          this.pageLoading = false;
          Toast.fail("网络连接错误");
        })
  }

  // 根据目的地搜索订单
  private searchByDestination(): void {
    // console.info(this.desInput);
    this.pageLoading = true;
    let params = new URLSearchParams();
    params.append("search",this.desInput);
    params.append("page","1");
    params.append("pagesize","10");
    (this as any).$axios
      .post((this as any).baseUrl + '/api/v1.0/SUSTDelivery/view/order/lists',params)
          .then((res: any) => {
            console.info("des",res);
            this.pageLoading = false;
            if (res.data.status === "success") {
              this.lists = res.data.data;
            } else {
              Toast.fail(res.data.data.errorMsg);
            }
          })
          .catch((err: any) => {
            this.pageLoading = false;
            Toast.fail("网络连接错误");
          })
  }

  // 下拉刷新
  // private onRefresh() {
  //   // 刷新页面
  //   this.$router.push("/aaa");
  //   this.$router.go(-1);
  //     setTimeout(() => {
  //       Toast.success('刷新成功');
  //       this.isLoading = false;
  //     }, 500);
  // }

  private forMore_receiver(index: number): void{
    sessionStorage.setItem("list_id",(this as any).lists[index].id);  //存储当前点击订单的id
    this.$store.commit('SET_LISTID',(this as any).lists[index].id);
    (this as any).$router.push({
        name:'forMore',
        params:{
          role:"receiver"
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
    .header-wrapper {
      z-index: 1000;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: fixed;
      top: 0;
      background: @mainColor;
      width: 100%;
      padding-top: 1.6%;
      padding-bottom: 1.6%;
      .header-content {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        .logo {
          width: 22%;
          text-align: center;
          color: white;
        };
        input {
          border: 0;
          border-radius: .4rem;
          width: 63%;
          padding-left: 1rem;
          outline: none;
          font-size: .92rem;
          padding-top: 1%;
          padding-bottom: 1%;
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
      .tag-advice {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin: .2rem auto 0 auto;
        width: 92%;
        text-align: center;
        .tag {
          margin: .4rem .3rem;
          background: white;
          color: @mainColor;
          border-radius: .4rem;
          padding: .2rem .3rem;
          &:active {
            background-color: lighten(@mainColor,50%);
          }
        }
      }
    }
    .lists-wrapper{
      margin-top: 15%;
      min-height: 100vh;
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
          font-size: 1.4rem;
          margin-right: 5%;
          background-color: lighten(@mainColor,5%);
          color: white;
          font-weight: bold;
        }
        .other-wrapper{
          margin-top: 1rem;
          margin-bottom: 1rem;
          .deliveryPoint{
            display: flex;
            flex-direction: column;
          }
          .destination{
            font-size: .92rem;
          }
        }
      }
    }
  }
</style>
