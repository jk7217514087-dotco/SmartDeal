import base64

with open('public/smartdeal_icon_mark.png', 'rb') as f:
    mark_b64 = base64.b64encode(f.read()).decode('utf-8')

with open('public/icon-512.png', 'rb') as f:
    app_b64 = base64.b64encode(f.read()).decode('utf-8')

# Favicon SVG
favicon_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <clipPath id="rounded">
      <rect width="512" height="512" rx="115" />
    </clipPath>
  </defs>
  <rect width="512" height="512" rx="115" fill="#00061e" />
  <image href="data:image/png;base64,{mark_b64}" width="512" height="512" clip-path="url(#rounded)" />
</svg>'''

with open('public/favicon.svg', 'w', encoding='utf-8') as f:
    f.write(favicon_svg)

# Logo SVG (for PWA and manifest)
logo_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <clipPath id="appSquircle">
      <rect width="512" height="512" rx="120" />
    </clipPath>
  </defs>
  <rect width="512" height="512" rx="120" fill="#00061e" />
  <image href="data:image/png;base64,{app_b64}" width="512" height="512" clip-path="url(#appSquircle)" />
</svg>'''

with open('public/logo.svg', 'w', encoding='utf-8') as f:
    f.write(logo_svg)

print('Updated public/favicon.svg and public/logo.svg successfully!')
