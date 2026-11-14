#!/usr/bin/env python3
"""렌트 릴스(만화풍 SVG 캐릭터) 빌드: 음성 길이를 읽어 장면 3개 + 오디오 믹스를 생성한다.
rep1.mp3 / rep2.mp3 가 없으면 추정 길이(3.4s / 4.2s)로 만들고 오디오 요소는 생략한다."""
import os, subprocess, json
os.chdir(os.path.dirname(os.path.abspath(__file__)))
V = 'assets/voice/'


def dur(name, est):
    p = V + name
    if os.path.exists(p):
        return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p]).decode())
    return est


H, C, E = dur('hook.mp3', 9.12), dur('cust.mp3', 2.27), dur('end.mp3', 12.98)
R1, R2 = dur('rep1.mp3', 3.4), dur('rep2.mp3', 4.2)
HAS1, HAS2 = os.path.exists(V + 'rep1.mp3'), os.path.exists(V + 'rep2.mp3')

D1 = H + 0.6
r1 = 0.4
cu = r1 + R1 + 0.35
r2 = cu + C + 0.35
D2 = r2 + R2 + 0.4
S2 = D1
S3 = S2 + D2
D3 = E + 0.9
TOTAL = round(S3 + D3, 2)

INK, SKIN = '#1B1B3A', '#FFD3A8'


