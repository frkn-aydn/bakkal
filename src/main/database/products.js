"use strict";
import db from "./db";

export function findProduct(barcode_no){
    return db.products.then(products=>{
        return products.findOne({barcode_no : barcode_no}).then(result=>{
            return result
        })
    })
}

export function searchProduct(search){
    return db.products.then(products=>{
        return products.find(search).limit(50).sort({date: -1}).toArray().then(result=>{
            return result
        })
    })
}

export function addProduct(barcode_no, title, price, sub_price){
    return findProduct(barcode_no).then(product=>{
        if(product) return {
            success : false,
            error : "Ürün zaten kayıtlı.",
            product : product
        }

        return db.products.then(products=>{
            return products.insert({
                barcode_no : parseInt(barcode_no),
                title : title,
                price : parseInt(price),
                sub_price : parseInt(sub_price),
                date : new Date()
            }).then(results=>{
                if(results.result.n != 1 || results.result.ok != 1) return {
                    success : false,
                    error : "Ürün eklemedi... Tekrar deneyiniz.",
                }
                return {
                    success : true,
                    product : results.ops[0]
                }
            })
        })
    })
}

export function getAllProducts(limit){
    return db.products.then(products=>{
        return products.find({}).sort({date: -1}).limit(limit || 50).toArray().then(results=>{
            return results
        })
    })
}

export function removeProduct(barcode_no){
    return db.products.then(products=>{
        if(!barcode_no) return {
            error : "Barcode numarası bulunamadı !"
        }
        return products.remove({
            barcode_no : barcode_no
        }).then(result=>{
            if(result.result.ok != 1) return {
                error : "Ürün silinemedi. Tekrar deneyiniz."
            }
            return {
                success : true
            }
        })
    })
}

export function updateProduct(barcode_no, updateQuary){
    return db.products.then(products=>{
        return products.update({barcode_no : barcode_no}, {$set : updateQuary}).then(results=>{
            if(results.result.nModified > 0, results.result.ok > 0) return { success : true };
            return {
                error : "Güncelleme başarısız...",
                success : false
            }
        })
    })
}