products = [
  {
    slug: "diwali-delight-hamper",
    name: "Diwali Delight Hamper",
    description: "Celebrate the festival of lights with this curated Diwali hamper featuring handcrafted clay diyas, organic rangoli colors, premium sweets box, and a decorative aarti thali. Perfect for gifting family and friends during Diwali celebrations.",
    price: 2499,
    category: "Diwali",
    images: [ "https://images.pexels.com/photos/10182772/pexels-photo-10182772.jpeg?auto=compress&cs=tinysrgb&w=800" ],
    in_stock: true,
    featured: true,
    tags: [ "diwali", "gift", "festive", "sweets", "diya" ],
    ritual_contents: [ "clay diyas", "organic rangoli colors", "sweets box", "aarti thali" ]
  },
  {
    slug: "complete-puja-kit",
    name: "Complete Puja Kit",
    description: "Everything you need for a traditional Hindu puja. Includes brass aarti thali, camphor, incense sticks, haldi, kumkum, rice grains, coconut, flowers, and a detailed puja guide. Ideal for daily worship or special occasions.",
    price: 1899,
    category: "Puja",
    images: [ "https://images.pexels.com/photos/35407778/pexels-photo-35407778.jpeg?auto=compress&cs=tinysrgb&w=800" ],
    in_stock: true,
    featured: true,
    tags: [ "puja", "worship", "brass", "thali", "ritual" ],
    ritual_contents: [ "brass aarti thali", "camphor", "incense sticks", "haldi", "kumkum", "rice grains", "coconut", "flowers", "puja guide" ]
  },
  {
    slug: "wedding-blessing-box",
    name: "Wedding Blessing Box",
    description: "A beautiful gift box for Indian weddings containing mangalsutra, sindoor, shagun envelope, dried fruits, sweets, and a blessed photo frame. Thoughtfully packaged in a traditional red and gold box.",
    price: 3499,
    category: "Wedding",
    images: [ "https://images.pexels.com/photos/18897125/pexels-photo-18897125.jpeg?auto=compress&cs=tinysrgb&w=800" ],
    in_stock: true,
    featured: true,
    tags: [ "wedding", "mangalsutra", "sindoor", "gift", "shagun" ],
    ritual_contents: [ "mangalsutra", "sindoor", "shagun envelope", "dried fruits", "sweets", "blessed photo frame" ]
  },
  {
    slug: "griha-pravesh-set",
    name: "Griha Pravesh Set",
    description: "Welcome prosperity into your new home with this housewarming set featuring a Ganesh idol, silver-plated Kalash, coconut, rice, kumkum, and a decorative toran. Complete with a guided griha pravesh puja manual.",
    price: 2799,
    category: "Housewarming",
    images: [ "https://images.pexels.com/photos/18849556/pexels-photo-18849556.jpeg?auto=compress&cs=tinysrgb&w=800" ],
    in_stock: true,
    featured: false,
    tags: [ "housewarming", "griha pravesh", "ganesh", "kalash", "new home" ],
    ritual_contents: [ "Ganesh idol", "silver-plated Kalash", "coconut", "rice", "kumkum", "decorative toran", "puja manual" ]
  },
  {
    slug: "navratri-celebration-pack",
    name: "Navratri Celebration Pack",
    description: "Get ready for nine nights of devotion and dance. Includes dandiya sticks, garba accessories, goddess Durga idol, navratri puja samagri, and a colorful chunri. Perfect for both prayer and celebration.",
    price: 1999,
    category: "Navratri",
    images: [ "https://images.pexels.com/photos/17264037/pexels-photo-17264037.jpeg?auto=compress&cs=tinysrgb&w=800" ],
    in_stock: true,
    featured: false,
    tags: [ "navratri", "durga puja", "dandiya", "garba", "festival" ],
    ritual_contents: [ "dandiya sticks", "garba accessories", "goddess Durga idol", "navratri puja samagri", "colorful chunri" ]
  },
  {
    slug: "raksha-bandhan-special",
    name: "Raksha Bandhan Special",
    description: "Celebrate the bond of siblings with this special Rakhi set featuring handcrafted rakhis, roli-chawal, chocolates, and a personalized message card. Available in sets of 2, 3, or 5 rakhis.",
    price: 1499,
    category: "Raksha Bandhan",
    images: [ "https://images.pexels.com/photos/15474159/pexels-photo-15474159.jpeg?auto=compress&cs=tinysrgb&w=800" ],
    in_stock: true,
    featured: true,
    tags: [ "raksha bandhan", "rakhi", "siblings", "gift", "chocolate" ],
    ritual_contents: [ "handcrafted rakhis", "roli-chawal", "chocolates", "personalized message card" ]
  },
  {
    slug: "holi-colors-gift-box",
    name: "Holi Colors Gift Box",
    description: "Make this Holi vibrant and safe with organic herbal colors, gujiya sweets, thandai mix, and a water gun. All colors are skin-safe and eco-friendly. Packaged in a splash-proof gift box.",
    price: 1299,
    category: "Holi",
    images: [ "https://images.pexels.com/photos/2041707/pexels-photo-2041707.jpeg?auto=compress&cs=tinysrgb&w=800" ],
    in_stock: true,
    featured: false,
    tags: [ "holi", "colors", "organic", "gujiya", "festival" ],
    ritual_contents: [ "organic herbal colors", "gujiya sweets", "thandai mix", "water gun" ]
  },
  {
    slug: "ganesh-chaturthi-kit",
    name: "Ganesh Chaturthi Kit",
    description: "Welcome Lord Ganesha with this complete kit including an eco-friendly Ganesh idol, puja samagri, modak ingredients, durva grass, red flowers, and aarti book. Sustainable and traditional.",
    price: 2199,
    category: "Ganesh Chaturthi",
    images: [ "https://images.pexels.com/photos/1485015/pexels-photo-1485015.jpeg?auto=compress&cs=tinysrgb&w=800" ],
    in_stock: true,
    featured: false,
    tags: [ "ganesh chaturthi", "ganesh", "eco-friendly", "modak", "puja" ],
    ritual_contents: [ "eco-friendly Ganesh idol", "puja samagri", "modak ingredients", "durva grass", "red flowers", "aarti book" ]
  }
]

products.each do |attrs|
  Product.find_or_create_by!(slug: attrs[:slug]) do |product|
    product.assign_attributes(attrs.merge(currency: "INR"))
  end
end

admin_email = ENV.fetch("ADMIN_EMAIL", "admin@desisaga.com")
User.find_or_create_by!(email_address: admin_email) do |user|
  user.name = "Desi Saga Admin"
  user.password = ENV.fetch("ADMIN_PASSWORD", "desisaga-admin-2026")
end
