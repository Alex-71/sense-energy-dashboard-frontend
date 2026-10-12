# Ad-hoc temp music bed for "Mision: Cierre Mensual" - 90 s, A minor to C major, 100 bpm, cinematic synth.
import numpy as np, wave
SR=44100; BPM=100; beat=60/BPM; DUR=90.0
t=np.arange(int(SR*DUR))/SR
A=110.0
def freq(semi): return A*2**(semi/12)
def saw(f,tt): return 2*(tt*f-np.floor(0.5+tt*f))
def pad(f,tt,env):
    s=sum(saw(f*2**(d/1200),tt) for d in (-0.4,0,0.4))/3
    return np.convolve(s,np.ones(48)/48,mode='same')*env
prog=[[0,3,7,12],[-4,0,3,8],[-9,-5,0,3],[-2,2,5,10]]
resolve=[[-9,-5,0,3],[-2,2,5,10],[0,3,7,14],[-9,-5,0,7]]
mix=np.zeros_like(t); bar=8*beat; nb=int(np.ceil(DUR/bar)); rng=np.random.default_rng(7)
def chord_at(b): return prog[b%4] if b*bar<74 else resolve[b%4]
for b in range(nb):
    ch=chord_at(b); s0=int(b*bar*SR); s1=min(len(t),int((b+1)*bar*SR)+int(0.4*SR)); tt=t[s0:s1]-t[s0]
    env=np.minimum(1,tt/0.8)*np.minimum(1,np.maximum(0,(s1-s0)/SR-tt)/0.6)
    mix[s0:s1]+=sum(pad(freq(n)*2,tt,env) for n in ch)*0.12
    for k in range(8):
        q0=int((b*bar+k*beat)*SR)
        if q0>=len(t): continue
        q1=min(len(t),q0+int(beat*SR)); tq=t[q0:q1]-t[q0]
        mix[q0:q1]+=np.sin(2*np.pi*freq(ch[0])/2*tq)*np.exp(-tq*4)*0.18
    for k in range(16):
        tm=b*bar+k*beat/2
        if tm<16 or tm>76: continue
        amp=0.06 if tm<28 else (0.1 if tm<58 else 0.05)
        q0=int(tm*SR)
        if q0>=len(t): continue
        q1=min(len(t),q0+int(0.22*SR)); tq=t[q0:q1]-t[q0]
        mix[q0:q1]+=np.sin(2*np.pi*freq(ch[k%4]+12)*2*tq)*np.exp(-tq*14)*amp
for cue in (16,28,58,76):
    s0=int((cue-3)*SR); s1=int(cue*SR); tt=t[s0:s1]-t[s0]
    mix[s0:s1]+=(rng.normal(0,1,s1-s0)*0.03+np.sin(2*np.pi*(200+600*(tt/3)**2)*tt)*0.04)*(tt/3)**2
for cue in (6,16,28,58,68,76):
    s0=int(cue*SR); s1=min(len(t),s0+int(1.2*SR)); tt=t[s0:s1]-t[s0]
    mix[s0:s1]+=np.sin(2*np.pi*55*tt)*np.exp(-tt*5)*0.35+rng.normal(0,1,s1-s0)*np.exp(-tt*30)*0.08
fade=np.minimum(1,t/1.5)*np.minimum(1,np.maximum(0,DUR-t)/4)
mix=np.tanh(mix*1.6)*fade; mix=mix/np.max(np.abs(mix))*0.89
stereo=np.stack([mix*0.98+np.roll(mix,120)*0.02, mix*0.98+np.roll(mix,-120)*0.02],axis=1)
with wave.open('mision-cierre-mensual-temp.wav','wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((stereo*32767).astype(np.int16).tobytes())
print('wav ok')
