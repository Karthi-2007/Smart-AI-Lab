# =========================================================================
# SmartLab KCE Assets Downloader
# This script downloads KCE website logos and images locally for offline use.
# =========================================================================

# Ensure TLS 1.2 is enabled
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$dir = Join-Path $PSScriptRoot "frontend\public\images\kce"
if (!(Test-Path $dir)) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
    Write-Host "Created local asset directory: $dir" -ForegroundColor Green
}

$assets = @{
    "KCE-logo-color.png" = "https://kce.ac.in/images/kce/logo/KCE-logo-color.png"
    "b1.jpg"             = "https://kce.ac.in/images/kce/home/banner/b1.jpg"
    "about-us1.webp"     = "https://kce.ac.in/images/kce/home/about-us1.webp"
    "banner-img2.webp"   = "https://kce.ac.in/images/kce/home/banner/banner-img2.webp"
    "banner-img3.webp"   = "https://kce.ac.in/images/kce/home/banner/banner-img3.webp"
    "banner-img5.webp"   = "https://kce.ac.in/images/kce/home/banner/banner-img5.webp"
}

Write-Host "Downloading Karpagam College of Engineering images locally..." -ForegroundColor Cyan

foreach ($item in $assets.GetEnumerator()) {
    $outFile = Join-Path $dir $item.Name
    Write-Host "Downloading $($item.Name) -> $outFile" -ForegroundColor Gray
    try {
        Invoke-WebRequest -Uri $item.Value -OutFile $outFile -ErrorAction Stop
        Write-Host "Success: $($item.Name) ($((Get-Item $outFile).Length) bytes)" -ForegroundColor Green
    } catch {
        Write-Host "Failed to download $($item.Name): $_" -ForegroundColor Red
    }
}

Write-Host "`nAll KCE assets have been successfully setup locally!" -ForegroundColor Green
