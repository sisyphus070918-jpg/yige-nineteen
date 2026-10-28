(function(root){
 'use strict';
 const KEY='yige.nineteen.wishes.v1';
 function readWishes(storage){try{const data=JSON.parse(storage.getItem(KEY)||'[]');return Array.isArray(data)?data.filter(x=>typeof x==='string'&&x.trim()&&x.trim().length<=120).map(x=>x.trim()).slice(-19):[]}catch{return []}}
 function writeWish(storage,value){const text=String(value??'').trim();if(!text||text.length>120)return{ok:false,saved:false,wishes:readWishes(storage)};const wishes=[...readWishes(storage).filter(x=>x!==text),text].slice(-19);try{storage.setItem(KEY,JSON.stringify(wishes));return{ok:true,saved:true,wishes}}catch{return{ok:true,saved:false,wishes}}}
 const api={readWishes,writeWish};if(typeof module!=='undefined')module.exports=api;else root.GiftCore=api;
})(typeof window!=='undefined'?window:globalThis);
