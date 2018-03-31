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
                    <div class="title">Ürün düzenlemek için aşağıdaki bilgileri değiştiriniz...</div>
                    <input :value="barcode_no" disabled="disabled" class="form-element" type="text" placeholder="lütfen barkod numarası giriniz...">
                    <input v-model="title" class="form-element" type="text" placeholder="Lütfen ürünün adını giriniz...">
                    <div class="input-horizonal">
                        <input v-model="price" type="text" class="price" placeholder="XX">
                        <span>,</span>
                        <input v-model="sub_price" type="text" class="price" placeholder="YY">
                    </div>
                </div>
                <div class="button-area">
                    <button class="btn primary" @click="update_product">Güncelle</button>
                    <button class="btn error" @click="remove_product">Sil</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import swal from "sweetalert/dist/sweetalert.min.js";

    export default {
        name: 'edit-product-modal',
        props: ["barcodeno", "refresh"],
        data: function () {
            return {
                barcode_no: "",
                title: "",
                price: "",
                sub_price: ""
            }
        },
        beforeDestroy: function () {
            this.$electron.ipcRenderer.removeAllListeners(["find-product-result", "remove-product-result"])
        },
        components: {},
        mounted: function () {
            const that = this;
            this.$electron.ipcRenderer.on("find-product-result", (event, arg) => {
                if (arg.error) return swal("Hata !", arg.error, "error");
                that.barcode_no = arg.barcode_no;
                that.title = arg.title;
                that.price = arg.price;
                that.sub_price = arg.sub_price;
            })
            this.$electron.ipcRenderer.send("find-product", this.barcodeno)

            this.$electron.ipcRenderer.on("remove-product-result", (event, arg) => {
                if (!arg || arg.error) return swal("Hata !", arg.error || "Ürün bulunamadı !", "error");
                that.refresh();
                that.$store.commit("CLOSE_EDIT_PRODUCT")
                swal("Başarılı !", "Ürünü başarılı bir şekilde sildiniz...", "success");                
            })

            this.$electron.ipcRenderer.on("update-product-result", (event, arg) => {
                if (!arg || arg.error) return swal("Hata !", arg.error || "Ürün bulunamadı !", "error");
                that.refresh();
                that.$store.commit("CLOSE_EDIT_PRODUCT")
                swal("Başarılı !", "Ürünü başarılı bir şekilde güncellediniz...", "success");                
            })
        },
        methods: {
            close_modal_general(e) {
                if (e.target.classList.contains("modal")) {
                    this.$store.commit("CLOSE_EDIT_PRODUCT")
                }
            },
            close_modal() {
                this.$store.commit("CLOSE_EDIT_PRODUCT")
            },
            remove_product() {
                const that = this;
                const barcode_no = parseInt(that.barcode_no);
                swal({
                    title: "Ürünü silmek üzeresiniz !",
                    text: "Ürünü silmeniz halinde bir daha bu ürünün bilgisine ulaşamayacaksınız.",
                    type: "error",
                    showCancelButton: true,
                    cancelButtonText: "İptal",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Evet, sil gitsin!",
                    closeOnConfirm: false,
                    showLoaderOnConfirm: true,
                }, function () {
                    that.$electron.ipcRenderer.send("remove-product", barcode_no)
                });
            },
            update_product(){
                const that = this;
                const barcode_no = parseInt(that.barcode_no);
                that.$electron.ipcRenderer.send("update-product", {
                    barcode_no : barcode_no,
                    title : that.title,
                    price : parseInt(that.price),
                    sub_price : parseInt(that.sub_price)
                })
            }
        }
    }
</script>