const state = {
  addProductModal: false,
  editProductModal : false
}

const mutations = {
  OPEN_ADD_PRODUCT (state) {
    state.addProductModal = true
  },
  CLOSE_ADD_PRODUCT (state) {
    state.addProductModal = false
  },
  OPEN_EDIT_PRODUCT (state) {
    state.editProductModal = true
  },
  CLOSE_EDIT_PRODUCT (state) {
    state.editProductModal = false
  }
}

const actions = {
  someAsyncTask ({ commit }) {
    // do something async
    commit('INCREMENT_MAIN_COUNTER')
  }
}

export default {
  state,
  mutations,
  actions
}
