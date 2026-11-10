/* A light, local canvas animation; faces remain unaltered image assets. */
(() => {
  'use strict';
  function init() {
    const slide = document.querySelector('.team-slide');
    const deck = document.getElementById('deck');
    if (!slide || !deck) return;
    const size = 270, center = 135, radius = 122, tau = Math.PI * 2;
    const rings = [...slide.querySelectorAll('.team-orbit')].map((canvas,index) => ({canvas,index,context:canvas.getContext('2d')})).filter(ring => ring.context);
    let frame = 0, last = 0, time = 0, ratio = 1;
    function draw() {
      for (const {context:ctx,index} of rings) {
        ctx.setTransform(ratio,0,0,ratio,0,0);
        ctx.clearRect(0,0,size,size);
        ctx.beginPath();
        ctx.arc(center,center,radius,0,tau);
        ctx.strokeStyle='rgba(117,150,255,.22)';
        ctx.lineWidth=.8;
        ctx.stroke();
        const head = time / 8.8 * tau - Math.PI / 3 + index * 1.35;
        const tail = Math.PI * 1.22;
        for (let step=0;step<88;step++) {
          const progress=(step+1)/88;
          ctx.beginPath();
          ctx.arc(center,center,radius,head-tail+step/88*tail,head-tail+progress*tail+.006);
          ctx.lineWidth=.35+2.9*progress*progress;
          ctx.strokeStyle=`rgba(112,153,255,${.04+.82*progress*progress})`;
          ctx.shadowColor='rgba(74,117,255,.6)';
          ctx.shadowBlur=6*progress;
          ctx.stroke();
        }
        const x=center+Math.cos(head)*radius, y=center+Math.sin(head)*radius;
        ctx.save();
        ctx.translate(x,y);
        ctx.rotate(head+Math.PI/4);
        ctx.beginPath();
        for(let point=0;point<8;point++) {
          const angle=point*Math.PI/4;
          const length=point%2 ? 3 : 11;
          const px=Math.cos(angle)*length, py=Math.sin(angle)*length;
          if(point===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
        }
        ctx.closePath();
        ctx.fillStyle='#a0b9ff';
        ctx.shadowColor='#5a83ff';
        ctx.shadowBlur=13;
        ctx.fill();
        ctx.restore();
        ctx.shadowBlur=0;
      }
    }
    const running = () => slide.classList.contains('is-active') && !deck.classList.contains('motion-paused') && !document.hidden;
    function tick(now) {
      frame=0;
      if(!running()) { last=0; return; }
      if(last) time+=Math.min((now-last)/1000,.08);
      last=now;
      draw();
      frame=requestAnimationFrame(tick);
    }
    function sync() {
      const play=running();
      for(const {canvas} of rings) canvas.dataset.motionState=play?'playing':'paused';
      if(play&&!frame) {last=0;frame=requestAnimationFrame(tick);}
      else if(!play&&frame) {cancelAnimationFrame(frame);frame=0;last=0;}
    }
    function resize() {
      ratio=Math.min(window.devicePixelRatio||1,2);
      for(const {canvas} of rings) {canvas.width=Math.round(size*ratio);canvas.height=Math.round(size*ratio);}
      draw();
    }
    const observer=new MutationObserver(sync);
    observer.observe(deck,{attributes:true,attributeFilter:['class']});
    observer.observe(slide,{attributes:true,attributeFilter:['class']});
    document.addEventListener('visibilitychange',sync);
    window.addEventListener('resize',resize);
    resize();
    sync();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
