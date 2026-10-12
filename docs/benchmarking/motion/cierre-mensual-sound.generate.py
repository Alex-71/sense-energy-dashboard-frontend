# Sound design v3 for "Cierre Mensual" (90 s). Temp score + effects with a real DSP chain:
# convolution reverb, modal resonators, time-varying filters, Karplus-Strong, compression, ducking.
import numpy as np, wave, os
VAR=os.environ.get('VAR','P')
from scipy.signal import butter, lfilter, lfilter_zi, fftconvolve
SR=48000; DUR=90.0; N=int(SR*DUR); rng=np.random.default_rng(5)
BPM=100; BEAT=60/BPM; BAR=4*BEAT
def tt(d): return np.arange(int(d*SR))/SR
def lp(x,fc,o=2): b,a=butter(o,min(fc,SR/2-100)/(SR/2)); return lfilter(b,a,x)
def hp(x,fc,o=2): b,a=butter(o,max(fc,10)/(SR/2),btype='high'); return lfilter(b,a,x)
def bp(x,lo,hi,o=2): b,a=butter(o,[max(lo,10)/(SR/2),min(hi,SR/2-100)/(SR/2)],btype='band'); return lfilter(b,a,x)
def env(n,a=0.005,r=0.05):
    e=np.ones(n); ia=max(1,min(n,int(a*SR))); ir=max(1,min(n,int(r*SR))); e[:ia]*=np.linspace(0,1,ia); e[-ir:]*=np.linspace(1,0,ir); return e
def fit(x,n): return x[:n] if len(x)>=n else np.pad(x,(0,n-len(x)))
def mixn(*arrs):
    n=max(len(a) for a in arrs); return sum(fit(a,n) for a in arrs)
def pink(n):
    w=rng.normal(0,1,n); S=np.fft.rfft(w); f=np.fft.rfftfreq(n,1/SR); S/=np.sqrt(np.maximum(f,20)); x=np.fft.irfft(S,n); return x/(np.std(x)+1e-9)
def white(n): return rng.normal(0,1,n)
def reson(x,f,decay,gain=1.0):
    r=10**(-3/(decay*SR)); w=2*np.pi*f/SR; a=[1,-2*r*np.cos(w),r*r]; return lfilter([1-r],a,x)*gain
def modal(exc,modes):  # modes: list of (freq, decay_s, amp)
    y=np.zeros(len(exc)+int(max(m[1] for m in modes)*SR*1.5))
    e=np.zeros(len(y)); e[:len(exc)]=exc
    for f,d,a in modes: y+=reson(e,f,d)*a
    return y
def burst(ms=2.0,color=None): n=int(ms*SR/1000); x=white(n)*env(n,0.0002,ms/1000*0.8); return x if color is None else bp(x,*color)
def sweep_bp(x,f0,f1,bw=1.0,chunk=0.01):  # time-varying bandpass, log sweep
    n=len(x); cs=int(chunk*SR); y=np.zeros(n); zi=None
    for i in range(0,n,cs):
        u=i/n; fc=f0*(f1/f0)**u; lo=fc/np.sqrt(bw+1); hi=fc*np.sqrt(bw+1)
        b,a=butter(2,[max(lo,20)/(SR/2),min(hi,SR/2-100)/(SR/2)],btype='band')
        if zi is None: zi=lfilter_zi(b,a)*x[i]
        y[i:i+cs],zi=lfilter(b,a,x[i:i+cs],zi=zi)
    return y
def make_ir(rt60,damp=4000,pre=0.01,early=True):
    n=int((rt60*1.2+pre)*SR); t=np.arange(n)/SR; out=[]
    for ch in range(2):
        nz=white(n); tail=lp(nz,damp)*np.exp(-6.9*np.maximum(0,t-pre)/rt60)+bp(nz,damp,min(12000,SR/2-200))*np.exp(-6.9*np.maximum(0,t-pre)/(rt60*0.45))
        tail[:int(pre*SR)]=0
        if early:
            for d,g in ((0.013,0.5),(0.021,0.35),(0.034,0.25),(0.047,0.18)):
                k=int((pre+d)*SR)+ch*7; tail[k]+=g*(1 if ch==0 else -1)
        out.append(tail/np.sqrt(np.sum(tail**2)+1e-9))
    return np.stack(out,axis=1)
