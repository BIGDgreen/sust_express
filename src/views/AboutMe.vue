<template>
    <div class="aboutMe">
        <div class="header aboutMe-header">
            <span class="iconfont icon-icon--fanhui" @click="returnHome()"></span>
            <div class="title">我的</div>
        </div>
        <div class="selfInfo">
            <div class="avatar">
                <img :src=userAvatar alt="Avatar">
            </div>
            <div class="lists_content">
                <van-tabs v-model="active">
                    <van-tab title="我发起的">
                        <div class="lists-wrapper">
                            <div class="lists" v-for="(list,index) in createLists" @click="forMore_sponsor(index)">
                                <div class="deliveryInfo">
                                    <div>
                                        <div><b>{{list.deliveryPoint.area}}</b></div>
                                        <div><b>{{list.deliveryPoint.deliveryPoint}}</b></div>
                                    </div>
                                    <div>截止时间&nbsp;&nbsp;{{list.deadline | formatDate}}</div>
                                </div>
                                <div class="destination">送至：{{list.destination}}</div>
                                <div class="timeInfo">
                                    发布时间：{{list.updateTime | formatDate}}
                                </div>
                            </div>
                        </div>
                        <div class="noData" v-if="noLaunch">订单为空~</div>
                    </van-tab>
                    <van-tab title="我接过的">
                        <div class="lists-wrapper">
                            <div class="lists" v-for="(list,index) in joinLists" @click="forMore_receiver(index)">
                                <div class="deliveryInfo">
                                    <div>
                                        <div><b>{{list.deliveryPoint.area}}</b></div>
                                        <div><b>{{list.deliveryPoint.deliveryPoint}}</b></div>
                                    </div>
                                    <div>截止时间&nbsp;&nbsp;{{list.deadline | formatDate}}</div>
                                </div>
                                <div class="destination">送至：{{list.destination}}</div>
                                <div class="timeInfo">
                                    发布时间：{{list.updateTime | formatDate}}
                                </div>
                            </div>
                        </div>
                        <div class="noData" v-if="noJoin">订单为空~</div>
                    </van-tab>
                </van-tabs>
            </div>
        </div>
        <div class="plus-button">
            <span class="iconfont icon-jia" @click="publishList"></span>
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Provide, Component} from 'vue-property-decorator';
    import ListItem from '../components/ListItem.vue';
    import {Toast} from 'vant';

    @Component({
        components:{
            ListItem
        }
    })
    export default class AboutMe extends Vue {
        @Provide() userAvatar: string = '';
        @Provide() active: number = 0;
        @Provide() noLaunch: boolean = true;
        @Provide() noJoin: boolean = true;
        @Provide() createLists: Object[] = [];
        @Provide() joinLists: Object[] = [];
        mounted() {
            let userInfos = sessionStorage.getItem("userInfoStore") || "";
            // console.info(JSON.parse(userInfos));
            // 获取头像
            this.userAvatar = JSON.parse(userInfos).avatar;
          // 获取与我有关的订单
            let id = JSON.parse(userInfos).id;
            // 我发起的
            (this as any).$axios
                .get((this as any).baseUrl + `/api/v1.0/SUSTDelivery/view/user/${id}/myLists`, {
                    params: {
                      page: 1,
                      pagesize: 10
                    }
                })
                .then((res: any) => {
                    console.info("launch",res);
                    if (res.data.status === 'success') {
                        if (res.data.data.length === 0) {
                            this.noLaunch = true;
                        } else {
                            this.noLaunch = false;
                            this.createLists = res.data.data;
                        }
                    } else {
                        Toast(res.data.errorMsg);
                    }
                })
                .catch((err: any) => {
                    console.error(err);
                });

            // 我加入的
            (this as any).$axios
            .get((this as any).baseUrl + `/api/v1.0/SUSTDelivery/view/user/${id}/theirList`, {
                params: {
                    page: 1,
                    pagesize: 10
                }
            })
            .then((res: any) => {
                console.info("join",res);
                if (res.data.status === 'success') {
                    if (res.data.data.length === 0) {
                        this.noJoin = true;
                    } else {
                        this.noJoin = false;
                        this.joinLists = res.data.data;
                    }
                } else {
                    Toast(res.data.errorMsg);
                }
            })
            .catch((err: any) => {
                console.error(err);
            })
        }
        // 发起人查看订单详细信息
        private forMore_sponsor(index: number): void {
            this.$store.commit('SET_LISTID',this.createLists[index].id);
            (this as any).$router.push({
                name:'forMore',
                params:{"role":"sponsor"}
            });
            sessionStorage.setItem("list_id",this.createLists[index].id);
        }
        // 接单人查看订单详细信息
        private forMore_receiver(index: number): void {
            // this.$store.commit('SET_USERROLE','receiver');
            this.$store.commit('SET_LISTID',this.joinLists[index].id);
            (this as any).$router.push({
                name:'forMore',
                params:{"role":"receiver"}
            });
            sessionStorage.setItem("list_id",this.joinLists[index].id);
        }
        // 发布订单
        private publishList() {
            // 跳转到填写订单信息页面
            this.$router.push({path:'/aboutMe/publishList'});
        }
        //返回上一页
        private returnHome(): void{
            this.$router.push({path:'/'});
        }
    }

</script>

<style lang="less" scoped>
    @mainColor:#1DA57A;
    // 修改标签滑动组件的下划线颜色
    /deep/ .van-tabs__line {
        background-color: @mainColor;
    }
    .aboutMe{
        .aboutMe-header{
            z-index: 1000;
            .icon-icon--fanhui{
                color: white;
                font-size: 1.36rem;
                width: 10%;
                text-align: center;
                &:active{
                    color: lighten(@mainColor,50%);
                }
            }
            .title{
                color: white;
                width: 90%;
                padding-right: 5%;
                text-align: center;
            }
        }
        .selfInfo{
            margin-top: 18%;
            .avatar{
                text-align: center;
                img{
                    width: 6.8rem;
                    height: 6.8rem;
                    border: .5px solid #aaaaaa;
                    border-radius: 50%;
                }
            }
            .lists_content{
                width: 100%;
                margin: .68rem auto 0 auto;
            }
        }
        .noData {
            color: #aaaaaa;
            text-align: center;
            margin-top: 30%
        }
        .plus-button{
            position: fixed;
            bottom: 5%;
            right: 10%;
            .icon-jia {
                font-size: 2.6rem;
                color: lighten(@mainColor,8%);
                &:active {
                    color: @mainColor;
                }
           }
        }
    }
</style>
