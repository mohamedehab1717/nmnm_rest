const seedMenuItems = [
  // ── Burgers ──
  {
    name: 'The Obsidian Wagyu Burger',
    description: 'A premium 250g A5 Wagyu beef patty, black truffle-infused aioli, aged cave cheddar, and caramelized shallots on a charcoal brioche bun.',
    price: 400,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
    customizations: [
      {
        name: 'Doneness',
        required: true,
        maxSelections: 1,
        options: [
          { name: 'Medium Rare', priceModifier: 0 },
          { name: 'Medium', priceModifier: 0 },
          { name: 'Medium Well', priceModifier: 0 },
        ],
      },
      {
        name: 'Premium Add-ons',
        required: false,
        maxSelections: 3,
        options: [
          { name: 'Seared Foie Gras', priceModifier: 50 },
          { name: 'Extra Truffle Aioli', priceModifier: 20 },
          { name: 'Shaved Black Truffle', priceModifier: 50 },
        ],
      },
    ],
  },
  {
    name: 'Royal Purple Chicken Burger',
    description: 'Crispy buttermilk chicken glazed with purple sweet potato and maple reduction, pickled red cabbage, smoked gouda, and herb mayonnaise.',
    price: 320,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&q=80&w=800',
    customizations: [
      {
        name: 'Spiciness',
        required: true,
        maxSelections: 1,
        options: [
          { name: 'Mild', priceModifier: 0 },
          { name: 'Medium Glow', priceModifier: 0 },
          { name: 'Ultra Heat', priceModifier: 0 },
        ],
      },
    ],
  },
  {
    name: 'Midnight Lamb Burger',
    description: 'Ground Australian lamb patty with mint yogurt, feta crumble, roasted eggplant, and pomegranate molasses on a sesame brioche.',
    price: 350,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800',
    customizations: [],
  },
  {
    name: 'Truffle Mushroom Veggie Burger',
    description: 'House-made black bean and portobello patty, truffle aioli, aged gruyere, caramelized onions, and micro arugula on a whole-grain bun.',
    price: 280,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&q=80&w=800',
    customizations: [],
  },
  {
    name: 'Double Stack Prime Burger',
    description: 'Two 180g prime beef patties, double aged cheddar, bourbon bacon jam, crispy onion rings, and signature nmnm sauce.',
    price: 380,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&q=80&w=800',
    customizations: [
      {
        name: 'Doneness',
        required: true,
        maxSelections: 1,
        options: [
          { name: 'Medium Rare', priceModifier: 0 },
          { name: 'Medium', priceModifier: 0 },
          { name: 'Well Done', priceModifier: 0 },
        ],
      },
    ],
  },

  // ── Pasta ──
  {
    name: 'Truffle & Saffron Fettuccine',
    description: 'House-made egg fettuccine, white truffle cream, Kashmiri saffron, wild mushrooms, and shaved 24-month Parmigiano-Reggiano.',
    price: 390,
    category: 'Pasta',
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&q=80&w=800',
    customizations: [
      {
        name: 'Add Protein',
        required: false,
        maxSelections: 1,
        options: [
          { name: 'Grilled Tiger Prawns', priceModifier: 40 },
          { name: 'Seared Maine Lobster Tail', priceModifier: 50 },
        ],
      },
    ],
  },
  {
    name: 'Lobster Ravioli in Violet Cream',
    description: 'Hand-folded lobster ravioli in a beet-infused violet cream sauce with tarragon, lemon zest, and toasted pine nuts.',
    price: 400,
    category: 'Pasta',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&q=80&w=800',
    customizations: [],
  },
  {
    name: 'Spicy Arrabbiata Penne',
    description: 'Bronze-cut penne in a slow-simmered San Marzano arrabbiata with garlic confit, fresh basil, and pecorino romano.',
    price: 280,
    category: 'Pasta',
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&q=80&w=800',
    customizations: [
      {
        name: 'Heat Level',
        required: true,
        maxSelections: 1,
        options: [
          { name: 'Mild', priceModifier: 0 },
          { name: 'Classic', priceModifier: 0 },
          { name: 'Extra Fiery', priceModifier: 0 },
        ],
      },
    ],
  },
  {
    name: 'Carbonara alla Romana',
    description: 'Guanciale, farm-fresh egg yolk, pecorino, and cracked black pepper tossed with silky spaghetti — no cream, pure tradition.',
    price: 320,
    category: 'Pasta',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a59d5504?auto=format&fit=crop&q=80&w=800',
    customizations: [],
  },

  // ── Sandwiches ──
  {
    name: 'Golden Ribeye Steak Sandwich',
    description: 'Thinly sliced prime ribeye, melted provolone, roasted garlic spread, and balsamic arugula on an artisanal baguette.',
    price: 350,
    category: 'Sandwiches',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=800',
    customizations: [],
  },
  {
    name: 'Smoked Salmon Club',
    description: 'Norwegian smoked salmon, avocado, cucumber, dill cream cheese, and capers on toasted sourdough with mixed greens.',
    price: 330,
    category: 'Sandwiches',
    image: 'https://images.unsplash.com/photo-1553909489-efcc2cb26fda?auto=format&fit=crop&q=80&w=800',
    customizations: [],
  },
  {
    name: 'Grilled Halloumi Panini',
    description: 'Char-grilled halloumi, roasted peppers, sun-dried tomato pesto, and baby spinach pressed on olive focaccia.',
    price: 250,
    category: 'Sandwiches',
    image: 'https://images.unsplash.com/photo-1509722757452-fff18c88eb92?auto=format&fit=crop&q=80&w=800',
    customizations: [],
  },
  {
    name: 'BBQ Pulled Brisket Sliders',
    description: 'Twelve-hour smoked brisket, house BBQ glaze, pickled jalapenos, and coleslaw on three mini brioche buns.',
    price: 340,
    category: 'Sandwiches',
    image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&q=80&w=800',
    customizations: [],
  },

  // ── Sweets ──
  {
    name: 'Royal Velvet Lavender Tart',
    description: 'Charcoal pastry shell filled with white chocolate and organic lavender ganache, topped with blackberries and edible gold leaf.',
    price: 220,
    category: 'Sweets',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&q=80&w=800',
    customizations: [],
  },
  {
    name: 'Amethyst Chocolate Fondue',
    description: 'Dark Belgian chocolate infused with wild berry liqueur, served with strawberries, purple marshmallows, and sponge cake.',
    price: 260,
    category: 'Sweets',
    image: 'https://images.unsplash.com/photo-1511018556340-d16986a1c194?auto=format&fit=crop&q=80&w=800',
    customizations: [],
  },
  {
    name: 'Creme Brulee Royale',
    description: 'Madagascar vanilla bean custard with a caramelized sugar crust, served with fresh seasonal berries.',
    price: 200,
    category: 'Sweets',
    image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?auto=format&fit=crop&q=80&w=800',
    customizations: [],
  },
  {
    name: 'Tiramisu Classico',
    description: 'Espresso-soaked ladyfingers layered with mascarpone cream, dusted with Valrhona cocoa and amaretto essence.',
    price: 210,
    category: 'Sweets',
    image: 'https://images.unsplash.com/photo-1571877227209-a0d98ea607e9?auto=format&fit=crop&q=80&w=800',
    customizations: [],
  },
  {
    name: 'Baklava Ice Cream Parfait',
    description: 'House-made pistachio baklava crumble layered with honey ice cream, rose water syrup, and crushed pistachios.',
    price: 240,
    category: 'Sweets',
    image: 'https://images.unsplash.com/photo-1488477181941-6428a0291777?auto=format&fit=crop&q=80&w=800',
    customizations: [],
  },

  // ── Beverages ──
  {
    name: 'Ultraviolet Hibiscus Tea',
    description: 'Cold-brewed hibiscus with lavender essence, butterfly pea flower, fresh mint, and sparkling artisanal water.',
    price: 200,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800',
    customizations: [
      {
        name: 'Sweetener Level',
        required: true,
        maxSelections: 1,
        options: [
          { name: 'Unsweetened', priceModifier: 0 },
          { name: 'Honey Infused', priceModifier: 15 },
          { name: 'Stevia Extract', priceModifier: 0 },
        ],
      },
    ],
  },
  {
    name: 'Espresso Doppio',
    description: 'Double shot of single-origin Ethiopian Yirgacheffe beans, pulled to perfection with a rich crema.',
    price: 200,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1514434753662-86a87f2d5c8e?auto=format&fit=crop&q=80&w=800',
    customizations: [
      {
        name: 'Milk',
        required: false,
        maxSelections: 1,
        options: [
          { name: 'Oat Milk', priceModifier: 10 },
          { name: 'Almond Milk', priceModifier: 10 },
        ],
      },
    ],
  },
  {
    name: 'Lavender Latte',
    description: 'Velvety steamed milk infused with organic lavender syrup over a double espresso shot, finished with dried lavender.',
    price: 220,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=800',
    customizations: [],
  },
  {
    name: 'Signature Old Fashioned',
    description: 'Small-batch bourbon, demerara syrup, Angostura bitters, and a flamed orange peel — stirred, never shaken.',
    price: 280,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=800',
    customizations: [],
  },

  // ── Juices ──
  {
    name: 'Royal Plum & Violet Nectar',
    description: 'Cold-pressed royal plums, purple carrots, organic red grapes, elderberry extract, and fresh lime juice.',
    price: 210,
    category: 'Juices',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=800',
    customizations: [],
  },
  {
    name: 'Green Vitality Elixir',
    description: 'Cold-pressed kale, cucumber, green apple, ginger, lemon, and spirulina for a refreshing wellness boost.',
    price: 230,
    category: 'Juices',
    image: 'https://images.unsplash.com/photo-1610970881669-41f850767a39?auto=format&fit=crop&q=80&w=800',
    customizations: [],
  },
  {
    name: 'Tropical Sunrise Blend',
    description: 'Fresh mango, pineapple, passion fruit, and coconut water blended into a silky tropical refreshment.',
    price: 220,
    category: 'Juices',
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&q=80&w=800',
    customizations: [],
  },
  {
    name: 'Berry Antioxidant Boost',
    description: 'Blueberry, raspberry, acai, pomegranate, and beetroot cold-pressed for a deep ruby antioxidant powerhouse.',
    price: 240,
    category: 'Juices',
    image: 'https://images.unsplash.com/photo-1590393802681-bc6e589fab3b?auto=format&fit=crop&q=80&w=800',
    customizations: [],
  },

  // ── Pizza ──
  {
    name: 'Black Truffle & Fig Pizza',
    description: 'Neapolitan charcoal dough, buffalo mozzarella, caramelized black figs, gorgonzola, arugula, and truffle oil drizzle.',
    price: 380,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
    customizations: [
      {
        name: 'Size',
        required: true,
        maxSelections: 1,
        options: [
          { name: 'Individual 10"', priceModifier: 0 },
          { name: 'Royal Shareable 14"', priceModifier: 50 },
        ],
      },
    ],
  },
  {
    name: 'Margherita Classica',
    description: 'San Marzano tomato sauce, fresh buffalo mozzarella, basil leaves, and extra virgin olive oil on hand-stretched dough.',
    price: 280,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800',
    customizations: [
      {
        name: 'Size',
        required: true,
        maxSelections: 1,
        options: [
          { name: 'Individual 10"', priceModifier: 0 },
          { name: 'Royal Shareable 14"', priceModifier: 40 },
        ],
      },
    ],
  },
  {
    name: 'Prosciutto & Arugula Pizza',
    description: 'White garlic cream base, mozzarella, 18-month prosciutto di Parma, fresh arugula, and shaved parmesan.',
    price: 360,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=800',
    customizations: [],
  },
  {
    name: 'Spicy Diavola',
    description: 'Spicy Calabrian salami, smoked mozzarella, roasted red peppers, chili oil, and fresh oregano on crispy crust.',
    price: 320,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800',
    customizations: [
      {
        name: 'Size',
        required: true,
        maxSelections: 1,
        options: [
          { name: 'Individual 10"', priceModifier: 0 },
          { name: 'Royal Shareable 14"', priceModifier: 45 },
        ],
      },
    ],
  },
];

module.exports = seedMenuItems;