def char(p, shirt, hair, kind):
    """만화풍 캐릭터 SVG(400x600). p = id 접두어. kind: 'rep' 영업사원 | 'cus' 손님"""
    tie = f'<path d="M200 345 L182 400 L200 480 L218 400Z" fill="#FF4D4D" stroke="{INK}" stroke-width="6" stroke-linejoin="round"/>' if kind == 'rep' else ''
    collar = f'<path d="M150 335 L200 400 L250 335Z" fill="#fff" stroke="{INK}" stroke-width="6" stroke-linejoin="round"/>' if kind == 'rep' else f'<path d="M150 335 Q200 380 250 335" fill="none" stroke="{INK}" stroke-width="6"/>'
    hairp = (f'<path d="M88 200 Q92 82 200 80 Q308 82 312 200 Q262 140 200 150 Q138 140 88 200Z" fill="{hair}" stroke="{INK}" stroke-width="7" stroke-linejoin="round"/>' if kind == 'rep' else
             f'<path d="M88 205 Q80 90 170 78 L190 40 L214 80 L250 52 L262 90 Q322 110 312 205 Q262 135 200 148 Q138 135 88 205Z" fill="{hair}" stroke="{INK}" stroke-width="7" stroke-linejoin="round"/>')
    extra = (f'<g id="{p}-wal"><rect x="255" y="470" width="110" height="78" rx="14" fill="#8A5A2B" stroke="{INK}" stroke-width="7"/><rect x="255" y="488" width="110" height="14" fill="#6B431F"/></g><circle cx="262" cy="520" r="30" fill="{SKIN}" stroke="{INK}" stroke-width="7"/>' if kind == 'cus' else
             f'<circle cx="48" cy="470" r="30" fill="{SKIN}" stroke="{INK}" stroke-width="7"/><circle cx="352" cy="470" r="30" fill="{SKIN}" stroke="{INK}" stroke-width="7"/>')
    arms = f'<path d="M95 360 Q40 420 48 470" fill="none" stroke="{INK}" stroke-width="64" stroke-linecap="round"/><path d="M95 360 Q40 420 48 470" fill="none" stroke="{shirt}" stroke-width="50" stroke-linecap="round"/><path d="M305 360 Q360 420 352 470" fill="none" stroke="{INK}" stroke-width="64" stroke-linecap="round"/><path d="M305 360 Q360 420 352 470" fill="none" stroke="{shirt}" stroke-width="50" stroke-linecap="round"/>' if kind == 'rep' else \
        f'<path d="M95 360 Q60 440 90 520" fill="none" stroke="{INK}" stroke-width="64" stroke-linecap="round"/><path d="M95 360 Q60 440 90 520" fill="none" stroke="{shirt}" stroke-width="50" stroke-linecap="round"/><path d="M305 360 Q330 440 262 520" fill="none" stroke="{INK}" stroke-width="64" stroke-linecap="round"/><path d="M305 360 Q330 440 262 520" fill="none" stroke="{shirt}" stroke-width="50" stroke-linecap="round"/>'
    star = lambda cx, cy, i: f'<path id="{p}-st{i}" d="M{cx} {cy-26} L{cx+8} {cy-8} L{cx+26} {cy} L{cx+8} {cy+8} L{cx} {cy+26} L{cx-8} {cy+8} L{cx-26} {cy} L{cx-8} {cy-8}Z" fill="#FFD400" stroke="{INK}" stroke-width="4" opacity="0" style="transform-box:fill-box;transform-origin:center"/>'
    return f'''<svg viewBox="-20 0 440 600" xmlns="http://www.w3.org/2000/svg">
<path d="M70 600 L70 400 Q70 335 140 330 L260 330 Q330 335 330 400 L330 600Z" fill="{shirt}" stroke="{INK}" stroke-width="8" stroke-linejoin="round"/>
{arms}{collar}{tie}
<rect x="170" y="300" width="60" height="45" fill="{SKIN}" stroke="{INK}" stroke-width="7"/>
<circle cx="88" cy="218" r="24" fill="{SKIN}" stroke="{INK}" stroke-width="7"/><circle cx="312" cy="218" r="24" fill="{SKIN}" stroke="{INK}" stroke-width="7"/>
<circle cx="200" cy="205" r="115" fill="{SKIN}" stroke="{INK}" stroke-width="8"/>
{hairp}
<ellipse cx="150" cy="215" rx="28" ry="33" fill="#fff" stroke="{INK}" stroke-width="6"/><ellipse cx="250" cy="215" rx="28" ry="33" fill="#fff" stroke="{INK}" stroke-width="6"/>
<circle id="{p}-pl" cx="152" cy="219" r="13" fill="{INK}" style="transform-box:fill-box;transform-origin:center"/><circle id="{p}-pr" cx="248" cy="219" r="13" fill="{INK}" style="transform-box:fill-box;transform-origin:center"/>
{star(150, 215, 1)}{star(250, 215, 2)}
<path d="M118 172 Q150 152 182 172" fill="none" stroke="{INK}" stroke-width="8" stroke-linecap="round"/><path d="M218 172 Q250 152 282 172" fill="none" stroke="{INK}" stroke-width="8" stroke-linecap="round"/>
<ellipse cx="116" cy="268" rx="20" ry="12" fill="#FF9A9A" opacity=".7"/><ellipse cx="284" cy="268" rx="20" ry="12" fill="#FF9A9A" opacity=".7"/>
<g id="{p}-m" style="transform-box:fill-box;transform-origin:50% 30%"><path d="M158 276 Q200 332 242 276 Q200 290 158 276Z" fill="#6B1A2A" stroke="{INK}" stroke-width="6" stroke-linejoin="round"/></g>
<path id="{p}-sw" d="M300 130 Q318 160 300 175 Q282 160 300 130Z" fill="#7FD6FF" stroke="{INK}" stroke-width="5" opacity="0" style="transform-box:fill-box;transform-origin:center"/>
{extra}
</svg>'''


CSS = f"""@font-face{{font-family:'ASD';src:local('Apple SD Gothic Neo');font-weight:100 900}}
#root{{position:absolute;inset:0;background:#FFF0C2;font-family:'ASD',sans-serif;color:{INK};overflow:hidden}}
.t{{position:absolute;left:140px;right:200px;font-weight:900;letter-spacing:-3px;line-height:1.15}}
.y{{display:inline-block;background:#FFD400;border-radius:18px;padding:4px 26px;border:6px solid {INK}}}
.r{{display:inline-block;background:#FF4D4D;color:#fff;border-radius:18px;padding:4px 26px;border:6px solid {INK}}}
.cv{{position:absolute}}
.bub{{position:absolute;background:#fff;border:8px solid {INK};border-radius:44px;padding:30px 40px;font-size:54px;font-weight:900;letter-spacing:-2px;line-height:1.3;width:500px}}
.floor{{position:absolute;left:0;right:0;bottom:0;height:420px;background:#F2C879;border-top:8px solid {INK}}}
.note{{position:absolute;font-size:34px;font-weight:800;color:#C7332B}}
"""


