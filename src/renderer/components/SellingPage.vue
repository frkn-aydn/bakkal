<template>
    <div class="wrapper animated fadeIn">
        <div class="selling-page">
            <form @submit.prevent="search_product">
                <div class="search-area">
                    <input id="search-product" autofocus v-model="search" class="form-element" type="text" placeholder="Lütfen barkod numarasını giribiz...">
                    <button type="submit" class="btn primary small">Ara</button>
                </div>
            </form>
            <div class="cart">
                <table>
                    <thead>
                        <tr>
                            <th class="left">Ürünün Adı</th>
                            <th>Adet</th>
                            <th>Adet Fiyatı</th>
                            <th>Toplam Fiyatı</th>
                            <th class="islem"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-if="cartData.length">
                            <tr v-for="(item, key) in cartData" :key="key">
                                <td class="title left">{{item.title}}</td>
                                <td class="piece">
                                    <a href="#" @click.prevent="redQty(key)">
                                        <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                                            <path fill="#000000" d="M19,13H5V11H19V13Z" />
                                        </svg>
                                    </a>
                                    <input type="text" class="form-element" :value="item.qty" disabled="disabled">
                                    <a href="#" @click.prevent="decQty(key)">
                                        <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                                            <path fill="#000000" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                                        </svg>
                                    </a>
                                </td>
                                <td>{{parseFloat(item.price + "." + item.sub_price).toFixed(2)}}</td>
                                <td>{{(parseFloat(item.price + "." + item.sub_price) * item.qty).toFixed(2)}}</td>
                                <td class="trash">
                                    <a href="#" @click.prevent="removeFromCart(key)">
                                        <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                                            <path fill="#000000" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                                        </svg>
                                    </a>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
            <div class="footer">
                <div class="process">
                    <button class="btn primary" @click="save_selling"> Satış Yap</button>
                </div>
                <div class="total-price-area">
                    <span class="total-price">{{parseFloat(totalMoney).toFixed(2)}}</span>
                </div>
                <div class="cancel-area">
                    <button class="btn error" @click="clear"> Temizle</button>
                </div>
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


    export default {
        name: 'selling-page',
        data: function () {
            return {
                search: "",
                cartData: [],
                totalMoney: 0
            }
        },
        beforeDestroy: function () {
            this.$electron.ipcRenderer.removeAllListeners(["search-product-result"])
        },
        computed: {},
        components: {},
        mounted: function () {
            this.countTotal()
            this.$electron.ipcRenderer.on("search-product-result", (event, arg) => {
                if (!arg[0] || arg.error) {
                    this.search = "";
                    swal("Hata !", arg.error || "Ürün bulunamadı !", "error");
                    return;
                }

                const cart = this.cartData;
                let thereIs = false;

                for (let i = 0; i < cart.length; i++) {
                    if (cart[i].barcode_no == arg[0].barcode_no) {
                        thereIs = true;
                        cart[i].qty += 1;
                    }
                }

                if (!thereIs) {
                    cart.push({
                        barcode_no: arg[0].barcode_no,
                        title: arg[0].title,
                        price: parseInt(arg[0].price),
                        sub_price: parseInt(arg[0].sub_price),
                        qty: 1
                    })
                }

                this.cartData = cart;
                this.search = "";
                this.countTotal();
            })
            this.$electron.ipcRenderer.on("save-selling-result", (event, arg) => {
                if (!arg.success || arg.error) return swal("Hata !", arg.error ||
                    "Satış kaydı başarısız. Tekrar deneyiniz...", "error");
                this.cartData = [];
                this.totalMoney = 0;
                document.getElementById("search-product").focus();
            })
        },
        methods: {
            countTotal() {
                let total = 0;
                this.cartData.forEach(data => {
                    total = total + (parseFloat(data.price + "." + data.sub_price) * data.qty)
                })
                this.totalMoney = total
            },
            removeFromCart(index) {
                this.cartData.splice(index, 1);
                document.getElementById("search-product").focus();
                this.countTotal();
            },
            decQty(index) {
                this.cartData[index].qty += 1
                document.getElementById("search-product").focus();
                this.countTotal();
            },
            redQty(index) {
                this.cartData[index].qty > 1 ? this.cartData[index].qty -= 1 : "";
                document.getElementById("search-product").focus();
                this.countTotal();
            },
            search_product() {
                if (!this.search) return;
                const barcode_no = parseInt(this.search);
                if (isNaN(barcode_no)) return swal("Hata !", "Yanlış barkod numarası girdiniz...", "error");
                document.getElementById("search-product").focus();
                this.$electron.ipcRenderer.send("search-product", {
                    barcode_no: barcode_no
                })
            },
            clear() {
                this.cartData = []
                document.getElementById("search-product").focus();
                this.countTotal();
            },
            save_selling() {
                if (this.cartData.length < 1) return swal("Hata !", "Satılacak ürün yok !", "error");
                document.getElementById("search-product").focus();
                this.countTotal();
                this.$electron.ipcRenderer.send("save-selling", {
                    cart: this.cartData,
                    total: this.totalMoney
                })
            }
        }
    }
</script>