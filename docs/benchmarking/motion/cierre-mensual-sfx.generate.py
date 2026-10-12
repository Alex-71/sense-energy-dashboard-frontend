# Sound design v2 for "Cierre Mensual": mechanical / electronic palette (vault, servos, hydraulics, relays, UI clicks).
import numpy as np, wave
from scipy.signal import butter, lfilter
SR=44100; DUR=90.0; N=int(SR*DUR)
L=np.zeros(N); R=np.zeros(N); rng=np.random.default_rng(23)
def bp(x,lo,hi,o=2): b,a=butter(o,[lo/(SR/2),hi/(SR/2)],btype='band'); return lfilter(b,a,x)
def lp(x,fc,o=2): b,a=butter(o,fc/(SR/2)); return lfilter(b,a,x)
def hp(x,fc,o=2): b,a=butter(o,fc/(SR/2),btype='high'); return lfilter(b,a,x)
def env(n,a,r,hold=None):
    e=np.ones(n); ia=max(1,int(a*SR)); ir=max(1,int(r*SR))
    e[:ia]=np.linspace(0,1,ia)
    if ir<n: e[-ir:]*=np.linspace(1,0,ir)
    return e
def nz(dur): return rng.normal(0,1,int(dur*SR))
def tt(dur): return np.arange(int(dur*SR))/SR
def add(start,sig,pan=0.0,gain=1.0):
    s0=int(start*SR); s1=min(N,s0+len(sig))
    if s0>=N or s1<=s0: return
    seg=sig[:s1-s0]*gain; L[s0:s1]+=seg*(1-max(0,pan)*0.8); R[s0:s1]+=seg*(1+min(0,pan)*0.8)
# ---- primitives ----
def ui_click(dur=0.012,lo=2200,hi=5200,g=1.0):          # crisp interface click
    s=bp(nz(dur+0.01),lo,hi,2)*env(int((dur+0.01)*SR),0.0005,dur); return s/ (np.max(np.abs(s))+1e-9)*g
def key_click(g=1.0):                                   # mechanical key / button
    a=bp(nz(0.03),900,3500)*env(int(0.03*SR),0.0005,0.025); b=np.sin(2*np.pi*420*tt(0.04))*env(int(0.04*SR),0.001,0.035)*0.4
    s=np.zeros(max(len(a),len(b))); s[:len(a)]+=a/(np.max(np.abs(a))+1e-9); s[:len(b)]+=b; return s*g
def relay(g=1.0):                                       # relay / bolt clunk
    a=lp(nz(0.05),900)*env(int(0.05*SR),0.0005,0.045); t=tt(0.12); b=np.sin(2*np.pi*(95-40*t/0.12)*t)*np.exp(-t*28)
    s=np.zeros(max(len(a),len(b))); s[:len(a)]+=a/(np.max(np.abs(a))+1e-9)*0.8; s[:len(b)]+=b*0.9; return s*g
def thud(f0=48,dur=0.6,g=1.0):                          # sub impact
    t=tt(dur); s=np.sin(2*np.pi*(f0-f0*0.4*t/dur)*t)*np.exp(-t*7); n=lp(nz(0.12),300)*env(int(0.12*SR),0.0005,0.1)*0.25
    s[:len(n)]+=n; return s*g
def metal_settle(g=1.0):                                # short inharmonic ring, lowpassed
    t=tt(0.45); s=sum(np.sin(2*np.pi*f*t)*np.exp(-t*d)*a for f,d,a in ((412,9,1),(1137,14,.5),(1866,18,.3),(2733,22,.15)))
    return lp(s,2600)*g*0.5
def servo(dur,f1,f2,g=1.0):                             # motor whine with slight vibrato
    t=tt(dur); f=f1+(f2-f1)*t/dur; ph=2*np.pi*np.cumsum(f)/SR; s=(2*((ph/(2*np.pi))%1)-1)*0.5+np.sin(ph*2)*0.2
    s*= (1+0.03*np.sin(2*np.pi*27*t)); return lp(s,1400)*env(len(t),0.12,0.2)*g
def hydraulic(dur,g=1.0):                               # hiss with slow decay
    t=tt(dur); s=hp(nz(dur),1800)*np.exp(-t*2.2)*env(len(t),0.02,0.3); return s*g*0.6
def rumble(dur,g=1.0):                                  # low mechanical bed
    s=lp(nz(dur),120,3)*env(int(dur*SR),0.25,0.5); return s/(np.max(np.abs(s))+1e-9)*g
def hum(dur,f=58,g=1.0):                                # electrical hum
    t=tt(dur); s=np.sin(2*np.pi*f*t)+0.35*np.sin(2*np.pi*f*2*t)+0.15*np.sin(2*np.pi*f*3*t); return lp(s,400)*env(len(t),0.6,0.8)*g*0.3
def charge(dur,g=1.0):                                  # electrical charge-up
    t=tt(dur); n=bp(nz(dur),300+3000*(t/dur),400+6000*(t/dur)+1,2) if False else hp(nz(dur),400)*(t/dur)**2
    h=np.sin(2*np.pi*np.cumsum(70+180*(t/dur)**2)/SR)*(t/dur); return (n*0.5+h*0.5)*env(len(t),0.05,0.05)*g
def shimmer(dur,g=1.0):                                 # holographic texture
    t=tt(dur); s=hp(nz(dur),5000)*(0.5+0.5*np.sin(2*np.pi*6*t))*env(len(t),0.6,0.8); return s*g*0.35