def talk(sel, start, d, step=0.13):
    out, t, hi = '', start, True
    while t < start + d:
        out += f"tl.to('{sel}',{{scaleY:{1.0 if hi else 0.35},duration:{step * 0.9:.3f},ease:'none'}},{t:.3f});"
        hi = not hi
        t += step
    return out + f"tl.to('{sel}',{{scaleY:1,duration:0.1}},{start + d:.3f});"


def write(name, html):
    open(f'compositions/{name}.html', 'w').write(html)


# ---------------- n1: 훅 ----------------
coins = ''.join(f'<g class="coin" id="n1-c{i}" data-layout-allow-overlap><circle r="36" fill="#FFD400" stroke="{INK}" stroke-width="7"/><text y="14" text-anchor="middle" font-size="40" font-weight="900" fill="{INK}">₩</text></g>' for i in range(8))
coin_js = ''
for i in range(8):
    t0 = 0.45 * H + i * (0.33 * H / 8)
    coin_js += f"tl.fromTo('#n1-c{i}',{{x:{500 + (i % 3) * 20},y:1270,opacity:1,rotation:0}},{{x:{900 + (i * 53) % 260},y:{360 + (i * 71) % 260},rotation:{360 + i * 40},opacity:0,duration:1.1,ease:'power1.out'}},{t0:.2f});tl.set('#n1-c{i}',{{opacity:0}},0);"
# opacity 0 초기화는 위 set(…,0) 보다 fromTo 가 나중이라 문제없다(마지막에 등록한 값이 우선)
n1 = f"""<template>
<style>{CSS}</style>
<div id="root" data-composition-id="n1" data-width="1080" data-height="1920">
<div class="floor" style="height:520px"></div>
<div class="t" style="top:250px;font-size:104px">월 90만원 렌트</div>
<div class="t" id="n1-q" style="top:400px;font-size:104px"><span class="y">싸다고요?</span></div>
<div class="t" id="n1-sum" style="top:600px;font-size:84px;white-space:nowrap">3년 <span class="r" id="n1-n">+0만원</span></div>
<div class="cv" id="n1-ch" style="left:260px;top:790px;width:560px;height:840px">{char('n1', '#6FB7FF', '#3B2A20', 'cus')}</div>
<div class="t" id="n1-st" style="top:1010px;left:640px;right:60px;font-size:120px;color:#FF4D4D;transform:rotate(-8deg);-webkit-text-stroke:5px {INK};paint-order:stroke fill;white-space:nowrap">기부?</div>
{coins}
</div>
<script>
const tl=gsap.timeline({{paused:true}});
tl.from('#n1-q',{{scale:0.5,opacity:0,duration:0.4,ease:'back.out(2)',transformOrigin:'0 50%'}},0.9);
tl.from('#n1-sum',{{y:40,opacity:0,duration:0.4}},{0.40 * H:.2f});
tl.from('#n1-ch',{{y:60,opacity:0,duration:0.4,ease:'power3.out'}},0.05);
tl.fromTo('#n1-ch',{{rotation:-2,transformOrigin:'50% 100%'}},{{rotation:2,duration:0.45,yoyo:true,repeat:{int(H / 0.45)},ease:'sine.inOut'}},0.4);
const o={{n:0}};
tl.to(o,{{n:210,duration:{0.38 * H:.2f},ease:'power1.in',onUpdate:()=>{{document.getElementById('n1-n').textContent='+'+Math.round(o.n)+'만원'}}}},{0.42 * H:.2f});
{coin_js}
tl.to('#n1-pl,#n1-pr',{{scale:1.5,duration:0.15}},{0.80 * H:.2f});
tl.to('#n1-m',{{scaleY:2.2,scaleX:0.6,duration:0.15}},{0.80 * H:.2f});
tl.to('#n1-sw',{{opacity:1,y:30,duration:0.5}},{0.80 * H:.2f});
tl.from('#n1-st',{{scale:2.6,opacity:0,duration:0.3,ease:'power4.out',transformOrigin:'50% 50%'}},{H - 1.7:.2f});
window.__timelines["n1"]=tl;
</script>
</template>"""
write('n1', n1)

