<template>
    <div class="forMore">
        <div class="header forMore-header">
            <span class="iconfont icon-icon--fanhui" @click="returnHome()"></span>
            <div class="title">详情</div>
        </div>
        <div v-if="!deleted">
            <div class="detail-wrapper">
                <div class="bold-title">
                    <div>{{listDetail.deliveryPoint.area}}</div>
                    <div>{{listDetail.deliveryPoint.deliveryPoint}}</div>
                </div>
                <div class="detail-info">
                    <div>目的地：<span class="fee">{{listDetail.destination}}</span></div>
                    <div>重量：<span class="weight">{{listDetail.type}}</span></div>
                    <div>费用：<span class="fee">{{listDetail.fee}}</span></div>
                    <div>截止时间：{{listDetail.deadline}}</div>
                    <div>发布时间：{{listDetail.updateTime}}</div>
                    <div class="sponsor-info" v-if=" userRole === 'sponsor' ">
                        <!--发起人可查看的信息-->
                        <div>快递号：5024</div>
                        <div>手机尾号：1234</div>
                    </div>
                    <div>备注：{{listDetail.remark}}</div>
                </div>
                <div class="contact-wrapper">
                    <div class="role" v-if=" userRole === 'sponsor' ">
                        <!--如果是发起人，则联系接单者-->
                        <div class="sponsor">
                            <button @click="clickViewReceiver">查看接单者</button>
                            <button @click="changeListState" :class="{'button_disabled': disabledList}" :disabled="disabledList">订单已完成<span v-if="!disabledList">？</span></button>
                        </div>
                        <!--订单完成后，删除订单按钮出现-->
                        <div @click="deleteList" class="iconfont icon-lajitong"></div>
                    </div>
                    <div class="role receiver" v-if=" userRole === 'receiver' ">
                        <!--如果是接单者，则联系发起人-->
                        <button @click="clickReceive" :class="{'button_disabled': disableReceive}" :disabled="disableReceive">接单 ！</button>
                    </div>
                </div>
            </div>
            <div class="more-info" v-if=" clickedReceive && userRole === 'receiver' ">
                <div>快递号</div>
                <div class="express-number">5024</div>
                <div>手机尾号</div>
                <div class="express-number">1234</div>
                <div>发起人联系方式</div>
                <div class="express-number">{{listDetail.publisher.telphone}}</div>
                <div class="wranning">请妥善保管以上信息</div>
            </div>
            <div class="more-info" v-if="viewReceiver">
                <div>接单人联系方式</div>
                <div class="express-number">{{listDetail.receiver.telphone}}</div>
            </div>
        </div>
        <div class="delete-page" v-if="deleted">订单已删除！</div>
    </div>
</template>

