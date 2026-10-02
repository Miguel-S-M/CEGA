const $=id=>document.getElementById(id);
const initial={budget:5000000,months:3,radio:60,radioCost:150000,diplomacy:80,diplomacyCost:250000,naval:35,navalCost:1000000,air:25,airCost:800000,invasion:100,invasionCost:0};
const money=n=>'$ '+Math.round(n).toLocaleString('en-US');
const pairs=[['radio','onRadio','radioCost'],['diplomacy','onDiplomacy','diplomacyCost'],['naval','onNaval','navalCost'],['air','onAir','airCost']];
function val(id){return Math.max(0,Number($(id).value)||0)}
function update(){
 const months=Math.max(1,val('months'));
 let spent=0, info=0, logistics=0;
 for(const [range,check,cost] of pairs){
  const active=$(check).checked, intensity=val(range);
  $(range+'Out').textContent=intensity+'%';
  if(active){spent+=val(cost)*months; if(range==='radio'||range==='diplomacy')info+=intensity; if(range==='naval')logistics+=intensity*.58;if(range==='air')logistics+=intensity*.42;}
 }
 const invasionOn=$('onInvasion').checked;
 $('invasionOut').textContent=val('invasion')+'%';
 if(invasionOn) spent+=val('invasionCost');
 const budget=val('budget'), balance=budget-spent;
 $('spent').textContent=money(spent);$('balance').textContent=money(balance);
 $('balance').style.color=balance<0?'#b42318':'#20272d';
 $('totalCost').textContent=money(spent);
 logistics=Math.round(Math.min(100,logistics));
 const peace=Math.round(Math.min(100,info/2));
 $('logistics').textContent=logistics+' / 100';$('peace').textContent=peace+' / 100';
 $('logBar').style.width=logistics+'%';$('peaceBar').style.width=peace+'%';
 $('japanDeaths').textContent=invasionOn?'5–10 milhões':'Não selecionada';
 $('usDeaths').textContent=invasionOn?'400–800 mil':'Não selecionada';
 $('japanNote').textContent = ( $('onNaval').checked || $('onAir').checked )
   ? 'A campanha de bloqueio e mineração interrompeu o transporte de alimentos e matérias-primas. As fontes consultadas não fornecem um total de mortes japonesas atribuível ao nível escolhido aqui.'
   : 'Nenhuma medida de bloqueio ativada. Propaganda e diplomacia não têm estimativa confiável de mortes diretas.';
 $('navalLayer').style.display=$('onNaval').checked && val('naval')>0?'':'none';
 $('airLayer').style.display=$('onAir').checked && val('air')>0?'':'none';
 $('landLayer').style.display=invasionOn && val('invasion')>0?'':'none';
 $('diplomacyLayer').style.display=$('onDiplomacy').checked && val('diplomacy')>0?'':'none';
 const active=[];
 if($('onRadio').checked && val('radio')>0)active.push('rádio');
 if($('onDiplomacy').checked && val('diplomacy')>0)active.push('diplomacia');
 if($('onNaval').checked && val('naval')>0)active.push('naval');
 if($('onAir').checked && val('air')>0)active.push('aérea');
 if(invasionOn && val('invasion')>0)active.push('invasão');
 $('mapStatus').textContent='Ativas: '+(active.length?active.join(', '):'nenhuma');
 $('warning').textContent=invasionOn
 ? 'Faixa histórica para a operação completa. O controle de escala só mostra o grau de ativação no mapa; as mortes não são reduzidas proporcionalmente.'
 : 'Sem invasão selecionada: mortes diretas e indiretas dos bloqueios não podem ser calculadas com rigor a partir destes controles. Propaganda e diplomacia não têm estimativa confiável de mortes diretas.';
}
function reset(){
 for(const [id,v] of Object.entries(initial))$(id).value=v;
 for(const id of ['onRadio','onDiplomacy','onNaval','onAir'])$(id).checked=true;
 $('onInvasion').checked=false;update();
}
function exportReport(){
 const lines=['SIMULADOR 1945 — RELATÓRIO','Data do cenário: 27/07/1945',`Duração: ${val('months')} meses`,`Orçamento: ${money(val('budget'))}`,`Custo planejado: ${$('totalCost').textContent}`,`Saldo: ${$('balance').textContent}`,'','MEDIDAS:'];
 for(const [range,check,cost] of pairs)lines.push(`${$(check).checked?'ATIVA':'INATIVA'} — ${range}: intensidade ${val(range)}%; custo mensal ${money(val(cost))}`);
 lines.push(`${$('onInvasion').checked?'ATIVA':'INATIVA'} — Invasão Downfall: escala ${val('invasion')}%; custo extra ${money(val('invasionCost'))}`,'','MORTES:','Japoneses e americanos para bloqueios/propaganda/diplomacia: não quantificável com rigor a partir dos controles; efeitos indiretos possíveis.','Invasão Downfall completa: projeção do Departamento de Guerra no fim de julho de 1945: 400–800 mil mortes americanas e 5–10 milhões de mortes japonesas. A faixa é para a operação completa.','Índices de logística e diplomacia são indicadores de jogo, não probabilidades. Custos configuráveis são fictícios.','FONTES:','https://www.history.navy.mil/about-us/leadership/director/directors-corner/h-grams/h-gram-057/h-057-1.html','https://history.state.gov/historicaldocuments/frus1945Berlinv01/d598','https://www.presidency.ucsb.edu/documents/proclamation-the-heads-governments-united-states-china-and-the-united-kingdom','https://www.history.navy.mil/about-us/leadership/director/directors-corner/h-grams/h-gram-053/h-053-1.html');
 const blob=new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='relatorio-simulador-1945.txt';a.click();URL.revokeObjectURL(url);
}
document.querySelectorAll('input').forEach(el=>el.addEventListener('input',update));
$('reset').addEventListener('click',reset);$('export').addEventListener('click',exportReport);update();
