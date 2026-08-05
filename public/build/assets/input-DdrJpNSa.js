import{a as c,j as e}from"./app-DOqjnIlx.js";const m=c.forwardRef(({label:i,id:n,type:o="text",error:s,icon:r,required:p=!1,disabled:t,...x},d)=>{const[a,u]=c.useState(!1),h=o==="password"&&a?"text":o,l=typeof s=="object"&&s!==null?s.message:s;return e.jsxs("div",{className:"w-full",children:[e.jsxs("div",{className:"relative",children:[r&&e.jsx("div",{className:`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-200 ${t?"text-gray-400 opacity-50":"text-gray-400"}`,children:r}),e.jsx("input",{ref:d,id:n,type:h,disabled:t,placeholder:" ",className:`
                        peer w-full h-12 rounded-lg border-2 px-4 outline-none transition-all duration-200
                        ${r?"pl-11":""} 
                        ${o==="password"?"pr-11":""}
                        
                        /* State Styling */
                        ${t?"bg-gray-50 border-gray-300 text-gray-400 cursor-not-allowed":"bg-transparent text-gray-900 "+(s?"border-red-500 focus:border-red-500":"border-blue-500 focus:border-blue-600 hover:border-blue-500")}
                    `,...x}),e.jsx("label",{htmlFor:n,className:`
                        absolute px-1 pointer-events-none transition-all duration-200
                        ${r?"left-10":"left-3"}
                        
                        /* 1. Base/Filled State (Sitting on the top border, masking the line) */
                        -top-2.5 translate-y-0 text-xs font-medium
                        
                        /* Color logic based on states */
                        ${t?"text-gray-400 bg-gray-50":`bg-white ${s?"text-red-500":"text-blue-500"}`}
                        
                        /* 2. Inactive/Empty State (Centered inside the input) */
                        peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-gray-400
                        
                        /* 3. Focus State */
                        peer-focus:-top-2.5 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:font-medium
                        ${t?"":s?"peer-focus:text-red-500":"peer-focus:text-blue-600"}
                    `,children:e.jsxs("div",{className:"flex gap-0.5",children:[i,p&&e.jsx("span",{className:`${t?"text-gray-400":"text-red-500"} font-medium`,children:"*"})]})}),o==="password"&&e.jsx("button",{type:"button",disabled:t,onClick:()=>u(!a),className:`absolute right-4 top-1/2 -translate-y-1/2 transition-colors focus:outline-none ${t?"text-gray-400 opacity-50 cursor-not-allowed":"text-gray-400 hover:text-gray-600"}`,children:a?e.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-5 w-5",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"}),e.jsx("line",{x1:"1",y1:"1",x2:"23",y2:"23"})]}):e.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-5 w-5",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("path",{d:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"}),e.jsx("circle",{cx:"12",cy:"12",r:"3"})]})})]}),l&&!t&&e.jsxs("p",{className:"mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1",children:[e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-3 w-3",viewBox:"0 0 20 20",fill:"currentColor",children:e.jsx("path",{fillRule:"evenodd",d:"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",clipRule:"evenodd"})}),l]})]})});m.displayName="Input";export{m as I};