# ---------------- n2: 대화 ----------------
car = f'''<svg viewBox="0 0 700 260" style="position:absolute;left:190px;top:1180px;width:700px;height:260px"><path d="M30 190 L30 140 Q40 110 110 100 L200 40 Q230 20 300 20 L440 20 Q500 25 540 100 L640 115 Q680 130 680 190Z" fill="#FF6B6B" stroke="{INK}" stroke-width="9" stroke-linejoin="round"/><path d="M215 55 L300 38 L430 38 L500 100 L190 100Z" fill="#CFEFFF" stroke="{INK}" stroke-width="7" stroke-linejoin="round"/><circle cx="150" cy="195" r="48" fill="{INK}"/><circle cx="150" cy="195" r="20" fill="#ccc"/><circle cx="550" cy="195" r="48" fill="{INK}"/><circle cx="550" cy="195" r="20" fill="#ccc"/></svg>'''
sp = lambda s: ''.join(f'.' for _ in s)
n2 = f"""<template>
<style>{CSS}</style>
<div id="root" data-composition-id="n2" data-width="1080" data-height="1920">
<div class="floor" style="height:560px"></div>
<div class="t" style="top:240px;font-size:56px;letter-spacing:-1px;color:#C7332B;white-space:nowrap" id="n2-top">자동차 렌트 상담소</div>
<div class="bub" id="n2-b1" style="left:140px;top:340px">고객님! 보험! 세금! 다 포함인데 월 90만원이에요!</div>
<div class="note" id="n2-n1" style="left:150px;top:690px">(눈빛 반짝)</div>
<div class="bub" id="n2-b2" style="left:380px;top:340px;width:500px">와, 다 포함이면 싸네요?</div>
<div class="bub" id="n2-b3" style="left:140px;top:340px">그럼요! 저희 진짜 남는 게 없어요! 오늘 바로 계약하시죠!</div>
<div class="note" id="n2-n3" style="left:150px;top:690px">(손 부여잡음)</div>
<div class="cv" id="n2-rep" style="left:20px;top:790px;width:480px;height:720px">{char('rp', '#2F6B5F', '#1B1B3A', 'rep')}</div>
<div class="cv" id="n2-cus" style="left:580px;top:790px;width:480px;height:720px">{char('cu', '#6FB7FF', '#3B2A20', 'cus')}</div>
<div class="t" id="n2-sum" style="left:140px;top:1540px;font-size:44px;white-space:nowrap;letter-spacing:-1px">3년 더 내는 돈 <span class="r" id="n2-n">+0만원</span></div>
</div>
<script>
const tl=gsap.timeline({{paused:true}});
const pop=(s,t,o='50% 100%')=>tl.from(s,{{scale:0.6,opacity:0,duration:0.3,ease:'back.out(2)',transformOrigin:o}},t);
const hide=(s,t)=>tl.to(s,{{opacity:0,duration:0.15}},t);
tl.set('#n2-b2,#n2-b3,#n2-n3',{{opacity:0}},0);
tl.from('#n2-rep',{{x:-80,opacity:0,duration:0.4,ease:'power3.out'}},0);
tl.from('#n2-cus',{{x:80,opacity:0,duration:0.4,ease:'power3.out'}},0.1);
pop('#n2-b1',{r1:.2f});pop('#n2-n1',{r1 + 0.2:.2f});
tl.to('#rp-st1,#rp-st2',{{opacity:1,scale:1.3,duration:0.2,yoyo:true,repeat:5}},{r1 + 0.1:.2f});
{talk('#rp-m', r1, R1)}
hide('#n2-b1',{cu - 0.1:.2f});hide('#n2-n1',{cu - 0.1:.2f});
tl.set('#rp-st1,#rp-st2',{{opacity:0}},{cu:.2f});
tl.to('#n2-b2',{{opacity:1,duration:0.01}},{cu:.2f});pop('#n2-b2',{cu:.2f});
{talk('#cu-m', cu, C)}
hide('#n2-b2',{r2 - 0.1:.2f});
tl.to('#n2-b3,#n2-n3',{{opacity:1,duration:0.01}},{r2:.2f});pop('#n2-b3',{r2:.2f});pop('#n2-n3',{r2 + 0.3:.2f});
{talk('#rp-m', r2, R2)}
tl.to('#cu-pl,#cu-pr',{{scale:0.6,duration:0.2}},{r2 + 1.6:.2f});
tl.from('#n2-sum',{{y:40,opacity:0,duration:0.4}},{cu:.2f});
const o={{n:0}};
tl.to(o,{{n:210,duration:{R2 + C:.2f},ease:'power1.in',onUpdate:()=>{{document.getElementById('n2-n').textContent='+'+Math.round(o.n)+'만원'}}}},{cu:.2f});
window.__timelines["n2"]=tl;
</script>
</template>"""
write('n2', n2)

