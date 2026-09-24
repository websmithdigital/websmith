$res = Invoke-WebRequest -Uri "http://localhost:3000/blog" -UseBasicParsing
Write-Host "Status:" $res.StatusCode
Write-Host "Length:" $res.Content.Length
Write-Host "Multi-Agent:" ($res.Content.Contains('Multi-Agent'))
Write-Host "App Router:" ($res.Content.Contains('App Router'))
Write-Host "SOC2:" ($res.Content.Contains('SOC2'))
Write-Host "Shipping Client:" ($res.Content.Contains('Shipping Client'))
