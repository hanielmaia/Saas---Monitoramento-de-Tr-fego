$API = "http://localhost:3000"

Write-Host "=== TESTE DE LOGIN DOS 4 USUARIOS ===" -ForegroundColor Cyan
Write-Host ""

# Teste 1: Joao Calheiros (ADMIN)
Write-Host "1. Joao Calheiros (ADMIN)" -ForegroundColor Yellow
Write-Host "Email: joao@test.com" -ForegroundColor Gray
$body = @{email="joao@test.com"; password="password123"} | ConvertTo-Json
$response = Invoke-WebRequest "$API/api/auth/login" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
$data = $response.Content | ConvertFrom-Json
Write-Host "[OK] Login bem-sucedido!" -ForegroundColor Green
Write-Host "Token: $($data.token.Substring(0, 50))..." -ForegroundColor Cyan
Write-Host "Papel: $($data.role)" -ForegroundColor Magenta

Write-Host ""

# Teste 2: Haniel Maia (MODERATOR)
Write-Host "2️⃣  Haniel Maia (MODERATOR)" -ForegroundColor Yellow
Write-Host "📧 haniel@test.com" -ForegroundColor Gray
try {
    $body = @{email="haniel@test.com"; password="password123"} | ConvertTo-Json
    $response = Invoke-WebRequest "$API/api/auth/login" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✅ Login bem-sucedido!" -ForegroundColor Green
    Write-Host "🔑 Token: $($data.token.Substring(0, 50))..." -ForegroundColor Cyan
    Write-Host "👥 Papel: $($data.role)" -ForegroundColor Magenta
} catch {
    Write-Host "❌ Erro: $($_)" -ForegroundColor Red
}

Write-Host ""

# Teste 3: Jessé Alves (USER)
Write-Host "3️⃣  Jessé Alves (USER)" -ForegroundColor Yellow
Write-Host "📧 jesse@test.com" -ForegroundColor Gray
try {
    $body = @{email="jesse@test.com"; password="password123"} | ConvertTo-Json
    $response = Invoke-WebRequest "$API/api/auth/login" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✅ Login bem-sucedido!" -ForegroundColor Green
    Write-Host "🔑 Token: $($data.token.Substring(0, 50))..." -ForegroundColor Cyan
    Write-Host "👥 Papel: $($data.role)" -ForegroundColor Magenta
} catch {
    Write-Host "❌ Erro: $($_)" -ForegroundColor Red
}

Write-Host ""

# Teste 4: Kauã Heronides (USER)
Write-Host "4️⃣  Kauã Heronides (USER)" -ForegroundColor Yellow
Write-Host "📧 kaua@test.com" -ForegroundColor Gray
try {
    $body = @{email="kaua@test.com"; password="password123"} | ConvertTo-Json
    $response = Invoke-WebRequest "$API/api/auth/login" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✅ Login bem-sucedido!" -ForegroundColor Green
    Write-Host "🔑 Token: $($data.token.Substring(0, 50))..." -ForegroundColor Cyan
    Write-Host "👥 Papel: $($data.role)" -ForegroundColor Magenta
} catch {
    Write-Host "❌ Erro: $($_)" -ForegroundColor Red
}

Write-Host ""
Write-Host "✅ Testes concluídos!" -ForegroundColor Green
