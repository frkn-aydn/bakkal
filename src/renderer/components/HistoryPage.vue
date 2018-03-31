<template>
    <div class="wrapper animated fadeIn">
        <div class="history-page">
            <div class="sidebar">
                <datepicker language="tr" v-model="search_date" :inline="true"></datepicker>
                <div class="submit-button">
                    <button @click="search" class="btn primary zero">Satışları Getir</button>
                </div>
                <div class="total">
                    <div class="total">
                        Toplam :
                    </div>
                    <div class="price">
                        {{this.total.toFixed(2) + " TL"}}
                    </div>
                </div>
            </div>
            <div class="selling-list-area">
                <ul class="selling-list">
                    <template v-if="selling_list.length">
                        <li class="selling-list-item" v-for="(item, key) in selling_list" @click="show_list" :key="key">
                            <div class="sell-info">
                                <div class="date">{{item.date}}</div>
                                <div class="total">{{item.total.toFixed(2)}} TL</div>
                            </div>
                            <div class="basket">
                                <table>
                                    <thead>
                                        <tr>
                                            <th class="left">Ürünün Adı</th>
                                            <th>Adet</th>
                                            <th>Adet Fiyatı</th>
                                            <th>Toplam Fiyatı</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(cart, cartkey) in item.cart" :key="cartkey">
                                            <td class="title left">{{cart.title}}</td>
                                            <td class="piece">{{cart.qty}}</td>
                                            <td>{{parseFloat(cart.price + "." + cart.sub_price).toFixed(2)}}</td>
                                            <td>{{(parseFloat(cart.price + "." + cart.sub_price) * cart.qty).toFixed(2)}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </li>
                    </template>
                    <template v-else>
                        <li>Bu tarihte herhangi bir satış bulunamadı !</li>
                    </template>
                </ul>
            </div>
        </div>
        <div class="side-button-area left buttom">
            <router-link class="btn error circle" to="/">
                <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                    <path fill="#fff" d="M13,9V5L6,12L13,19V14.9C18,14.9 21.5,16.5 24,20C23,15 20,10 13,9M7,8V5L0,12L7,19V16L3,12L7,8Z" />
                </svg>
            </router-link>
        </div>
    </div>
</template>

<script>
    import swal from "sweetalert/dist/sweetalert.min.js";
    import Datepicker from 'vuejs-datepicker';

    export default {
        name: 'history-page',
        data: function () {
            return {
                search_date: new Date(),
                selling_list: [],
                total: 0,
                loading : false
            }
        },
        beforeDestroy: function () {
            this.$electron.ipcRenderer.removeAllListeners(["search-products-by-date-result"])
        },
        computed: {},
        components: {
            Datepicker
        },
        mounted: function () {
            this.$electron.ipcRenderer.on("search-products-by-date-result", (event, arg) => {
                const products = [];
                let total = 0;
                arg.forEach(sell => {
                    const sellDate = new Date(sell.date);
                    const day = ("0" + sellDate.getDate()).slice(-2);
                    const month = ("0" + (sellDate.getMonth() + 1)).slice(-2);
                    const year = sellDate.getFullYear();

                    const hour = ("0" + sellDate.getHours()).slice(-2);
                    const minute = ("0" + sellDate.getMinutes()).slice(-2);
                    products.push({
                        total: sell.total,
                        date: day + "." + month + "." + year + " " + hour + ":" + minute,
                        cart: sell.cart
                    })
                    total = total + sell.total
                })
                this.total = total;
                this.selling_list = products
            })
            const searchDate = new Date();
            searchDate.setHours(0, 1, 0);
            this.$electron.ipcRenderer.send("search-products-by-date", searchDate)
        },
        methods: {
            search() {
                const searchDate = new Date(this.search_date);
                searchDate.setHours(0, 1, 0);
                this.$electron.ipcRenderer.send("search-products-by-date", searchDate)
            },
            show_list(e) {
                e.currentTarget.childNodes[2].classList.toggle("active")
            }
        }
    }
</script>