def shutter(g=1.0):                                     # two-part mechanical shutter
    a=ui_click(0.009,1500,5000); b=ui_click(0.011,1200,4200); s=np.zeros(int(0.06*SR)); s[:len(a)]+=a; s[int(0.038*SR):int(0.038*SR)+len(b)]+=b*0.8; return s*g
def tick(g=1.0): return ui_click(0.006,3000,7000,g)
def denied(g=1.0):
    t=tt(0.14); s=np.sign(np.sin(2*np.pi*110*t))*env(len(t),0.003,0.08); return lp(s,500)*g*0.5
def steps(t0,t1,period=0.59,g=0.18):
    k=0; x=t0
    while x<t1:
        s=lp(nz(0.07),420)*env(int(0.07*SR),0.001,0.06); s=s/(np.max(np.abs(s))+1e-9)
        add(x,s,pan=(-0.25 if k%2 else 0.25),gain=g); add(x,thud(60,0.12,0.35),pan=(-0.25 if k%2 else 0.25),gain=g); x+=period; k+=1
# ---- scene 1: boot ----
add(0.8,hum(5.2,55),gain=0.35)
for i in range(14): add(1.2+i*0.3,tick(),gain=0.08)
add(5.4,relay(),gain=0.35); add(5.45,hydraulic(0.5),gain=0.25)
# ---- scene 2: credentials ----
add(7.0,hydraulic(0.35),gain=0.3); add(7.05,ui_click(0.012),gain=0.2); add(7.45,relay(),gain=0.4)
add(10.0,hydraulic(0.6),gain=0.3); add(10.95,relay(),gain=0.5)
steps(10.4,16.0)
# ---- scene 3: vault ----
add(19.0,charge(1.9),gain=0.45)
for k,ts in enumerate((20.9,21.05,21.2)): add(ts,relay(),pan=(-0.4,0,0.4)[k],gain=0.75)
add(21.0,thud(42,0.8),gain=0.6)
add(21.2,rumble(3.2),gain=0.55); add(21.3,servo(2.6,85,130),gain=0.28); add(21.3,hydraulic(1.6),gain=0.35)
add(23.8,thud(45,0.6),gain=0.5); add(23.85,metal_settle(),gain=0.5)
add(22.0,ui_click(0.012),gain=0.22); add(22.08,ui_click(0.012),gain=0.15)
add(24.0,hp(nz(0.5),2500)*np.linspace(0,1,int(0.5*SR))**2*env(int(0.5*SR),0.05,0.1),gain=0.12); add(24.4,hum(1.2,120),gain=0.2)
steps(25.0,28.0)
# ---- scene 4: repository ----
add(28.5,shimmer(3.0),gain=0.5)
for i in range(17): add(31.0+i*0.55,ui_click(0.012,2000+rng.integers(-200,200),5000),pan=((i%6)-2.5)/3.5,gain=0.55)
add(40.2,denied(),gain=0.4)
# ---- scene 5: capture ----
add(42.0,servo(1.0,110,70),gain=0.22); add(42.9,relay(),gain=0.45)
for i in range(17): add(42.0+i*0.55,shutter(),pan=((i%6)-2.5)/3.5,gain=0.5)
for tc in (44,47,50): add(tc,ui_click(0.012),gain=0.2)
add(50.0,hum(8.0,62),gain=0.6)
for i in range(60): add(50.4+i*0.125+rng.uniform(-0.02,0.02),tick(),pan=rng.uniform(-0.5,0.5),gain=0.07)
# ---- scene 6: consolidation ----
add(59.0,rumble(2.8),gain=0.35); add(59.0,servo(2.4,60,120),gain=0.18)
for k in range(4): add(60.0+k*1.5,relay(),gain=0.8); add(60.0+k*1.5,thud(50,0.45),gain=0.45)
for i in range(30): add(65.0+i*0.083,tick(),gain=0.1)
add(67.5,relay(),gain=0.5)
# ---- scene 7: logout ----
add(70.0,ui_click(0.012),gain=0.25); add(70.08,ui_click(0.012),gain=0.15)
add(72.0,key_click(),gain=0.7); add(72.4,hydraulic(0.5),gain=0.3)
add(73.0,rumble(2.8),gain=0.55); add(73.0,servo(2.3,130,80),gain=0.28); add(73.1,hydraulic(1.4),gain=0.3)
for k,ts in enumerate((75.2,75.35,75.5)): add(ts,relay(),pan=(0.4,0,-0.4)[k],gain=0.75)
add(75.5,thud(42,0.8),gain=0.6); add(75.55,metal_settle(),gain=0.45)
add(75.0,ui_click(0.012),gain=0.2)
# ---- scene 8: report ----
add(77.0,thud(40,1.4),gain=0.8); add(77.0,lp(nz(1.8),500)*np.exp(-tt(1.8)*2.5),gain=0.12)
for i in range(30): add(81.0+i*0.083,tick(),gain=0.08)
add(84.5,relay(),gain=0.7); add(84.5,thud(50,0.4),gain=0.4)
for i in range(3): add(86.0+i*0.9,ui_click(0.012),gain=0.2)
mix=np.stack([L,R],axis=1); mix=np.tanh(mix*1.1); mix=mix/np.max(np.abs(mix))*0.8
with wave.open('cierre-mensual-sfx2.wav','wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype(np.int16).tobytes())
print('sfx2 ok')
