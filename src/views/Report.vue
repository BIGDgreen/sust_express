<template>
    <div class="report">
        <div class="header report-header">
            <span class="iconfont icon-icon--fanhui" @click="returnBack()"></span>
            <div class="title">举报</div>
        </div>
        <div class="lists">
            <div><div class="title">被举报用户</div>
                <div class="reportedUser">{{reportedUser}}</div>
            </div>
            <div><div class="title">举报原因</div>
                <div class="tags-wrapper">
<!--                    <div class="tag" v-for="tag in tags">{{tag}}</div>-->
                    <van-checkbox-group v-model="tags">
                        <van-checkbox name="a" checked-color="#1DA57A" class="check-item">接单人未取快递</van-checkbox>
                        <van-checkbox name="b" checked-color="#1DA57A" class="check-item">快递逾期未送达</van-checkbox>
                        <van-checkbox name="c" checked-color="#1DA57A" class="check-item" @click="clickOtherReason">其他原因</van-checkbox>
                    </van-checkbox-group>
                    <div v-if="existOtherReasons">
                        <van-cell-group>
                            <van-field
                                v-model="otherReasons"
                                rows="4"
                                autosize
                                type="textarea"
                                maxlength="200"
                                placeholder="请输入您的举报原因"
                                show-word-limit = "true"
                            />
                        </van-cell-group>
                    </div>
                </div>
            </div>
            <div>
                <div class="title">截图<span class="describe">留下截图可提高举报成功率哦~</span></div>
                <van-uploader v-model="fileList" multiple  :max-count="3"/>
            </div>
            <button class="submitBtn">提交</button>
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Provide, Component} from 'vue-property-decorator';
    import { Field, Uploader, CellGroup } from 'vant'
    @Component({
        [Field.name]: Field,
        [Uploader.name]: Uploader,
        [CellGroup.name]: CellGroup
    })
    export default class Report extends Vue {
        @Provide() reportedUser: string = '';
        @Provide() otherReasons: string = '';
        @Provide() existOtherReasons: boolean = false;
        @Provide() tags: string[] = ['接单人未取快递','快递逾期未送达','其他原因'];
        @Provide()  fileList:object[] = [];
        mounted() {
            // let e = new EventSource('http://192.168.0.109:8065/user/flux');
            // e.onmessage = (e: any) => {
            //     console.log(e.data)
            // };
            this.reportedUser = this.$route.params.reportedUser;
            console.info("被举报人",this.$route.params.reportedUser);
        }
        clickOtherReason(e: any) {
            console.log(e);
            console.log(this.existOtherReasons);
            this.existOtherReasons = !this.existOtherReasons;
        }
        returnBack() {
            this.$router.push('/');
        }
    }
</script>

<style lang="less" scoped>
    @mainColor:#1DA57A;
    .report {
        width: 100%;
        .report-header{
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
        .lists {
            width: 80%;
            margin: 15% auto 1rem auto;
            border: .5px solid #eee;
            border-radius: .5rem;
            padding: 1rem;
            box-shadow: 0 1px 2px #aaaaaa;
            overflow: hidden;
            word-break: break-all;
           .title {
               margin-top: 1rem;
               font-size: 1.2rem;
               color: darken(@mainColor,10%);
           }
            .describe {
                font-size: .8rem;
                color: #999999;
                margin-left: 1rem;
                margin-bottom: 1.4rem;
            }
            .reportedUser{
                margin-left: 3rem;
                margin-top: .68rem;
                font-size: 1.1rem;
            }
            .tags-wrapper {
                margin-left: 2rem;
                .check-item {
                    margin-top: 1rem;
                    color: #666666;
                }
            }
            .submitBtn {
                border: 0;
                border-radius: .6rem;
                width: 60%;
                background-color: lighten(@mainColor,10%);
                outline: none;
                color: white;
                padding-top: .6rem;
                padding-bottom: .6rem;
                display: block;
                margin: 1.6rem auto;
                &:active {
                    color: lighten(@mainColor,10%);
                    border: .5px solid lighten(@mainColor,10%);
                    background-color: white;
                }
            }
        }
    }
</style>