# ---------------- n3: 결말 ----------------
n3 = f"""<template>
<style>{CSS}
.lab{{position:absolute;left:140px;font-size:44px;font-weight:800;letter-spacing:-1px}}
.val{{position:absolute;right:200px;font-size:52px;font-weight:900}}
.bar{{position:absolute;left:140px;height:86px;border-radius:18px;border:7px solid {INK};transform-origin:0 50%}}
</style>
<div id="root" data-composition-id="n3" data-width="1080" data-height="1920">
<div class="floor" style="height:300px"></div>
<div id="n3-a">
<div class="t" style="top:250px;font-size:92px">남는 게 없는 건</div>
<div class="t" style="top:400px;font-size:92px"><span class="y">내 통장</span> 이었다</div>
<div class="cv" style="left:290px;top:780px;width:500px;height:750px">{char('n3', '#6FB7FF', '#3B2A20', 'cus')}</div>
</div>
<div id="n3-b">
<div class="t" style="top:250px;font-size:70px">4,000만원 차 · 3년</div>
<div class="lab" style="top:420px">렌트 견적(가정)</div><div class="val" style="top:410px;color:#C7332B">월 90만원</div>
<div class="bar" id="n3-b0" style="top:490px;width:740px;background:#FF4D4D"></div>
<div class="lab" style="top:640px">할부 실질비용(가정)</div><div class="val" style="top:630px;color:#17806C">월 84만원</div>
<div class="bar" id="n3-b1" style="top:710px;width:690px;background:#7FD6B0"></div>
<div class="t" id="n3-d" style="top:880px;font-size:60px;letter-spacing:-2px;white-space:nowrap">월 6만원 × 36개월 = <span class="r">약 210만원</span></div>
<div class="t" id="n3-c1" style="top:1090px;font-size:58px">견적이 월 84만원보다<br>낮은지부터 보세요</div>
<div class="t" id="n3-c2" style="top:1330px;font-size:44px;color:#17806C;letter-spacing:-1px">보증금 · 주행거리 한도도 같이 확인!</div>
<div class="t" style="top:1430px;font-size:28px;font-weight:700;color:#5A5A7A;letter-spacing:-1px;white-space:nowrap">가정: 연 6.5% · 잔존가치 55% · 보험·세금·정비 포함 기준</div>
</div>
</div>
<script>
const tl=gsap.timeline({{paused:true}});
tl.from('#n3-a',{{y:40,opacity:0,duration:0.4,ease:'power3.out'}},0.35);
tl.to('#n3-a',{{opacity:0,duration:0.2}},{4.0:.2f});
tl.set('#n3-b',{{opacity:0}},0);
tl.to('#n3-b',{{opacity:1,duration:0.2}},{4.1:.2f});
tl.fromTo('#n3-b0',{{scaleX:0}},{{scaleX:1,duration:0.6,ease:'power3.out'}},{4.9:.2f});
tl.fromTo('#n3-b1',{{scaleX:0}},{{scaleX:1,duration:0.6,ease:'power3.out'}},{5.8:.2f});
tl.from('#n3-d',{{scale:1.6,opacity:0,duration:0.35,ease:'power4.out',transformOrigin:'0 50%'}},{7.0:.2f});
tl.from('#n3-c1',{{y:30,opacity:0,duration:0.4}},{E * 0.62 + 0.4:.2f});
tl.from('#n3-c2',{{y:30,opacity:0,duration:0.4}},{E * 0.86 + 0.4:.2f});
tl.to('#n3-m',{{scaleY:1.8,scaleX:0.7,duration:0.2}},0.5);
tl.to('#n3-pl,#n3-pr',{{scale:0.6,duration:0.2}},0.5);
window.__timelines["n3"]=tl;
</script>
</template>"""
write('n3', n3)

