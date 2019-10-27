<template>
    <div class="publishList">
        <div class="header publishList-header">
            <span class="iconfont icon-icon--fanhui" @click="returnHome()"></span>
            <div class="title">发布订单</div>
        </div>
        <div class="listInfo-wrapper">
            <van-field
                    readonly
                    clickable
                    label="快递公司"
                    :value="listDetail.deliveryPoint.deliveryPoint"
                    placeholder="选择快递公司"
                    @click="showAreaPicker = true"
                    required
            />
            <van-popup v-model="showAreaPicker" position="bottom">
                <van-picker
                        show-toolbar
                        :columns="columns"
                        @cancel="showAreaPicker = false"
                        @confirm="onConfirm($event,'deliveryPoint')"
                />
            </van-popup>
            <van-cell-group>
                <van-field
                        v-model="listDetail.deliveryPoint.area"
                        label="快递地点"
                        placeholder="请输入快递地点"
                        required
                />
                <van-field
                        v-model="listDetail.destination"
                        label="目的地"
                        placeholder="请输入快递送往的目的地"
                        required
                />
            </van-cell-group>
            <van-field
                    readonly
                    clickable
                    label="截止时间"
                    :value="listDetail.deadline"
                    placeholder="选择截止时间"
                    @click="showTimePicker = true"
                    required
            />
            <van-popup v-model="showTimePicker" position="bottom">
                <van-datetime-picker
                        v-model="currentDate"
                        type="datetime"
                        :min-date="minDate"
                        :max-date="maxDate"
                        :formatter="formatter"
                        @cancel="showTimePicker = false"
                        @confirm="onConfirm($event,'deadline')"
                />
            </van-popup>
            <van-cell-group>
                <van-field
                        v-model="listDetail.fee"
                        label="报酬（元）"
                        placeholder="请输入您将给的报酬"
                        required
                />
                <van-field
                        v-model="listDetail.publisher.pickName"
                        label='取货人姓名(淘宝会员名)'
                        placeholder="请输入您的淘宝会员名"
                        required
                />
                <van-field
                        v-model="listDetail.pickCode"
                        label="取货号"
                        placeholder="请输入您的快递取货号"
                        required
                />
            </van-cell-group>
            <van-field
                    readonly
                    clickable
                    label="重量"
                    :value="listDetail.type"
                    placeholder="选择包裹重量"
                    @click="showTypePicker = true"
                    required
            />
            <van-popup v-model="showTypePicker" position="bottom">
                <van-picker
                        show-toolbar
                        :columns="weightTypes"
                        @cancel="showTypePicker = false"
                        @confirm="onConfirm($event,'weightType')"
                />
            </van-popup>
            <van-cell-group>
                <van-field
                        v-model="listDetail.remark"
                        rows="2"
                        autosize
                        label="备注"
                        type="textarea"
                        maxlength="100"
                        placeholder="请留下备注"
                        show-word-limit
                />
            </van-cell-group>
        </div>
        <div class="submit_button">
            <button @click="submitList">提交</button>
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Provide, Component} from 'vue-property-decorator';
    import {Picker, CellGroup, Popup, DatetimePicker, Stepper, Toast } from 'vant'
    import jwt_decode from 'jwt-decode'; //解析token

    @Component({
        components:{
            [Picker.name]: Picker,
            [Popup.name]: Popup,
            [CellGroup.name]: CellGroup,
            [DatetimePicker.name]: DatetimePicker,
            [Stepper.name]: Stepper,
        }
    })
    export default class PublishList extends Vue {
        @Provide() columns:string[] = ['中通快递', '圆通快递', '申通快递', '韵达快递', '顺丰速运', '京东物流', '德邦快递', '天天快递', '百世物流', '百世汇通', 'EMS邮政'];
        @Provide() weightTypes:string[] = ['轻', '重', '超重'];
        @Provide() value: string = '';
        @Provide() showAreaPicker:boolean = false;
        @Provide() showTimePicker:boolean = false;
        @Provide() showTypePicker:boolean = false;
        @Provide() minHour: number = 10;
        @Provide() maxHour: number = 20;
        @Provide() minDate: any = new Date();
        @Provide() maxDate: any = new Date(2019, 10, 1);
        @Provide() currentDate: any = new Date();
        @Provide() formatter(type: string, value: string) {
            if (type === 'year') {
                return `${value}年`;
            } else if (type === 'month') {
                return `${value}月`
            } else if (type === 'day') {
                return `${value}日`
            } else if (type === 'hour') {
                return `${value}时`
            } else if (type === 'minute') {
                return `${value}分`
            }
            return value;
        }
        @Provide() new_deadline: any = new Date();
        @Provide() listDetail: object = {
            updateTime: '',
            deadline: '',
            destination: '',
            deliveryPoint: {
                deliveryPoint: '',
                area: '',
            },
            type: null,
            fee: '',
            remark: '',
            publisher: {
                telphone: '12345678901',
                email: '',
                registerMode: '',
                thirdPartyId: '',
                avatar: 'http://b-ssl.duitang.com/uploads/item/201809/16/20180916120134_myspq.jpeg',
                displayName: 'Maira',
                pickName:''
            },
            pickCode: '',
        };
        returnHome() {
            this.$router.go(-1);
        }
        onConfirm(value: any, type: string) {
            if ( type === 'deliveryPoint' ) {
                (this as any).listDetail.deliveryPoint.deliveryPoint = value;
                this.showAreaPicker = false;
            } else if ( type === 'deadline' ) {
                this.new_deadline = value;
                console.log("new_deadline:",this.new_deadline);
                const resDate = value.getFullYear() + '年' + this.p((value.getMonth() + 1)) + '月' + this.p(value.getDate()) + '日';
                const resTime = this.p(value.getHours()) + '时' + this.p(value.getMinutes()) + '分';
                (this as any).listDetail.deadline = resDate + resTime;
                this.showTimePicker = false;
            } else if ( type === 'weightType' ) {
                (this as any).listDetail.type = value;
                this.showTypePicker = false;
            }
        }
        // 提交订单信息
        submitList(): void {
            let login_token: string = sessionStorage.getItem('login_token') || '';
            // console.log("解析token",jwt_decode(login_token));
            // console.log(this.listDetail);
            // console.log(this.new_deadline);
            // console.log((this as any).TypeToNum(this.listDetail.type));
            let id = jwt_decode(login_token).sub;
            let params = new URLSearchParams();
            let listDetail = (this as any).listDetail;
            let objNull = true;
            console.log("listDetail",listDetail);
            for (let key in listDetail) {
                // console.log("key",listDetail[key]);
                 if ( listDetail[key] && listDetail.deliveryPoint.area && listDetail.deliveryPoint.deliveryPoint && listDetail.publisher.pickName ) {    // 都不为空
                     objNull = false;
                     // console.log("111");
                 } else {       // 某项为空
                     objNull = key !== 'remark';        // 如果这一项是备注，则可以为空
                 }
            }
            if ( !objNull ) {
                params.append('listInfo',(this as any).listDetail);
                params.append('deadline',(this as any).new_deadline);
                params.append('deliveryPointId',listDetail.deliveryPoint.area);
                params.append('destination',listDetail.destination);
                params.append('fee',listDetail.fee);
                params.append('pickCode',listDetail.pickCode);
                params.append('pickName',listDetail.publisher.pickName);
                params.append('remark',listDetail.remark);
                params.append('tailNumber',listDetail.publisher.telphone);
                params.append('type',(this as any).TypeToNum(listDetail.type));

                (this as any).$axios.post((this as any).baseUrl + `/api/v1.0/SUSTDelivery/view/user/${id}/commit`, params, {
                    headers:{
                        'Authorization':sessionStorage.getItem('login_token')
                    }
                })
                    .then((res: any) => {
                        console.log(res);
                        if (res.data.status === 'success') {
                            Toast.success("提交成功");
                        } else {
                            Toast.fail(res.data.errorMsg);
                        }
                    })
                    .catch((err: any) => {
                        console.log('err');
                        Toast.fail('网络连接错误');
                    })
            } else {
                Toast.fail('还有未填写的信息');
            }
        }

         private p( s: any ) {
            return s < 10 ? '0' + s : s     // 时之前为两位数字
        }

        // 将包裹重量由文字转为数字
        private TypeToNum(type: string ) {
            switch (type) {
                case '轻':
                    return 1;
                case '重':
                    return 2;
                case '超重':
                    return 3;
                default :
                    return -1;
            }
        }

    }
</script>

<style lang="less" scoped>
    @mainColor:#1DA57A;
    .publishList {
        .publishList-header {
            z-index: 1000;
            .icon-icon--fanhui {
                color: white;
                font-size: 1.36rem;
                width: 10%;
                text-align: center;
                &:active {
                    color: lighten(@mainColor, 50%);
                }
            }
            .title {
                color: white;
                width: 90%;
                padding-right: 5%;
                text-align: center;
            }
        }
        /***填写快递信息***/
        .listInfo-wrapper {
            width: 86%;
            margin: 15% auto 0 auto;
            border: .5px solid #eee;
            border-radius: .5rem;
            padding: 1rem;
            box-shadow: 0 1px 2px #aaaaaa;
            display: flex;
            flex-direction: column;
        }

        .submit_button {
            display: flex;
            flex-direction: row;
            justify-content: center;
            margin-top: 1rem;
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
        }
    }
</style>