def reverb(stereo,ir,mix):
    wet=np.stack([fftconvolve(stereo[:,0]+stereo[:,1],ir[:,c])[:len(stereo)] for c in (0,1)],axis=1)*0.5
    return stereo*(1-mix)+wet*mix
def block_env(x,blk=0.001,att=0.01,rel=0.3):
    b=int(blk*SR); nb=int(np.ceil(len(x)/b)); e=np.array([np.sqrt(np.mean(x[i*b:(i+1)*b]**2)) for i in range(nb)]); out=np.zeros(nb); y=0
    ca=np.exp(-blk/att); cr=np.exp(-blk/rel)
    for i,v in enumerate(e): y=ca*y+(1-ca)*v if v>y else cr*y+(1-cr)*v; out[i]=y
    return np.repeat(out,b)[:len(x)]
def compress(st,th_db=-18,ratio=3,att=0.01,rel=0.25,makeup_db=3):
    m=(st[:,0]+st[:,1])*0.5; e=block_env(m,att=att,rel=rel); edb=20*np.log10(e+1e-6); over=np.maximum(0,edb-th_db); g=10**((-over*(1-1/ratio)+makeup_db)/20); return st*g[:,None]
class Bus:
    def __init__(s): s.L=np.zeros(N); s.R=np.zeros(N)
    def add(s,start,sig,pan=0.0,gain=1.0):
        s0=int(start*SR); s1=min(N,s0+len(sig))
        if s0>=N or s1<=s0: return
        seg=sig[:s1-s0]*gain; gl=np.cos((pan+1)*np.pi/4); gr=np.sin((pan+1)*np.pi/4); s.L[s0:s1]+=seg*gl; s.R[s0:s1]+=seg*gr
    def addst(s,start,st,gain=1.0):
        s0=int(start*SR); s1=min(N,s0+len(st)); 
        if s0>=N or s1<=s0: return
        s.L[s0:s1]+=st[:s1-s0,0]*gain; s.R[s0:s1]+=st[:s1-s0,1]*gain
    def st(s): return np.stack([s.L,s.R],axis=1)
# ================= INSTRUMENTS =================
def nf(name):  # note name -> Hz
    names={'C':0,'C#':1,'D':2,'D#':3,'E':4,'F':5,'F#':6,'G':7,'G#':8,'A':9,'A#':10,'B':11}
    k=names[name[:-1]]; o=int(name[-1]); return 440*2**((k-9)/12+(o-4))
def piano(f,dur=2.5,vel=0.7):
    n=int(dur*SR); t=tt(dur); y=np.zeros(n); B=0.00035
    for k in range(1,9):
        fk=f*k*np.sqrt(1+B*k*k); d=2.6/(k**0.75)*(0.7+0.6*vel); a=(1/k**1.25)*(1 if k<5 else 0.6)
        for det in (-1.2,0,1.2): y+=np.sin(2*np.pi*fk*2**(det/1200)*t+rng.uniform(0,6.28))*np.exp(-t/d)*a/3
    y*=env(n,0.002,0.4); ham=lp(white(int(0.012*SR)),3500)*env(int(0.012*SR),0.0005,0.01)*0.5; y[:len(ham)]+=ham*vel
    return lp(y,6500)*vel*0.35
def pad(freqs,dur,cut=1800,att=2.0,rel=2.5):
    n=int(dur*SR); t=tt(dur); out=np.zeros((n,2))
    for f in freqs:
        for vi,(det,pan) in enumerate(((-7,-0.6),(0,0),(7,0.6))):
            vib=1+0.0025*np.sin(2*np.pi*(5.1+vi*0.2)*t+rng.uniform(0,6.28)); y=np.zeros(n)
            for k in range(1,7): y+=np.sin(2*np.pi*f*2**(det/1200)*k*vib*t+rng.uniform(0,6.28))/k**1.6
            y=lp(y,cut); gl=np.cos((pan+1)*np.pi/4); gr=np.sin((pan+1)*np.pi/4); out[:,0]+=y*gl; out[:,1]+=y*gr
    e=env(n,att,rel); out*=e[:,None]; br=bp(pink(n),400,1400)*e*(0.5+0.5*np.sin(2*np.pi*0.2*t))*0.03; out[:,0]+=br; out[:,1]+=np.roll(br,900)
    return out/ (len(freqs)*3) *0.5
