<template>
    <div class="modal open animated fadeIn" @click="close_modal_general">
        <div class="modal-container animated bounceInDown">
            <div class="modal-head">
                <svg class="close_modal" viewBox="0 0 24 24" @click="close_modal">
                    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
            </div>
            <div class="modal-body">
                <div class="information">
                    <div class="title">Ürün eklemek için aşağıdaki bilgileri giriniz...</div>
                    <input v-model="barcode_no" class="form-element" type="text" placeholder="lütfen barkod numarası giriniz...">
                    <input v-model="title" class="form-element" type="text" placeholder="Lütfen ürünün adını giriniz...">
                    <div class="input-horizonal">
                        <input v-model="price" type="text" class="price" placeholder="XX">
                        <span>,</span>
                        <input v-model="sub_price" type="text" class="price" placeholder="YY">
                    </div>
                </div>
                <div class="button-area">
                    <button class="btn primary" @click="save">Kaydet</button>
                    <button class="btn error" @click="clear">Temizle</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import swal from "sweetalert/dist/sweetalert.min.js";

    export default {
        name: 'add-product-modal',
        data : function(){
            return {
                barcode_no : "",
                title : "",
                price : "",
                sub_price : ""
            }
        },
        props : ["refresh"],
        components: {},
        beforeDestroy : function(){
            this.$electron.ipcRenderer.removeAllListeners(["save-product-result"])
        },
        mounted : function(){
            this.$electron.ipcRenderer.on("save-product-result", (event, arg)=>{
                if(arg.error || !arg.success) return swal("Hata !", arg.error || "Ürün kaydedilemedi !", "error");
                this.barcode_no = "";
                this.title = "";
                this.price = "";
                this.sub_price = "";
                swal("Ürün başarıyla kaydedildi !", "", "success")
                this.refresh()
            })
        },
        methods: {
            close_modal_general(e) {
                if (e.target.classList.contains("modal")) {
                    this.$store.commit("CLOSE_ADD_PRODUCT")
                }
            },
            close_modal(){
                this.$store.commit("CLOSE_ADD_PRODUCT")
            },
            save(){
                const barcode_no = parseInt(this.barcode_no);
                if(!barcode_no || isNaN(barcode_no)) return swal("Hata !", "Lütfen barkod numarası giriniz...", "error");
                const title = this.title;
                if(!title) return swal("Hata !", "Lütfen ürünün adını giriniz...", "error");
                const price = parseInt(this.price);
                if(isNaN(price)) return swal("Hata !", "Ücret kısmı sayı olmalıdır...", "error");
                const sub_price = parseInt(this.sub_price);
                if(isNaN(sub_price)) return swal("Hata !", "Kuruş kısmı sayı olmalıdır...", "error");

                this.$electron.ipcRenderer.send("save-product", {
                    barcode_no : barcode_no,
                    title : title,
                    price : price,
                    sub_price : sub_price
                })
            },
            clear(){
                this.barcode_no = "";
                this.title = "";
                this.price = "";
                this.sub_price = "";
            }
        }
    }
</script>