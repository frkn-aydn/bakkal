"use strict";
const db = require("./db");

export function saveSelling(products, total){
    return db.transactions.then(transactions=>{
        return transactions.insert({
            total : parseFloat(total),
            cart : products,
            date : new Date()
        }).then(results=>{
            if(results.result.n != 1 || results.result.ok != 1) return {
                success : false,
                error : "Ürün eklemedi... Tekrar deneyiniz.",
            }
            return {
                success : true,
                data : results.ops[0]
            }
        })
    })
}

export function searchByDate(date){
    return db.transactions.then(transactions=>{
        const lesThan = new Date(date);
        lesThan.setDate(lesThan.getDate() + 1);
        return transactions.find({date: {
            $gte: new Date(date),
            $lte: new Date(lesThan)
        } }).sort({date : -1}).toArray().then(result=>{
            return result
        })
    })
}