<script lang="ts">
    import {Vue, Provide, Component} from 'vue-property-decorator';
    import {Toast, Dialog} from 'vant';

    @Component({})
    export default class ForMore extends Vue {
        @Provide() private userRole: string = 'receiver';
        @Provide() private clickedReceive: boolean = false;     // 接单者
        @Provide() private viewReceiver: boolean = false;   // 发起人
        @Provide() private disabledList: boolean = false;   // 订单已完成按钮 禁用
        @Provide() private disableReceive: boolean = false;     // 接单按钮 禁用
        @Provide() private deleted: boolean = false;     // 订单删除状态
        @Provide() private listDetail: object = {
            // updateTime: '2019-08-26T13:28:25.000+0000',
            // deadline: '2019-08-27T13:28:32.000+0000',
            // destination: '2A311',
            // deliveryPoint: {
            //     deliveryPoint: '圆通',
            //     area: '八公寓后院菜鸟驿站',
            // },
            // type: 1,
            // fee: '3元',
            // remark: '尽快！！！',
            // publisher: {
            //     telphone: '12345678901',
            //     email: null,
            //     registerMode: '',
            //     thirdPartyId: '',
            //     avatar: 'http://b-ssl.duitang.com/uploads/item/201809/16/20180916120134_myspq.jpeg',
            //     displayName: 'Maira',
            // },
            // receiver: {
            //     telphone: '12345678901',
            //     email: null,
            //     registerMode: '',
            //     thirdPartyId: '',
            //     avatar: '',
            //     displayName: 'Maira',
            // }
        };
        // beforeRouteEnter (to, from, next) {
        //     next(vm => {
        //         // 通过 `vm` 访问组件实例
        //     })
        // }
        mounted() {
            // 判断进入该页面的用户角色
            if (this.$route.params.role === 'receiver') {
                // this.$store.commit('SET_USERROLE','receiver');
                this.userRole = 'receiver';
            } else if (this.$route.params.role === 'sponsor') {
                // this.$store.commit('SET_USERROLE','sponsor');
                this.userRole = 'sponsor';
            }
            // 获取指定订单的详细信息
            let id = sessionStorage.getItem("list_id");
            (this as any).$axios
                .get((this as any).baseUrl+`/api/v1.0/SUSTDelivery/view/order/lists/${id}/info`,{
                    headers:{
                        'Authorization':sessionStorage.getItem('login_token')
                    }
                })
                .then((res: any) => {
                    console.log(res);
                    if (res.data.status === 'success') {
                       // 转换时间格式
                        res.data.data.updateTime = (this as any).resolvingDate(res.data.data.updateTime);
                        res.data.data.deadline = (this as any).resolvingDate(res.data.data.deadline);
                        // 将type 1 2 3 转为文字
                        res.data.data.type = ForMore.transformType(res.data.data.type);
                        this.listDetail = res.data.data;
                    } else {
                        Toast(res.data.errorMsg);
                    }
                })
                .catch((err: any) => {
                    Toast('网络连接错误！');
                })
        }
        // 返回首页
        private returnHome(): void {
            this.$router.go(-1);
        }
        // 接单人点击接单按钮，显示相关信息
        private clickReceive(): void {
            if ( !this.disableReceive ) {
                Dialog.confirm({
                    title: '提示',
                    message: '是否确定接下此单？点击确定后，您将获取该订单的详细信息，同时发起人也将获得您的相关信息。',
                }).then(() => {
                    // 接单按钮禁用
                    this.disableReceive = true;
                    // on confirm
                    let params = new URLSearchParams();
                    params.append("_method","PUT");
                    (this as any).clickedReceive = true;
                    // 发送请求，更改订单状态为已接
                    let orderId = sessionStorage.getItem('list_id');
                    const statusId = 2;
                    (this as any).$axios
                        .post((this as any).baseUrl + `/api/v1.0/SUSTDelivery/view/order/lists/${orderId}/status/${statusId}`, params, {
                            headers:{
                                'Authorization':sessionStorage.getItem('login_token')
                            }
                        })
                        .then((res: any) => {
                            console.info(res);
                        })
                        .catch((err: any) => {
                            console.info(err);
                        });
                }).catch(() => {
                    // on cancel
                });
            }
        }
        // 发起人查看接单人信息
        private clickViewReceiver(): void {
            (this as any).viewReceiver = true;
        }
        // 更改订单状态
        private changeListState(): void {
            if ( !this.disabledList ) {
                Dialog.confirm({
                    title: '提示',
                    message: '是否确定将此订单修改为已完成状态？修改后，其他用户将无法接此单。（该操作不可撤回）'
                }).then(() => {
                    this.disabledList = true;
                    // on confirm
                    let params = new URLSearchParams();
                    params.append('_method', 'PUT');
                    (this as any).clickedReceive = true;
                    // 发送请求，更改订单状态为已完成
                    let orderId = sessionStorage.getItem('list_id');
                    const statusId = 4;
                    (this as any).$axios
                        .post((this as any).baseUrl + `/api/v1.0/SUSTDelivery/view/order/lists/${orderId}/status/${statusId}`,params, {
                            headers:{
                                'Authorization':sessionStorage.getItem('login_token')
                            }
                        })
                        .then((res: any) => {
                            console.log(res);
                            this.disabledList = true;
                        })
                        .catch((err: any) => {
                            console.log(err);
                        })
                    // this.disabledList = true;
                }).catch(() => {
                    // on cancel
                });
            }
        }
        // 删除订单
        private deleteList(): void {
            Dialog.confirm({
                title: '警告',
                message: '是否确定删除此订单？（操作不可撤回）'
            }).then(() => {
                // on confirm
                // 发送请求，删除订单
                let params = new URLSearchParams();
                params.append("_method","PUT");
                let orderId = sessionStorage.getItem("list_id");
                const statusId = 5;
                (this as any).$axios
                    .post((this as any).baseUrl + `/api/v1.0/SUSTDelivery/view/order/lists/${orderId}/status/${statusId}`, params, {
                        headers:{
                            'Authorization':sessionStorage.getItem('login_token')
                        }
                    })
                    .then((res: any) => {
                        console.log(res);
                        if (res.data.status === 'success') {
                            // 切换页面
                            this.deleted = true;
                        }
                    })
                    .catch((err: any) => {
                        console.log(err);
                    });
                Toast.success("删除成功！");
            }).catch((err) => {
                // on cancel
                console.log(err);
            });
        }
        // 将数据type（1，2，3）转为文字
        static transformType(typeNum: number): string{
            switch (typeNum) {
                case 1:
                    return "轻";
                case 2:
                    return "重";
                case 3:
                    return "超重";
                default:
                    return "";
            }
        }
    }
