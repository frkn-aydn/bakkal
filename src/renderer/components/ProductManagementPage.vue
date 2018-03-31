<template>
  <div class="wrapper animated fadeIn">
    <div class="products-page">
      <form v-on:submit.prevent="search_product">
        <div class="search-area">
          <input v-model="search_barcode" class="form-element" type="text" placeholder="Lütfen barkod numarasını giribiz...">
          <button type="submit" class="btn primary small">Ara</button>
        </div>
      </form>
      <div class="products-list">
        <table>
          <thead>
            <tr>
              <th>Ürünün Adı</th>
              <th>Barkod Numarası</th>
              <th>Ürünün Fiyatı</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="products.length">
              <tr v-for="(product, key) in products" :key="key">
                <td>{{product.title}}</td>
                <td>{{product.barcode_no}}</td>
                <td>{{product.price + "," + product.sub_price}}</td>
                <td>
                  <div class="horizonal-buttons">
                    <button class="btn small zero primary" @click="edit_product(product.barcode_no)">Düzenle</button>
                    <button class="btn small zero error" @click="remove_product(product.barcode_no)">Sil</button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <template v-if="productWillEdit && edit_product_modal">
        <edit-product-modal :refresh="refresh_products" :barcodeno="productWillEdit"></edit-product-modal>
      </template>
      <add-product-modal :refresh="refresh_products" v-if="add_product_modal"></add-product-modal>
      <div class="side-button-area right buttom">
        <button class="btn primary circle" @click="open_add_product_modal()">
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path fill="#fff" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
          </svg>
        </button>
      </div>
      <div class="side-button-area left buttom">
        <router-link class="btn error circle" to="/">
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path fill="#fff" d="M13,9V5L6,12L13,19V14.9C18,14.9 21.5,16.5 24,20C23,15 20,10 13,9M7,8V5L0,12L7,19V16L3,12L7,8Z" />
          </svg>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import swal from "sweetalert/dist/sweetalert.min.js";

  import AddProductModal from "./ProductManagementPage/AddProductModal.vue";
  import EditProductModal from "./ProductManagementPage/EditProductModal.vue";

  export default {
    name: 'product-managemant-page',
    data: function () {
      return {
        products: [],
        productWillEdit: null,
        search_barcode: ""
      }
    },
    beforeDestroy: function () {
      this.$electron.ipcRenderer.removeAllListeners(["get-products-result", "search-product-result",
        "remove-product-result"
      ])
    },
    computed: {
      add_product_modal() {
        return this.$store.state.Modals.addProductModal
      },
      edit_product_modal() {
        return this.$store.state.Modals.editProductModal
      }
    },
    components: {
      'add-product-modal': AddProductModal,
      'edit-product-modal': EditProductModal
    },
    mounted: function () {
      const that = this;
      that.$electron.ipcRenderer.on("get-products-result", (event, arg) => {
        that.products = arg
      })
      that.$electron.ipcRenderer.send("get-products", 50)


      this.$electron.ipcRenderer.on("search-product-result", (event, arg) => {
        if (!arg) return swal("Hata !", "Ürün bulunamadı !", "error");
        that.products = arg
      })

      this.$electron.ipcRenderer.on("remove-product-result", (event, arg) => {
        if (!arg || arg.error) return swal("Hata !", arg.error || "Ürün bulunamadı !", "error");
        swal("Başarılı !", "Ürünü başarılı bir şekilde sildiniz...", "success");
        that.$electron.ipcRenderer.send("get-products", 50)
      })
    },
    methods: {
      open_add_product_modal() {
        this.$store.commit("OPEN_ADD_PRODUCT")
      },
      edit_product(barcode) {
        this.productWillEdit = barcode;
        this.$store.commit("OPEN_EDIT_PRODUCT")
      },
      refresh_products() {
        this.$electron.ipcRenderer.send("get-products", 50)
      },
      search_product() {
        const that = this;
        const barcode_number = parseInt(this.search_barcode);
        const search = {};
        if (!isNaN(barcode_number)) search.barcode_no = barcode_number;
        this.$electron.ipcRenderer.send("search-product", search)
      },
      remove_product(barcode) {
        const that = this;
        const barcode_no = parseInt(barcode);
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
      }
    }
  }
</script>