def pluck(f,dur=0.5,bright=0.5):
    n=int(dur*SR); P=int(SR/f); x=np.zeros(n); x[:P]=lp(white(P),400+bright*4000)*0.9; a=np.zeros(P+2); a[0]=1; a[P]=-0.497*0.995; a[P+1]=-0.497*0.995
    y=lfilter([1],a,x); return lp(y,2500)*env(n,0.001,0.08)
def drone(dur,f=55):
    t=tt(dur); y=np.sin(2*np.pi*f*t)*(0.7+0.3*np.sin(2*np.pi*0.07*t))+0.35*np.sin(2*np.pi*f*2*t+0.4)*(0.7+0.3*np.sin(2*np.pi*0.11*t))+0.12*np.sin(2*np.pi*f*3*t)
    air=bp(pink(len(t)),120,600)*0.12*(0.6+0.4*np.sin(2*np.pi*0.05*t)); return (y*0.5+air)*env(len(t),3.0,3.0)
def riser(dur,g=1.0):
    t=tt(dur); n=sweep_bp(pink(len(t)),150,4500,1.2)*(t/dur)**2.2; s=np.sin(2*np.pi*np.cumsum(50+140*(t/dur)**2)/SR)*(t/dur)**2*0.5; return (n+s)*env(len(t),0.05,0.02)*g
def impact(sub=36,dur=2.2,g=1.0,metal=False):
    t=tt(dur); s=np.sin(2*np.pi*np.cumsum(sub*(1.6-0.6*np.minimum(1,t/0.15)))/SR)*np.exp(-t*2.2); n=lp(white(len(t)),220)*np.exp(-t*9)*0.6; y=s+n
    if metal: y=mixn(y,modal(burst(3,(300,5000)),[(165,0.9,0.5),(347,0.7,0.35),(712,0.5,0.25),(1290,0.35,0.15)])*0.35)
    return y*g
def clock_tick(g=1.0): return modal(burst(1.0,(1500,7000)),[(2100,0.015,0.6),(4300,0.008,0.4)])*g
def ui_click(f=1900,g=1.0): return modal(burst(1.2,(600,6000)),[(f,0.022,0.6),(f*1.9,0.010,0.35),(f*0.33,0.016,0.3)])*g
def glass_tick(f=2600,g=1.0): return modal(burst(0.8,(1500,9000)),[(f,0.04,0.6),(f*2.76,0.02,0.2)])*g
def solenoid(g=1.0): return mixn(modal(burst(2.5,(150,4000)),[(290,0.06,0.5),(880,0.04,0.35),(1900,0.02,0.2)]),lp(white(int(0.03*SR)),900)*env(int(0.03*SR),0.0005,0.025)*0.6)*g
def bolt(g=1.0): return mixn(modal(burst(3,(100,3000)),[(140,0.5,0.6),(310,0.4,0.4),(680,0.3,0.25),(1200,0.18,0.12)])*0.8,impact(48,0.6,0.6))*g
def latch(g=1.0): return mixn(modal(burst(2,(300,5000)),[(700,0.12,0.5),(1400,0.08,0.35),(2300,0.05,0.2)])*0.7,impact(55,0.4,0.5))*g
def servo(dur,lfo0,lfo1,g=1.0):
    t=tt(dur); lfo=lfo0+(lfo1-lfo0)*t/dur; m=0.55+0.45*np.sign(np.sin(2*np.pi*np.cumsum(lfo)/SR)); y=bp(pink(len(t)),90,260)*m+np.sin(2*np.pi*72*t)*0.35*(1+0.1*np.sin(2*np.pi*lfo*t))
    return lp(y,900)*env(len(t),0.25,0.35)*g