</script>

<style lang="less" scoped>
    @mainColor: #1DA57A;
    .forMore{
        .delete-page {
            margin-top: 80%;
            text-align: center;
        }
        .forMore-header{
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
        .detail-wrapper{
            margin: 16% auto 0 auto;
            width: 80%;
            border: .5px solid #eee;
            border-radius: .5rem;
            padding: 1.8rem 1rem;
            box-shadow: 0 1px 2px #aaaaaa;
            .bold-title {
                font-size: 1.4rem;
                font-weight: bold;
                color: darken(@mainColor,8%);
                display: flex;
                flex-direction: row;
                justify-content: space-between;
            }
            .detail-info {
                margin-top: 1rem;
                div {
                    margin-top: .6rem;
                }
                .weight{
                    border: .5px solid darken(@mainColor,10%);
                    border-radius: .6rem;
                    color: @mainColor;
                    padding: .1rem .6rem;
                }
                .fee{
                    color: @mainColor;
                    font-weight: bold;
                    font-size: 1.2rem;
                }
            }
        }
        .contact-wrapper{
            .role {
                display: flex;
                flex-direction: column;
                align-items: center;
                button {
                    border: 0;
                    border-radius: .6rem;
                    width: 60%;
                    background-color: lighten(@mainColor,10%);
                    outline: none;
                    color: white;
                    padding-top: .6rem;
                    padding-bottom: .6rem;
                    margin-top: 1.6rem;
                    &:active {
                        color: lighten(@mainColor,10%);
                        border: .5px solid lighten(@mainColor,10%);
                        background-color: white;
                    }
                }
                .button_disabled {
                    background-color: #cccccc;
                    color: white;
                }
            }

            .sponsor {
                width: 100%;
                display: flex;
                flex-direction: row;
                justify-content: space-around;
                button {
                    width: 40%;
                }
            }

            .icon-lajitong {
                margin-top: 1rem;
                margin-left: 80%;
                color: red;
                font-size: 1.6rem;
            }
        }

        .more-info{
            margin: 5% auto 0 auto;
            width: 80%;
            border: .5px solid #eee;
            border-radius: .5rem;
            padding: 1.8rem 1rem;
            box-shadow: 0 1px 2px #aaaaaa;
            display: flex;
            flex-direction: column;
            align-items: center;
            div {
                margin-top: .6rem;
            }
            .express-number{
                color: darken(@mainColor,5%);
                font-weight: bold;
                font-size: 1.6rem;
            }
            .wranning {
                font-size: .8rem;
                color: #666666;
                text-align: center;
                margin-top: 2rem;
            }
        }
    }
</style>
