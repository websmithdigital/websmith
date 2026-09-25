$res = Invoke-WebRequest -Uri "http://localhost:3000/services" -UseBasicParsing
Write-Host "Services status:" $res.StatusCode
Write-Host "Contains nowrap:" ($res.Content.Contains('white-space:nowrap') -or $res.Content.Contains('white-space: nowrap') -or $res.Content -match 'whiteSpace')
