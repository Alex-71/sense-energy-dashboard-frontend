# Synthesized sound-effects layer for "Cierre Mensual" (90 s), aligned to the animation timeline.
import numpy as np, wave
SR=44100; DUR=90.0; N=int(SR*DUR); t=np.arange(N)/SR
L=np.zeros(N); Rr=np.zeros(N); rng=np.random.default_rng(11)
def add(start,sig,pan=0.0,gain=1.0):
    s0=int(start*SR); s1=min(N,s0+len(sig)); 
    if s0>=N: return
    seg=sig[:s1-s0]*gain; L[s0:s1]+=seg*(1-max(0,pan)); Rr[s0:s1]+=seg*(1+min(0,pan))
def env(n,a,d,s=0.0,r=0.05,sus=0.0):
    e=np.ones(n); ia=int(a*SR); idd=int(d*SR); ir=int(r*SR)
    e[:ia]=np.linspace(0,1,ia) if ia>0 else 1
    if idd>0: e[ia:ia+idd]=np.linspace(1,sus if sus else 1,idd)
    if ir>0 and ir<n: e[-ir:]*=np.linspace(1,0,ir)
    return e
def tone(f,dur,wave_='sine',a=0.005,r=0.05,f2=None):
    n=int(dur*SR); tt=np.arange(n)/SR
    ff=f if f2 is None else f+(f2-f)*(tt/dur)
    ph=2*np.pi*np.cumsum(ff)/SR
    s=np.sin(ph) if wave_=='sine' else (2*(ph/(2*np.pi)%1)-1)
    return s*env(n,a,0,r=r)
def noise(dur,a=0.002,r=0.05,lp=0):
    n=int(dur*SR); s=rng.normal(0,1,n)
    if lp>1: s=np.convolve(s,np.ones(lp)/lp,mode='same')
    return s*env(n,a,0,r=r)
def click(f=1800,dur=0.05,g=1): return tone(f,dur,a=0.001,r=0.03)*g
def blip(f=880,dur=0.12,g=1): return tone(f,dur,a=0.003,r=0.08,f2=f*1.5)*g
def thump(dur=0.5,g=1):
    a=tone(70,dur,a=0.002,r=0.3,f2=40)*0.9; b=noise(0.08,r=0.06,lp=8)*0.5; a[:len(b)]+=b; return a*g
def chime(f=1320,g=1):
    s=tone(f,0.9,r=0.6)*0.6+tone(f*1.5,0.9,r=0.6)*0.35+tone(f*2,0.9,r=0.5)*0.2; return s*g
def whoosh(dur=0.6,g=1): return noise(dur,a=0.25,r=0.3,lp=40)*g
def rumble(dur,g=1): return (noise(dur,a=0.3,r=0.6,lp=300)*0.8+tone(38,dur,a=0.3,r=0.6)*0.6)*g
def steps(t0,t1,period=0.59,g=0.25):
    tt=t0
    while tt<t1:
        pn=(-0.3 if int(tt/period)%2 else 0.3); add(tt,noise(0.08,a=0.002,r=0.06,lp=24)*0.8,pan=pn,gain=g); add(tt,tone(90,0.09,a=0.002,r=0.07,f2=60)*0.6,pan=pn,gain=g); tt+=period
# 1 boot: data ticks 1-5.4, objectives appear
for i in range(26): add(1.0+i*0.17,click(2200+rng.integers(-300,300),0.025),gain=0.12)
add(5.4,chime(990),gain=0.35)
# 2 credentials: panel whoosh at 7, key slide-in 10-11.2, steps 10-16
add(7.0,whoosh(0.5),gain=0.5); add(7.1,blip(660,0.15),gain=0.25); add(7.45,blip(880,0.15),gain=0.25)
add(10.0,whoosh(0.9),gain=0.45); add(10.9,click(1200,0.06),gain=0.4)
steps(10.3,16.0)
# 3 gate: beam 19-20.6 rising, unlock 21, doors 21.2-24 rumble+slide, orb join 24
add(19.0,tone(220,1.7,wave_='saw',a=0.1,r=0.3,f2=880)*0.35); add(19.0,noise(1.7,a=0.2,r=0.3,lp=6)*0.08)
add(20.9,chime(1560),gain=0.5); add(21.0,tone(110,0.4,a=0.002,r=0.3,f2=55),gain=0.6)
add(21.2,rumble(3.0),gain=0.7); add(21.4,noise(2.4,a=0.4,r=0.5,lp=120)*np.linspace(0.3,1,len(noise(2.4))),gain=0.35); add(23.9,thump(0.5),gain=0.6)
add(22.0,blip(1046,0.2),gain=0.3)
add(24.1,chime(1760),gain=0.3); add(24.0,tone(440,0.6,a=0.05,r=0.4,f2=880),gain=0.12)
steps(25.0,28.0)
# 4 repository: tiles reveal 28.5-31 shimmer, selection ticks 31+i*0.55, D51 locked buzz 40.2
add(28.5,tone(660,2.5,a=0.8,r=1.0,f2=1320)*0.08); add(28.5,noise(2.5,a=0.8,r=1.0,lp=3)*0.04)
for i in range(17):
    add(31.0+i*0.55,click(1500+i*40,0.04)*0.7,pan=((i%6)-2.5)/4,gain=0.45); add(31.0+i*0.55,blip(700+i*30,0.09)*0.5,pan=((i%6)-2.5)/4,gain=0.45)
