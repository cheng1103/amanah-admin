#!/bin/bash

# Fix all admin pages - remove lang params and bilingual text

for file in app/leads/page.tsx app/testimonials/page.tsx app/users/page.tsx app/settings/page.tsx app/logs/page.tsx app/reports/page.tsx; do
  if [ -f "$file" ]; then
    echo "Fixing $file..."
    
    # Backup
    cp "$file" "$file.bak"
    
    # Remove params.lang from function signature
    sed -i '' 's/({ params }: { params: { lang: string } })/()/' "$file"
    
    # Remove isEnglish definition
    sed -i '' '/const isEnglish = params\.lang/d' "$file"
    
    # Fix navigation links - remove /${params.lang}/admin/
    sed -i '' 's|/${params\.lang}/admin/|/|g' "$file"
    
    echo "Fixed $file"
  fi
done

echo "All files fixed!"