def hiss(dur,g=1.0): t=tt(dur); return hp(pink(len(t)),1800)*np.exp(-t*2.4)*env(len(t),0.01,0.2)*g
def rattle(dur,rate=9,g=1.0):
    y=np.zeros(int(dur*SR)+SR); x=0.0
    while x<dur:
        c=modal(burst(1.5,(400,6000)),[(rng.uniform(900,2600),0.03,0.5),(rng.uniform(300,700),0.05,0.3)]); k=int(x*SR); y[k:k+len(c)]+=c*rng.uniform(0.3,1); x+=rng.exponential(1/rate)
    return y[:int(dur*SR)]*env(int(dur*SR),0.2,0.3)*g
def charge(dur,g=1.0):
    t=tt(dur); n=sweep_bp(pink(len(t)),250,5000,1.0)*(t/dur)**1.8; h=np.sin(2*np.pi*np.cumsum(60+200*(t/dur)**2)/SR); h=(h+0.4*np.sign(h))*(t/dur)**1.5*0.35
    sp=np.zeros(len(t)); 
    for _ in range(int(dur*14)):
        k=int(rng.uniform(0.3,1)**0.5*len(t)); c=hp(burst(1.2),3500); sp[k:k+len(c)]+=c[:max(0,min(len(c),len(t)-k))]*0.5
    return (n*0.6+h+sp)*env(len(t),0.05,0.03)*g
def swish(dur=0.25,g=1.0): t=tt(dur); return lp(pink(len(t)),1600)*np.sin(np.pi*t/dur)**2*g
def footstep(g=1.0): return mixn(modal(burst(2.5,(60,900)),[(95,0.06,0.6),(185,0.04,0.3)])*0.8,hp(burst(14),1500)*0.25)*g
def trolley_bed(dur,g=1.0):
    t=tt(dur); base=lp(pink(len(t)),160,3)*(0.75+0.25*np.sin(2*np.pi*3.4*t)); hiss=bp(pink(len(t)),900,2600)*0.08*(0.6+0.4*np.sin(2*np.pi*3.4*t+1))
    y=np.zeros(len(t)); x=0.0
    while x<dur:
        c=modal(burst(1.2,(500,4000)),[(rng.uniform(1200,2600),0.02,0.4)]); k=int(x*SR); y[k:k+len(c)]+=fit(c,min(len(c),len(t)-k))*rng.uniform(0.2,0.6); x+=rng.exponential(0.45)
    return (base/(np.std(base)+1e-9)*0.5+hiss+y*0.3)*env(len(t),0.8,1.0)*g
def scan_sweep(g=1.0):
    t=tt(0.22); n=sweep_bp(white(len(t)),1800,6500,0.6)*env(len(t),0.01,0.08); tk=glass_tick(5200)
    return mixn(n*0.35,fit(tk,len(t))*0.5)*g
def placement(g=1.0): return mixn(modal(burst(2,(80,1200)),[(240,0.07,0.6),(480,0.05,0.3),(900,0.03,0.15)])*0.7,lp(white(int(0.04*SR)),700)*env(int(0.04*SR),0.0005,0.035)*0.4)*g
# ================= SCORE =================
music=Bus(); sfx=Bus(); vault=Bus()
A={'Am':['A2','C3','E3','A3'],'F':['F2','A2','C3','F3'],'C':['C3','E3','G3','C4'],'G':['G2','B2','D3','G3'],'Cm':['C3','E3','G3','C4'],'Gm':['G2','B2','D3','G3'],'Amaj9':['A2','C3','E3','B3']}
def chordseq(seq,cut=1800):
    for name,start,dur in seq: music.addst(start,pad([nf(n) for n in A[name]],dur+2.5,cut=cut),gain=0.9)