# ---------------- index.html ----------------
aud = ''
tr = 2


def au(i, start, d, src):
    global aud, tr
    aud += f'<audio id="{i}" data-start="{start:.2f}" data-duration="{d:.2f}" data-track-index="{tr}" src="{src}"></audio>\n'
    tr += 1


au('a1', 0.2, H, 'assets/voice/hook.mp3')
if HAS1: au('a2', S2 + r1, R1, 'assets/voice/rep1.mp3')
au('a3', S2 + cu, C, 'assets/voice/cust.mp3')
if HAS2: au('a4', S2 + r2, R2, 'assets/voice/rep2.mp3')
au('a5', S3 + 0.4, E, 'assets/voice/end.mp3')
au('mix', 0, TOTAL, 'assets/mix.mp3')

index = f"""<!doctype html>
<html lang="ko"><head><meta charset="UTF-8"/><meta name="viewport" content="width=1080, height=1920"/>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
<style>*{{margin:0;padding:0;box-sizing:border-box}}html,body{{margin:0;width:1080px;height:1920px;overflow:hidden;background:#FFF0C2}}</style></head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="{TOTAL}" data-width="1080" data-height="1920">
<div id="n1" class="clip" data-composition-id="n1" data-composition-src="compositions/n1.html" data-start="0" data-duration="{D1:.2f}" data-track-index="1" data-track-kind="graphics" data-width="1080" data-height="1920"></div>
<div id="n2" class="clip" data-composition-id="n2" data-composition-src="compositions/n2.html" data-start="{S2:.2f}" data-duration="{D2:.2f}" data-track-index="1" data-track-kind="graphics" data-width="1080" data-height="1920"></div>
<div id="n3" class="clip" data-composition-id="n3" data-composition-src="compositions/n3.html" data-start="{S3:.2f}" data-duration="{D3:.2f}" data-track-index="1" data-track-kind="graphics" data-width="1080" data-height="1920"></div>
{aud}</div>
<script>const tl=gsap.timeline({{paused:true}});window.__timelines["main"]=tl;tl.seek(0);</script>
</body></html>"""
open('index.html', 'w').write(index)

# ---------------- 음악 + 효과음 믹스 ----------------
SFX = os.path.expanduser('~/.claude/skills/media-use/audio/assets/sfx/')
cues = [  # (파일, 절대시각, 볼륨)
    ('whoosh-short', S2 - 0.1, .5), ('whoosh-short', S3 - 0.1, .5),
    ('pop', 0.9, .6), ('pop', S2 + r1, .5), ('pop', S2 + cu, .5), ('pop', S2 + r2, .5),
    ('sparkle', S2 + r1 + 0.1, .6), ('error', S2 + r2 + 1.5, .5),
    ('impact-bass-1', H - 1.7, .8), ('impact-bass-1', S3 + 7.0, .7), ('ping', S3 + E * 0.62 + 0.4, .4),
] + [('click', 0.45 * H + i * (0.33 * H / 8) + 0.2, .35) for i in range(8)]
for f in {c[0] for c in cues}:
    subprocess.run(['cp', SFX + f + '.mp3', f'assets/{f}.mp3'], check=True)
subprocess.run(['python3', os.environ['MKBGM'], 'assets/bgm.wav', str(TOTAL)], check=True)
ins = ['-i', 'assets/bgm.wav'] + sum([['-i', f'assets/{c[0]}.mp3'] for c in cues], [])
fc = ''.join(f'[{i + 1}]adelay={int(c[1] * 1000)}|{int(c[1] * 1000)},volume={c[2]}[s{i}];' for i, c in enumerate(cues))
fc += '[0]volume=.2[m];[m]' + ''.join(f'[s{i}]' for i in range(len(cues))) + f'amix=inputs={len(cues) + 1}:normalize=0:duration=first,alimiter=limit=0.9'
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y'] + ins + ['-filter_complex', fc, '-b:a', '192k', '-t', str(TOTAL), 'assets/mix.mp3'], check=True)
os.remove('assets/bgm.wav')
print(json.dumps(dict(H=H, C=C, E=E, R1=R1, R2=R2, S2=round(S2, 2), S3=round(S3, 2), TOTAL=TOTAL, HAS1=HAS1, HAS2=HAS2)))
