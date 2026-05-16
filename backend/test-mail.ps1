param(
    [string]$EnvFile = ".env.local",
    [string]$To = ""
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

if ([string]::IsNullOrWhiteSpace($To)) {
    $To = $vars["MAIL_USERNAME"]
}

$message = [System.Net.Mail.MailMessage]::new()
$client = $null

try {
    $message.From = [System.Net.Mail.MailAddress]::new($vars["MAIL_FROM"], $vars["MAIL_FROM_NAME"])
    $message.To.Add($To)
    $message.Subject = "Prueba SMTP HogarXpress"
    $message.Body = "Si recibes este correo, la configuracion SMTP de HogarXpress ya funciona."

    $client = [System.Net.Mail.SmtpClient]::new($vars["MAIL_HOST"], [int]$vars["MAIL_PORT"])
    $client.EnableSsl = $true
    $client.Credentials = [System.Net.NetworkCredential]::new($vars["MAIL_USERNAME"], $vars["MAIL_PASSWORD"])
    $client.Send($message)

    Write-Host "Correo de prueba enviado correctamente a $To" -ForegroundColor Green
}
catch {
    Write-Host "No se pudo enviar el correo de prueba." -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red

    if ($_.Exception.InnerException) {
        Write-Host $_.Exception.InnerException.Message -ForegroundColor Red
    }

    exit 1
}
finally {
    if ($client) {
        $client.Dispose()
    }

    $message.Dispose()
}
