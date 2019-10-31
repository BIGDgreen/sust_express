<template>
    <div class="addInfo">
        <div class="header addInfo-header">
            <span class="iconfont icon-icon--fanhui" @click="returnHome()"></span>
            <div class="title">填写信息</div>
        </div>
        <div class="input-info">
            <div class="input-item">
                <div>手机号：<input type="text" placeholder="请填入手机号" v-model="telephone" :class="{'input_err':telephone_err.phone_is_err}" @keyup="judgePhone()"/></div>
                <div class="err" v-if="telephone_err.phone_is_err">{{telephone_err.phone_errMsg}}</div>
            </div>
            <div class="input-item">
                <div>邮&nbsp;&nbsp;&nbsp;箱：<input type="text" placeholder="请填入邮箱" v-model="email" :class="{'input_err':email_err.email_is_err}" @keyup="judgeEmail()"/></div>
                <div class="err" v-if="email_err.email_is_err">{{email_err.email_errMsg}}</div>
            </div>
            <button @click="submit_info" :disabled=" isEmpty || email_err.email_is_err || telephone_err.phone_is_err">提交</button>
        </div>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Provide } from 'vue-property-decorator';
    import { Toast } from 'vant';

    @Component({
        components: {
        },
    })
    export default class Home extends Vue {
        @Provide() telephone: string = '';
        @Provide() email: string = '';
        @Provide() isEmpty: boolean = true;
        @Provide() telephone_err: {
            phone_is_err: boolean;
            phone_errMsg: string;
        } = {
            phone_is_err: false,
            phone_errMsg:''
        };
        @Provide() email_err: {
            email_is_err: boolean;
            email_errMsg: string;
        } = {
            email_is_err: false,
            email_errMsg:''
        };
        @Provide() submitDisabled: boolean = true;
        submit_info() {
            let username = (this as any).$route.params.username;
            console.log("username",username);
            let params = new URLSearchParams();
            params.append('telphone',this.telephone);
            params.append('email',this.email);
            params.append('username',username);
            (this as any).$axios
                .post((this as any).baseUrl + '/api/v1.0/SUSTDelivery/view/addInfo', params, {
                        headers: {'Authorization': sessionStorage.getItem('token')}
                    }
                )
                .then((res: any) => {
                    console.log(res);
                    // let userInfos = {
                    //     username: username,
                    //     password: password,
                    //     telphone: this.telephone,
                    //     email: this.email
                    // };
                    // this.$store.commit('SET_USERINFO',Object.assign(res.data.data,userInfos));
                    let params = new URLSearchParams();
                    params.append("username",res.data.data.thirdPartyId);
                    params.append("password",res.data.data.avatar);
                    (this as any).$axios
                        .post((this as any).baseUrl + '/api/v1.0/SUSTDelivery/view/form',params)
                        .then((res: any) => {
                            console.log(res);
                            this.$router.push({path:"/"});
                        })
                        .catch((err: any) => {
                            console.log(err);
                        })
                })
                .catch((err: any) => {
                    Toast.fail('网络连接错误！');
                })
        }
        returnHome() {
            this.$router.go(-1);
        }
        judgePhone() {
            // 验证手机号
            let realPhone = /^1[3456789]\d{9}$/;
            // 手机号为空
            if ( !realPhone.test(this.telephone) ) {
                this.telephone_err.phone_is_err = true;
                if ( !this.telephone ) {
                    // 手机号为空
                    this.telephone_err.phone_errMsg = '手机号不能为空！';
                } else {
                    this.telephone_err.phone_errMsg = '请输入正确的手机号！';
                }
            } else {
                // 正确
                this.telephone_err.phone_is_err = false;
                this.judge();
            }
        }
        judgeEmail() {
            // 验证邮箱
            let realEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            if ( !realEmail.test(this.email) ) {
                this.email_err.email_is_err = true;
                if ( !this.email ) {
                    // 手机号为空
                    this.email_err.email_errMsg = '邮箱不能为空！';
                } else {
                    this.email_err.email_errMsg = '请输入正确的邮箱！';
                }
            } else {
                // 正确
                this.email_err.email_is_err = false;
                this.judge();
            }
        }
        judge() {
            // 提交按钮是否可用
            this.isEmpty = !this.telephone || !this.email;
        }
    }
</script>

<style lang="less" scoped>
@mainColor:#1DA57A;
.addInfo{
    width: 100%;
    .addInfo-header{
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
    .input-info {
        display: flex;
        flex-direction: column;
        margin: 14% auto 0 auto;
        width: 80%;
        .input-item {
            margin-top: 5%;
            div:nth-child(1) {
                display: flex;
                flex-direction: row;
                align-items: center;
            }
            input {
                padding: .6rem .4rem;
                border: .5px solid @mainColor;
                border-radius: .4rem;
                width: 70%;
                &:focus {
                    border: .8px solid lighten(@mainColor,10%);
                }
            }
             .input_err {
                 border: .5px solid red;
                 &:focus {
                     border: .8px solid lighten(red,10%);
                 }
             }
            .err{
                display: flex;
                flex-direction: row;
                justify-content: flex-end;
                margin-top: .4rem;
                color: red;
                font-size: .8rem;
            }
        }
        button {
            background-color: lighten(@mainColor,6%);
            color: white;
            padding-top: .6rem;
            padding-bottom: .4rem;
            border-radius: .4rem;
            margin-top: 10%;
            outline: none;
            border: 0;
            &:active {
                background-color: @mainColor;
            }
            &:disabled {
                background-color: #bbbbbb;
            }
        }
    }

}
</style>
