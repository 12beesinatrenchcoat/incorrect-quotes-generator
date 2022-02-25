window.generateQuote=function(){console.group("creating a new quote..."),console.time("generateQuote");const o=window.getCharacters();if(window.settings.randomize.checked)for(let e=o.length-1;e>0;e--){const i=Math.floor(Math.random()*(e+1));[o[e],o[i]]=[o[i],o[e]]}const n=window.settings["prompt-characters-min"],r=window.settings["prompt-characters-max"],u=n.value||n.placeholder,d=r.value||r.placeholder,m=window.settings["character-range-toggle"].checked?randomPromptSetNumberFromRange(u,d):u;console.debug(`using ${m} characters...`);const p=window.filteredPrompts[m],a=p[Math.floor(Math.random()*p.length)];let t=a.text;console.debug("prompt:",a),console.groupCollapsed("text replacement"),console.time("generateQuote > text replacement");const l="{{",f="}}";let w=t.indexOf(l),b=t.indexOf(f);for(;w>=0;){let e;const i=t.substring(w+2,b);let[c,y]=i.split("%",2);c=c.split("?",2),c[0]=c[0].split(".");const M=o[c[0].shift()-1];let h=c[0].shift().trim();for(e=M[h];typeof e=="object";)h=c[0].shift().trim(),e=e[h];let s="";if(typeof e=="boolean"){console.debug(e);const g=c[1].split(":");e=e?g[0]:g[1],s=c[0]?g[1]:g[0],s=s.trim(),s=applyModifiers(s,y)}e=e.trim(),e=applyModifiers(e,y),console.debug('replacing "'+i+'" with "'+e+'"');const k=window.createField(h,M.charNum,e);s&&(k.dataset.alt=s),t=t.replace(l+i+f,k.outerHTML),w=t.indexOf(l),b=t.indexOf(f)}console.timeEnd("generateQuote > text replacement"),console.groupEnd(),document.querySelector("#output").innerHTML=t,window.fields[0]=document.querySelectorAll("#output .field");const E=document.querySelector("#output-about");E.innerText="from ";const C=document.createElement("em");C.innerText=window.fetchedPromptSets[a.set].title,E.appendChild(C),console.timeEnd("generateQuote"),console.groupEnd()};const randomPromptSetNumberFromRange=function(o,n){o=Number(o),n=Number(n);const r={};let u=0;for(let t=o;t<n+1;t++){const l=window.filteredPrompts[t].length;u+=l,r[t]=l}const d=Object.keys(r);d.forEach(t=>{r[t]/=u});const m=Math.random();let p=0,a;return d.some(t=>(p+=r[t],m<=p?(a=t,!0):!1)),a},applyModifiers=function(o="",n=""){return n&&(n=n.split(" "),n.forEach(r=>{switch(r){case"upper":o=o.toUpperCase();break;case"first":o=o[0];break;default:break}})),o};
