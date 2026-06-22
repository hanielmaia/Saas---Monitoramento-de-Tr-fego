$API = "http://localhost:3000"

Write-Host "=== TESTE DE LOGIN - DETALHADO ===" -ForegroundColor Cyan
Write-Host ""

# Joao Calheiros
Write-Host "1. Joao Calheiros (ADMIN)" -ForegroundColor Yellow
Write-Host "Email: joao@test.com | Senha: password123" -ForegroundColor Gray
$body = @{email="joao@test.com"; password="password123"} | ConvertTo-Json
$response = Invoke-WebRequest "$API/api/auth/login" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
$data = $response.Content | ConvertFrom-Json
Write-Host "Status: OK" -ForegroundColor Green
Write-Host ($data | ConvertTo-Json -Depth 5) -ForegroundColor Cyan
Write-Host ""

# Haniel Maia
Write-Host "2. Haniel Maia (MODERATOR)" -ForegroundColor Yellow
Write-Host "Email: haniel@test.com | Senha: password123" -ForegroundColor Gray
$body = @{email="haniel@test.com"; password="password123"} | ConvertTo-Json
$response = Invoke-WebRequest "$API/api/auth/login" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
$data = $response.Content | ConvertFrom-Json
Write-Host "Status: OK" -ForegroundColor Green
Write-Host ($data | ConvertTo-Json -Depth 5) -ForegroundColor Cyan
Write-Host ""

# Jesse Alves
Write-Host "3. Jesse Alves (USER)" -ForegroundColor Yellow
Write-Host "Email: jesse@test.com | Senha: password123" -ForegroundColor Gray
$body = @{email="jesse@test.com"; password="password123"} | ConvertTo-Json
$response = Invoke-WebRequest "$API/api/auth/login" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
$data = $response.Content | ConvertFrom-Json
Write-Host "Status: OK" -ForegroundColor Green
Write-Host ($data | ConvertTo-Json -Depth 5) -ForegroundColor Cyan
Write-Host ""

# Kaua Heronides
Write-Host "4. Kaua Heronides (USER)" -ForegroundColor Yellow
Write-Host "Email: kaua@test.com | Senha: password123" -ForegroundColor Gray
$body = @{email="kaua@test.com"; password="password123"} | ConvertTo-Json
$response = Invoke-WebRequest "$API/api/auth/login" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
$data = $response.Content | ConvertFrom-Json
Write-Host "Status: OK" -ForegroundColor Green
Write-Host ($data | ConvertTo-Json -Depth 5) -ForegroundColor Cyan
