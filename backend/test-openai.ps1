param(
    [string]$EnvFile = ".env.local"
)

$ErrorActionPreference = "Stop"
$basePath = Split-Path -Parent $MyInvocation.MyCommand.Path
$envPath = Join-Path $basePath $EnvFile

if (-not (Test-Path -LiteralPath $envPath)) {
    Write-Host "No existe backend\$EnvFile" -ForegroundColor Red
    exit 1
}

$vars = @{}
Get-Content -LiteralPath $envPath | ForEach-Object {
    $line = $_.Trim()

    if ($line -eq "" -or $line.StartsWith("#") -or -not $line.Contains("=")) {
        return
    }

    $parts = $line.Split("=", 2)
    $vars[$parts[0].Trim()] = $parts[1].Trim().Trim('"').Trim("'")
}

if ([string]::IsNullOrWhiteSpace($vars["OPENAI_API_KEY"])) {
    Write-Host "OPENAI_API_KEY no esta configurada." -ForegroundColor Red
    exit 1
}

$apiUrl = if ([string]::IsNullOrWhiteSpace($vars["AI_API_URL"])) {
    "https://api.openai.com/v1/responses"
} else {
    $vars["AI_API_URL"]
}

$model = if ([string]::IsNullOrWhiteSpace($vars["AI_MODEL"])) {
    "gpt-4.1-mini"
} else {
    $vars["AI_MODEL"]
}

$body = @{
    model = $model
    instructions = "Responde solo con: OK HogarXpress"
    input = "Prueba de conexion"
    max_output_tokens = 20
} | ConvertTo-Json -Depth 6

try {
    $response = Invoke-RestMethod `
        -Uri $apiUrl `
        -Method Post `
        -Headers @{
            Authorization = "Bearer " + $vars["OPENAI_API_KEY"]
            "Content-Type" = "application/json"
        } `
        -Body $body

    Write-Host "OpenAI respondio correctamente con el modelo $model." -ForegroundColor Green
    Write-Host $response.output_text
}
catch {
    Write-Host "OpenAI no respondio correctamente." -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host "Revisa saldo, facturacion, limites del proyecto, modelo y API key." -ForegroundColor Yellow
    exit 1
}
