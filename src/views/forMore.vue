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
                    <div style="margin-top: .6rem;">{{listDetail.deliveryPoint.deliveryPoint}}</div>
                </div>
                <div class="detail-info">
                    <div>目的地：<span class="fee">{{listDetail.destination}}</span></div>
                    <div>重量：<span class="weight">{{listDetail.type}}</span></div>
                    <div>费用：<span class="fee">{{listDetail.fee}}</span></div>
                    <div>发起人：<span class="sponsor">{{listDetail.publisher.displayName}}</span></div>
                    <div>截止时间：{{listDetail.deadline | formatDate}}</div>
                    <div>发布时间：{{listDetail.updateTime | formatDate}}</div>
                    <div class="sponsor-info" v-if=" userRole === 'sponsor' ">
                        <!--发起人可查看的信息-->
                        <div>快递号：{{listDetail.orderPickVO.pickCode}}</div>
                        <div>手机号：{{listDetail.orderPickVO.tailNumber}}</div>
                    </div>
                    <div>备注：{{listDetail.remark || '暂无备注~'}}</div>
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
                        <button @click="clickReceive" :class="{'button_disabled': disableReceive}" :disabled="disableReceive">接单</button>
                    </div>
                </div>
            </div>
            <div class="more-info" v-if=" clickedReceive && userRole === 'receiver' && viewMore || userRole === 'receiver_me' && viewMore">
                <div>取货号</div>
                <div class="receiver_item">{{listDetail.orderPickVO.pickCode}}</div>
                <div>手机尾号</div>
                <div class="receiver_item">{{listDetail.orderPickVO.tailNumber}}</div>
                <div>发起人取货名</div>
                <div class="receiver_item">{{listMore.pickName || listDetail.orderPickVO.pickName}}</div>
                <div>发起人易班Id</div>
                <div class="receiver_item">{{listDetail.publisher.thirdPartyId}}</div>
                <div>发起人联系方式</div>
                <div class="receiver_item">{{listDetail.publisher.telphone}}</div>
                <div class="wranning">请妥善保管以上信息</div>
            </div>
            <div v-if="viewReceiver">
                <div class="more-info" v-if="!listDetail.receiver.id">
                    <div class="receiver_item">暂无接单者~</div>
                </div>
                <div class="more-info" v-if="listDetail.receiver.id">
                    <div>接单人用户名</div>
                    <div><span class="receiver_item">{{listDetail.receiver.displayName}}</span><span class="iconfont icon-jubao" @click="toReport">举报</span></div>
                    <div>接单人易班Id</div>
                    <div class="receiver_item">{{listDetail.receiver.thirdPartyId}}</div>
                    <div>接单人联系方式</div>
                    <div class="receiver_item">{{listDetail.receiver.telphone}}</div>
                </div>
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
        @Provide() private viewMore: boolean = false;     // 显示更多信息
        @Provide() private listDetail: object = {};
        @Provide() private listMore: object = {};

        mounted() {
            // 判断进入该页面的用户角色
            if (this.$route.params.role === 'receiver') {
                // this.$store.commit('SET_USERROLE','receiver');
                this.userRole = 'receiver';
            } else if (this.$route.params.role === 'sponsor') {
                // this.$store.commit('SET_USERROLE','sponsor');
                this.userRole = 'sponsor';
            } else if (this.$route.params.role === 'receiver_me') {
                this.userRole = 'receiver_me';
                this.viewMore = true;
            }
            // 获取指定订单的详细信息
            // let id = sessionStorage.getItem("list_id");
            let id = this.$store.state.listId || sessionStorage.list_id;
            (this as any).$axios
                .get((this as any).baseUrl+`/api/v1.0/SUSTDelivery/view/order/lists/${id}/info`)
                .then((res: any) => {
                    console.log("订单详情",res);
                    if (res.data.status === 'success') {
                        // 将type 1 2 3 转为文字
                        res.data.data.type = ForMore.transformType(res.data.data.type);
                        this.listDetail = res.data.data;
                        // 根据订单状态决定按钮状态（0异常1未接2已接3未完成4已完成5已删除）
                        let status = res.data.data.status.status;
                        switch (status) {
                            case 4:
                                this.disabledList = true;
                                break;
                            case 2:
                                this.disableReceive = true;
                                break;
                            case 0:
                                Toast.fail("订单异常");
                                break;
                            case 5:
                                // 切换页面
                                this.deleted = true;
                                break;
                            default:
                        }
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
        // 跳转到举报页面
        private toReport(): void {
            Dialog.confirm({
                title: '提示',
                message: '是否确定举报该用户？',
            }).then(() => {
                // 确定
                this.$router.push({
                    name: 'report',
                    params: {
                        reportedUser: (this as any).listDetail.receiver.displayName
                    }
                });
            })
            .catch(() => {
                // on cancel
            });
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
                    (this as any).clickedReceive = true;
                    let orderId = sessionStorage.getItem('list_id');
                    let userInfo = sessionStorage.getItem("userInfoStore") || '';
                    let user_id = JSON.parse(userInfo).id;
                    (this as any).$axios
                        .get((this as any).baseUrl + `/api/v1.0/SUSTDelivery/view/user/${user_id}/theirLists/${orderId}`)
                        .then((res: any) => {
                            console.info("接单",res);
                            if (res.data.status === "success") {
                                this.viewMore = true;
                                this.listMore = res.data.data;
                            } else {
                                this.viewMore = false;
                                Toast.fail(res.data.data.errorMsg);
                                (this as any).listDetail.publisher.telphone = '';
                            }
                        })
                        .catch((err: any) => {
                            Toast("网络连接错误");
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
                    (this as any).clickedReceive = true;
                    // 发送请求，更改订单状态为已完成
                    // let orderId = sessionStorage.getItem('list_id');
                    let orderId = this.$store.state.listId;
                    const statusId = 4;
                    (this as any).$axios
                        .get((this as any).baseUrl + `/api/v1.0/SUSTDelivery/view/order/lists/${orderId}/status/${statusId}`)
                        .then((res: any) => {
                            console.log(res);
                            this.disabledList = true;
                            if (res.data.status === 'success') {
                                Toast.success("操作成功");
                            }
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
                let userInfo = sessionStorage.getItem("userInfoStore") || '';
                let user_id = JSON.parse(userInfo).id;
                let orderId = this.$store.state.listId || sessionStorage.getItem("list_id");
                // 发送请求，删除订单
                (this as any).$axios
                    .delete((this as any).baseUrl + `/api/v1.0/SUSTDelivery/view/user/${user_id}/myLists/${orderId}`)
                    .then((res: any) => {
                        console.log("删除",res);
                        if (res.data.status === 'success') {
                            // 切换页面
                            this.deleted = true;
                            Toast.success("删除成功");
                        } else {
                            Toast.fail(res.data.data.errorMsg);
                        }
                    })
                    .catch((err: any) => {
                        Toast.fail("网络连接错误");
                    });
                })
            .catch((err: any) => {
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
            margin: 5% auto;
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
            .receiver_item{
                color: darken(@mainColor,5%);
                font-weight: bold;
                font-size: 1.6rem;
            }
            .icon-jubao {
                margin-left: .4rem;
                color: #b3b3b3;
                font-size: .8rem;
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
