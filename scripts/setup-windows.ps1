# =============================================================================
#  setup-windows.ps1 — AutoCost Lab 최초 1회 환경 점검 + 설치 + 빌드 검증
# -----------------------------------------------------------------------------
#  사용법 (PowerShell, 프로젝트 폴더에서):
#     .\scripts\setup-windows.ps1
#     .\scripts\setup-windows.ps1 -SkipInstall    # 이미 npm install 을 한 경우
#
#  하는 일
#     1) Git 설치 확인
#     2) Node.js 버전 확인 (22 이상 필요)
#     3) npm install
#     4) npm run build 로 빌드 검증
#     5) 다음에 할 일 안내
# =============================================================================

[CmdletBinding()]
param(
  [switch]$SkipInstall
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

try {
  [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
  $OutputEncoding = [System.Text.Encoding]::UTF8
} catch {
  # 콘솔 인코딩을 바꿀 수 없는 환경(일부 터미널)은 무시
}

function Write-Step([string]$Text) {
  Write-Host ""
  Write-Host "==> $Text" -ForegroundColor Cyan
}

function Write-Ok([string]$Text) {
  Write-Host "  [OK] $Text" -ForegroundColor Green
}

function Write-Warn([string]$Text) {
  Write-Host "  [!]  $Text" -ForegroundColor Yellow
}

function Fail([string]$Text) {
  Write-Host ""
  Write-Host "  [X] $Text" -ForegroundColor Red
  exit 1
}

# 프로젝트 루트 = 이 스크립트의 부모 폴더
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host ""
Write-Host "  AutoCost Lab — Windows 초기 설정" -ForegroundColor White
Write-Host "  폴더: $root" -ForegroundColor DarkGray

# ---------------------------------------------------------------- 1. Git ----
Write-Step "1/5  Git 확인"
$git = Get-Command git -ErrorAction SilentlyContinue
if (-not $git) {
  Write-Warn "Git 이 설치되어 있지 않습니다."
  Write-Host "      아래 명령으로 설치한 뒤 PowerShell 을 새로 열고 다시 실행하세요:" -ForegroundColor Yellow
  Write-Host "      winget install --id Git.Git -e" -ForegroundColor White
  Fail "Git 설치 후 재실행이 필요합니다."
}
$gitVersion = (git --version)
Write-Ok $gitVersion

# --------------------------------------------------------------- 2. Node ----
Write-Step "2/5  Node.js 확인 (22 이상 필요)"
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
  Write-Warn "Node.js 가 설치되어 있지 않습니다."
  Write-Host "      winget install --id OpenJS.NodeJS.LTS -e" -ForegroundColor White
  Fail "Node.js 설치 후 PowerShell 을 새로 열고 다시 실행하세요."
}

$nodeVersion = (node -v).TrimStart('v')
$nodeMajor = [int]($nodeVersion.Split('.')[0])
$nodeMinor = [int]($nodeVersion.Split('.')[1])

if ($nodeMajor -lt 22) {
  Write-Warn "Node.js $nodeVersion 은 너무 오래되었습니다. 22 이상이 필요합니다."
  Write-Host "      winget upgrade --id OpenJS.NodeJS.LTS -e" -ForegroundColor White
  Fail "Node.js 업그레이드 후 다시 실행하세요."
}
Write-Ok "Node.js $nodeVersion"

$npm = Get-Command npm -ErrorAction SilentlyContinue
if (-not $npm) { Fail "npm 을 찾을 수 없습니다. Node.js 를 다시 설치하세요." }
Write-Ok "npm $(npm -v)"

# ------------------------------------------------------------ 3. install ----
Write-Step "3/5  패키지 설치"
if ($SkipInstall) {
  Write-Warn "-SkipInstall 옵션: npm install 을 건너뜁니다."
} else {
  if (Test-Path (Join-Path $root 'node_modules')) {
    Write-Host "  node_modules 가 이미 있습니다. 최신 상태로 맞춥니다..." -ForegroundColor DarkGray
  }
  npm install
  if ($LASTEXITCODE -ne 0) { Fail "npm install 실패. 네트워크·프록시 설정을 확인하세요." }
  Write-Ok "패키지 설치 완료"
}

# -------------------------------------------------------------- 4. build ----
Write-Step "4/5  빌드 검증 (npm run build)"
npm run build
if ($LASTEXITCODE -ne 0) {
  Fail "빌드 실패. 위 오류 메시지를 Claude Code 에 붙여넣으면 원인을 잡아 줍니다."
}
Write-Ok "빌드 성공 — dist\ 폴더가 생성되었습니다."

# --------------------------------------------------------------- 5. test ----
Write-Step "5/5  계산기 엔진 테스트 (npm test)"
npm test
if ($LASTEXITCODE -ne 0) {
  Write-Warn "계산 엔진 테스트 실패 — src\lib\car-tax.ts 의 RULES 값을 확인하세요."
} else {
  Write-Ok "계산 엔진 테스트 통과"
}

# ------------------------------------------------------------- 안내 문구 ----
Write-Host ""
Write-Host "  준비 완료. 다음 순서로 진행하세요." -ForegroundColor White
Write-Host ""
Write-Host "  1) 로컬 미리보기" -ForegroundColor Cyan
Write-Host "     npm run dev        →  http://localhost:4321" -ForegroundColor Gray
Write-Host ""
Write-Host "  2) 내 정보로 바꾸기 (src\config.ts)" -ForegroundColor Cyan
Write-Host "     - url / contact.email / instagram.handle" -ForegroundColor Gray
Write-Host "     - author.name, author.bio" -ForegroundColor Gray
Write-Host ""
Write-Host "  3) GitHub 연결 후 발행" -ForegroundColor Cyan
Write-Host "     git init; git add -A; git commit -m 'init'" -ForegroundColor Gray
Write-Host "     git remote add origin https://github.com/<아이디>/<저장소>.git" -ForegroundColor Gray
Write-Host "     git push -u origin main" -ForegroundColor Gray
Write-Host "     이후부터는: .\scripts\publish.ps1 -Message '글 발행: 제목'" -ForegroundColor Gray
Write-Host ""
Write-Host "  수익화 스위치는 src\config.ts 의 adsense.enabled / showAffiliates 입니다." -ForegroundColor DarkGray
Write-Host "  자세한 전략은 docs\claude-code-start-prompt.md 를 참고하세요." -ForegroundColor DarkGray
Write-Host ""
