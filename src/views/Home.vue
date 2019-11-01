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
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="lists-wrapper">
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
  @Provide() page:number = 1;  // 请求订单的页码
  @Provide() expressPoints:string[] = [];
  @Provide() desInput:string = '';
  @Provide() isLoading:boolean = false;
  @Provide() focused:boolean = false;
  @Provide() pageLoading:boolean = true;
  // 订单列表
  @Provide() lists:Object[] = [];

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
        },
        headers:{
          'Authorization':sessionStorage.getItem('login_token')
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
  private onRefresh() {
    // 刷新页面
    this.$router.push("/aaa");
    this.$router.go(-1);
      setTimeout(() => {
        Toast.success('刷新成功');
        this.isLoading = false;
      }, 500);
  }

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

  handleScroll() {
    this.$nextTick(() => {
      const el = document.querySelector('.lists-wrapper');
      if (el) {
        const offsetHeight = el.offsetHeight;
        // console.info("offsetHeight",offsetHeight);
        // el.scroll = () => {
          const scrollTop = el.scrollTop || window.pageYOffset || document.body.scrollTop;
          // console.log("scrollTop",scrollTop);
          const scrollHeight = el.scrollHeight;
          // console.log("scrollHeight",scrollHeight);
          if ((offsetHeight + scrollTop) >= scrollHeight) {
            this.page ++ ;
            // 需要执行的代码
            (this as any).$axios
              .get((this as any).baseUrl + '/api/v1.0/SUSTDelivery/view/order/lists/0',{
                params:{
                  page:this.page,
                  pageSize:10
                }
              })
              .then((res: any) => {
                console.log("addlists", res);
              })
              .catch((err: any) => {
                // Toast.fail("网络连接错误")
              });
          }
        };
      // }
    });
  }

  mounted() {
    // 获取所有订单
    (this as any).$axios
        .get((this as any).baseUrl + '/api/v1.0/SUSTDelivery/view/order/lists/0', {
          params: {
            page: 1,
            pageSize: 10
          }
        })
        .then((res: any) => {
          console.log("订单", res);
          if (res.data.status === "success") {
            this.pageLoading = false;
            // 展示列表
            this.lists = res.data.data;
            // 将列表中的费用改成'X元'格式
              for ( let i: number = 0; i < this.lists.length; i ++) {
                  (this as any).lists[i].fee = parseInt((this as any).lists[i].fee) + '元';
              }
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
                  Toast.fail("网络连接错误")
                })
          } else {
            Toast.fail(res.data.data.errorMsg);
          }
        })
        .catch((error: any) => {
          this.pageLoading = false;
          console.error("errRes", error);
        });
    // 监听页面滚动
    // window.addEventListener("scroll", this.handleScroll);
    this.$nextTick(() => {
      const el = document.querySelector('.lists-wrapper');
      if (el) {
        const offsetHeight = el.offsetHeight;
        // console.info("offsetHeight", offsetHeight);
        el.onscroll = () => {
          const scrollTop = el.scrollTop || window.pageYOffset || document.body.scrollTop;
          console.log("scrollTop", scrollTop);
          const scrollHeight = el.scrollHeight;
          console.log("scrollHeight", scrollHeight);
          if ((offsetHeight + scrollTop) >= scrollHeight) {
            this.page++;
            // 需要执行的代码
            (this as any).$axios
              .get((this as any).baseUrl + '/api/v1.0/SUSTDelivery/view/order/lists/0', {
                params: {
                  page: this.page,
                  pageSize: 10
                }
              })
              .then((res: any) => {
                console.log("addlists", res);
              })
              .catch((err: any) => {
                Toast.fail("网络连接错误")
              });
          }
        };
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