add(40.2,tone(180,0.25,wave_='saw',a=0.005,r=0.1)*0.25)
# 5 capture: shutter+flash at 42+i*0.55; chest appears 42; beam hum 50-58; chips 44/47/50
add(42.0,whoosh(0.5),gain=0.4); add(42.2,thump(0.4),gain=0.4)
for i in range(17):
    pn=((i%6)-2.5)/4; add(42.0+i*0.55,noise(0.06,a=0.001,r=0.05,lp=2)*0.9,pan=pn,gain=0.5); add(42.0+i*0.55,click(3000,0.02)*0.6,pan=pn,gain=0.5); add(42.0+i*0.55,tone(520,0.25,a=0.01,r=0.2,f2=1400)*0.25,pan=pn,gain=0.5)
for tc in (44,47,50): add(tc,blip(990,0.14),gain=0.3)
add(50.0,tone(110,8.0,a=0.8,r=1.2)*0.12); add(50.0,tone(220.5,8.0,a=0.8,r=1.2)*0.08); add(50.0,noise(8.0,a=1,r=1,lp=60)*0.06)
for i in range(40): add(52.2+i*0.12,click(2600,0.02),gain=0.12)
# 6 consolidation: cube rise 59-61.5, stamps 60+1.5k, bar 65-67.5
add(59.0,tone(55,2.5,a=0.5,r=1.0,f2=110)*0.3); add(59.0,tone(330,2.5,a=0.5,r=1.0,f2=660)*0.1)
for k in range(4):
    add(60.0+k*1.5,thump(0.45),gain=0.8); add(60.0+k*1.5,click(900,0.05)*0.5,gain=0.8)
for i in range(30): add(65.0+i*0.083,click(1800+i*40,0.025),gain=0.15)
add(67.5,chime(1320),gain=0.4)
# 7 logout: dialog 70, press 72, holster 72.4, doors close 73-75.5, badge 75
add(70.0,blip(784,0.18),gain=0.35); add(72.0,click(1400,0.05)*0.8,gain=0.6); add(72.0,tone(600,0.12,a=0.002,r=0.1)*0.4,gain=0.6)
add(72.4,whoosh(0.8),gain=0.4); add(73.0,rumble(2.6),gain=0.7); add(75.4,thump(0.6),gain=0.9)
add(75.0,chime(880),gain=0.3)
# 8 report: complete 77 chime, tiles count 81-83.5 ticks, four-eyes stamp 84.5, lines 86-88
add(77.0,chime(1046)*0.8,gain=0.6); add(77.0,chime(1568)*0.5,gain=0.6); add(77.0,tone(65,1.2,a=0.01,r=0.9),gain=0.5)
for i in range(30): add(81.0+i*0.083,click(2000+i*20,0.02),gain=0.12)
add(84.5,thump(0.4)*0.8,gain=0.8); add(84.5,click(1000,0.05)*0.5,gain=0.8)
for i in range(3): add(86.0+i*0.9,blip(660+i*110,0.16),gain=0.3)
mix=np.stack([L,Rr],axis=1); mix=np.tanh(mix*1.2); mix=mix/np.max(np.abs(mix))*0.8
with wave.open('cierre-mensual-sfx.wav','wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype(np.int16).tobytes())
print('sfx ok')
