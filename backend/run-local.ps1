param(
    [string]$EnvFile = ".env.local"
)

$ErrorActionPreference = "Stop"
$basePath = Split-Path -Parent $MyInvocation.MyCommand.Path
$envPath = Join-Path $basePath $EnvFile

if (-not (Test-Path -LiteralPath $envPath)) {
    Write-Host "No existe $EnvFile. Creando uno desde .env.example..." -ForegroundColor Yellow
    Copy-Item -LiteralPath (Join-Path $basePath ".env.example") -Destination $envPath
    Write-Host "Edita backend\$EnvFile con tus claves reales y vuelve a ejecutar este script." -ForegroundColor Yellow
    exit 1
}

Get-Content -LiteralPath $envPath | ForEach-Object {
    $line = $_.Trim()

    if ($line -eq "" -or $line.StartsWith("#")) {
        return
    }

    $parts = $line.Split("=", 2)
    if ($parts.Count -ne 2) {
        return
    }

    $key = $parts[0].Trim()
    $value = $parts[1].Trim()

    if (($value.StartsWith('"') -and $value.EndsWith('"')) -or
        ($value.StartsWith("'") -and $value.EndsWith("'"))) {
        $value = $value.Substring(1, $value.Length - 2)
    }

    [Environment]::SetEnvironmentVariable($key, $value, "Process")
}

Write-Host "Variables cargadas desde backend\$EnvFile" -ForegroundColor Green
Write-Host "Iniciando backend en http://localhost:8080 ..." -ForegroundColor Green

Push-Location $basePath
try {
    .\gradlew.bat bootRun
}
finally {
    Pop-Location
}
