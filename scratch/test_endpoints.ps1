$routes = @(
  "/admin/manage-page",
  "/admin/manage-page?tab=careers",
  "/admin/manage-page?tab=about&subtab=audiences",
  "/admin/careers",
  "/careers",
  "/services?tab=all"
)

foreach ($r in $routes) {
  $url = "http://localhost:3000" + $r
  try {
    $res = Invoke-WebRequest -Uri $url -UseBasicParsing
    Write-Host "$r -> $($res.StatusCode)"
  } catch {
    Write-Host "$r -> ERROR: $_"
  }
}