music.add(0,drone(26),gain=0.45); music.add(24,drone(36,55),gain=0.4); music.add(58,drone(20,55),gain=0.5); music.add(76,drone(14,65.4),gain=0.35)
chordseq([('Am',2,14),('F',21.2,6.8),('Am',28,4.8),('F',32.8,4.8),('C',37.6,4.8),('G',42.4,4.8),('Am',47.2,4.8),('F',52,4.8),('C',56.8,1.6)],cut=1500)
chordseq([('Am',58.3,4.5),('G',62.8,4.8),('Am',67.6,6.0)],cut=1200)
chordseq([('C',77,4.8),('G',81.8,4.8),('Am',86.6,1.6),('C',88.2,2.5)],cut=3200)
# high sustained tension note in consolidation
music.addst(58.3,pad([nf('E5')],9.5,cut=3000,att=3.0,rel=2.0),gain=0.25)
# piano
def pn(note,at,vel=0.6,dur=2.6): music.add(at,piano(nf(note),dur,vel),pan=rng.uniform(-0.2,0.2),gain=1.0)
for n_,a_,v_ in (('A4',5.5,0.45),('E5',24.0,0.5),('C5',25.2,0.42)): pn(n_,a_,v_)
motif={'Am':['E5','C5','A4'],'F':['F5','C5','A4'],'C':['G5','E5','C5'],'G':['D5','B4','G4']}
for name,start in (('Am',28),('F',32.8),('C',37.6),('G',42.4),('Am',47.2),('F',52)):
    for i,nt in enumerate(motif[name]): pn(nt,start+[0,1.2,2.4][i],0.5-0.08*i)
pn('A4',72.0,0.4)
for nt,at,v in (('E5',77.2,0.55),('G5',78.4,0.5),('C6',79.6,0.5),('G5',82.0,0.45),('E5',84.0,0.42),('C5',86.6,0.45)): pn(nt,at,v)
for nt in ('C4','E4','G4','C5'): pn(nt,87.0,0.45,4.0)
# pulse (Karplus-Strong ostinato on chord roots)
roots=[('A2',10,21.2),('F2',21.2,28),('A2',28,32.8),('F2',32.8,37.6),('C3',37.6,42.4),('G2',42.4,47.2),('A2',47.2,52),('F2',52,58),('A2',58.3,62.8),('G2',62.8,67.6),('A2',67.6,70.5)]
for note,s0,s1 in roots:
    x=s0; k=0
    while x<s1:
        acc=1.0 if k%4==0 else (0.55 if k%2==0 else 0.3); g=0.22*acc*(0.6 if x<16 else 1.0)*(1.25 if 58<=x<68 else 1.0)*(max(0.1,1-(x-67.6)/3) if x>67.6 else 1)
        music.add(x,pluck(nf(note),0.6,0.35),gain=g); x+=BEAT/2; k+=1
# clock ticks on beats 28-58 (very soft)
x=28.0
while x<58: music.add(x,clock_tick(),pan=0.15,gain=0.07); x+=BEAT
# risers and impacts
music.add(17.6,riser(3.6),gain=0.35); music.add(21.2,impact(36,2.4,0.9,metal=True))
music.add(54.8,riser(3.4),gain=0.3); music.add(58.3,impact(34,2.4,0.8))
music.add(75.6,riser(1.4),gain=0.15); music.add(77.0,impact(32,3.0,0.7))
music.add(5.4,impact(40,1.0,0.25))
# ================= SFX =================
sfx.add(0.8,hp(drone(5.5,50),30),gain=0.12)
for i in range(16): sfx.add(1.1+i*0.28,glass_tick(4200+rng.integers(-300,300)),pan=rng.uniform(-0.3,0.3),gain=0.05)
sfx.add(5.4,solenoid(),gain=0.3)
sfx.add(7.0,hiss(0.35),gain=0.18); sfx.add(7.45,solenoid(),gain=0.35); sfx.add(10.0,bp(swish(0.7),1500,6000),gain=0.25); sfx.add(10.95,solenoid(),gain=0.4)
def steps(t0,t1,period=0.59,g=0.16):
    x=t0; k=0
    while x<t1: sfx.add(x,footstep(),pan=(-0.3 if k%2 else 0.3),gain=g*rng.uniform(0.8,1.1)); x+=period*rng.uniform(0.97,1.03); k+=1
