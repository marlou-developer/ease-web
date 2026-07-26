function m(i){return`₱ ${(i==null||isNaN(Number(i))?0:Number(i)).toLocaleString("en-PH",{minimumFractionDigits:2,maximumFractionDigits:2})}`}export{m as p};
