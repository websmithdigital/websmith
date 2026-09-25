$res = Invoke-WebRequest -Uri "http://localhost:3000/services?tab=software-engineering" -UseBasicParsing
Write-Host "Status:" $res.StatusCode
Write-Host "Contains dynamic Software Engineering subtitle:" ($res.Content -match 'Modern, high-performance web systems and mobile applications built with sub-second response times\.')
Write-Host "Contains dynamic button text:" ($res.Content -match 'Request Scope for Software Engineering')