steps(10.4,16.0); steps(25.0,28.0)
# vault open
vault.add(19.0,charge(1.9),gain=0.4)
for k,ts in enumerate((20.9,21.05,21.2)): vault.add(ts,bolt(),pan=(-0.45,0,0.45)[k],gain=0.7)
vault.add(21.2,hiss(1.4),gain=0.35); vault.add(21.3,servo(2.6,14,24),gain=0.45); vault.add(21.6,rattle(2.0,9),gain=0.25)
vault.add(23.8,impact(40,1.8,0.7,metal=True)); vault.add(23.8,modal(burst(4,(200,4000)),[(412,1.1,0.5),(1137,0.8,0.3),(1866,0.5,0.15)]),gain=0.25)
sfx.add(22.0,glass_tick(2600),gain=0.18); sfx.add(22.09,glass_tick(3300),gain=0.12)
sfx.add(24.0,lp(np.sin(2*np.pi*np.cumsum(220+600*(tt(0.4)/0.4)**2)/SR)*env(int(0.4*SR),0.05,0.2),1800),gain=0.08)
# selection beds per variant
if VAR in ('P','B'):
    sfx.add(28.2,trolley_bed(18.2),gain=0.32 if VAR=='P' else 0.22)
if VAR=='A':
    sfx.add(28.2,lp(pink(int(18.5*SR)),220,3)*env(int(18.5*SR),1.0,1.2)/3,gain=0.12)
    for i in range(12): sfx.add(28.6+i*1.5+rng.uniform(0,0.4),glass_tick(2400+rng.integers(-400,400)),pan=rng.uniform(-0.6,0.6),gain=0.05)
if VAR=='C':
    t_=tt(18.5); sfx.add(28.2,hp(pink(len(t_)),2600)*(0.6+0.4*np.sin(2*np.pi*0.23*t_))*env(len(t_),1.5,1.5),gain=0.05)
    sfx.add(28.2,lp(np.sin(2*np.pi*110*t_)+0.3*np.sin(2*np.pi*220.4*t_),300)*env(len(t_),2,2),gain=0.05)
for tb in (29.0,33.4,38.2,45.0): sfx.add(tb,glass_tick(3100),gain=0.09 if VAR!='C' else 0.0)
for i in range(17):
    tp=29.6+i*0.9; pn_=(-0.4 if i%2==0 else 0.4)
    if VAR=='P': sfx.add(tp-0.22,scan_sweep(),pan=pn_,gain=0.5); sfx.add(tp+0.62,placement(),pan=-0.2,gain=0.5)
    if VAR=='A': sfx.add(tp-0.2,scan_sweep(),pan=pn_*0.6,gain=0.35); sfx.add(tp+0.05,ui_click(1900,0.9),pan=pn_*0.6,gain=0.4); sfx.add(tp+0.6,swish(0.18),pan=-0.3,gain=0.25); sfx.add(tp+0.72,placement(),pan=-0.3,gain=0.3)
    if VAR=='B': sfx.add(tp-0.3,solenoid(),pan=pn_,gain=0.35); sfx.add(tp-0.25,lp(pink(int(0.5*SR)),500)*env(int(0.5*SR),0.05,0.25)/3,pan=pn_,gain=0.35); sfx.add(tp+0.65,placement(),pan=0.0,gain=0.45)
    if VAR=='C': sfx.add(tp-0.2,glass_tick(2600+i*40),pan=pn_,gain=0.3); sfx.add(tp+0.1,hp(pink(int(0.5*SR)),1800)*env(int(0.5*SR),0.2,0.25)/3,pan=pn_,gain=0.25); sfx.add(tp+0.7,glass_tick(1800),pan=0,gain=0.2)
