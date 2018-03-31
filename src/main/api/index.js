import {addProduct, getAllProducts, findProduct, searchProduct, removeProduct, updateProduct} from "../database/products";
import {saveSelling, searchByDate} from "../database/transactions";

export default function(event){
    event.on("save-product", (event, arg)=>{
        if(!arg.barcode_no || !arg.title || isNaN(arg.price) || isNaN(arg.sub_price)){
            return event.sender.send("save-product-result", {
                success : false,
                error : "Eksik alanlar var !"
            })
        } 
        addProduct(arg.barcode_no, arg.title, arg.price, arg.sub_price).then(results=>{
            return event.sender.send("save-product-result", results)
        }).catch(err=>{
            return event.sender.send("save-product-result", {
                error : "İşlem başarısız. lütfen tekrar deneyiniz...",
                error_info : err,
                success : false
            })
        })
    })
    event.on("get-products", (event, arg)=>{
        getAllProducts(arg || 50).then(products=>{
            event.sender.send("get-products-result", products)
        })
    })
    
    event.on("search-products-by-date", (event, arg)=>{
        searchByDate(arg).then(products=>{
            event.sender.send("search-products-by-date-result", products)
        })
    })


    event.on("find-product", (event, arg)=>{
        findProduct(arg).then(product=>{
            return event.sender.send("find-product-result", product)
        })
    })
    event.on("search-product", (event, arg)=>{
        searchProduct(arg).then(product=>{
            return event.sender.send("search-product-result", product)
        })
    })
    event.on("remove-product", (event, arg)=>{
        removeProduct(arg).then(product=>{
            return event.sender.send("remove-product-result", product)
        })
    })

    event.on("update-product", (event, arg)=>{
        updateProduct(arg.barcode_no, arg).then(product=>{
            return event.sender.send("update-product-result", product)
        })
    })

    event.on("save-selling", (event, arg)=>{
        saveSelling(arg.cart, arg.total).then(result=>{
            event.sender.send("save-selling-result", result)
        })
    })
}