$res = Invoke-WebRequest -Uri "http://localhost:3000/services?tab=software-engineering" -UseBasicParsing
Write-Host "Status:" $res.StatusCode
Write-Host "Web App Dev:" ($res.Content -match 'Web App Development')
Write-Host "Mobile App Dev:" ($res.Content -match 'Mobile App Development')
Write-Host "Microservices:" ($res.Content -match 'Microservices')
Write-Host "Database & Cache:" ($res.Content -match 'Database')
Write-Host "DevOps & CI/CD:" ($res.Content -match 'DevOps')
Write-Host "Software Modernization:" ($res.Content -match 'Software Modernization')
