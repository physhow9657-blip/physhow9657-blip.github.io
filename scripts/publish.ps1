# =============================================================================
#  publish.ps1 — 빌드 검증 + 커밋 + 푸시 (한 번에)
# -----------------------------------------------------------------------------
#  사용법 (PowerShell, 프로젝트 폴더에서):
#     .\scripts\publish.ps1
#     .\scripts\publish.ps1 -Message "글 발행: 중고차 보험 특약"
#     .\scripts\publish.ps1 -SkipBuild          # 빌드를 건너뜀 (권장하지 않음)
#     .\scripts\publish.ps1 -NoPush             # 커밋까지만
#
#  동작
#     1) npm run build  (실패하면 아무것도 하지 않고 종료)
#     2) 변경 파일 git add -A
#     3) 변경이 없으면 "올릴 것이 없습니다" 로 종료
#     4) commit (메시지 없으면 날짜로 자동 생성)
#     5) push (원격이 없으면 안내만 하고 종료)
# =============================================================================

[CmdletBinding()]
param(
  [string]$Message = "",
  [switch]$SkipBuild,
  [switch]$NoPush
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

try {
  [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
} catch { }

function Write-Step([string]$Text) {
  Write-Host ""
  Write-Host "==> $Text" -ForegroundColor Cyan
}

function Write-Ok([string]$Text) {
  Write-Host "  [OK] $Text" -ForegroundColor Green
}

function Fail([string]$Text) {
  Write-Host ""
  Write-Host "  [X] $Text" -ForegroundColor Red
  exit 1
}

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

# ------------------------------------------------------------ 0. 저장소 ----
if (-not (Test-Path (Join-Path $root '.git'))) {
  Write-Host ""
  Write-Host "  [i] 아직 Git 저장소가 아닙니다. 먼저 아래를 한 번 실행하세요:" -ForegroundColor Yellow
  Write-Host "      git init -b main" -ForegroundColor White
  Write-Host "      git add -A" -ForegroundColor White
  Write-Host "      git commit -m `"init`"" -ForegroundColor White
  Write-Host "      git remote add origin https://github.com/<아이디>/<저장소>.git" -ForegroundColor White
  Write-Host "      git push -u origin main" -ForegroundColor White
  Write-Host ""
  exit 1
}

# ---------------------------------------------------------------- 1. 빌드 ----
Write-Step "1/4  빌드 검증"
if ($SkipBuild) {
  Write-Host "  -SkipBuild: 빌드를 건너뜁니다." -ForegroundColor Yellow
} else {
  npm run build
  if ($LASTEXITCODE -ne 0) {
    Fail "빌드 실패 — push 하지 않았습니다. 오류를 고친 뒤 다시 실행하세요."
  }
  Write-Ok "빌드 성공"
}

# -------------------------------------------------------------- 2. 스테이지 ----
Write-Step "2/4  변경 파일 확인"
git add -A
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
  Write-Ok "변경된 파일이 없습니다. 올릴 것이 없습니다."
  exit 0
}

Write-Host "  변경 파일:" -ForegroundColor DarkGray
$status -split "`n" | Where-Object { $_.Trim() -ne '' } | ForEach-Object {
  Write-Host "    $($_.Trim())" -ForegroundColor DarkGray
}

# ---------------------------------------------------------------- 3. 커밋 ----
Write-Step "3/4  커밋"
if ([string]::IsNullOrWhiteSpace($Message)) {
  $Message = "발행: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
}
git commit -m $Message
if ($LASTEXITCODE -ne 0) { Fail "커밋 실패. 위 메시지를 확인하세요." }
$hash = (git rev-parse --short HEAD)
Write-Ok "커밋 완료 ($hash) — $Message"

# ----------------------------------------------------------------- 4. 푸시 ----
Write-Step "4/4  푸시"
$remotes = git remote
if ([string]::IsNullOrWhiteSpace($remotes)) {
  Write-Host "  [i] 원격 저장소가 없습니다. 커밋까지만 완료했습니다." -ForegroundColor Yellow
  Write-Host "      git remote add origin https://github.com/<아이디>/<저장소>.git" -ForegroundColor White
  Write-Host "      git push -u origin main" -ForegroundColor White
  exit 0
}

if ($NoPush) {
  Write-Host "  -NoPush: 푸시를 건너뜁니다." -ForegroundColor Yellow
  exit 0
}

$branch = (git rev-parse --abbrev-ref HEAD)
git push origin $branch
if ($LASTEXITCODE -ne 0) {
  Fail "푸시 실패. GitHub 인증(gh auth login 또는 자격 증명)을 확인하세요."
}
Write-Ok "푸시 완료 — 1~3분 뒤 사이트에 반영됩니다."
Write-Host ""
Write-Host "  배포 상태: GitHub → Actions 탭 / Cloudflare Pages → Deployments" -ForegroundColor DarkGray
Write-Host ""
