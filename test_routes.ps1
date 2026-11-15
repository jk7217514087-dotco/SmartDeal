# SmartDeals End-to-End Route Health Check Script
Write-Host "Testing SmartDeals Route Health on http://localhost:5173..." -ForegroundColor Cyan

$routes = @(
  '/',
  '/categories',
  '/product/prod-samsung-m14',
  '/compare',
  '/compare/prod-samsung-m14',
  '/product-vs-product',
  '/ai-assistant',
  '/deal-intelligence/prod-samsung-m14',
  '/cart',
  '/checkout',
  '/orders',
  '/wallet',
  '/wishlist',
  '/price-alerts',
  '/notifications',
  '/profile',
  '/become-seller',
  '/seller/dashboard',
  '/admin/dashboard',
  '/support',
  '/about',
  '/contact',
  '/terms',
  '/privacy'
)

$passed = 0
$failed = 0

foreach ($r in $routes) {
  $url = "http://localhost:5173$r"
  try {
    $res = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 5
    if ($res.StatusCode -eq 200) {
      Write-Host "  [OK 200] $r" -ForegroundColor Green
      $passed++
    } else {
      Write-Host "  [WARN $($res.StatusCode)] $r" -ForegroundColor Yellow
      $failed++
    }
  } catch {
    Write-Host "  [FAIL] $r" -ForegroundColor Red
    $failed++
  }
}

Write-Host "Health Summary: $passed Passed, $failed Failed." -ForegroundColor Cyan
if ($failed -eq 0) {
  Write-Host "ALL 24 PRIMARY ROUTES ARE FULLY OPERATIONAL!" -ForegroundColor Green
}
