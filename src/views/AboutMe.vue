<template>
    <div class="aboutMe">
        <div class="header aboutMe-header">
            <span class="iconfont icon-icon--fanhui" @click="returnHome()"></span>
            <div class="title">我的</div>
        </div>
        <div class="selfInfo">
            <div class="avatar">
                <img src="http://b-ssl.duitang.com/uploads/item/201809/16/20180916120134_myspq.jpeg" alt="Avatar">
            </div>
            <div class="lists_content">
                <van-tabs v-model="active">
                    <van-tab title="我发起的">
                        <div class="lists-wrapper">
                            <div class="lists" v-for="(list,index) in createLists" @click="forMore_sponsor(index)">
                                <div class="deliveryInfo">
                                    <div>
                                        <b>{{list.deliveryPoint.area}} {{list.deliveryPoint.deliveryPoint}}</b>
                                    </div>
                                    <div>截止时间&nbsp;&nbsp;{{list.deadline}}</div>
                                </div>
                                <div class="destination">送至：{{list.destination}}</div>
                                <div class="timeInfo">
                                    发布时间：{{list.updateTime}}
                                </div>
                            </div>
                        </div>
<!--                        <ListItem :lists="deliveryLists"></ListItem>-->
                    </van-tab>
                    <van-tab title="我加入的">
                        <div class="lists-wrapper">
                            <div class="lists" v-for="list in joinLists" @click="forMore_receiver(index)">
                                <div class="deliveryInfo">
                                    <div>
                                        <b>{{list.deliveryPoint.area}} {{list.deliveryPoint.deliveryPoint}}</b>
                                    </div>
                                    <div>截止时间&nbsp;&nbsp;{{list.deadline}}</div>
                                </div>
                                <div class="destination">送至：{{list.destination}}</div>
                                <div class="timeInfo">
                                    发布时间：{{list.updateTime}}
                                </div>
                            </div>
                        </div>
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
    @Component({
        components:{
            ListItem
        }
    })
    export default class AboutMe extends Vue {
        @Provide() active: number = 0;
        @Provide() createLists: Object[] = [
            {
                id:1,
                updateTime: "2019.08.27 12:00",
                deadline: "2018.10.29 16:04",
                destination: "12公寓",
                deliveryPoint: {
                    deliveryPoint: "韵达",
                    area: "二餐厅东侧菜鸟驿站"
                },
                fee: "￥5",
            }
        ];
        @Provide() joinLists: Object[] = [
            {
                id:1,
                updateTime: "2019.08.27 12:00",
                deadline: "2018.10.29 16:04",
                destination: "12公寓",
                deliveryPoint: {
                    deliveryPoint: "圆通",
                    area: "八公寓后院"
                },
                fee: "￥2",
            }
        ];
        mounted() {
          // 获取与我有关的订单

        }
        // 发起人查看订单详细信息
        private forMore_sponsor(index: number): void {
            (this as any).$router.push({
                name:'forMore',
                params:{"role":"sponsor"}
            });
            sessionStorage.setItem("list_id",this.createLists[index].id);
        }
        // 接单人查看订单详细信息
        private forMore_receiver(index: number): void {
            // this.$store.commit('SET_USERROLE','receiver');
            (this as any).$router.push({
                name:'forMore',
                params:{"role":"receiver"}
            })
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
