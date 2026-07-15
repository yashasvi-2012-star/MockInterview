
(function(){
  const canvas = document.getElementById('board');
  const ctx = canvas.getContext('2d');
  const GRID = 20;
  let cell = 0;

  let snake, dir, nextDir, dirQueue, food, score, best = 0, running, paused, speedMs, loopTimer;
  let particles = [];

  const scoreEl = document.getElementById('score');
  const bestEl = document.getElementById('best');
  const hiscoreFoot = document.getElementById('hiscoreFoot');
  const startOverlay = document.getElementById('startOverlay');
  const pauseOverlay = document.getElementById('pauseOverlay');
  const overOverlay = document.getElementById('overOverlay');
  const overSub = document.getElementById('overSub');
  const overTitle = document.getElementById('overTitle');

  function resize(){
    const stage = document.getElementById('stage');
    const size = stage.clientWidth;
    canvas.width = size * devicePixelRatio;
    canvas.height = size * devicePixelRatio;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    cell = canvas.width / GRID;
  }
  window.addEventListener('resize', resize);

  function resetState(){
    const mid = Math.floor(GRID/2);
    snake = [
      {x:mid-1,y:mid}, {x:mid-2,y:mid}, {x:mid-3,y:mid}
    ];
    dir = {x:1,y:0};
    nextDir = {x:1,y:0};
    dirQueue = [];
    score = 0;
    speedMs = 130;
    particles = [];
    placeFood();
    updateHud();
  }

  function placeFood(){
    let ok = false;
    while(!ok){
      food = { x: Math.floor(Math.random()*GRID), y: Math.floor(Math.random()*GRID) };
      ok = !snake.some(s => s.x===food.x && s.y===food.y);
    }
  }

  function updateHud(){
    scoreEl.textContent = String(score).padStart(3,'0');
    bestEl.textContent = String(best).padStart(3,'0');
    hiscoreFoot.textContent = String(best).padStart(3,'0');
  }

  function showOverlay(el){ el.classList.add('show'); }
  function hideOverlay(el){ el.classList.remove('show'); }
  function hideAllOverlays(){ [startOverlay,pauseOverlay,overOverlay].forEach(hideOverlay); }

  function gameOver(){
    running = false;
    clearTimeout(loopTimer);
    if(score > best){ best = score; }
    updateHud();
    overSub.textContent = 'Final score: ' + score + (score>=best && score>0 ? '  •  NEW BEST!' : '');
    overTitle.textContent = 'Signal Lost';
    showOverlay(overOverlay);
  }

  function step(){
    if(dirQueue.length){ dir = dirQueue.shift(); }
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    if(head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID){
      gameOver(); return;
    }
    if(snake.some(s => s.x===head.x && s.y===head.y)){
      gameOver(); return;
    }

    snake.unshift(head);

    if(head.x === food.x && head.y === food.y){
      score += 10;
      spawnParticles(food.x, food.y);
      placeFood();
      speedMs = Math.max(60, speedMs - 2.5);
      updateHud();
    } else {
      snake.pop();
    }

    draw();
    loopTimer = setTimeout(step, speedMs);
  }

  function spawnParticles(gx, gy){
    for(let i=0;i<10;i++){
      particles.push({
        x: (gx+0.5)*cell, y: (gy+0.5)*cell,
        vx: (Math.random()-0.5)*4, vy:(Math.random()-0.5)*4,
        life: 1
      });
    }
  }

  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.strokeStyle = 'rgba(255,180,0,0.05)';
    ctx.lineWidth = 1;
    for(let i=1;i<GRID;i++){
      ctx.beginPath(); ctx.moveTo(i*cell,0); ctx.lineTo(i*cell,canvas.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,i*cell); ctx.lineTo(canvas.width,i*cell); ctx.stroke();
    }

 
    const fx = (food.x+0.5)*cell, fy = (food.y+0.5)*cell;
    const r = cell*0.32;
    const grad = ctx.createRadialGradient(fx,fy,0,fx,fy,r*2.2);
    grad.addColorStop(0,'rgba(255,77,46,1)');
    grad.addColorStop(1,'rgba(255,77,46,0)');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(fx,fy,r*2.2,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ff4d2e';
    ctx.beginPath(); ctx.arc(fx,fy,r,0,Math.PI*2); ctx.fill();

  
    snake.forEach((s,i)=>{
      const x = s.x*cell, y = s.y*cell;
      const t = i===0 ? 1 : Math.max(0.35, 1 - i/snake.length*0.8);
      ctx.fillStyle = i===0 ? '#ffcf5c' : `rgba(255,180,0,${t})`;
      ctx.shadowColor = 'rgba(255,180,0,0.8)';
      ctx.shadowBlur = i===0 ? 14 : 6;
      const pad = cell*0.09;
      roundRect(ctx, x+pad, y+pad, cell-pad*2, cell-pad*2, cell*0.22);
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    particles.forEach(p=>{
      ctx.fillStyle = `rgba(255,180,0,${p.life})`;
      ctx.beginPath(); ctx.arc(p.x,p.y,3*devicePixelRatio,0,Math.PI*2); ctx.fill();
      p.x += p.vx; p.y += p.vy; p.life -= 0.05;
    });
    particles = particles.filter(p=>p.life>0);
  }

  function roundRect(ctx,x,y,w,h,r){
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.arcTo(x+w,y,x+w,y+h,r);
    ctx.arcTo(x+w,y+h,x,y+h,r);
    ctx.arcTo(x,y+h,x,y,r);
    ctx.arcTo(x,y,x+w,y,r);
    ctx.closePath();
  }

  function ambientParticleLoop(){
    if(particles.length){ draw(); }
    requestAnimationFrame(ambientParticleLoop);
  }

  function setDirection(nx, ny){
    if(!running || paused) return;
    const last = dirQueue.length ? dirQueue[dirQueue.length-1] : dir;
    if(nx === -last.x && ny === -last.y) return; // no reverse
    if(nx === last.x && ny === last.y) return; // no duplicate
    if(dirQueue.length >= 2) return; // don't let the queue outrun the ticks
    dirQueue.push({x:nx, y:ny});
  }

  function startGame(){
    resize();
    resetState();
    hideAllOverlays();
    running = true; paused = false;
    draw();
    clearTimeout(loopTimer);
    loopTimer = setTimeout(step, speedMs);
  }

  function togglePause(){
    if(!running) return;
    paused = !paused;
    if(paused){
      clearTimeout(loopTimer);
      showOverlay(pauseOverlay);
    } else {
      hideOverlay(pauseOverlay);
      loopTimer = setTimeout(step, speedMs);
    }
  }

  document.getElementById('startBtn').addEventListener('click', startGame);
  document.getElementById('retryBtn').addEventListener('click', startGame);
  document.getElementById('resumeBtn').addEventListener('click', togglePause);

  window.addEventListener('keydown', (e)=>{
    switch(e.key){
      case 'ArrowUp': case 'w': case 'W': e.preventDefault(); setDirection(0,-1); break;
      case 'ArrowDown': case 's': case 'S': e.preventDefault(); setDirection(0,1); break;
      case 'ArrowLeft': case 'a': case 'A': e.preventDefault(); setDirection(-1,0); break;
      case 'ArrowRight': case 'd': case 'D': e.preventDefault(); setDirection(1,0); break;
      case ' ': e.preventDefault();
        if(!running){ startGame(); } else { togglePause(); }
        break;
    }
  });

  const dpad = document.getElementById('dpad');
  dpad.querySelector('.up').addEventListener('click', ()=>setDirection(0,-1));
  dpad.querySelector('.down').addEventListener('click', ()=>setDirection(0,1));
  dpad.querySelector('.left').addEventListener('click', ()=>setDirection(-1,0));
  dpad.querySelector('.right').addEventListener('click', ()=>setDirection(1,0));

 
  let touchStart = null;
  const stage = document.getElementById('stage');
  stage.addEventListener('touchstart', (e)=>{
    touchStart = { x:e.touches[0].clientX, y:e.touches[0].clientY };
  }, {passive:true});
  stage.addEventListener('touchend', (e)=>{
    if(!touchStart) return;
    const dx = e.changedTouches[0].clientX - touchStart.x;
    const dy = e.changedTouches[0].clientY - touchStart.y;
    if(Math.abs(dx) > Math.abs(dy)){
      if(Math.abs(dx) > 20) setDirection(dx>0?1:-1, 0);
    } else {
      if(Math.abs(dy) > 20) setDirection(0, dy>0?1:-1);
    }
    touchStart = null;
  }, {passive:true});

  resize();
  resetState();
  draw();
  ambientParticleLoop();
})();