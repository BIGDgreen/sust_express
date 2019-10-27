<template>
    <div class="blank">
        blank page
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import {Toast} from 'vant';

    @Component({
        components: {
        },
    })
    export default class Blank extends Vue {
        mounted() {
            // 获取href中的access_token
            let href: string = window.location.href;
            if ( href ) {
                let accessToken: string = href.match(/\?access_token=(.*)/)[1];
                // console.log("token:",accessToken);
                sessionStorage.setItem("token",accessToken);
                (this as any).$axios
                    .get((this as any).baseUrl + '/api/v1.0/SUSTDelivery/view/login', {
                        params: {
                            'access_token': accessToken
                        }
                    })
                    .then((res: any) => {
                        console.log("login_info",res);
                        if (res.data.status === 'success') {
                            if ( !res.data.data.telphone || !res.data.data.email) {              // 邮箱和手机号为空，跳转到添加信息页面
                                this.$router.push({
                                    name: 'addInfo',
                                    params: {
                                        username: res.data.data.thirdPartyId,
                                        password: res.data.data.avatar
                                    }
                                });
                            } else {
                                // 将用户信息存入vuex
                                let userInfos = {
                                    username: res.data.data.thirdPartyId,
                                    password: res.data.data.avatar,
                                };
                                this.$store.commit('SET_USERINFO',Object.assign(res.data.data,userInfos));

                                // 发送请求，传入用户名和密码
                                let params = new URLSearchParams();
                                params.append("username",res.data.data.thirdPartyId);
                                params.append("password",res.data.data.avatar);
                                (this as any).$axios
                                    .post((this as any).baseUrl + '/api/v1.0/SUSTDelivery/view/form',params)
                                    .then((res: any) => {
                                        console.log("form",res);
                                        // 将用户信息存入vuex
                                        this.$store.commit('SET_USERID',res.data.principal.username);
                                        sessionStorage.setItem("login_token",res.headers.authorization);
                                        if ( res.data.authenticated ) {
                                            // 返回首页
                                            this.$router.push({path:'/'});
                                        }
                                    })
                                    .catch((error: any) => {
                                        console.log("form_err",error);
                                    })
                            }
                        } else {
                            Toast.fail(res.data.errorMsg);
                        }
                    })
                    .catch((err: any) => {
                        Toast.fail('网络连接错误！');
                    });
            }
        }
    }
</script>

<style scoped>

</style>
