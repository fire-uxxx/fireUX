import{j as y,o as h,c as i,e as r,F as p,R as u,h as f}from"./CoChPsuk.js";function $(){return{initializeStars:()=>{document.querySelectorAll(".star").forEach(t=>{t.style.left=`${Math.random()*100}%`;const e=Math.random()*100;t.style.top=`${e}%`;const n=100-e;t.style.transform=`translateY(${n}vh)`;const s=Math.random()*1.5+1;t.style.width=`${s}px`,t.style.height=`${s}px`;const c=Math.random()*.4+.1;t.style.opacity=c;const d=Math.random()*3+3,o=Math.random()*340+340,m=-(o*(e/100)),_=Math.random()*2;t.style.animationDelay=`${_}s, ${m}s`,t.style.animationDuration=`${d}s, ${o}s`,t.addEventListener("animationiteration",()=>{t.style.top="100%",t.style.transform="translateY(-100vh)"})})}}}const v={class:"starfield"},M={__name:"EffectsStarfield",setup(l){const{initializeStars:a}=$();return h(()=>{a()}),(t,e)=>(r(),i("div",v,[(r(),i(p,null,u(50,n=>f("div",{key:n,class:"star"})),64))]))}},D=y(M,[["__scopeId","data-v-4580120b"]]);export{D as _};
