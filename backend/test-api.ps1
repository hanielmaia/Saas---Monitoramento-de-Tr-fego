$API = "http://localhost:3000"
$global:token = ""

# Teste 1: Health Check
Write-Host "=== TESTE 1: Health Check ===" -ForegroundColor Green
try {
    $response = Invoke-WebRequest "$API/api/health" -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host ($response.Content | ConvertFrom-Json | ConvertTo-Json)
} catch {
    Write-Host "Erro: $_" -ForegroundColor Red
}

# Teste 2: Login  
Write-Host "`n=== TESTE 2: Login ===" -ForegroundColor Green
try {
    $body = @{email="joao@test.com"; password="password123"} | ConvertTo-Json
    $response = Invoke-WebRequest "$API/api/auth/login" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    $data = $response.Content | ConvertFrom-Json
    $global:token = $data.token
    Write-Host "Token recebido" -ForegroundColor Yellow
} catch {
    Write-Host "Erro: $_" -ForegroundColor Red
}

# Teste 3: GET Devices
Write-Host "`n=== TESTE 3: GET /api/devices ===" -ForegroundColor Green
if ($global:token) {
    try {
        $headers = @{"Authorization"="Bearer $($global:token)"}
        $response = Invoke-WebRequest "$API/api/devices" -Headers $headers -UseBasicParsing
        Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
        $data = $response.Content | ConvertFrom-Json
        Write-Host "Dispositivos: $($data.count)" -ForegroundColor Yellow
    } catch {
        Write-Host "Erro: $_" -ForegroundColor Red
    }
}

# Teste 4: GET Logs
Write-Host "`n=== TESTE 4: GET /api/logs ===" -ForegroundColor Green
if ($global:token) {
    try {
        $headers = @{"Authorization"="Bearer $($global:token)"}
        $response = Invoke-WebRequest "$API/api/logs" -Headers $headers -UseBasicParsing
        Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
        $data = $response.Content | ConvertFrom-Json
        Write-Host "Logs: $($data.count)" -ForegroundColor Yellow
    } catch {
        Write-Host "Erro: $_" -ForegroundColor Red
    }
}

# Teste 5: GET Settings
Write-Host "`n=== TESTE 5: GET /api/settings ===" -ForegroundColor Green
if ($global:token) {
    try {
        $headers = @{"Authorization"="Bearer $($global:token)"}
        $response = Invoke-WebRequest "$API/api/settings" -Headers $headers -UseBasicParsing
        Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
        Write-Host "Settings carregadas" -ForegroundColor Yellow
    } catch {
        Write-Host "Erro: $_" -ForegroundColor Red
    }
}

Write-Host "`nTestes concluidos!`n" -ForegroundColor Cyan
