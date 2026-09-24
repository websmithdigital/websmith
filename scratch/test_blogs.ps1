$tests = @(
  '/admin/blogs',
  '/blog',
  '/api/blogs',
  '/api/blogs?all=true',
  '/blog/building-multi-agent-ai-workflows-in-production'
)

foreach ($t in $tests) {
  try {
    $res = Invoke-WebRequest -Uri ('http://localhost:3000' + $t) -UseBasicParsing
    Write-Host "$t -> $($res.StatusCode)"
  } catch {
    Write-Host "$t -> ERROR: $_"
  }
}
