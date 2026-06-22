$API = "http://localhost:3000"

Write-Host "=== TESTE DE LOGIN ===" -ForegroundColor Cyan
Write-Host ""

# Joao Calheiros
Write-Host "Testando: Joao Calheiros (ADMIN)" -ForegroundColor Yellow
$body = @{email="joao@test.com"; password="password123"} | ConvertTo-Json
$response = Invoke-WebRequest "$API/api/auth/login" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
$data = $response.Content | ConvertFrom-Json
Write-Host "Status: OK - Token recebido" -ForegroundColor Green
Write-Host "Papel: $($data.role)" -ForegroundColor Magenta
Write-Host ""

# Haniel Maia
Write-Host "Testando: Haniel Maia (MODERATOR)" -ForegroundColor Yellow
$body = @{email="haniel@test.com"; password="password123"} | ConvertTo-Json
$response = Invoke-WebRequest "$API/api/auth/login" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
$data = $response.Content | ConvertFrom-Json
Write-Host "Status: OK - Token recebido" -ForegroundColor Green
Write-Host "Papel: $($data.role)" -ForegroundColor Magenta
Write-Host ""

# Jesse Alves
Write-Host "Testando: Jesse Alves (USER)" -ForegroundColor Yellow
$body = @{email="jesse@test.com"; password="password123"} | ConvertTo-Json
$response = Invoke-WebRequest "$API/api/auth/login" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
$data = $response.Content | ConvertFrom-Json
Write-Host "Status: OK - Token recebido" -ForegroundColor Green
Write-Host "Papel: $($data.role)" -ForegroundColor Magenta
Write-Host ""

# Kaua Heronides
Write-Host "Testando: Kaua Heronides (USER)" -ForegroundColor Yellow
$body = @{email="kaua@test.com"; password="password123"} | ConvertTo-Json
$response = Invoke-WebRequest "$API/api/auth/login" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
$data = $response.Content | ConvertFrom-Json
Write-Host "Status: OK - Token recebido" -ForegroundColor Green
Write-Host "Papel: $($data.role)" -ForegroundColor Magenta
Write-Host ""

Write-Host "=== Testes concluidos com sucesso! ===" -ForegroundColor Green
