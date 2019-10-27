<!--<template>-->
<!--    <div class="ListItem">-->
<!--        <div class="lists-wrapper">-->
<!--            <div class="deliveryInfo">-->
<!--                <div>-->
<!--                    <b>{{list.deliveryPoint.area}} {{list.deliveryPoint.deliveryPoint}}</b>-->
<!--                </div>-->
<!--                <div>截止时间&nbsp;&nbsp;{{list.deadline}}</div>-->
<!--            </div>-->
<!--            <div class="destination">送至：{{list.destination}}</div>-->
<!--            <div class="timeInfo">-->
<!--                发布时间：{{list.updateTime}}-->
<!--            </div>-->
<!--        </div>-->
<!--    </div>-->
<!--</template>-->

<!--<script lang="ts">-->
<!--    import {Vue, Provide, Prop } from 'vue-property-decorator'-->
<!--    export default class ListItem extends Vue  {-->
<!--        mounted() {-->
<!--            alert("a");-->
<!--            // console.log("propLists",this.propLists);-->
<!--        }-->

<!--        @Prop(Array) list!: Object;-->


<!--        // @Provide() lists:Object[] = [-->
<!--        //     {-->
<!--        //         updateTime: "2019.08.27 12:00",-->
<!--        //         deadline: "2018.10.29 16:04",-->
<!--        //         destination: "12公寓",-->
<!--        //         deliveryPoint: {-->
<!--        //             deliveryPoint: "韵达",-->
<!--        //             area: "二餐厅东侧菜鸟驿站"-->
<!--        //         },-->
<!--        //         fee: "￥5",-->
<!--        //     },-->
<!--        // ];-->
<!--    }-->
<!--</script>-->

<!--<style lang="less" scoped>-->
<!--    @mainColor:#1DA57A;-->

<!--    .lists-wrapper{-->
<!--        margin-top: .6rem;-->
<!--        .lists{-->
<!--            width: 80%;-->
<!--            margin: 0 auto 1rem auto;-->
<!--            border: .5px solid #eee;-->
<!--            border-radius: .5rem;-->
<!--            padding: 1rem;-->
<!--            box-shadow: 0 1px 2px #aaaaaa;-->
<!--            &:active{-->
<!--                background: lighten(@mainColor,55%);-->
<!--            }-->

<!--            .deliveryInfo{-->
<!--                margin-bottom: .48rem;-->
<!--                div:nth-child(1){-->
<!--                    display: flex;-->
<!--                    flex-direction: row;-->
<!--                    justify-content: space-between;-->
<!--                    font-size: 1.2rem;-->
<!--                    margin-bottom: .6rem;-->
<!--                    b{-->
<!--                        color: darken(@mainColor,15%);-->
<!--                    }-->
<!--                }-->
<!--            }-->
<!--        }-->
<!--        .timeInfo{-->
<!--            font-size: .6rem;-->
<!--            color: #333333;-->
<!--            margin-top: .68rem;-->
<!--        }-->
<!--    }-->
<!--</style>-->