sfx.add(45.2,modal(burst(3,(60,600)),[(105,0.08,0.7),(210,0.05,0.3)]),gain=0.45); sfx.add(45.28,modal(burst(3,(60,600)),[(105,0.08,0.7)]),gain=0.35)
# scanner gate: power-up, per-box shutter, hum, data ticks
sfx.add(45.6,servo(1.2,10,22),gain=0.2); sfx.add(46.4,solenoid(),gain=0.35)
for i in range(17):
    ts_=46.6+i*0.27; pn_=((i%4)-1.5)/3; sfx.add(ts_,ui_click(3200,0.9),pan=pn_,gain=0.42); sfx.add(ts_+0.035,ui_click(1200,0.8),pan=pn_,gain=0.36)
for tc in (47.2,50.2): sfx.add(tc,glass_tick(2600),gain=0.15)
hm=tt(8.0); sfx.add(50.0,lp(np.sin(2*np.pi*60*hm)+0.4*np.sin(2*np.pi*120*hm)+0.2*np.sin(2*np.pi*180*hm)*(1+0.2*np.sin(2*np.pi*0.7*hm)),500)*env(len(hm),0.8,1.0),gain=0.12)
for i in range(70): sfx.add(50.4+i*0.107+rng.uniform(-0.03,0.03),glass_tick(5000+rng.integers(-800,800)),pan=rng.uniform(-0.5,0.5),gain=0.045)
# consolidation
sfx.add(59.0,servo(2.4,10,18),gain=0.2)
for k in range(4): sfx.add(60.0+k*1.5,latch(),pan=(-0.15,0.15,-0.1,0.1)[k],gain=0.75)
x=65.0
while x<67.5: sfx.add(x,clock_tick(),gain=0.12); x+=1/12
sfx.add(67.5,solenoid(),gain=0.4)
# logout
sfx.add(68.2,swish(0.6),gain=0.25)
sfx.add(70.0,glass_tick(2600),gain=0.16); sfx.add(70.09,glass_tick(3300),gain=0.1)
sfx.add(72.0,ui_click(900,1.0),gain=0.7); sfx.add(72.4,swish(0.3),gain=0.3)
vault.add(73.0,hiss(1.2),gain=0.3); vault.add(73.0,servo(2.4,24,12),gain=0.45); vault.add(73.3,rattle(1.8,8),gain=0.22)
for k,ts in enumerate((75.2,75.35,75.5)): vault.add(ts,bolt(),pan=(0.45,0,-0.45)[k],gain=0.7)
vault.add(75.5,impact(40,1.8,0.7,metal=True))
sfx.add(75.0,glass_tick(2200),gain=0.15)
# report
sfx.add(76.2,riser(0.9),gain=0.1)
for i in range(30): sfx.add(81.0+i*0.083,clock_tick(),gain=0.09)
sfx.add(84.5,latch(),gain=0.6)
for i in range(3): sfx.add(86.0+i*0.9,glass_tick(2600+i*300),gain=0.16)
# ================= MIX =================
room=make_ir(0.55,5000,0.008); hall=make_ir(1.7,3200,0.02); plate=make_ir(1.3,6000,0.015,early=False)
sfx_st=reverb(sfx.st(),room,0.14)+reverb(vault.st(),hall,0.28)
mus_st=music.st(); mus_st=np.stack([hp(mus_st[:,0],32),hp(mus_st[:,1],32)],axis=1); mus_st=reverb(mus_st,plate,0.22); mus_st=compress(mus_st,-20,2.5,0.02,0.3,2)
key=block_env((sfx_st[:,0]+sfx_st[:,1])*0.5,att=0.012,rel=0.45); key=key/(np.percentile(key,99.5)+1e-9); duckg=1-0.4*np.minimum(1,key)
mus_st*=duckg[:,None]
mix=mus_st*0.9+sfx_st*1.0
fade=np.minimum(1,np.arange(N)/SR/1.2)*np.minimum(1,np.maximum(0,DUR-np.arange(N)/SR)/2.0); mix*=fade[:,None]
mix=np.tanh(mix*1.05); mix=mix/np.max(np.abs(mix))*0.9
with wave.open('cierre-mensual-mix-'+VAR+'.wav','wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype(np.int16).tobytes())
print('mix3 ok')
